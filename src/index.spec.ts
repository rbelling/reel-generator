import { createServer } from "./index"
import { FastifyInstance } from "fastify"
import mockAxios from "jest-mock-axios"
import request from "supertest"

describe("Server", () => {
  it("Should return server instance", async () => {
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
    mockAxios.reset()
    await server.close()
  })

  it("GET / - Should return index.html", async () => {
    const response = await request(server.server).get("/").expect(200)
    expect(response.body.length).not.toBe(0)
  })
})
