let {baseTransaction} = require("./baseTransaction.js")
let inputFormats = require("./inputFormat.js");
class contractTransaction extends baseTransaction{
    constructor(platForm,accounts,web3,param,from){
        super(platForm,accounts,web3,param,from);
    }
    createTransaction(args){
        if (args.length == 2) {
            let tx = new this.Trans(this.createContractTx(args[0],args[1]));
            return [tx,args[0],args[1]];
        }else{
            let funcName = args[3];
            if (inputFormats[funcName]) {
                args = inputFormats[funcName](args);  
            }
            let tokenAddress = args[0];
            let value = args[1];
            let contractName = args[2];
            args = args.slice(4)
            let Contract = this.createContract(contractName,tokenAddress);
            let data = Contract.methods[funcName](...args).encodeABI();
            let tx = new this.Trans(this.createContractTx(tokenAddress,value,data));
            return [tx,tokenAddress,value,contractName,funcName];
        }

    }
    async sendSignedTransaction(data){
        let result = await this.web3.eth.sendSignedTransaction(data);
        if (result && result.status){
            return result;
        }else{
            console.error(result);
            process.exit(1);
        }
    }
}
exports.contractTransaction = contractTransaction;