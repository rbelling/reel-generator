import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
import editly, { Clip } from "editly"
import path from "path"

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
  audioFilePath: path.join(
    __dirname,
    "../../media/music/The Polish Ambassador - The Juiceman Cometh ft. Saqi.mp3",
  ),
  // total reel Duration in seconds
  desiredLength: 30,
  fps: 25,
  height: 1920,
  width: 1080,
  logo: path.join(__dirname, "../../media/images/logo.png"),
})

// Calculates the duration in seconds of how long each of the provided clips should be displayed for
export const getClipDuration = (
  imagesCount: number,
  cfg: Pick<IVideoConfig, "desiredLength"> = instagramReelConfig,
): number => {
  return cfg.desiredLength / imagesCount
}

function getFfmpegCommand(input: string, opts: FfmpegConfig): FfmpegCommand {
  return (
    ffmpeg()
      .input(input)
      .inputFPS(1 / getClipDuration(opts.imagesCount))
      // .size("800x500")
      .output(opts.outputPath)
      .outputFPS(opts.config.fps)
      .noAudio()
  )
}

export const ffmpegFrameNamePrefix = `image-`

export const render__legacy = async (
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

export function createClips(paths: string[], config: IVideoConfig): Clip[] {
  return paths.map((path): Clip => {
    return {
      layers: [
        {
          type: "image",
          path,
          duration: getClipDuration(paths.length, config),
        },
      ],
    }
  })
}

/**
 * Renders using editly
 */
export const render = async (
  paths: string[],
  config: IVideoConfig,
  outPath: string,
): Promise<string> => {
  const { audioFilePath, height, width, fps } = config

  await editly({
    // see https://github.com/mifi/editly/blob/master/examples/commonFeatures.json5
    audioFilePath,
    clips: createClips(paths, config),
    fast: false,
    fps,
    height,
    outPath,
    width,
  })
  return outPath
}
