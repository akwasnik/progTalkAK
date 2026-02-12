const path = require("node:path");
const SRC = path.join(process.cwd(),"src")
const app = require(path.join(process.cwd(),'app.js'));
const conf = require(path.join(SRC, 'config'));
const bootstrapAdmin = require(path.join(SRC, "common", "utils", "bootstrapAdmin"));
const { initSocket } = require(path.join(SRC, "sockets", "socket"));
const userRepository = require(path.join(SRC, "modules", "users", "user.repository"));
const userService = require(path.join(SRC, "modules", "users", "user.service"));
const postRepository = require(path.join(SRC, "modules", "posts", "post.repository"));
const Post = require(path.join(SRC, "modules", "posts", "post.model"));

const test = async () => {
    const aliceLogin = "alice@example.com";

    const alice = await userRepository.findByLogin(aliceLogin);
    const post = await Post.findOne()
    await postRepository.addLike(post._id, alice.login);

    const przed = await Post.findById(post._id)
    console.log("Likei przed zablokowaniem");
    console.log(przed?.likes);

    await userService.setAllowed(alice._id, false);

    const po = await Post.findById(post._id)
    console.log("Likei po zablokowaniu");
    console.log(po.likes || []);

    await userService.setAllowed(alice._id, true);
};

const startServer = async () =>{

    const connectToMongo = require(path.join(SRC,'database'));
    await connectToMongo();

    await bootstrapAdmin();

    const httpServer = app.listen(conf.PORT, () => {
            console.log(`Serwer API: http://${conf.API_HOST}:${conf.PORT}`);
        });

    initSocket(httpServer);

    await test();
}

startServer().catch((err) => {
    console.log("Błąd uruchamiania serwera! :\n"+err)
});