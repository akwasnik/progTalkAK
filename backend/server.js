const path = require("node:path");
const SRC = path.join(process.cwd(),"src")
const app = require(path.join(process.cwd(),'app.js'));
const conf = require(path.join(SRC, 'config',));
let sio;

const startServer = async () =>{

    const connectToMongo = require(path.join(SRC,'database'));
    await connectToMongo();


    const httpServer = app.listen(conf.PORT, () => {
            console.log(`Serwer API: http://${conf.API_HOST}:${conf.PORT}`);
        });


    sio = require('socket.io')(httpServer);
    sio.on('connect', (/*socket*/) => {
        console.log('Socket.io – połączenie');
    });
}

startServer().catch((err) => {
    console.log("Błąd uruchamiania serwera! :\n"+err)
});

        