
let {baseCommand} = require("./basecommand.js")
let {contractTransaction} = require("./contractTransaction.js")
let config = require('../config.js');
class contractCommand extends baseCommand{
    constructor(accounts,param,from){
        super(accounts,param,from);
        this.contractTransaction = new contractTransaction(config.platform,accounts,this.web3,param,from);
    }
    run(txs,saveFile){
        let obj = [];
        for (var i=0;i<txs.data.length;i++){
            this.createTransaction(this.contractTransaction.createTransaction(txs.data[i]),obj);
        }
        this.SaveJSON(saveFile,obj);
        console.log("raw transactions info is saved in " +saveFile);
    }

    async sendSignedTransaction(txs,savefile){
        for (var i = 0;i<txs.length;i++) {
            let logs = await this.contractTransaction.sendSignedTransaction(txs[i].data);
        }
        console.log("Successfully Finish!");
    }
}
exports.contractCommand = contractCommand;