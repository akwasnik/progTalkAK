const path = require('node:path');
const SRC = path.join(process.cwd(),"src")
const conf = require(path.join(SRC,'config','db'));

const mongoUri = `mongodb://${conf.DB_HOST}:${conf.DB_PORT}/${conf.DB_NAME}`
const mongooose = require('mongoose');

const connectToMongo = async () => {
    try {
        const ans = await mongooose.connect(mongoUri);
        const connData = `${ans.connection.host}:${ans.connection.port}/${ans.connection.name}`
        console.log(`Połączenie z MongoDB udało się: mongodb://${connData}`);
    } catch (err) {
        console.error((err.message));
        process.exit(-1);
    }
};

module.exports = connectToMongo;
