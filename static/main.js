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
let typingInterval;
let isTyping = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

async function loadLyrics() {
    const response = await fetch("/get_lyrics");
    lyricsData = await response.json();
}

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


function updateLyrics(currentTime) {
    for (let i = 0; i < lyricsData.length; i++) {
        if (
            currentTime >= lyricsData[i].time &&
            (i === lyricsData.length - 1 || currentTime < lyricsData[i + 1].time)
        ) {
            if (activeLineIndex !== i && !isTyping) {
                const lines = lyricsContainer.querySelectorAll("p");
                lines[i].classList.remove("inactive");
                lines[i].classList.add("active");

                highlightWords(lines[i], lyricsData[i].text);

                activeLineIndex = i;
                lines[i].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            break;
        }
    }
}

function seekTo(percentage) {
    const newTime = (percentage / 100) * audio.duration;
    audio.currentTime = newTime;
}

audio.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    const progress = (current / duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeText.textContent = formatTime(current);
    updateLyrics(current);
});

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playIcon.textContent = "⏸️";
    } else {
        audio.pause();
        playIcon.textContent = "▶️";
    }
});

progressWrapper.addEventListener("click", (e) => {
    const rect = progressWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seekTo(percentage);
});

window.addEventListener("DOMContentLoaded", async () => {
    await loadLyrics();
    renderLyricsStatic();
});
