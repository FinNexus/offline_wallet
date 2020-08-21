let contractCommand = require("../../utils/contractCommand.js").contractCommand;
var path = require("path");
let accounts = require("../data/account.json");
let txData = require("../data/txData.json");
let param = require("../data/param.json");
async function runCommand(){
    let command = new contractCommand(accounts,param,txData.from);
    command.SignRun(txData,path.join(path.resolve(__dirname),"../data/newTxs.json"));
}
runCommand();