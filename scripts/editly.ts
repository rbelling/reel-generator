import { mediaFolder } from "../src/lib/storage"

import path from "path"
import { instagramReelConfig, render } from "../src/lib/video"

async function run() {
  // TODO download these
  const paths = [
    "image-001.jpeg",
    "image-002.jpeg",
    "image-003.jpeg",
    "image-004.png",
    "image-005.png",
    "image-006.jpeg",
    "image-007.png",
    "image-008.png",
  ].map((i) => path.join(mediaFolder, "images", i))

  await render(paths, instagramReelConfig, path.join(mediaFolder, "generated", "video-b.mp4"))
}

console.time("create-video")
run()
  .then(() => {
    console.timeEnd("create-video")
  })
  .catch((e) => {
    console.error(e)
    console.timeEnd("create-video")
    process.exit(1)
  })
