import { CommandOptions, createVideo, getFrameDuration, instagramReelConfig } from "./createVideo"
import path from "path"

const sampleConfig: CommandOptions = {
  stepsCount: 5,
  inputFiles: path.join(__dirname, "../../", "public", "samples", "sample_%03d.jpg"),
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
