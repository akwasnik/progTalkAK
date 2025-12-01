const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const conf = require(require('path').join(SRC, 'config','crypto'));
const crypto = require('crypto');

const genHash = (pswd) => {
    return crypto.pbkdf2Sync(pswd, conf.SALT, conf.ITERATIONS, conf.KEYLEN, conf.DIGEST).toString(`hex`);
};

const cmpHash = (pswd, hash) => {
  let hashedPswd = genHash(pswd);
  return hashedPswd == hash;
};

module.exports = {
  genHash,
  cmpHash
};
