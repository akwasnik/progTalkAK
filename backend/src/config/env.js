require('dotenv').config({
    path: require('path').join(process.cwd(), '.env')
});

module.exports = {
    PORT: process.env.PORT,
    API_HOST: process.env.API_HOST,
    SECRET: process.env.SECRET
};
