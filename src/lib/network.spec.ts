import axios from "axios"
import {downloadToTempFolder, fetchImageAsStream} from "./network"

jest.mock("axios", () => {
  const originalModule = jest.requireActual("axios")
  return {
    // __esModule: true,
    ...originalModule,
    get: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ data: {}, headers: { "content-type": "image/png" } }),
      ),
  }
})

describe("Downloads images and saves them", () => {
  beforeEach(() => {
    axios.get = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ data: {}, headers: { "content-type": "image/png" } }),
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

    expect(paths[0]).toMatch(/media\/image-001.jpg/)
    expect(paths[1]).toMatch(/media\/image-002.jpg/)
    expect(folder).toMatch(/\/media/)
  })
  test("returns extension correctly", async () => {
    const { extension } = await fetchImageAsStream("howdy.png")

    expect(extension).toBe(".png")
  })
})
