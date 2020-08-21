const BN = require("bn.js");
let inputFormats = {
    approve(args){
        let index = args.length - 1;
        args[index] = new BN(args[index])
        return args;
    },
    contributeTokens(args){
        let index = args.length - 1;
        args[index] = new BN(args[index])
        return args;
    }
}
module.exports = inputFormats;