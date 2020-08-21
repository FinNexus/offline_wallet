//normal transaction
let IRawTransaction = require('./transaction.js').IRawTransaction;
let WanTx = require('wanchainjs-tx')
class WanTransaction extends IRawTransaction
{
    constructor(trans)
    {
        trans.Txtype = '0x01';
        super(trans);
    }
    createTx(){
        return new WanTx(this.trans);
    }
};
exports.WanTransaction = WanTransaction;
