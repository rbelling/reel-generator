import path from "path"

import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifyMultipart from "fastify-multipart"

// Load env vars
import loadConfig from "./lib/config"
loadConfig()

export async function createServer() {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  })

  server.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
  })

  // TODO check if we need this plugin or not
  server.register(fastifyMultipart)

  // ROUTES
  server.get("/", async function (req, reply) {
    return reply.sendFile("/index.html")
  })

  server.post("/create-reel", async function (req, reply) {
    return reply.status(200)
  })

  await server.ready()
  return server
}

export async function startServer() {
  process.on("unhandledRejection", (err) => {
    console.error(err)
    process.exit(1)
  })

  const server = await createServer()
  await server.listen(+process.env.API_PORT, process.env.API_HOST)

  if (process.env.NODE_ENV === "production") {
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () =>
        server.close().then((err) => {
          console.log(`close application on ${signal}`)
          process.exit(err ? 1 : 0)
        }),
      )
    }
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer()
}
