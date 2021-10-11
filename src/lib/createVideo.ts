import ffmpegExecutable from "@ffmpeg-installer/ffmpeg"
import ffmpeg from "fluent-ffmpeg"
import stream from "stream"

ffmpeg.setFfmpegPath(ffmpegExecutable.path)

export type IVideoConfig = {
  desiredLength: number
  fps: number
  height: number
  width: number
}

export type CommandOptions = {
  stepsCount: number
  inputFiles: string | stream.Readable
  outputPath: string
}

export const instagramReelConfig: IVideoConfig = Object.freeze({
  // Duration expressed in milliseconds
  desiredLength: 30000,
  fps: 25,
  height: 1920,
  width: 1080,
})

// Calculates the duration in seconds of how long each provided frame should be displayed for
export const getFrameDuration = (
  stepsCount: number,
  cfg: Pick<IVideoConfig, "desiredLength"> = instagramReelConfig,
): number => {
  return cfg.desiredLength / 1000 / stepsCount
}

export const createVideo = async (opts: CommandOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.time("create-video")
    const onSuccess = () => {
      console.timeEnd("create-video")
      resolve()
    }

    ffmpeg()
      .on("error", (e) => {
        console.timeEnd("create-video")
        console.error(e)
        reject()
      })
      .on("end", onSuccess)
      .input(opts.inputFiles)
      .inputFPS(1 / getFrameDuration(opts.stepsCount))
      .output(opts.outputPath)
      .outputFPS(instagramReelConfig.fps)
      .noAudio()
      .run()
  })
}
