let Web3 = require('web3');
const net = require('net');
let config = require('../config.js');
let keystoreDir = require("../keystore/keystoreDir.js")
let {CreateOptions,addCollateral,Erc20Approve,Erc20Transfer} = require("./baseTransaction.js")
const fs = require('fs');
var colors = require("colors/safe");
const prompt = require('prompt');
let collateral0 = "0x0000000000000000000000000000000000000000";
class baseCommand {
    constructor(accounts,param,from){
        if (config.ipcPath){
            this.web3 = new Web3(new Web3.providers.IpcProvider(config.ipcPath, net));
        }else if(config.rpcPath){
            this.web3 = new Web3(new Web3.providers.HttpProvider(config.rpcPath));
        }
        this.keystore = new keystoreDir(config.keyStorePath);
        this.accounts = accounts;
        this.param = param;
        this.from = from;
    }
    async initNonce(InputFile) {
        for (var key in this.accounts) {
            try {
                this.accounts[key] = await this.web3.eth.getTransactionCount(key); 
            } catch (error) {
                console.error(error);
            }
            
            
        }
        this.SaveJSON(InputFile,this.accounts);
        console.log("Account Nonces are saved in " +InputFile);
    }
    createTransaction(tx,obj){
        try {
            let result = tx[0].signAndHash(Buffer.from(this.privateKy.slice(2), 'hex'));
            obj.push({
                hash:result[1],
                param:tx.slice(1),
                data:result[0]
            })           
        } catch (error) {
            console.error(error);
        }
    }
    getPrivateKey(password){
        this.privateKy = this.keystore.getAccount(this.from).getPrivateKey(password);
    }
    close(){

    }
    SignRun(...args){
        let self = this;
        prompt.start();
        prompt.message = colors.blue("finnexus");
        prompt.delimiter = colors.green(">>");
        prompt.get({
            name:"password",
            description:"input your password:",
            hidden:true,
            replace: '*',
            type: 'string'}, function (err, result) {
                if (err){
                    console.error(err);
                    return;
                }else{
                    self.getPrivateKey(result.password);
                    self.run(...args);
                }
        });
    }
    SaveJSON(fileName,obj){
        fs.writeFileSync(fileName,JSON.stringify(obj,null,4),"utf8");
    }
}
class CreateOptionsCommand extends baseCommand{
    constructor(accounts,param,from){
        super(accounts,param,from);
        this.optionTx = new CreateOptions(config.platform,accounts,this.web3,param,from);
    }
    run(options,saveFile){
        let obj = [];
        for (var i=0;i<options.data.length;i++){
            this.createTransaction(this.optionTx.createTransaction(...options.data[i]),obj);
        }
        this.SaveJSON(saveFile,obj);
        console.log("raw transactions info is saved in " +saveFile);
    }
    async sendSignedTransaction(optionsToken,savefile){
        for (var i = 0;i<optionsToken.length;i++) {
            let logs = await this.optionTx.sendSignedTransaction(optionsToken[i].data);
            for (var j=0;j<logs.length;j++){
                if (logs[j].name == "CreateOptions"){
                    optionsToken[i].address = logs[j].tokenAddress;
                    break;
                }
            }
        }
        this.SaveJSON(savefile,optionsToken);
        console.log("options info is saved in " +savefile);
    }
}
class AddCollateralCommand extends baseCommand{
    constructor(accounts,param,from){
        super(accounts,param,from);
        this.CollateralTx = new addCollateral(config.platform,accounts,this.web3,param,from);
        this.ApproveTx = new Erc20Approve(config.platform,accounts,this.web3,param,from);
        this.transfer = new Erc20Transfer(config.platform,accounts,this.web3,param,from);
    }
    run(collateral,saveFile){
        let obj = [];
        for (var i=0;i<collateral.data.length;i++){
            let colAddr = this.param.collateral[collateral.data[i][1]];
            if (colAddr != collateral0){
                this.createTransaction(this.ApproveTx.createTransaction(colAddr,this.CollateralTx.contract.contractAddr,collateral.data[i][2]),obj);
            }
            this.createTransaction(this.CollateralTx.createTransaction(...collateral.data[i]),obj);
            this.createTransaction(this.transfer.createTransaction(collateral.data[i][0],collateral.recipient,collateral.data[i][3]),obj);
        }
        this.SaveJSON(saveFile,obj);
        console.log("raw transactions info is saved in " +saveFile);
    }

    async sendSignedTransaction(collateral,savefile){
        for (var i = 0;i<collateral.length;i++) {
            let logs = await this.CollateralTx.sendSignedTransaction(collateral[i].data);
        }
        console.log("Successfully Finish!");
    }
} 
exports.CreateOptionsCommand = CreateOptionsCommand;
exports.AddCollateralCommand = AddCollateralCommand;