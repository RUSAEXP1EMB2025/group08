//1日の終わりにその日の合計電気使用量を送信するプログラム
function last() {
  var spreadsheetId = "1hNZIP-bkVbVlCUdU8IKTJGDYV72XItLdRtlpuA6eF1k";
  var sheetsum = SpreadsheetApp.openById(spreadsheetId).getSheetByName("電気量");
  var hoursum = 0;
  var minsum = 0;
  var lastraw = sheetsum.getLastRow();

  for (let i = 1; i <= lastraw; i++) {
    hoursum += Number(sheetsum.getRange(i,1).getValue());
    minsum += Number(sheetsum.getRange(i,2).getValue());
  }
  hoursum += Math.floor(minsum / 60);
  minsum = minsum % 60;
  var message = "本日の合計使用時間:" + hoursum + "時間" + minsum + "分";
  var todaysum = hoursum * 60 + minsum;
  sendLINE(message);
  var yesterdaysum  = Number(sheetsum.getRange(2,5).getValue());
  if(yesterdaysum != "" && yesterdaysum != 0){
    message = "前日比" + Math.floor((todaysum / yesterdaysum)*100) + "%";
    sendLINE(message);
  }
  for (let i = 1; i <= lastraw; i++) {
    sheetsum.getRange(i,1).setValue([""]);
    sheetsum.getRange(i,2).setValue([""]);
  }
  sheetsum.getRange(2,5).setValue(todaysum);
}