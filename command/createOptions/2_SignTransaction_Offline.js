let CreateOptionsCommand = require("../../utils/basecommand.js").CreateOptionsCommand;
var path = require("path");
let accounts = require("../data/account.json");
let options = require("../data/CreateOptions.json");
const prompt = require('prompt');
prompt.start();
prompt.message = colors.blue("finnexus");
prompt.delimiter = colors.green(">>");
let param = require("../data/param.json");
let command = new CreateOptionsCommand(accounts,param,options.from);
async function runCommand(){
    result = await prompt.get({
        name:"password",
        description:"input your password:",
        hidden:true});
    command.getPrivateKey(result);
    command.run(options,path.join(path.resolve(__dirname),"../data/optionToken.json"));
}
runCommand();