let EthTx = require('ethereumjs-tx').Transaction;
let IRawTransaction = require('./transaction.js').IRawTransaction;
let Common = require('ethereumjs-common').default;
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function forCustomChain(baseChain, customChainParams, hardfork, supportedHardforks) {
    var standardChainParams = Common._getChainParams(baseChain);
    return {
        chainParams : __assign(__assign({}, standardChainParams), customChainParams),
        hardfork : hardfork,
        supportedHardforks : supportedHardforks
    };
};
//normal transaction
class EthTransaction extends IRawTransaction
{
    constructor(trans)
    {
        super(trans);
        this.customChain = {
            56 : forCustomChain('mainnet',
                {
                name: 'BSCTestNet',
                networkId: 56,
                chainId: 56,
                }
            )
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
