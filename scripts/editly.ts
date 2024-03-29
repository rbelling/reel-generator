import { mediaFolder } from "../src/lib/storage"

import path from "path"
import { instagramReelConfig, render } from "../src/lib/video"
import { downloadToTempFolder } from "../src/lib/network"
import * as fs from "fs"

async function run(imageUrls: string[]) {
  console.time("download-images")
  const { folder, paths } = await downloadToTempFolder({
    imageUrls,
  })
  console.timeEnd("download-images")

  console.time("create-video")
  await render(paths, instagramReelConfig, path.join(mediaFolder, "generated", "video-b.mp4"))
  fs.rmdir(folder, () => `Removed  ${folder}`)
}

run([
  "https://cdn.spoak.com/palette-sample.jpeg",
  "https://cdn.spoak.com/images/dc379d06-1446-445d-a6b5-141fa24de801",
  "https://spoak.imgix.net/https%3A%2F%2Fdnwdt2n2p011ycoep3azqyo4-wpengine.netdna-ssl.com%2Fwp-content%2Fuploads%2F2019%2F06%2Fathena_calderone_eyeswoon_RH_amagansett_4.jpg?w=600&s=e4ae9f6dda62188dac08fed062c94460",
  "https://spoak.imgix.net/https%3A%2F%2Fcdn.spoak.com%2Fimages%2Fb4f8f691-7c7f-4758-a48f-a7838629c3e0?w=600&s=07b853e7b195d47c09f737d9fa6a0525",
  "https://spoak.imgix.net/https%3A%2F%2Fcdn.spoak.com%2Fimages%2F30ceb8d3-0ed9-44e0-9ea1-ce58d4bf5abd?w=600&s=d48aa754c6a06cbde2b9b06207fe1bbf",
  "https://cdn.spoak.com/images/18dab76c-179e-4270-a75b-a5647e994ec1",
  "https://cdn.spoak.com/card-sample1.png",
  "https://cdn.spoak.com/card-sample2.png",
])
  .then(() => {
    console.timeEnd("create-video")
  })
  .catch((e) => {
    console.error(e)
    console.timeEnd("create-video")
    process.exit(1)
  })
