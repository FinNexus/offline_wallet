let CreateOptionsCommand = require("../../utils/basecommand.js").CreateOptionsCommand;
var path = require("path");
let accounts = require("../data/account.json");
let options = require("../data/CreateOptions.json");

let param = require("../data/param.json");

async function runCommand(){
    let command = new CreateOptionsCommand(accounts,param,options.from);
    command.SignRun(options,path.join(path.resolve(__dirname),"../data/optionToken.json"));
}
runCommand();