const path = require("node:path");
const SRC = path.join(process.cwd(),"src")
const app = require(path.join(process.cwd(),'app.js'));
const conf = require(path.join(SRC, 'config'));
const bootstrapAdmin = require(path.join(SRC, "common", "utils", "bootstrapAdmin"));
const { initSocket } = require(path.join(SRC, "sockets", "socket"));

const startServer = async () =>{

    const connectToMongo = require(path.join(SRC,'database'));
    await connectToMongo();

    await bootstrapAdmin();

    const httpServer = app.listen(conf.PORT, () => {
            console.log(`Serwer API: http://${conf.API_HOST}:${conf.PORT}`);
        });

    initSocket(httpServer);
}

startServer().catch((err) => {
    console.log("Błąd uruchamiania serwera! :\n"+err)
});