let EthTx = require('ethereumjs-tx').Transaction;;
let IRawTransaction = require('./transaction.js').IRawTransaction;
//normal transaction
class EthTransaction extends IRawTransaction
{
    constructor(trans)
    {
        super(trans,EthTx);
    }
};
exports.EthTransaction = EthTransaction;
