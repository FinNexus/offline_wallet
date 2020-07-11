let WanTransaction = require('../transactions/wanTransaction.js').WanTransaction;
let EthTransaction = require('../transactions/EthTransaction.js').EthTransaction;
let {GWeiAmount,CoinAmount} = require("../transactions/Amount.js");
let ContractFunc = require("../contracts/ContractFunc.js");
let ContractEvent = require("../contracts/ContractEvent.js");
let Contract = require("../contracts/Contract.js");
let contractInfo = require("../ABI/contractInfo.json");
let config = require('../config.js');
let collateral0 = "0x0000000000000000000000000000000000000000";
class baseTransaction {
    constructor(platForm,accounts,web3,param,from,contractName){
        this.accounts = accounts;
        this.web3 = web3;
        this.param = param;
        this.from = from;
        let contractMap = contractInfo;
        if (contractMap[contractName]){
            let abi = require("../ABI/"+contractName+".json");
            if(abi) {
                this.contract = new Contract(abi,contractMap[contractName].address);
            }else{
                console.error("Contract Abi " + contractMap[contractName].fileName + " is not exist!");
            }
        }else{
            console.error("Contract " + contractName + " is not exist!");
        }
        if (platForm == "WAN"){
            this.Trans = WanTransaction;
        }else{
            this.Trans = EthTransaction;
        }
    }
    async sendSignedTransaction(data){
        let logs = []
        let result = await this.web3.eth.sendSignedTransaction(data);
        if (result && result.logs && result.status){
            for (var i=0;i<result.logs.length;i++){
                let data = await this.contract.decodeLog(result.logs[i].data,result.logs[i].topics,this.web3);
                logs.push(data);
            }
        }else{
            console.error(result);
            process.exit(1);
        }
        return logs;
    }
    createTxObj(value,data){
        let nonce = this.accounts[this.from];
        this.accounts[this.from]++;
        let gasPrice = new GWeiAmount(config.gasPrice);
        return {
            to:this.contract.contractAddr,
            value:value,
            data:data,
            gas:config.gas,
            gasPrice:gasPrice.getWei(),
            nonce:nonce,
            chainId:config.chainId
        }
    }
}
class CreateOptions extends baseTransaction{
    constructor(platForm,accounts,web3,param,from){
        super(platForm,accounts,web3,param,from,"OptionsManager");
        this.func = new ContractFunc(this.contract,"createOptionsToken");
    }
    createTransaction(underlying,optionType,strikePrice,Expiration,collateral){
        let optionName = underlying+"_"+optionType+"_"+strikePrice+"_"+Expiration+"_"+collateral;
        let colarg = this.param.collateral[collateral];
        if (!colarg){
            console.error("collateral "+collateral+" is not found");
        } 
        let optType = this.param.optionType[optionType];
        if (optType == undefined){
            console.error("option type "+optionType+" is not found");
        } 
        let under = this.param.underLying[underlying];
        if (!under){
            console.error("underLying "+underlying+" is not found");
        } 
        try {
            let data = this.func.getData(this.web3,optionName,colarg,under,strikePrice*1e8,Expiration,optType);
            let tx = new this.Trans(this.createTxObj(0,data));
            return [tx,optionName];
        } catch (error) {
            console.error(error);
        }
    }
}
class addCollateral extends baseTransaction{
    constructor(platForm,accounts,web3,param,from){
        super(platForm,accounts,web3,param,from,"OptionsManager");
        this.func = new ContractFunc(this.contract,"addCollateral");
    }
    createTransaction(optionsToken,collateral,amount,mintOptionsTokenAmount){
        let colarg = this.param.collateral[collateral];
        if (!colarg){
            console.error("collateral "+collateral+" is not found");
        } 
        try {
            let amountWei = new CoinAmount(amount);
            let amountmint = new CoinAmount(mintOptionsTokenAmount);
            let data = this.func.getData(this.web3,optionsToken,colarg,amountWei.getWei(),amountmint.getWei());
            if (colarg == collateral0){
                let tx = new this.Trans(this.createTxObj(amountWei.getWei(),data));
                return [tx,"addCollateral",optionsToken,collateral,amount,mintOptionsTokenAmount];
            }else{
                let tx = new this.Trans(this.createTxObj(0,data));
                return [tx,"addCollateral",optionsToken,collateral,amount,mintOptionsTokenAmount];
            }

        } catch (error) {
            console.error(error);
        }
    }
}
class withdrawCollateral extends baseTransaction{
    constructor(platForm){
        super(platForm,"OptionsManager");
        this.func = new ContractFunc(this.contract,"withdrawCollateral");
    }
}
class burnOptionsToken extends baseTransaction{
    constructor(platForm){
        super(platForm,"OptionsManager");
        this.func = new ContractFunc(this.contract,"burnOptionsToken");
    }
}
class Erc20Transfer extends baseTransaction{
    constructor(platForm,accounts,web3,param,from){
        super(platForm,accounts,web3,param,from,"IERC20");
        this.func = new ContractFunc(this.contract,"transfer");
    }
    createTransaction(tokenAddress,recipient,amount){
        this.func.contract.contractAddr = tokenAddress;
        let amountWei = new CoinAmount(amount);
        let data = this.func.getData(this.web3,recipient,amountWei.getWei());
        let tx = new this.Trans(this.createTxObj(0,data));
        return [tx,"transfer",tokenAddress,recipient,amount];
    }
}
class Erc20Approve extends baseTransaction{
    constructor(platForm,accounts,web3,param,from){
        super(platForm,accounts,web3,param,from,"IERC20");
        this.func = new ContractFunc(this.contract,"approve");
    }
    createTransaction(tokenAddress,spender,amount){
        this.func.contract.contractAddr = tokenAddress;
        let amountWei = new CoinAmount(amount);
        let data = this.func.getData(this.web3,spender,amountWei.getWei());
        let tx = new this.Trans(this.createTxObj(0,data));
        return [tx,"approve",tokenAddress,spender,amount];
    }
}
exports.CreateOptions = CreateOptions;
exports.Erc20Approve = Erc20Approve;
exports.addCollateral = addCollateral;
exports.Erc20Transfer = Erc20Transfer;