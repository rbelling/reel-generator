import { NowRequestHandler } from "fastify-now"
import S from "fluent-json-schema"

export const GET: NowRequestHandler = async function (req, reply) {
  return reply.send({})
}

GET.opts = {
  schema: {
    response: {
      200: S.object(),
    },
  },
}
