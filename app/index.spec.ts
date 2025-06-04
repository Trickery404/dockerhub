// index.spec.ts
import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { buildServer } from './index'; // <-- import the function you just exported
import { jest } from '@jest/globals';

// Tell Jest to mock the entire '@prisma/client' module:
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      counter: {
        create: jest.fn(),
        count: jest.fn(),
      },
    })),
  };
});

// Now, when we call new PrismaClient(), we get an object
// whose `counter.create` and `counter.count` are Jest spy functions.
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
let app: FastifyInstance;

beforeEach(async () => {
  // buildServer will register the exact same /ping route from index.ts,
  // but using our `mockPrisma` instead of the real PrismaClient.
  app = buildServer(mockPrisma);
  await app.ready();
});

afterEach(async () => {
  await app.close();
  jest.clearAllMocks();
});

describe('GET /ping', () => {
  it('should return count with 200 status', async () => {
    // Arrange: have mockPrisma.counter.create resolve, and count return 5
    mockPrisma.counter.create.mockResolvedValueOnce({} as any);
    mockPrisma.counter.count.mockResolvedValueOnce(5 as any);

    // Act: fire off the request
    const response = await app.inject({ method: 'GET', url: '/ping' });

    // Assert:
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ count: 5 });
  });

  it('should return 500 on Prisma error', async () => {
    // If create() rejects, we expect a 500
    mockPrisma.counter.create.mockRejectedValueOnce(new Error('DB error'));

    const response = await app.inject({ method: 'GET', url: '/ping' });
    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'DB error' });
  });
});
