//トリガー作成用プログラム
//gasの標準機能では毎日0:00に正確に実行されるトリガーが作れないため、
//「トリガーを作るプログラム」をトリガーで動かして実現

function setTrigger() {
  let triggers = ScriptApp.getProjectTriggers();
  for(let trigger of triggers){
    let funcName = trigger.getHandlerFunction();
    if(funcName == 'last'){
      ScriptApp.deleteTrigger(trigger);
    }
  }
  let now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth();
  let d = now.getDate();
  let date = new Date(y, m, d+1, 0, 0);
  ScriptApp.newTrigger('last').timeBased().at(date).create();
}