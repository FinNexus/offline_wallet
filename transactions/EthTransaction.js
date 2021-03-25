let EthTx = require('ethereumjs-tx').Transaction;
let IRawTransaction = require('./transaction.js').IRawTransaction;
let Common = require('ethereumjs-common').default;
//normal transaction
class EthTransaction extends IRawTransaction
{
    constructor(trans)
    {
        super(trans);
        this.customChain = {
            56 : {common: Common.forCustomChain('mainnet',
                {
                name: 'BSCTestNet',
                networkId: 56,
                chainId: 56,
                },
                'petersburg'
            )}
        }
    }
    createTx(){
        let chainObj = this.customChain[this.trans.chainId];
        if(!chainObj){
            chainObj = {chain:this.trans.chainId};
        }
        return new EthTx(this.trans,chainObj);
    }
};
exports.EthTransaction = EthTransaction;
