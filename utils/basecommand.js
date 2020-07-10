let Web3 = require('web3');
const net = require('net');
let config = require('../config.js');
let keystoreDir = require("../keystore/keystoreDir.js")
let {CreateOptions,Erc20Approve} = require("./baseTransaction.js")
const fs = require('fs');
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
            let nonce = await this.web3.eth.getTransactionCount(key);
            this.accounts[key] = nonce;
        }
        this.SaveJSON(InputFile,this.accounts);
    }
    getPrivateKey(password){
        this.privateKy = this.keystore.getAccount(this.from).getPrivateKey(password);
    }
    close(){

    }
    SaveJSON(fileName,obj){
        fs.writeFileSync(fileName,JSON.stringify(obj,null,4),"utf8");
    }
}



class CreateOptionsCommand extends baseCommand{
    constructor(accounts,param,from){
        super(accounts,param,from);
        this.optionTx = new CreateOptions(config.platform,param);
    }
    run(options,saveFile){
        let obj = {};
        for (var i=0;i<options.data.length;i++){
            let result = this.optionTx.signTransaction(...options.data[i]);
            obj[result[2]] = {
                name:result[0],
                data:result[1]
            }
        }
        this.SaveJSON(obj,saveFile);
    }
}
exports.CreateOptionsCommand = CreateOptionsCommand;