import Stream from "stream"
import { SupportedImageExtension } from "./config"
import axios from "axios"
import { ISaveToFolder, saveImage } from "./storage"
import path from "path"
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"

type IDownloadToTempFolderResponse = {
  folder: string
  paths: Array<string>
}

export const mediaFolder = path.join(__dirname, "../../media")

export async function fetchImageAsStream(
  url,
): Promise<{ data: Stream; extension: SupportedImageExtension }> {
  const { data, headers } = await axios.get<Stream>(url, {
    responseType: "stream",
  })

  const extension: SupportedImageExtension =
    (headers["content-type"]?.match(/\/(.*)/)[0]?.replace("/", ".") as SupportedImageExtension) ??
    ".jpg"

  return { data, extension }
}

/**
 * Fetches urls and saves them in a temp folder with the `image-001.{extension}` filename
 */

export async function downloadToTempFolder({
  imageUrls,
}: Pick<ISaveToFolder, "imageUrls">): Promise<IDownloadToTempFolderResponse> {
  const folder = path.join(mediaFolder, "downloads", uuidv4())
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, "0744")
  }
  return Promise.all(
    imageUrls.map(async (url, index) => {
      const { data, extension } = await fetchImageAsStream(url)
      const targetPath = await saveImage({ data, extension, index, folder })

      return {
        folder,
        paths: [targetPath],
      }
    }),
  )
    .then(
      (_): IDownloadToTempFolderResponse =>
        _.reduce((seq, current) => ({
          ...seq,
          paths: [...seq.paths, ...current.paths],
        })),
    )
    .then((res) => {
      return res
    })
}
