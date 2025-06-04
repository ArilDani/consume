const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progress-bar");
const lyricsContainer = document.getElementById("lyrics");
const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const progressWrapper = document.querySelector(".progress-bar-wrapper");

let lyricsData = [];
let activeLineIndex = -1;
let isTyping = false;

// Format waktu (contoh: 1:05)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

// Ambil lirik dari backend
async function loadLyrics() {
    const response = await fetch("/get_lyrics");
    lyricsData = await response.json();
}

// Tampilkan lirik statik
function renderLyricsStatic() {
    lyricsContainer.innerHTML = "";
    lyricsData.forEach((line) => {
        const p = document.createElement("p");
        p.classList.add("lyric-line", "inactive");
        p.innerHTML = line.text
            .split(" ")
            .map((word) => `<span class="word">${word}</span>`)
            .join(" ");
        lyricsContainer.appendChild(p);
    });
}

// Update lirik sesuai waktu
function updateLyrics(currentTime) {
    for (let i = 0; i < lyricsData.length; i++) {
        if (
            currentTime >= lyricsData[i].time &&
            (i === lyricsData.length - 1 || currentTime < lyricsData[i + 1].time)
        ) {
            if (activeLineIndex !== i && !isTyping) {
                const lines = lyricsContainer.querySelectorAll("p");
                lines.forEach(line => line.classList.remove("active"));
                lines[i].classList.remove("inactive");
                lines[i].classList.add("active");
                activeLineIndex = i;
                lines[i].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            break;
        }
    }
}

// Seek audio saat user klik progress bar
function seekTo(percentage) {
    const newTime = (percentage / 100) * audio.duration;
    audio.currentTime = newTime;
}

// Saat metadata audio dimuat
audio.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(audio.duration);
});

// Saat audio diputar
audio.addEventListener("timeupdate", () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    const progress = (current / duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeText.textContent = formatTime(current);
    updateLyrics(current);
});

// Event Play/Pause
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="10" y="8" width="4" height="20" rx="1" />
                <rect x="22" y="8" width="4" height="20" rx="1" />
            </svg>
        `;
    } else {
        audio.pause();
        playIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="10,6 28,18 10,30" />
            </svg>
        `;
    }
});

// Klik progress bar untuk seek
progressWrapper.addEventListener("click", (e) => {
    const rect = progressWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seekTo(percentage);
});

// Saat halaman selesai dimuat
window.addEventListener("DOMContentLoaded", async () => {
    await loadLyrics();
    renderLyricsStatic();

    // Set ikon play saat awal
    playIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="10,6 28,18 10,30" />
        </svg>
    `;
});
