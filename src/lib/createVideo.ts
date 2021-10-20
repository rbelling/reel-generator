import axios, { AxiosResponse } from "axios"
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
import ffmpegExecutable from "@ffmpeg-installer/ffmpeg"
import { Readable } from "stream"

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

function getFfmpegCommand(opts: FfmpegConfig, input: Readable): FfmpegCommand {
  return ffmpeg()
    .input(input)
    .inputFPS(1 / getImageDuration(opts.imagesCount))
    .output(opts.outputPath)
    .outputFPS(opts.config.fps)
    .noAudio()
}

// TODO change to : Promise<Readable>
export const getReadableStreamFromUrls = async (urls: Array<string>): Promise<any> => {
  /**
   * @see https://github.com/axios/axios#axiosconfig
   */
  const images = await Promise.all(
    urls.map((url) =>
      axios.get(url, {
        responseType: "stream",
      }),
    ),
  )
  // return images.map(({ data }: AxiosResponse) => data)
  return images;
}

export const createVideo = async (
  opts: Omit<FfmpegConfig, "input" | "imagesCount">,
  urls: Array<string>,
): Promise<void> => {
  // TODO see if we can use async await throughout the function
  return new Promise(async (resolve, reject) => {
    try {
      const images = await getReadableStreamFromUrls(urls)
      const command = getFfmpegCommand({ ...opts, imagesCount: urls.length }, images)

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
