require('dotenv').config({
    path: require('path').join(process.cwd(), '.crypto.env')
});

module.exports = {
    SALT: process.env.SALT,
    ITERATIONS: parseInt(process.env.ITERATIONS, 10),
    KEYLEN: parseInt(process.env.KEYLEN, 10),
    DIGEST: process.env.DIGEST,
};
