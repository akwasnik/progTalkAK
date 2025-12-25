const request = require("supertest");
const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const app = require(path.join(process.cwd(),"app"));
const { genHash } = require(path.join(SRC,"common","utils","hash"));
// DB mock
jest.mock("../modules/users/user.repository", () => ({
    findByLogin: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
    updatePassword: jest.fn(),
    getAll: jest.fn(),
    deleteUser: jest.fn(),
    makeAdmin: jest.fn(),
    setAllowed: jest.fn()
}));

const userRepository = require(path.join(SRC,"modules","users","user.repository"));

// Middleware mock
jest.mock("../common/middleware/authRequired", () => (req, _res, next) => {
    req.user = { id: "123", isAdmin: false, isAllowed: true };
    next();
});

jest.mock("../common/middleware/adminRequired", () => (req, _res, next) => {
    req.user = { id: "999", isAdmin: true, isAllowed: true };
    next();
});

describe("User Module", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // PROFILE
    test("GET /api/users/:id — should return user", async () => {
        userRepository.findById.mockResolvedValue({
            login: "testuser",
            isAdmin: false
        });

        const res = await request(app).get("/api/users/123");

        expect(res.status).toBe(200);
        expect(res.body.login).toBe("testuser");
    });

    // UPDATE
    test("PATCH /api/users/:id/password — should update password", async () => {
        userRepository.updatePassword.mockResolvedValue({
            login: "testuser",
            passwordHashed: genHash("newpass123")  // mock
        });

        const res = await request(app)
            .patch("/api/users/123/password")
            .send({ newPassword: "newpass123" });

        expect(res.status).toBe(200);
        expect(res.body.passwordHashed).toBe(genHash("newpass123"));
        expect(userRepository.updatePassword).toHaveBeenCalledWith("123", genHash("newpass123") );
    });

    // ADMIN — MAKE ADMIN
    test("PATCH /api/users/:id/make-admin — admin makes admina", async () => {
        userRepository.makeAdmin.mockResolvedValue({
            login: "testuser",
            isAdmin: true
        });

        const res = await request(app)
            .patch("/api/users/123/make-admin");

        expect(res.status).toBe(200);
        expect(res.body.isAdmin).toBe(true);
    });

    // ADMIN — ALLOW / BLOCK
    test("PATCH /api/users/:id/allow — allow / block user", async () => {
        userRepository.setAllowed.mockResolvedValue({
            login: "testuser",
            isAllowed: false
        });

        const res = await request(app)
            .patch("/api/users/123/allow")
            .send({ allowed: false });

        expect(res.status).toBe(200);
        expect(res.body.isAllowed).toBe(false);
    });

    // DELETE USER
    test("DELETE /api/users/:id — admin delets user", async () => {
        userRepository.deleteUser.mockResolvedValue(true);

        const res = await request(app).delete("/api/users/123");

        expect(res.status).toBe(204);
    });

    // GET ALL (ADMIN)
    test("GET /api/users — admin gets all users", async () => {
        userRepository.getAll.mockResolvedValue([
            { login: "testuser" },
            { login: "testuser2" }
        ]);

        const res = await request(app).get("/api/users");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });
});
