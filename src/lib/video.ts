import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
import editly, { Clip } from "editly"
import path from "path"
import { mediaFolder } from "./storage"

export type IVideoConfig = {
  desiredLength: number
  fps: number
  height: number
  width: number
  audioFilePath?: string
}

export type FfmpegConfig = {
  config: IVideoConfig
  imagesCount: number
  outputPath: string
  soundtrack: string
}

export const instagramReelConfig: IVideoConfig = Object.freeze({
  audioFilePath: path.join(mediaFolder, "music/bensound-jazzyfrenchy.mp3"),
  // total reel Duration in seconds
  desiredLength: 30,
  fps: 25,
  height: 1920,
  width: 1080,
})

// Calculates the duration in seconds of how long each of the provided images should be displayed for
export const getImageDuration = (
  imagesCount: number,
  cfg: Pick<IVideoConfig, "desiredLength"> = instagramReelConfig,
): number => {
  return cfg.desiredLength / imagesCount
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

/**
 * Renders using editly
 */
export const render__wip = async (paths: string[], config: IVideoConfig) => {
  const { audioFilePath, height, width, fps } = config
  const clips: Clip[] = paths.map(
    (path): Clip => ({
      layers: [
        {
          type: "image",
          path,
          duration: getImageDuration(paths.length, config),
        },
      ],
    }),
  )

  await editly({
    // see https://github.com/mifi/editly/blob/master/examples/commonFeatures.json5
    audioFilePath,
    clips,
    // TODO set to false in prod
    fast: true,
    fps,
    height,
    outPath: path.join(mediaFolder, "generated", "video-b.mp4"),
    width,
  })
}
