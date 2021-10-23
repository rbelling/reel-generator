import { promisify } from "util"
import Stream from "stream"
import axios from "axios"
import { createWriteStream } from "fs"
import path from "path"

const finished = promisify(Stream.finished)

/**
 * Fetches urls and saves them in a temp folder with the `image-001.{extension}` filename
 * @param imageUrls  a list of URLS to fetch and then save to a temp folder
 * @param dryRun if true don't actually save to disk, used for tests
 * @param tempFolder where to save the downloaded images.
 */
export const saveToTempFolder = async (
  imageUrls: Array<string>,
  dryRun = process.env.NODE_ENV === "test",
  tempFolder = path.join(__dirname, "../../media"),
): Promise<string> => {
  await Promise.all(
    imageUrls.map(async (url, index) => {
      const fileName = `image-${(index + 1).toString().padStart(3, "0")}.jpeg`
      const response = await axios.get<Stream>(url, {
        responseType: "stream",
      })

      const writer = createWriteStream(path.join(tempFolder, fileName))
      if (dryRun) {
        writer.close()
        return Promise.resolve()
      }

      response.data.pipe(writer)

      return finished(writer)
    }),
  )
  return tempFolder
}
