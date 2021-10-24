import fastify from "fastify"
import fastifyStatic from "fastify-static"
import path from "path"

// Load env vars
import loadConfig from "./lib/config"
import { render, instagramReelConfig } from "./lib/video"
import { downloadToTempFolder, mediaFolder } from "./lib/network"

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

  server.get("/", async function (req, reply) {
    return reply.sendFile("/index.html")
  })

  server.post("/create-reel", async function (req, reply) {
    const { urls } = req.body as { urls: Array<string> }
    const { folder } = await downloadToTempFolder({
      imageUrls: urls,
    })

    await render(folder, {
      soundtrack: path.join(mediaFolder, "music", "background-music-1.wav"),
      config: instagramReelConfig,
      imagesCount: urls.length,
      // TODO save in a temp folder
      outputPath: path.join(mediaFolder, "generated", "video.mp4"),
    })

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
