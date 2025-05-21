//massageをLINEで送信するプログラム
function sendLINE(message) {
  var access_token = "rjsN0LEtpI75aoHyqN75yRmToUkBRch2IXcif1u7fKK9a4JzL+SmweU4vIYBP8emLXyzT0dScKLM9ObWVMklJZBcz4fWZK3U6Of37IK6MItDk6VO2AGe7Xmuftjneox1FHC9SQ9ds1GotBpWybpjrQdB04t89/1O/w1cDnyilFU=";
  var to = "U2c18b49ccfeed84e958191ef0b66e173";

  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + access_token
  };

  var postData = {
    "to": to,
    "messages": [
      {
        "type": "text",
        "text": message
      }
    ]
  };

  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData),
  };
  
  var response = UrlFetchApp.fetch(url, options);
  return response;
}