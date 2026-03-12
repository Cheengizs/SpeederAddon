const speedRange = document.getElementById("speedRange");
const currentVal = document.getElementById("currentVal");
let playbackRate = 1.0;

document.addEventListener("DOMContentLoaded", async () => {
  const data = await browser.storage.local.get("savedSpeed");
  if (data.savedSpeed) {
    speedRange.value = data.savedSpeed;
    currentVal.innerText = data.savedSpeed + "x";
    updateSpeed(data.savedSpeed);
  }
});

function setVideoSpeed(speed) {
  const vids = document.querySelectorAll("video");
  vids.forEach((v) => (v.playbackRate = speed));
}

async function updateSpeed(value) {
  browser.storage.local.set({ savedSpeed: value });
  playbackRate = parseFloat(value);
  currentVal.innerText = playbackRate.toFixed(1) + "x";
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: setVideoSpeed,
    args: [playbackRate],
  });
}

speedRange.addEventListener("input", (e) => updateSpeed(e.target.value));

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    playbackRate = btn.getAttribute("data-speed");
    speedRange.value = playbackRate;
    updateSpeed(playbackRate);
  });
});
