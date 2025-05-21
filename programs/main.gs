//メインプログラム
//LINEメッセージを受け取って分岐させる

function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var userMessageRaw = json.events[0].message.text;
  var userMessage = userMessageRaw.trim();
  
  // "オン" と一致する場合
  if (userMessage.toLowerCase() == "オン") {
      var spreadsheetId = "1hNZIP-bkVbVlCUdU8IKTJGDYV72XItLdRtlpuA6eF1k";
      var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("オン");
      var value = sheet.getRange('B2').getValue();
      if(value == "" || value == null){
        sheet.appendRow([new Date(),Date.now(),"オン"]);
        on();
      }
      return ContentService.createTextOutput(JSON.stringify({
      'content': 'Received message: ' + userMessage
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (userMessage.toLowerCase() == "オフ") {
    var spreadsheetId = "1hNZIP-bkVbVlCUdU8IKTJGDYV72XItLdRtlpuA6eF1k";
    var sheeton = SpreadsheetApp.openById(spreadsheetId).getSheetByName("オン");
    var sheetoff = SpreadsheetApp.openById(spreadsheetId).getSheetByName("オフ");
    var sheetsum = SpreadsheetApp.openById(spreadsheetId).getSheetByName("電気量");
    var value = sheeton.getRange('B2').getValue();
    if(value != "" && value != null){
      sheetoff.appendRow([new Date(),Date.now(),"オフ"]);
      off();
      sheeton.getRange(2,1,1,3).setValues([["","",""]]);
      sheetoff.getRange(2,1,1,3).setValues([["","",""]]);
    }
    return ContentService.createTextOutput(JSON.stringify({
    'content': 'Received message: ' + userMessage
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
