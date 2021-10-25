import * as path from "path"
import { mediaFolder } from "../src/lib/storage"

const videoshow = require("videoshow")

const images = [
  "image-004.png",
  "image-005.png",
  // "image-006.png",
  // "image-007.png",
  // "image-008.png",
  // "image-002.png",
  // "image-003.png",
  "image-001.png",
].map((_) => path.join(mediaFolder, "images", "resized", _))

const videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: true,
  transitionDuration: 0.35, // seconds
  /** @see supported colors https://www.ffmpeg.org/ffmpeg-utils.html#Color */
  transitionColor: "#243746",
  videoBitrate: 1024,
  videoCodec: "libx264",
  size: "1080x1920",
  autopad: "#243746",
  audioBitrate: "128k",
  audioChannels: 2,
  format: "mp4",
  pixelFormat: "yuv420p",
}

videoshow(images, videoOptions)
  .audio(path.join(mediaFolder, "music/bensound-jazzyfrenchy.mp3"))
  .save(path.join(mediaFolder, "generated/video.mp4"))
  .on("start", function (command) {
    console.log("ffmpeg process started:", command)
  })
  .on("error", function (err, stdout, stderr) {
    console.error("Error:", err)
    console.error("ffmpeg stderr:", stderr)
  })
  .on("end", function (output) {
    console.error("Video created in:", output)
  })
//
// downloadToTempFolder({
//   imageUrls: [],
// })
//   .then(({ paths, folder }) => {
//     console.info(`✅  Downloaded ${paths.length} images to ${folder}`)
//     return render(folder, {
//       soundtrack: path.join(mediaFolder, "music", "background-music-1.wav"),
//       config: instagramReelConfig,
//       imagesCount: paths.length,
//       outputPath: path.join(mediaFolder, "generated", "video.mp4"),
//     })
//   })
//   .then((outputPath) => {
//     console.info(`✅  Generated video in ${outputPath}`)
//   })
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
