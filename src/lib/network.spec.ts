import axios from "axios"
import { downloadToTempFolder, fetchImageAsStream } from "./network"
import { getExtensionFromFileName } from "./storage"

jest.mock("axios", () => {
  const originalModule = jest.requireActual("axios")
  return {
    ...originalModule,
    get: jest.fn(),
  }
})

describe("Downloads images and saves them", () => {
  beforeEach(() => {
    axios.get = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({
        data: {},
        headers: {
          "content-type": `image/${getExtensionFromFileName(url).extension.replace(".", "")}`,
        },
      }),
    )
  })
  const imageUrls = ["hello.jpeg", "world.png"]
  test("Fetches each image", async () => {
    await downloadToTempFolder({ imageUrls })

    expect(axios.get).toHaveBeenNthCalledWith(1, "hello.jpeg", { responseType: "stream" })
    expect(axios.get).toHaveBeenNthCalledWith(2, "world.png", { responseType: "stream" })
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
  test("saves each image with the correct path after having downloaded", async () => {
    const { folder, paths } = await downloadToTempFolder({ imageUrls })

    expect(paths[0]).toMatch(/\/media\/downloads(.*)image-001.jpeg/)
    expect(paths[1]).toMatch(/\/media\/downloads(.*)image-002.png/)
    expect(folder).toMatch("media/downloads")
  })
  test("returns extension correctly", async () => {
    const { extension } = await fetchImageAsStream("howdy.png")

    expect(extension).toBe(".png")
  })
})
