let EthTx = require('ethereumjs-tx').Transaction;;
let IRawTransaction = require('./transaction.js').IRawTransaction;
//normal transaction
class EthTransaction extends IRawTransaction
{
    constructor(trans)
    {
        super(trans);
    }
    createTx(){
        return new EthTx(this.trans,{chain:this.trans.chainId});
    }
};
exports.EthTransaction = EthTransaction;
