import { mediaFolder } from "../src/lib/storage"

import editly, { Layer } from "editly"
import path from "path"
import { instagramReelConfig } from "../src/lib/video"

const layers = [
  "image-001.jpeg",
  "image-002.jpeg",
  "image-003.jpeg",
  "image-004.png",
  "image-005.png",
  "image-006.jpeg",
  "image-007.png",
  "image-008.png",
].map((i): Layer => ({ type: "image", path: path.join(mediaFolder, "images", i) }))

async function run() {
  await editly({
    // see https://github.com/mifi/editly/blob/master/examples/commonFeatures.json5
    outPath: path.join(mediaFolder, "generated", "video-b.mp4"),
    fast: false,
    width: 1080,
    height: 1920,
    fps: 25,
    audioFilePath: path.join(mediaFolder, "music/bensound-jazzyfrenchy.mp3"),
    clips: [
      {
        layers,
        duration: instagramReelConfig.desiredLength,
      },
    ],
  })
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
