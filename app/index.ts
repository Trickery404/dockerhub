// index.ts
import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export function buildServer(prismaClient: PrismaClient): FastifyInstance {
  const server = fastify();

  server.get('/ping', async (_, reply) => {
    try {
      await prismaClient.counter.create({ data: {} });
      const count = await prismaClient.counter.count();
      return reply.status(200).send({ count });
    } catch (error: any) {
      return reply.status(500).send({ error: error?.message });
    }
  });

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
