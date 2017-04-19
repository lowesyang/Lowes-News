let crypto=require("crypto");
let key="lowesyang";

function encrypt(str){
    if(typeof str == "object"){
        str=JSON.stringify(str);
    }
    let encrypted="";
    let cipher=crypto.createCipher("aes192",key);
    encrypted+=cipher.update(str,"utf8","hex");
    encrypted+=cipher.final("hex");
    return encrypted;
}

function decrypt(str) {
    let decrypted="";
    let decipher=crypto.createDecipher("aes192",key);
    decrypted+=decipher.update(str,'hex','binary');
    decrypted+=decipher.final('binary');
    let res=JSON.parse(decrypted)
    if(res) return res;
    return decrypted;
}

module.exports={
    encrypt,
    decrypt,
    key
}