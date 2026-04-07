const totalHours = 24;
const totalDistance = 42;
const perHour = 1.75;

const messageEl = document.getElementById("message");
const distanceEl = document.getElementById("distance");
const statusEl = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");

// shrani začetni čas samo prvič
if (!localStorage.getItem("startTime")) {
  localStorage.setItem("startTime", new Date().toISOString());
}

const startTime = new Date(localStorage.getItem("startTime"));
const endTime = new Date(startTime.getTime() + totalHours * 60 * 60 * 1000);

let isPlaying = false;

function updateDisplay() {
  const now = new Date();

  if (now < startTime) {
    messageEl.textContent = "Srečno, imaš to! 0/24";
    distanceEl.textContent = `Do cilja še ${totalDistance.toFixed(2)} km`;
    statusEl.textContent = `Začetek: ${startTime.toLocaleString("sl-SI")}`;
    progressBar.style.width = "0%";
    return;
  }

  if (now >= endTime) {
    messageEl.textContent = "Srečno, imaš to! 24/24";
    distanceEl.textContent = "Do cilja še 0.00 km";
    statusEl.textContent = "Bravo, cilj je dosežen!";
    progressBar.style.width = "100%";
    return;
  }

  const elapsedMs = now - startTime;
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const remaining = Math.max(0, totalDistance - (perHour * elapsedHours));
  const progressPercent = (elapsedHours / totalHours) * 100;

  messageEl.textContent = `Srečno, imaš to! ${elapsedHours}/24`;
  distanceEl.textContent = `Do cilja še ${remaining.toFixed(2)} km`;
  statusEl.textContent = `Trenutni čas: ${now.toLocaleString("sl-SI")}`;
  progressBar.style.width = `${progressPercent}%`;
}

function toggleMusic() {
  if (!music) return;

  if (!isPlaying) {
    music.play()
      .then(() => {
        isPlaying = true;
        if (musicButton) {
          musicButton.textContent = "⏸ Ustavi glasbo";
        }
      })
      .catch((error) => {
        console.log("Predvajanje ni uspelo:", error);
      });
  } else {
    music.pause();
    isPlaying = false;
    if (musicButton) {
      musicButton.textContent = "🎵 Predvajaj glasbo";
    }
  }
}

updateDisplay();
setInterval(updateDisplay, 1000);

function resetTimer() {
  localStorage.removeItem("startTime");
  location.reload();
}