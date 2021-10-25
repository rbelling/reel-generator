import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
import { SupportedImageExtension } from "./config"

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
  soundtrack: string
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

export function getExtensionFromFileName(fileName: string): {
  fileName: string
  extension: SupportedImageExtension
} {
  // Name without extension
  const name = fileName.replace(/\.[^/.]+$/, "")
  switch (true) {
    case Boolean(fileName.match(/.png/)):
      return { fileName: name, extension: ".png" }
    case Boolean(fileName.match(/.jpg/)):
      return { fileName: name, extension: ".jpg" }
    case Boolean(fileName.match(/.jpeg/)):
    default:
      return { fileName: name, extension: ".jpeg" }
  }
}
function getFfmpegCommand(input: string, opts: FfmpegConfig): FfmpegCommand {
  return ffmpeg()
    .input(input)
    .inputFPS(1 / getImageDuration(opts.imagesCount))
    .size("800x500")
    .output(opts.outputPath)
    .outputFPS(opts.config.fps)
    .noAudio()
}

export const ffmpegFrameNamePrefix = `image-`

export const render = async (
  folder: string,
  config: Omit<FfmpegConfig, "input">,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = getFfmpegCommand(`${folder}/${ffmpegFrameNamePrefix}%03d.jpg`, config)

      console.time("create-video")
      command
        .on("error", (e) => {
          throw new Error(e)
        })
        .on("end", () => {
          console.timeEnd("create-video")
          resolve(config.outputPath)
        })
        .run()
    } catch (e) {
      console.timeEnd("create-video")
      console.error(e)
      reject()
    }
  })
}
