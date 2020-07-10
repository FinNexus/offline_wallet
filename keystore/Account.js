const fs = require('fs');
var Accounts = require('web3-eth-accounts');
let accounts = new Accounts();
module.exports = class Account{
    constructor(fileName){
        try{
            this.fileName = fileName;
            this.account; 
            let keystoreStr = fs.readFileSync(fileName, "utf8");
            this.keystore = JSON.parse(keystoreStr);
        }catch (e){
            this.keystore = null;
        }
    }
    getPrivateKey(password){
        if(!this.account || !this.account.privateKey){
            this.account = accounts.decrypt(this.keystore,password);
        }
        return this.account.privateKey;
    }
    getAddress(){
        return '0x'+this.keystore.address;
    }
    getWaddress(){
        return '0x'+this.keystore.waddress;
    }
    getOTAPrivateKey(password,OTAAddress) {
        let privateKey = this.getPrivateKey(password);
        let wanKey = this.getWanPrivateKey(password);
        if (privateKey && wanKey) {
            return wanUtil.computeWaddrPrivateKey(OTAAddress, privateKey, wanKey);
        }
        return null;
    }
    changePassword(oldPassword,newPassword){
        var privateKey = this.getPrivateKey(oldPassword);
        var keyObject = keythereum.dump(newPassword, privateKey, this.keystore.crypto.kdfparams.salt, this.keystore.crypto.cipherparams.iv);
        fs.writeFileSync(this.fileName,JSON.stringify(keyObject));
    }
}