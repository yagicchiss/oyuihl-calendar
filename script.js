let tweets = {};

const calendar = document.getElementById("calendar");
const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentYear = 2025;
let currentMonth = 11;

for (let year = 2025; year <= 2026; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = `${year}年`;
  yearSelect.appendChild(option);
}

function renderCalendar(year, month) {
  calendar.innerHTML = "";

  yearSelect.value = year;
  monthSelect.value = month;

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const startWeekDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  for (let i = 0; i < startWeekDay; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.classList.add("day", "empty");
    calendar.appendChild(emptyBox);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    const weekDay = new Date(year, month - 1, day).getDay();

    if (weekDay === 0) {
      dayBox.classList.add("sunday");
    }

    if (weekDay === 6) {
      dayBox.classList.add("saturday");
    }

    const dateKey =
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (tweets[dateKey]) {
      dayBox.classList.add("hasTweet");
    }

    dayBox.innerHTML = `<div class="date">${day}</div>`;

    if (tweets[dateKey]) {
      tweets[dateKey].forEach(tweet => {
        const link = document.createElement("a");
        link.href = tweet.url;
        link.textContent = tweet.title;
        link.target = "_blank";
        dayBox.appendChild(link);
      });
    }

    calendar.appendChild(dayBox);
  }
}

prevBtn.addEventListener("click", () => {
  currentMonth--;

  if (currentMonth === 0) {
    currentMonth = 12;
    currentYear--;
  }

  if (currentYear < 2025) {
    currentYear = 2025;
    currentMonth = 1;
  }

  renderCalendar(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;

  if (currentMonth === 13) {
    currentMonth = 1;
    currentYear++;
  }

  if (currentYear > 2026) {
    currentYear = 2026;
    currentMonth = 12;
  }

  renderCalendar(currentYear, currentMonth);
});

yearSelect.addEventListener("change", () => {
  currentYear = Number(yearSelect.value);
  renderCalendar(currentYear, currentMonth);
});

monthSelect.addEventListener("change", () => {
  currentMonth = Number(monthSelect.value);
  renderCalendar(currentYear, currentMonth);
});

fetch("tweets.json")
  .then(response => response.json())
  .then(data => {
    tweets = data;
    renderCalendar(currentYear, currentMonth);
  })
  .catch(error => {
    console.error("tweets.jsonの読み込みに失敗しました", error);
    renderCalendar(currentYear, currentMonth);
  });