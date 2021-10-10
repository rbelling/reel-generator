import ffmpegExecutable from "@ffmpeg-installer/ffmpeg"
import ffmpeg from "fluent-ffmpeg"
import path from "path"

ffmpeg.setFfmpegPath(ffmpegExecutable.path)

const VideoConfig = Object.freeze({
  // Duration expressed in milliseconds
  desiredLength: 30000,
  fps: 25,
  height: 1920,
  width: 1080,
})

// Calculates the duration in seconds of how long each provided frame should be displayed for
export const getFrameDuration = (
  inputFrames: number,
  cfg: Pick<typeof VideoConfig, "desiredLength"> = VideoConfig,
): number => {
  return cfg.desiredLength / 1000 / inputFrames
}

export async function createVideo(inputFrames: number): Promise<void> {
  const onError = (_: string) => console.error(`Error: ${_}`)
  return ffmpeg()
    .on("error", onError)
    .input(path.join(__dirname, "../../", "public", "samples", "sample_%03d.jpg"))
    .inputFPS(1 / getFrameDuration(inputFrames))
    .output(path.join(__dirname, "../../", "public", "samples", "video.mp4"))
    .outputFPS(VideoConfig.fps)
    .noAudio()
    .run()
}
