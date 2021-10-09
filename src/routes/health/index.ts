import { NowRequestHandler } from "fastify-now"
import S from "fluent-json-schema"

export const GET: NowRequestHandler = async function (_, reply) {
  return { hello: "world" }
}

GET.opts = {
  schema: {
    response: {
      200: S.object().prop("hello", S.string().required()),
    },
  },
}
