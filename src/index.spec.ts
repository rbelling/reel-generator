import { createServer } from "./index"
import { FastifyInstance } from "fastify"

describe("Server", () => {
  it("Should return server instance", async () => {
    const server = await createServer()
    expect(server).toBeDefined()
    await server.close()
  })
})

describe("GET /", () => {
  let server: FastifyInstance
  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.close()
  })

  it("Should return index.html", async () => {
    const response = await server.inject({
      method: "GET",
      path: "/",
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.length).not.toBe(0)
  })
})
