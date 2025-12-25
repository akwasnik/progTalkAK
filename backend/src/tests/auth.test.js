const request = require("supertest");
const path = require("node:path");
const SRC = path.join(process.cwd(),"src");
const jwt = require("jsonwebtoken");
const { genHash } = require(path.join(SRC,"common","utils","hash"));

const app = require(path.join(process.cwd(), "app"));
const conf = require(path.join(SRC, 'config',));

// DB mock
jest.mock("../modules/users/user.repository", () => ({
    findByLogin: jest.fn(),
    findById: jest.fn(),
    getAll: jest.fn(),
    createUser: jest.fn(),
}));

const userRepository = require(path.join(SRC,"modules","users","user.repository"));

describe("AUTH MODULE", () => {

    beforeEach(() => jest.clearAllMocks());

    // REGISTER
    test("POST /api/auth/register — should register new user", async () => {
        const newUser = { login: "testuser", password: "123" };

        userRepository.findByLogin.mockResolvedValue(null);
        userRepository.createUser.mockResolvedValue({
            ...newUser,
            _id: "abc123",
            isAdmin: false,
            isAllowed: true
        });

        const res = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        expect(res.status).toBe(201);
        expect(res.body.login).toBe("testuser");
        expect(userRepository.createUser).toHaveBeenCalled();
    });

    // LOGIN

    test("POST /api/auth/login — valid credentials return token", async () => {

        userRepository.findByLogin.mockResolvedValue({
            _id: "abc123",
            login: "testuser",
            passwordHashed: genHash("password123"),
            isAllowed: true
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ login: "testuser", password: "password123" });
            
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.login).toBe("testuser");
    });

    test("POST /api/auth/login — wrong password → 401", async () => {

        userRepository.findByLogin.mockResolvedValue({
            _id: "abc123",
            login: "testuser",
            passwordHashed: "correctpass",
            isAllowed: true
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ login: "testuser", password: "wrongpass" });

        expect(res.status).toBe(401);
    });

    test("POST /api/auth/login — blocked user → 403", async () => {

        userRepository.findByLogin.mockResolvedValue({
            _id: "abc123",
            login: "testuser",
            passwordHashed: genHash("123"),
            isAllowed: false
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ login: "testuser", password: "123" });

        expect(res.status).toBe(403);
    });

    // AUTH REQUIRED

    test("authRequired — no token → 401", async () => {
        const res = await request(app)
            .get("/api/users/123")  // middlewared endpoint
            .send();

        expect(res.status).toBe(401);
    });

    test("authRequired — valid token → next()", async () => {
        const token = jwt.sign({ id: "abc123" }, conf.SECRET);

        userRepository.findById.mockResolvedValue({
            _id: "abc123",
            isAdmin: false
        });

        const res = await request(app)
            .get("/api/users/123")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    // ADMIN REQUIRED

    test("adminRequired — non-admin → 403", async () => {
        const token = jwt.sign({ id: "abc123" }, conf.SECRET);

        userRepository.findById.mockResolvedValue({
            _id: "abc123",
            isAdmin: false
        });

        const res = await request(app)
            .get("/api/users")   // admin endpoint
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(403);
    });

    test("adminRequired — admin → 200", async () => {
        const token = jwt.sign({ id: "adm" }, conf.SECRET);

        userRepository.findById.mockResolvedValue({
            _id: "adm",
            isAdmin: true
        });

        const res = await request(app)
            .get("/api/users")   // admin route
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

});
