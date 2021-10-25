import { promisify } from "util"
import Stream from "stream"
import { createWriteStream } from "fs"
import path from "path"
import { SupportedImageExtension } from "./config"
import { ffmpegFrameNamePrefix } from "./video"

const finished = promisify(Stream.finished)

export type ISaveToFolder = {
  imageUrls: Array<string>
  folder: string
}

export const mediaFolder = path.join(__dirname, "../../media")

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

export async function writeStream(targetPath: string, data: Stream): Promise<void> {
  if (process.env.NODE_ENV === "test") return Promise.resolve()
  const writer = createWriteStream(targetPath)

  data.pipe(writer)

  return await finished(writer)
}

export async function saveImage({
  data,
  extension,
  folder,
  index,
}: {
  data: Stream
  extension: SupportedImageExtension
  folder: string
  index: number
}): Promise<string> {
  const targetPath = path.join(
    folder,
    `${ffmpegFrameNamePrefix}${(index + 1).toString().padStart(3, "0")}${extension}`,
  )

  await writeStream(targetPath, data)

  return targetPath
}

export default saveImage
