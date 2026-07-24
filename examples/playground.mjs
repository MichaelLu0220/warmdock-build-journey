import {
  classifyPageTurn,
  closingLine,
  dragPreview,
  sampleSteppedProgress,
  steppedFrames,
} from "../src/index.js";

const sample = {
  touchTurn: classifyPageTurn({
    deltaX: -92,
    deltaY: 18,
    pointer: "touch",
  }),
  ambiguousDrag: classifyPageTurn({
    deltaX: 40,
    deltaY: 48,
    pointer: "mouse",
  }),
  midDrag: dragPreview({
    delta: -16,
    threshold: 32,
  }),
  releaseWouldTurn: dragPreview({
    delta: -40,
    threshold: 32,
  }),
  pageFrames: steppedFrames({
    from: 0,
    to: 1,
    steps: 4,
  }),
  halfwayButPixelated: sampleSteppedProgress(0.58, 6),
  closingCopy: closingLine({
    completed: 3,
    total: 3,
  }),
};

console.log(JSON.stringify(sample, null, 2));

