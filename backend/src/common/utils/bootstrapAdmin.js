const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const userRepository = require(path.join(SRC, "modules", "users", "user.repository"));
const authService = require(path.join(SRC, "modules", "auth", "auth.service"));

module.exports = async function bootstrapAdmin() {
    const adminExists = await userRepository.existsAdmin();

    if (adminExists) {
        return;
    }

    console.log("\n BRAK ADMINA W BAZIE DANYCH");
    console.log("Musisz utworzyć pierwszego administratora\n");

    const rl = readline.createInterface({ input, output });

    const login = await rl.question("Admin login: ");
    const password = await rl.question("Admin password (min 6 znaków): ");

    rl.close();

    if (!login || !password || password.length < 6) {
        console.error("Nieprawidłowe dane. Restart serwera.");
        process.exit(1);
    }

    await authService.registerAdmin({ login, password });

    console.log("\nAdministrator utworzony pomyślnie!");
    console.log("Możesz się teraz zalogować.\n");
};
