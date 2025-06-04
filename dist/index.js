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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
// index.ts
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function buildServer(prismaClient) {
    const server = (0, fastify_1.default)();
    server.get('/ping', (_, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient.counter.create({ data: {} });
            const count = yield prismaClient.counter.count();
            return reply.status(200).send({ count });
        }
        catch (error) {
            return reply.status(500).send({ error: error === null || error === void 0 ? void 0 : error.message });
        }
    }));
    return server;
}
// Only start listening if this file is run directly:
if (require.main === module) {
    const server = buildServer(prisma);
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '127.0.0.1';
    server.listen({ host: HOST, port: Number(PORT) }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}
