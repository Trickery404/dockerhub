"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const index_1 = require("./index"); // <-- import the function you just exported
const globals_1 = require("@jest/globals");
// Tell Jest to mock the entire '@prisma/client' module:
globals_1.jest.mock('@prisma/client', () => {
    return {
        PrismaClient: globals_1.jest.fn().mockImplementation(() => ({
            counter: {
                create: globals_1.jest.fn(),
                count: globals_1.jest.fn(),
            },
        })),
    };
});
// Now, when we call new PrismaClient(), we get an object
// whose `counter.create` and `counter.count` are Jest spy functions.
const mockPrisma = new client_1.PrismaClient();
let app;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // buildServer will register the exact same /ping route from index.ts,
    // but using our `mockPrisma` instead of the real PrismaClient.
    app = (0, index_1.buildServer)(mockPrisma);
    yield app.ready();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.close();
    globals_1.jest.clearAllMocks();
}));
describe('GET /ping', () => {
    it('should return count with 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange: have mockPrisma.counter.create resolve, and count return 5
        mockPrisma.counter.create.mockResolvedValueOnce({});
        mockPrisma.counter.count.mockResolvedValueOnce(5);
        // Act: fire off the request
        const response = yield app.inject({ method: 'GET', url: '/ping' });
        // Assert:
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ count: 5 });
    }));
    it('should return 500 on Prisma error', () => __awaiter(void 0, void 0, void 0, function* () {
        // If create() rejects, we expect a 500
        mockPrisma.counter.create.mockRejectedValueOnce(new Error('DB error'));
        const response = yield app.inject({ method: 'GET', url: '/ping' });
        expect(response.statusCode).toBe(500);
        expect(response.json()).toEqual({ error: 'DB error' });
    }));
});
