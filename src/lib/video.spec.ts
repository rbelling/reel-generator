import { getImageDuration, instagramReelConfig } from "./video"
import { getExtensionFromFileName } from "./storage"

test("calculates duration of how long each frame should be displayed for (seconds)", () => {
  expect(getImageDuration(5, instagramReelConfig)).toBe(6)
  expect(getImageDuration(8, { ...instagramReelConfig, desiredLength: 37342 })).toBe(4.66775)
})

test("gets file extension from the name", () => {
  expect(getExtensionFromFileName("png_is_not_dead.jpg")).toStrictEqual({
    fileName: "png_is_not_dead",
    extension: ".jpg",
  })
  expect(getExtensionFromFileName("this/is/a/test.png?q=90")).toStrictEqual({
    fileName: "this/is/a/test",
    extension: ".png",
  })
  // gif is unsupported so it defaults to .jpeg
  expect(getExtensionFromFileName("something.gif")).toStrictEqual({
    fileName: "something",
    extension: ".jpeg",
  })
})
