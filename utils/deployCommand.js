
let {baseCommand} = require("./basecommand.js")
let {deployTransaction} = require("./deployTransaction.js")
let config = require('../config.js');
class deployCommand extends baseCommand{
    constructor(accounts,param,from,contractName){
        super(accounts,param,from);
        this.deploy = new deployTransaction(config.platform,accounts,this.web3,param,from,contractName);
    }
    run(contracts,saveFile){
        let obj = [];
        for (var i=0;i<contracts.data.length;i++){
            this.createTransaction(this.deploy.createTransaction(contracts.data[i].name,contracts.data[i].bytecode,...contracts.data[i].args),obj);
        }
        this.SaveJSON(saveFile,obj);
        console.log("raw transactions info is saved in " +saveFile);
    }
    async sendSignedTransaction(txs,savefile){
        let obj = {}
        for (var i = 0;i<txs.length;i++) {
            let address = await this.deploy.sendSignedTransaction(txs[i].data);
            obj[txs[i].param[0]] = address;
            console.log(address);
        }
        this.SaveJSON(savefile,obj);
        console.log("new contract address is saved in " +savefile);
    }

}
exports.deployCommand = deployCommand;