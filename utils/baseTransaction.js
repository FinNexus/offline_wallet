let WanTransaction = require('../transactions/wanTransaction.js').WanTransaction;
let EthTransaction = require('../transactions/EthTransaction.js').EthTransaction;
let ContractFunc = require("../contracts/ContractFunc.js");
let Contract = require("../contracts/Contract.js");
let contractInfo = require("../ABI/contractInfo.json");
let config = require('../config.js');
let collateral0 = "0x0000000000000000000000000000000000000000";
class baseTransaction {
    constructor(platForm,accounts,web3,param,contractName){
        this.accounts = accounts;
        this.web3 = web3;
        this.param = param;
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
    createTransaction(value,data){
        let nonce = this.accounts[this.from];
        this.accounts[this.from]++;
        return {
            from:this.from,
            to:this.this.contract.contractAddr,
            value:value,
            data:data,
            gas:config.gas,
            gasPrice:config.gasPrice,
            nonce:nonce,
            chainId:config.chainId
        }
    }
}
class CreateOptions extends baseTransaction{
    constructor(platForm,param,web3){
        super(platForm,param,web3,"OptionsManager");
        this.func = new ContractFunc(this.contract,"createOptionsToken");
    }
    signTransaction(underlying,optionType,strikePrice,Expiration,collateral){
        let optionName = underlying+optionType+strikePrice+Expiration+collateral;
        let colarg = this.param.collateral[collateral];
        if (!colarg){
            console.error("collateral "+collateral+" is not found");
        } 
        let optType = this.param.optionType[optionType];
        if (!optType){
            console.error("option type "+optionType+" is not found");
        } 
        let under = this.param.underLying[underLying];
        if (!under){
            console.error("underLying "+underLying+" is not found");
        } 
        let data = this.func.getData(this.web3,optionName,colarg,under,strikePrice,expiration,optType);
        this.tx = new this.Trans(createTransaction(0,data));
        let result = this.tx.signAndHash()
        return [optionName,result[0],result[1]];
    }
}
class addCollateral extends baseTransaction{
    constructor(platForm){
        super(platForm,"OptionsManager");
        this.func = new ContractFunc(this.contract,"addCollateral");
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
    constructor(platForm){
        super(platForm,"IERC20");
        this.func = new ContractFunc(this.contract,"transfer");
    }
}
class Erc20Approve extends baseTransaction{
    constructor(platForm,param,web3){
        super(platForm,param,web3,"IERC20");
        this.func = new ContractFunc(this.contract,"approve");
    }
    signTransaction(tokenAddress,spender,amount){
        this.func.contract.contractAddr = tokenAddress;
        let data = this.func.getData(this.web3,spender,amount);
        
        this.tx = new this.Trans(createTransaction(0,data));
        let result = this.tx.signAndHash()
        return result;
    }
}
exports.CreateOptions = CreateOptions;
exports.Erc20Approve = Erc20Approve;