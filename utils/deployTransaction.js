let {baseTransaction} = require("./baseTransaction.js")
class deployTransaction extends baseTransaction{
    constructor(platForm,accounts,web3,param,from,contractName){
        super(platForm,accounts,web3,param,from,contractName);
//        this.func = new ContractFunc(this.contract,"transfer");
    }
    createTransaction(contractName,bytecode,...args){
        this.setContractName(contractName);
        let data = this.contract.deployContractData(this.web3,bytecode,args);
        let tx = new this.Trans(this.createDeployTxObj(0,data));
        return [tx,contractName];
    }
    async sendSignedTransaction(data){
        let result = await this.web3.eth.sendSignedTransaction(data);
        if (result && result.status){
            return result.contractAddress;
        }else{
            console.error(result);
            process.exit(1);
        }
    }
}
exports.deployTransaction = deployTransaction;