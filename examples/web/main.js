// The demo is glue only. Every decision comes from the published utilities in
// ../../src — this file just reads pointer events and paints the result.
import {
  classifyPageTurn,
  closingLine,
  createBook,
  dragPreview,
  POINTER_DEFAULTS,
  steppedFrames,
  turnBook,
} from "../../src/index.js";

// Illustrative content that walks through the WarmDock concept. It is not the
// app's data — just enough to have something to turn.
const CARDS = [
  {
    eyebrow: "1 · Commit",
    title: "What matters today?",
    render: () => `
      <div class="card__body">
        <div class="row done"><span class="box">✓</span><span>Send the project proposal</span></div>
        <div class="row"><span class="box"></span><span>Practice piano, 20 min</span></div>
        <div class="row"><span class="box"></span><span>Reply to the landlord</span></div>
        <p class="card__foot">Three slots to start. A task, once weighed, can only be finished — not edited, not deleted.</p>
      </div>`,
  },
  {
    eyebrow: "2 · Grow",
    title: "Spend points on abilities",
    render: () => `
      <div class="card__body">
        <div class="row"><span class="box">＋</span><span>Capacity — more task slots</span></div>
        <div class="row"><span class="box">★</span><span>Focus — a bonus for the day's one task</span></div>
        <div class="row"><span class="box">◷</span><span>Rhythm — your own daily reset time</span></div>
        <div class="row"><span class="box">▤</span><span>Analysis — weekly review</span></div>
        <p class="card__foot">Features are earned with finished work, not found in a settings menu.</p>
      </div>`,
  },
  {
    eyebrow: "3 · Look back",
    title: "Seven days, wrapped",
    render: () => `
      <div class="card__body">
        <div class="bars">
          <i style="height:70%"></i>
          <i style="height:35%"></i>
          <i style="height:0%"></i>
          <i style="height:100%" data-full="true"></i>
          <i style="height:55%"></i>
          <i style="height:100%" data-full="true"></i>
          <i style="height:45%"></i>
        </div>
        <span class="pill">every promise kept · 2 days</span>
        <p class="card__foot">A gift box appears every seventh day. Share the week as a link, or keep it.</p>
      </div>`,
  },
  {
    eyebrow: "The end of the day",
    title: "Let it close",
    render: () => `
      <div class="card__body">
        <p style="font-size:1.05rem;line-height:1.6">${closingLine({ completed: 3, total: 3 })}</p>
        <p class="card__foot">No red badges, no rollover. The day is over; tomorrow starts empty.</p>
      </div>`,
  },
];

const stage = document.querySelector(".stage");
const cardEl = document.getElementById("card");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsEl = document.getElementById("dots");

let book = createBook(CARDS.length);
let animating = false;

for (let i = 0; i < CARDS.length; i += 1) {
  const dot = document.createElement("span");
  dot.className = "dot";
  dotsEl.appendChild(dot);
}

function paint() {
  const card = CARDS[book.index];
  cardEl.innerHTML =
    `<span class="card__eyebrow">${card.eyebrow}</span>` +
    `<h2 class="card__title">${card.title}</h2>` +
    card.render();
  dotsEl.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === book.index);
  });
  prevBtn.disabled = book.index === 0;
  nextBtn.disabled = book.index === CARDS.length - 1;
}

// The stepped flip: steppedFrames() gives the pixel-quantised progress, which we
// map onto a rotateY so the card turns in visible steps rather than smoothly.
function flip(direction) {
  const next = turnBook(book, direction);
  if (next.index === book.index || animating) return;
  animating = true;

  const sign = direction === "next" ? -1 : 1;
  const away = steppedFrames({ from: 0, to: 1, steps: 6 });

  const swing = (frames, onDone) => {
    let i = 0;
    const tick = () => {
      const p = frames[i];
      cardEl.style.transform = `rotateY(${sign * p * 90}deg)`;
      cardEl.style.opacity = String(1 - p * 0.85);
      i += 1;
      if (i < frames.length) {
        setTimeout(tick, 26);
      } else {
        onDone();
      }
    };
    tick();
  };

  swing(away, () => {
    book = next;
    paint();
    swing([...away].reverse(), () => {
      cardEl.style.transform = "";
      cardEl.style.opacity = "";
      animating = false;
    });
  });
}

prevBtn.addEventListener("click", () => flip("previous"));
nextBtn.addEventListener("click", () => flip("next"));
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") flip("next");
  if (e.key === "ArrowLeft") flip("previous");
});

// Drag to turn. Live feedback comes from dragPreview(); the release decision
// comes from classifyPageTurn() — the same two utilities the README shows.
let drag = null;
stage.addEventListener("pointerdown", (e) => {
  if (animating) return;
  drag = { x: e.clientX, y: e.clientY, pointer: e.pointerType === "touch" ? "touch" : "mouse" };
  cardEl.setPointerCapture?.(e.pointerId);
});

stage.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  const threshold = POINTER_DEFAULTS[drag.pointer].distance;
  const { degrees, willTurn } = dragPreview({ delta: dx, threshold, maxDegrees: 10 });
  cardEl.style.transform = `rotateY(${degrees}deg)`;
  cardEl.dataset.armed = String(willTurn);
});

function endDrag(e) {
  if (!drag) return;
  const decision = classifyPageTurn({
    deltaX: e.clientX - drag.x,
    deltaY: e.clientY - drag.y,
    pointer: drag.pointer,
  });
  drag = null;
  delete cardEl.dataset.armed;
  cardEl.style.transform = "";
  if (decision) flip(decision);
}

stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", () => {
  drag = null;
  delete cardEl.dataset.armed;
  cardEl.style.transform = "";
});

paint();
