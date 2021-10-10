import { CommandOptions, createVideo, getFrameDuration, instagramReelConfig } from "./createVideo"
import path from "path"

const sampleConfig: CommandOptions = {
  inputFiles: [
    path.join(__dirname, "../../", "public", "samples", "sample_002.jpg"),
    path.join(__dirname, "../../", "public", "samples", "sample_004.jpg"),
    path.join(__dirname, "../../", "public", "samples", "sample_005.jpg"),
    path.join(__dirname, "../../", "public", "samples", "sample_001.jpg"),
    path.join(__dirname, "../../", "public", "samples", "sample_003.jpg"),
  ],
  outputPath: path.join(__dirname, "../../", "public", "samples", "video.mp4"),
}

test("calculates duration of each frame", () => {
  expect(getFrameDuration(5, instagramReelConfig)).toBe(6)
  expect(getFrameDuration(8, { ...instagramReelConfig, desiredLength: 37342 })).toBe(4.66775)
})

// FIXME this test is effectful and at the moment only used to trigger video generation. This should be hooked to a route instead.
test("Creates video using sample images", async () => {
  await createVideo(sampleConfig)
}, 20000)
