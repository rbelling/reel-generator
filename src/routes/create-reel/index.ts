import { NowRequestHandler } from "fastify-now"
import S from "fluent-json-schema"
import { createVideo } from "@lib/createVideo"
import path from "path"

export const POST: NowRequestHandler = async function (req, reply) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const files = await req.saveRequestFiles()
  // await createVideo({
  //   inputFiles: files,
  //   outputPath: path.join(__dirname, "../../../", "public", "samples", "video.mp4"),
  // })
  reply.send({})
}

POST.opts = {
  schema: {
    response: {
      200: S.object(),
    },
  },
}
