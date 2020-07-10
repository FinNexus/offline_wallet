'use strict';

class IRawTransaction
{
    constructor(trans,txClass)
    {
        this.trans = trans;
        this.txClass = txClass;
    }
    setKeyStore(keystoreDir){
        this.Account = keystoreDir.getAccount(this.trans.from);
    }
    sign(web3,privateKey,callback)
    {
         let Key = "0x"+privateKey.toString("hex");
         web3.eth.accounts.signTransaction(this.trans,Key,callback);
    }
    signAndHash()
    {
        const tx = new this.txClass(this.trans);
        tx.sign(privateKey);
        var hash = tx.hash(true);
        const serializedTx = tx.serialize();
        return ["0x"+serializedTx.toString('hex'),hash];
    }

    signFromKeystore(password)
    {
        let privateKey = this.Account.getPrivateKey(password);
        if(privateKey)
        {
            return this.sign(privateKey);
        }
        else
        {
            return null;
        }
    }
    sendRaw(web3,rawTx,callback){
        web3.eth.sendSignedTransaction(rawTx,callback);
    }
    Bytes2HexString(b){
        if (b == undefined) {
            return "";
        }
        let hexs = "";
        for (let i = 0; i < b.length; i++) {
            let hex = b.charCodeAt(i).toString(16);
            if (hex.length === 1) {
                hexs = '0' + hex;
            }
            hexs += hex;
        }
        return hexs;
    }
};
exports.IRawTransaction = IRawTransaction;
