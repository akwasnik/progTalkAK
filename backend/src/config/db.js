require('dotenv').config({
    path: require('path').join(process.cwd(), '.db.env')
});

module.exports = {
    DB_HOST: process.env.DB_HOST || 'progtalk-mongo',
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || 'progtalk',
};
