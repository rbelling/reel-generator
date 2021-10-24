import Stream from "stream"
import { SupportedImageExtension } from "./config"
import axios from "axios"
import path from "path"
import { ISaveToFolder, saveToFolder } from "./storage"

type IDownloadToTempFolderResponse = {
  folder: string
  paths: Array<string>
}

export async function fetchImageAsStream(
  url,
): Promise<{ data: Stream; extension: SupportedImageExtension }> {
  const { data } = await axios.get<Stream>(url, {
    responseType: "stream",
  })

  // TODO determine real extension
  return { data, extension: ".jpg" }
}

/**
 * Fetches urls and saves them in a temp folder with the `image-001.{extension}` filename
 */

export async function downloadToTempFolder({
  imageUrls,
  folder = path.join(__dirname, "media"),
}: ISaveToFolder): Promise<IDownloadToTempFolderResponse> {
  return Promise.all(
    imageUrls.map(async (url, index) => {
      const { data, extension } = await fetchImageAsStream(url)

      const targetPath = await saveToFolder({ data, extension, folder, index })

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
