import { createVideo, getFrameDuration } from "./createVideo"

test("calculates duration of each frame", () => {
  expect(getFrameDuration(5)).toBe(6)
  expect(getFrameDuration(8, { desiredLength: 37342 })).toBe(4.66775)
})

// FIXME this test is effectful and at the moment only used to trigger video generation. This should be hooked to a route instead.
test("Creates video", async () => {
  const res = await createVideo(5)
  expect(res).toMatchSnapshot()
})
