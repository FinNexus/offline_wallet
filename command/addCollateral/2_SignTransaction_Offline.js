let AddCollateralCommand = require("../../utils/basecommand.js").AddCollateralCommand;
var path = require("path");
let accounts = require("../data/account.json");
let collateral = require("../data/addCollateral.json");

let param = require("../data/param.json");

async function runCommand(){
    let command = new AddCollateralCommand(accounts,param,collateral.from);
    command.SignRun(collateral,path.join(path.resolve(__dirname),"../data/collatralTrans.json"));

}
runCommand();