require('dotenv').config({
    path: require('path').join(process.cwd(), '.crypto.env')
});

module.exports = {
    SALT: process.env.SALT || 'b3a844b13ff50b99',
    ITERATIONS: parseInt(process.env.ITERATIONS, 10) || 10000,
    KEYLEN: parseInt(process.env.KEYLEN, 10) || 64,
    DIGEST: process.env.DIGEST || 'sha256',
};
