import { NowRequestHandler } from "fastify-now"
import S from "fluent-json-schema"
import { createVideo } from "@lib/createVideo"

export const GET: NowRequestHandler = async function (req, reply) {
  // return createVideo(3)
}

GET.opts = {
  schema: {
    response: {
      200: S.object(),
    },
  },
}
