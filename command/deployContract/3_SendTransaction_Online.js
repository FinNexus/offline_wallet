let deployTrans = require("../data/deployTrans.json");
let deployCommand = require("../../utils/deployCommand.js").deployCommand;
var path = require("path");
let accounts = require("../data/account.json");
let param = require("../data/param.json");

async function runCommand(){
    let command = new deployCommand(accounts,param);
    let result = await command.sendSignedTransaction(deployTrans,path.join(path.resolve(__dirname),"../data/deployContracts.json"));

}
runCommand();