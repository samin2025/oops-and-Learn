document.addEventListener("DOMContentLoaded", () => {

const LS_KEY = "multi_goals";
const addGoalBtn = document.getElementById("addGoalBtn");
const goalNameInput = document.getElementById("goalName");
const goalTotalInput = document.getElementById("goalTotal");
const goalsList = document.getElementById("goalsList");
const congratsModal = document.getElementById("congratsModal");
const congratsDetail = document.getElementById("congratsDetail");
const nextGoalBtn = document.getElementById("nextGoalBtn");

let goals = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

function saveGoals() { localStorage.setItem(LS_KEY, JSON.stringify(goals)); }
function formatNumber(n) { return Number(n).toLocaleString("fa-IR"); }

function createGoalCard(goal) {
    const div = document.createElement("div");
    div.className = "goal-card";

    div.innerHTML = `
        <h4>${goal.name} - ${formatNumber(goal.totalGoal)} ساعت</h4>
        <div class="progress-ring">
          <svg width="120" height="120">
            <circle class="progress-ring-bg" cx="60" cy="60" r="70"></circle>
            <circle class="progress-ring-fg" cx="60" cy="60" r="70"></circle>
          </svg>
          <div class="progress-ring-text">0%</div>
        </div>
        <div class="bar-chart"></div>
        <div class="entry-details"></div>
        <input type="number" class="hoursInput" placeholder="0.5 تا 2 ساعت" min="0.5" max="2" step="0.5">
        <button class="addHoursBtn">ثبت ساعت</button>
        <ul class="entriesList"></ul>
    `;
    goalsList.appendChild(div);

    const progressFG = div.querySelector(".progress-ring-fg");
    const progressText = div.querySelector(".progress-ring-text");
    const barChart = div.querySelector(".bar-chart");
    const entryDetails = div.querySelector(".entry-details");
    const hoursInput = div.querySelector(".hoursInput");
    const addHoursBtn = div.querySelector(".addHoursBtn");
    const entriesList = div.querySelector(".entriesList");

    function updateProgress() {
        const total = goal.totalGoal;
        const done = goal.entries.reduce((s, e) => s + e.hours, 0);
        const percent = Math.min(100, Math.round(done / total * 100));
        progressText.textContent = percent + "%";
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        progressFG.style.strokeDasharray = circumference;
        progressFG.style.strokeDashoffset = offset;
    }

    function renderEntries() {
        entriesList.innerHTML = "";
        entryDetails.innerHTML = "";
        barChart.innerHTML = "";
        const total = goal.totalGoal;
        const colors = ["#ff4081", "#18c77e", "#ffd700", "#00bfff", "#ff7f50"];
        goal.entries.forEach((e, i) => {
            const seg = document.createElement("div");
            seg.className = "bar-segment";
            seg.style.width = (e.hours / total * 100) + "%";
            seg.style.background = colors[i % colors.length];
            seg.textContent = e.hours + "h";
            barChart.appendChild(seg);
            entryDetails.innerHTML += `${e.date} ${e.time}: ${e.hours} ساعت <br>`;
            const li = document.createElement("li");
            li.innerHTML = `<span>${e.date} ${e.time}</span> <strong>${e.hours} ساعت</strong>`;
            entriesList.appendChild(li);
        });
        updateProgress();
    }

    addHoursBtn.addEventListener("click", () => {
        const v = Number(hoursInput.value);
        if (!v || v < 0.5 || v > 2) return alert("عدد معتبر وارد کنید (0.5 تا 2)");
        const totalDone = goal.entries.reduce((s, e) => s + e.hours, 0);
        if (totalDone + v > goal.totalGoal) return alert("بیش از حد مجاز است");
        const now = new Date();
        goal.entries.push({
            hours: v,
            date: now.toLocaleDateString('fa-IR'),
            time: now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        });
        const newTotal = goal.entries.reduce((s, e) => s + e.hours, 0);
        if (newTotal >= goal.totalGoal) {
            goal.completedAt = new Date().toISOString();
            congratsDetail.textContent = `تبریک! هدف "${goal.name}" تکمیل شد`;
            congratsModal.classList.add("active");
        }
        hoursInput.value = "";
        saveGoals();
        renderEntries();
    });

    renderEntries();
}

function renderGoals() {
    goalsList.innerHTML = "";
    goals.forEach(g => createGoalCard(g));
}

// اضافه کردن هدف جدید
addGoalBtn.addEventListener("click", () => {
    const name = goalNameInput.value.trim();
    const total = Number(goalTotalInput.value);
    if (!name) return alert("نام وارد کنید");
    if (!total || total <= 0) return alert("ساعت معتبر وارد کنید");
    const newGoal = { id: goals.length ? goals[goals.length - 1].id + 1 : 1, name: name, totalGoal: total, entries: [], completedAt: null };
    goals.push(newGoal);
    saveGoals();
    goalNameInput.value = "";
    goalTotalInput.value = "";
    renderGoals();
});

// بستن modal تبریک
nextGoalBtn.addEventListener("click", () => {
    congratsModal.classList.remove("active");
});

renderGoals();
});