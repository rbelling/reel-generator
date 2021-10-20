import { getImageDuration, instagramReelConfig } from "../src/lib/createVideo"

test("calculates duration of each frame", () => {
  expect(getImageDuration(5, instagramReelConfig)).toBe(6)
  expect(getImageDuration(8, { ...instagramReelConfig, desiredLength: 37342 })).toBe(4.66775)
})
