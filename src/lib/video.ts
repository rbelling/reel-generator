import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
import ffmpegExecutable from "@ffmpeg-installer/ffmpeg"
import { downloadToTempFolder } from "./network"

ffmpeg.setFfmpegPath(ffmpegExecutable.path)

export type IVideoConfig = {
  desiredLength: number
  fps: number
  height: number
  width: number
}

export type FfmpegConfig = {
  config: IVideoConfig
  imagesCount: number
  outputPath: string
}

export const instagramReelConfig: IVideoConfig = Object.freeze({
  // Duration expressed in milliseconds
  desiredLength: 30000,
  fps: 25,
  height: 1920,
  width: 1080,
})

// Calculates the duration in seconds of how long each of the provided images should be displayed for
export const getImageDuration = (
  imagesCount: number,
  cfg: Pick<IVideoConfig, "desiredLength"> = instagramReelConfig,
): number => {
  return cfg.desiredLength / 1000 / imagesCount
}

function getFfmpegCommand(opts: FfmpegConfig, inputRegex: string): FfmpegCommand {
  return ffmpeg()
    .input(inputRegex)
    .inputFPS(1 / getImageDuration(opts.imagesCount))
    .output(opts.outputPath)
    .outputFPS(opts.config.fps)
    .noAudio()
}

export const render = async (
  urls: Array<string>,
  config: Omit<FfmpegConfig, "input" | "imagesCount">,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { folder } = await downloadToTempFolder({ imageUrls: urls })
      const command = getFfmpegCommand({ ...config, imagesCount: urls.length }, folder)

      console.time("create-video")
      command
        .on("error", (e) => {
          throw new Error(e)
        })
        .on("end", () => {
          console.timeEnd("create-video")
          resolve()
        })
        .run()
    } catch (e) {
      console.timeEnd("create-video")
      console.error(e)
      reject()
    }
  })
}
