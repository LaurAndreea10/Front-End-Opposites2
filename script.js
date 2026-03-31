const compare = document.getElementById("compare");
const afterLayer = document.getElementById("afterLayer");
const handle = document.getElementById("handle");
const title = document.getElementById("title");

// --- Use JS before() and after() to inject real DOM UI ---
const note = document.createElement("div");
note.className = "note";
note.innerHTML = `
  <strong>Folosește:</strong> trage de mâner sau apasă <kbd>←</kbd> / <kbd>→</kbd>.
  <br><span style="opacity:.85">CSS: <code>::before</code>/<code>::after</code> (badge-uri & efecte) • JS: <code>.before()</code>/<code>.after()</code> (UI real)</span>
`;

const legend = document.createElement("div");
legend.className = "legend";
legend.innerHTML = `
  <span class="chip" style="color: rgba(255,77,157,.95)"><span class="dot"></span> BEFORE = retro / glitch</span>
  <span class="chip" style="color: rgba(255,209,102,.95)"><span class="dot"></span> AFTER = modern / glossy</span>
  <span class="chip" style="color: rgba(76,201,240,.95)"><span class="dot"></span> Drag slider</span>
`;

const controls = document.createElement("div");
controls.className = "controls";
controls.innerHTML = `
  <button class="btn-primary" id="party">Instant AFTER ✨</button>
  <button class="btn-ghost" id="reset">Reset</button>
`;

// Insert around the compare card
compare.before(note);     // <-- JS before()
compare.after(legend);    // <-- JS after()
legend.after(controls);   // <-- JS after()

const btnParty = document.getElementById("party");
const btnReset = document.getElementById("reset");

// --- Slider logic ---
let dragging = false;
let pos = 50;

function setPos(pct) {
  pos = Math.max(0, Math.min(100, pct));
  compare.style.setProperty("--pos", `${pos}%`);
  handle.setAttribute("aria-valuenow", String(Math.round(pos)));
}

function pointerToPct(clientX) {
  const rect = compare.getBoundingClientRect();
  return ((clientX - rect.left) / rect.width) * 100;
}

function onDown(e) {
  dragging = true;
  compare.setPointerCapture?.(e.pointerId);
  setPos(pointerToPct(e.clientX));
}

function onMove(e) {
  if (!dragging) return;
  setPos(pointerToPct(e.clientX));
}

function onUp() {
  dragging = false;
}

compare.addEventListener("pointerdown", onDown);
compare.addEventListener("pointermove", onMove);
compare.addEventListener("pointerup", onUp);
compare.addEventListener("pointercancel", onUp);

// Keyboard control on handle
handle.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") setPos(pos - 2);
  if (e.key === "ArrowRight") setPos(pos + 2);
});

// --- Confetti party when jumping to AFTER ---
function confettiBurst() {
  let layer = compare.querySelector(".confetti");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "confetti";
    compare.appendChild(layer);
  }
  layer.innerHTML = "";

  const pieces = 42;
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement("i");

    // random position
    const left = Math.random() * 100;
    // random drift and rotation
    const dx = (Math.random() * 2 - 1) * 180;
    const rot = (Math.random() * 2 - 1) * 720;

    // random color (no fixed palette in JS; keep it fun)
    const hue = Math.floor(Math.random() * 360);
    p.style.left = `${left}%`;
    p.style.background = `hsl(${hue} 95% 60%)`;
    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--rot", `${rot}deg`);
    p.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;

    layer.appendChild(p);
  }

  // clean after animation
  setTimeout(() => {
    if (layer) layer.innerHTML = "";
  }, 1800);
}

btnParty.addEventListener("click", () => {
  setPos(100);
  title.textContent = "AFTER Mode Activated";
  confettiBurst();
});

btnReset.addEventListener("click", () => {
  setPos(50);
  title.textContent = "Front-End Opposites";
});

// Init
setPos(50);
