let newTxs = require("../data/newTxs.json");
let contractCommand = require("../../utils/contractCommand.js").contractCommand;
var path = require("path");
let accounts = require("../data/account.json");
let param = require("../data/param.json");

async function runCommand(){
    let command = new contractCommand(accounts,param);
    let result = await command.sendSignedTransaction(newTxs,path.join(path.resolve(__dirname),"../data/newTxResult.json"));

}
runCommand();