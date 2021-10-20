import { createServer } from "../src"
import { FastifyInstance } from "fastify"
import request from "supertest"
import axios from "axios"
import { getReadableStreamFromUrls } from "../src/lib/createVideo"

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
    await server.close()
  })

  it("GET / - Should return index.html", async () => {
    const response = await request(server.server).get("/").expect(200)
    expect(response.body.length).not.toBe(0)
  })

  it("Fetches each image url", async () => {
    jest.doMock("axios")
    axios.get = jest.fn()
    const imageUrls = ["a.jpg", "b.png"]
    await getReadableStreamFromUrls(imageUrls)

    expect(axios.get).toHaveBeenCalledTimes(imageUrls.length)
    ;(axios.get as any).mockClear()
  })
})
