//remoを通じて照明をオフにするプログラム
function off() {
  //照明使用時間を計算、LINEで送信
  var spreadsheetId = "1hNZIP-bkVbVlCUdU8IKTJGDYV72XItLdRtlpuA6eF1k";
  var sheeton = SpreadsheetApp.openById(spreadsheetId).getSheetByName("オン");
  var sheetoff = SpreadsheetApp.openById(spreadsheetId).getSheetByName("オフ");
  var sheetsum = SpreadsheetApp.openById(spreadsheetId).getSheetByName("電気量");
  var ontime = Number(sheeton.getRange('B2').getValue());
  var offtime = Number(sheetoff.getRange('B2').getValue());
  var usetime = ((offtime - ontime) / 1000 / 3600);
  var usehour = Math.floor(usetime);
  var usemin =  Math.floor((usetime - usehour) * 60);
  sheetsum.appendRow([usehour,usemin]);
  var message = "使用時間: " + usehour + "時間" + usemin + "分";
  turnLight("off");
  sendLINE(message);
}

