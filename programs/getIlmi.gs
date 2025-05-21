//照度取得プログラム
function getIlmi() {
  var access_token = 'ory_at_kge0Njn78Yq2943JU8ajzvPTOHEaFrjrj1GH3Ioh9R4.JBHPwnNoxzPMu2pT4jhcaAlRCi5YFPnBXAE1s08asRA';

  var url = 'https://api.nature.global/1/devices';
  var params = {
    headers : {
      "Content-Type" : "application/json;",
      'Authorization': 'Bearer ' + access_token
    },
    method : 'get'
  };
  var data = JSON.parse(UrlFetchApp.fetch(url,params));

  var ilmi = (data[0]["newest_events"]["il"]["val"]); // 照度
  return ilmi;
}
