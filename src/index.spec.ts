import { createServer } from "./index"
import { FastifyInstance } from "fastify"
import request from "supertest"

describe("Server", () => {
  test("Should return server instance", async () => {
    const server = await createServer()
    expect(server).toBeDefined()
    await server.close()
  })
})

describe("Routes", () => {
  let server: FastifyInstance
  beforeEach(async () => {
    server = await createServer()
  })

  afterEach(async () => {
    await server.close()
  })

  test("GET / - Should return index.html", async () => {
    const response = await request(server.server).get("/").expect(200)
    expect(response.body.length).not.toBe(0)
  })
})
