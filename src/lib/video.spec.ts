import { createClips, getClipDuration, instagramReelConfig } from "./video"
import { getExtensionFromFileName } from "./storage"

test("calculates duration of how long each frame should be displayed for (seconds)", () => {
  expect(getClipDuration(5, instagramReelConfig)).toBe(6)
  expect(getClipDuration(8, { ...instagramReelConfig, desiredLength: 37.342 })).toBe(4.66775)

  const clips = createClips(
    [
      "image-001.jpeg",
      "image-002.jpeg",
      "image-003.jpeg",
      "image-004.png",
      "image-005.png",
      "image-006.jpeg",
      "image-007.png",
      "image-008.png",
    ],
    instagramReelConfig,
  )

  expect(clips[0].duration).toBe(undefined)
  expect(
    clips.reduce((seq, { layers }) => {
      return seq + layers[0].duration
    }, 0),
  ).toBe(30)
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
