
//remoを通じて実際に電気をオンオフするプログラム
function turnLight(order) {
  const accessToken = "ory_at_J-obN2rBFP4DhZBOGbhxdVOF-sbXmtj5EagCrYnF3IY.a6vmO2-RLFshpMcs_vGBj-1a9mtzQF_MNUTur6zvP4w";
  const applianceId = "78bc1304-6297-484c-82da-45c25f22e140";
  const url = `https://api.nature.global/1/appliances/${applianceId}/light`;
  var message;
  const options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  if(order == "on"){
    options.payload = "button=on";
    UrlFetchApp.fetch(url, options);
  }

  else if (order == "off") {
    // 1回目のonボタンを押す
    options.payload = "button=on";
    UrlFetchApp.fetch(url, options);
    Utilities.sleep(200);
    // 2回目のonボタンを押す
    options.payload = "button=on";
    UrlFetchApp.fetch(url, options);
  }
}