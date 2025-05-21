var access_token = 'ory_at_yppxsp3KzrYznxL_KR88TS6v2xZrGGLZfYyUAHqHZ-k.zUP_Osg-UoRL2M1eYMfx4cTKL60-FwqHRmMyADE8OPk';
var spreadsheetId = '1UBd_elhTxkLJ0WvIBVKvNr2bLJJQQScXkd_KB0cJTS4';

function remo() {
  var data = getNatureRemoData();
  Logger.log("取得データ: " + JSON.stringify(data, null, 2));

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('trial');
  var lastRow = getLastRow();
  Logger.log("直近の行番号: " + lastRow);

  if (data && data[0].newest_events && data[0].newest_events.il) {
    var illuminance = data[0].newest_events.il.val;
    Logger.log("現在の照度: " + illuminance);

    var lastIlluminance = 0;
    if (lastRow > 1) {
      lastIlluminance = sheet.getRange(lastRow, 2).getValue();
      Logger.log("直前の照度: " + lastIlluminance);
    }

    // 厳密な数値比較に変更（型の違いによるスキップ防止）
    if (Number(illuminance) !== Number(lastIlluminance)) {
      Logger.log("照度が変化！書き込みます");
      writeIlluminanceData(new Date(), illuminance, lastRow + 1);
    } else {
      Logger.log("照度に変化なし（" + illuminance + "）、書き込みスキップ");
    }
  } else {
    Logger.log("照度データが取得できませんでした");
  }
}

function getNatureRemoData() {
  var url = "https://api.nature.global/1/devices";
  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
  };
  var options = {
    "method": "get",
    "headers": headers
  };
  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function getLastRow() {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('trial');
  var values = sheet.getRange("B:B").getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] !== "" && values[i][0] !== null) {
      return i + 1;
    }
  }
  return 1;
}

function writeIlluminanceData(date, illuminance, row) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('trial');
  var formatdate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  sheet.getRange(row, 1).setValue(formatdate);     // A列: 日時
  sheet.getRange(row, 2).setValue(illuminance);    // B列: 照度
  Logger.log(`✅ ${formatdate} に照度 ${illuminance} を row ${row} に記録`);
}

function end() {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('trial');
  const values = sheet.getDataRange().getValues();

  if (values.length < 3) {
    Logger.log("⚠️ データが不足しているため終了します。");
    return;
  }

  let prevDate = null;
  let prevIlluminance = null;
  let currentDay = null;
  let energySum = 0;
  let lastEnergy = null;
  let outputRow = null;

  for (let i = 1; i < values.length; i++) {
    const rowDate = new Date(values[i][0]);
    const illuminance = values[i][1];

    if (!(rowDate instanceof Date) || isNaN(rowDate) || illuminance === "" || illuminance === null) {
      continue;
    }

    const day = Utilities.formatDate(rowDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    if (currentDay === null) {
      currentDay = day;
    }

    // 日付が変わったとき：前日分の結果を書き込み
    if (day !== currentDay) {
      Logger.log(`📅 日付切り替え: ${currentDay} → ${day}`);
      sheet.getRange(i, 3).setValue(energySum.toFixed(2)); // C列: 積算

      if (lastEnergy !== null) {
        const diff = energySum - lastEnergy;
        sheet.getRange(i, 4).setValue(diff.toFixed(2)); // D列: 差分
      }

      lastEnergy = energySum;
      currentDay = day;
      energySum = 0;
    }

    // 台形則による積分（Wh相当）
    if (prevDate !== null && prevIlluminance !== null) {
      const timeDiff = (rowDate - prevDate) / (1000 * 60 * 60); // 時間差 [h]
      const avgIlluminance = (illuminance + prevIlluminance) / 2;
      energySum += avgIlluminance * timeDiff;
    }

    prevDate = rowDate;
    prevIlluminance = illuminance;
    outputRow = i;
  }

  // 最終日の積算値も忘れずに出力
  if (currentDay !== null && outputRow !== null) {
    Logger.log(`✅ 最終日 ${currentDay} の積算出力`);
    sheet.getRange(outputRow, 3).setValue(energySum.toFixed(2));

    if (lastEnergy !== null) {
      const finalDiff = energySum - lastEnergy;
      sheet.getRange(outputRow, 4).setValue(finalDiff.toFixed(2));

      const msg = `📊 ${currentDay} の照度積算値は ${energySum.toFixed(2)} Wh でした。\n前日比: ${finalDiff > 0 ? "+" : ""}${finalDiff.toFixed(2)} Wh`;

      try {
        sendPushMessage(msg);
        Logger.log("📤 LINE通知送信済み: " + msg);
      } catch (e) {
        Logger.log("❌ LINE通知失敗: " + e.message);
      }
    }
  } else {
    Logger.log("⚠️ 最終行の出力に失敗しました。");
  }
}
