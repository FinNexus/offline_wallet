let deployCommand = require("../../utils/deployCommand.js").deployCommand;
var path = require("path");
let accounts = require("../data/account.json");
let deploy = require("../data/deploy.json");

let param = require("../data/param.json");

async function runCommand(){
    let command = new deployCommand(accounts,param,deploy.from);
    command.SignRun(deploy,path.join(path.resolve(__dirname),"../data/deployTrans.json"));
}
runCommand();