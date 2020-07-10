//normal transaction
let IRawTransaction = require('./transaction.js').IRawTransaction;
let WanTx = require('wanchainjs-tx')
class WanTransaction extends IRawTransaction
{
    constructor(trans)
    {
        trans.Txtype = '0x01';
        super(trans,WanTx);
    }
};
exports.WanTransaction = WanTransaction;
