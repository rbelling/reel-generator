import { mediaFolder } from "../src/lib/network"
import * as path from "path"

const videoshow = require("videoshow")

const images = ["image-001.jpeg"].map((_) => path.join(mediaFolder, "images", _))

const videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: true,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: "libx264",
  size: "640x?",
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
