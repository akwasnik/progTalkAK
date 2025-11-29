const path = require('node:path');
const CWD = process.cwd();
const conf = require(path.join(CWD,'config','database'));

const User = require(path.join(process.cwd(), 'models', 'User'));
const readline = require('readline');
const { genHash, cmpHash } = require(path.join(CWD, 'lib','hash'));

const mongoUri = `mongodb://${conf.DB_HOST}:${conf.DB_PORT}/${conf.DB_NAME}`
const mongooose = require('mongoose');

function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

const connectToMongo = async () => {
    try {
        const ans = await mongooose.connect(mongoUri);
        const users = await User.find();
        if(users.length == 0){
            console.log("Brak uzytkownikow w bazie danych");
            const login = await ask("Podaj login administratora: ");
            const email = await ask("Podaj email administratora: ");
            const pswrd = await ask("Podaj haslo administratora: ");
            const hashed = genHash(pswrd);

            await User.create({
                login,
                email,
                password: hashed,
                registrationDate: new Date(),
                isAdmin: true
            });

            console.log("Utworzono konto administratora");
        }
        const connData = `${ans.connection.host}:${ans.connection.port}/${ans.connection.name}`
        console.log(`Połączenie z MongoDB udało się: mongodb://${connData}`);
    } catch (err) {
        console.error((err.message));
        process.exit(-1);
    }
};

module.exports = connectToMongo;
