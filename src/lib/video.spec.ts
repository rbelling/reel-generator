import { getImageDuration, instagramReelConfig } from "./video"

test("calculates duration of how long each frame should be displayed for (seconds)", () => {
  expect(getImageDuration(5, instagramReelConfig)).toBe(6)
  expect(getImageDuration(8, { ...instagramReelConfig, desiredLength: 37342 })).toBe(4.66775)
})
