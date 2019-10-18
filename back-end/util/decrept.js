const crypto = require('crypto');
const path = require('path')
const fs = require('fs');

const p = path.join(__dirname, "", "connection_path.txt")
let MONGODB_CONNECTION = "";
// I read it Sync here
const data = fs.readFileSync(p)

encrypt = (text) => {
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

decrypt = (text) => {
    var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
MONGODB_CONNECTION = decrypt(data.toString())
module.exports = MONGODB_CONNECTION