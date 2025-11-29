require('dotenv').config({
    path: require('path').join(process.cwd(), '.env')
});

module.exports = {
    PORT: process.env.PORT || 3000,
    API_HOST: process.env.API_HOST || 'localhost',
    SECRET: process.env.SECRET || "$zyfr $zyfrujac7"
};
