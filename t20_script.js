document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // 🗝️ کلید ذخیره‌سازی و حالات
  // -------------------------------
  const LS_KEY = "t20_entries";
  const MOODS = [
    { id: "happy", label: "شاد", color: "#66ff66" },
    { id: "anger", label: "خشم", color: "#ff6b6b" },
    { id: "stress", label: "استرس", color: "#ffb74d" },
    { id: "sad", label: "غم", color: "#00e5ff" },
    { id: "calm", label: "آرامش", color: "#7c4dff" },
    { id: "motivation", label: "انگیزه", color: "#ff6ec7" }
  ];

  // -------------------------------
  // 📌 المان‌های DOM
  // -------------------------------
  const slidersContainer = document.getElementById("slidersContainer");
  const noteEl = document.getElementById("note");
  const recordBtn = document.getElementById("recordBtn");
  const exportBtn = document.getElementById("exportBtn");
  const clearBtn = document.getElementById("clearBtn");
  const feedback = document.getElementById("feedback");

  const dateView = document.getElementById("dateView");
  const dominantEl = document.getElementById("dominant");
  const samplesCountEl = document.getElementById("samplesCount");

  const pieCanvas = document.getElementById("pieChart");
  const lineCanvas = document.getElementById("lineChart");
  const entriesList = document.getElementById("entriesList");

  const filterDate = document.getElementById("filterDate");
  const filterBtn = document.getElementById("filterBtn");
  const clearFilterBtn = document.getElementById("clearFilterBtn");

  const modalExport = document.getElementById("modalExport");
  const modalClose = document.getElementById("modalClose");
  const exportArea = document.getElementById("exportArea");
  const downloadJson = document.getElementById("downloadJson");

  // -------------------------------
  // ⚡ متغیرهای اولیه
  // -------------------------------
  let entries = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const todayISO = new Date().toISOString().slice(0, 10);
  let viewDateISO = todayISO;

  let pieChart = null;
  let lineChart = null;
  const current = {};

  // -------------------------------
  // 🎚 ایجاد اسلایدرها برای هر حس
  // -------------------------------
  MOODS.forEach(mood => {
    current[mood.id] = 0;

    const row = document.createElement("div");
    row.className = "slider-row";

    row.innerHTML = `
      <div class="slider-label">${mood.label}</div>
      <input class="range" type="range" min="0" max="100" value="0" data-mood="${mood.id}">
      <div class="slider-value" id="val-${mood.id}">0</div>
    `;

    slidersContainer.appendChild(row);

    const range = row.querySelector('input[type="range"]');
    const val = row.querySelector(".slider-value");

    range.addEventListener("input", () => {
      current[mood.id] = Number(range.value);
      val.textContent = range.value;
    });
  });

  // -------------------------------
  // 💾 ذخیره‌سازی
  // -------------------------------
  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  }

  // -------------------------------
  // ⏰ تاریخ و زمان کنونی
  // -------------------------------
  function nowObj() {
    const d = new Date();
    return {
      isoDate: d.toISOString().slice(0, 10),
      date: d.toLocaleDateString("fa-IR"),
      time: d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      ts: d.getTime()
    };
  }

  // -------------------------------
  // 💬 نمایش بازخورد کوتاه
  // -------------------------------
  function showFeedback(txt) {
    feedback.textContent = txt;
    feedback.style.opacity = 1;
    setTimeout(() => (feedback.style.opacity = 0), 1500);
  }

  // -------------------------------
  // 📋 رندر لیست نمونه‌ها
  // -------------------------------
  function renderEntries(dateISO) {
    const arr = entries.filter(e => e.isoDate === dateISO).sort((a, b) => a.ts - b.ts);
    entriesList.innerHTML = "";

    arr.forEach(e => {
      const li = document.createElement("li");
      li.className = "entry";

      const moodsHtml = MOODS.map(
        m => `<div class="mood-dot" style="background:${m.color}" title="${m.label}: ${e.moods[m.id]}"></div>`
      ).join("");

      li.innerHTML = `
        <div class="left">
          ${moodsHtml}
          <div class="meta">
            <div class="text">${e.note}</div>
            <div class="text">${e.time}</div>
          </div>
        </div>
        <button class="del">حذف</button>
      `;

      li.querySelector(".del").addEventListener("click", () => {
        entries = entries.filter(item => item.id !== e.id);
        save();
        renderAll();
      });

      entriesList.appendChild(li);
    });
  }

  // -------------------------------
  // 📊 محاسبه میانگین روزانه
  // -------------------------------
  function computeDailyAverages(dateISO) {
    const arr = entries.filter(e => e.isoDate === dateISO);
    if (!arr.length) return null;

    const sums = {};
    MOODS.forEach(m => (sums[m.id] = 0));
    arr.forEach(e => MOODS.forEach(m => (sums[m.id] += e.moods[m.id])));

    const avgs = {};
    MOODS.forEach(m => (avgs[m.id] = Math.round(sums[m.id] / arr.length)));

    return { avgs, total: arr.length };
  }

  // -------------------------------
  // 📈 رندر چارت‌ها
  // -------------------------------
  function renderCharts(dateISO) {
    const stats = computeDailyAverages(dateISO);
    const labels = MOODS.map(m => m.label);
    const bg = MOODS.map(m => m.color);
    const data = MOODS.map(m => (stats ? stats.avgs[m.id] : 0));

    // Pie chart
    if (!pieChart) {
      pieChart = new Chart(pieCanvas.getContext("2d"), {
        type: "doughnut",
        data: { labels, datasets: [{ data, borderWidth: 1, backgroundColor: bg }] },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
      });
    } else {
      pieChart.data.datasets[0].data = data;
      pieChart.update();
    }

    // Line chart
    const arr = entries.filter(e => MOODS.some(m => e.moods[m.id] > 0));
    const times = arr.map(e => e.time);
    const datasets = MOODS.map(m => ({
      label: m.label,
      data: arr.map(e => e.moods[m.id]),
      borderColor: m.color,
      fill: false,
      tension: 0.3
    }));

    if (!lineChart) {
      lineChart = new Chart(lineCanvas.getContext("2d"), {
        type: "line",
        data: { labels: times, datasets },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
      });
    } else {
      lineChart.data.labels = times;
      lineChart.data.datasets = datasets;
      lineChart.update();
    }

    // Summary
    if (stats) {
      const dominant = MOODS.sort((a, b) => stats.avgs[b.id] - stats.avgs[a.id])[0];
      dominantEl.textContent = `حس غالب: ${dominant.label}`;
      samplesCountEl.textContent = `نمونه‌ها: ${stats.total}`;
    } else {
      dominantEl.textContent = "حس غالب: —";
      samplesCountEl.textContent = "نمونه‌ها: 0";
    }
  }

  // -------------------------------
  // 🔄 رندر همه
  // -------------------------------
  function renderAll() {
    renderEntries(viewDateISO);
    renderCharts(viewDateISO);
  }

  // -------------------------------
  // ➕ ثبت نمونه جدید
  // -------------------------------
  recordBtn.addEventListener("click", () => {
    if (dateView.value && dateView.value !== todayISO) {
      alert("ثبت فقط برای امروز امکان‌پذیر است!");
      return;
    }

    const now = nowObj();
    const moods = {};
    MOODS.forEach(m => (moods[m.id] = current[m.id]));

    entries.push({ id: Date.now(), ...now, moods, note: noteEl.value });
    save();

    // ریست اسلایدرها و یادداشت
    MOODS.forEach(m => {
      current[m.id] = 0;
      document.querySelector(`input[data-mood="${m.id}"]`).value = 0;
      document.getElementById(`val-${m.id}`).textContent = 0;
    });
    noteEl.value = "";

    showFeedback("نمونه ثبت شد ✅");
    renderAll();
  });

  // -------------------------------
  // 🗑️ پاک کردن همه نمونه‌ها
  // -------------------------------
  clearBtn.addEventListener("click", () => {
    if (confirm("آیا مطمئن هستید؟")) {
      entries = [];
      save();
      renderAll();
    }
  });

  // -------------------------------
  // 📅 فیلتر بر اساس تاریخ
  // -------------------------------
  filterBtn.addEventListener("click", () => {
    if (filterDate.value) {
      viewDateISO = filterDate.value;
      dateView.value = viewDateISO;
      renderAll();
    }
  });

  clearFilterBtn.addEventListener("click", () => {
    viewDateISO = todayISO;
    dateView.value = viewDateISO;
    filterDate.value = "";
    renderAll();
  });

  dateView.addEventListener("change", () => {
    viewDateISO = dateView.value || todayISO;
    renderAll();
  });

  // -------------------------------
  // 📤 خروجی JSON
  // -------------------------------
  exportBtn.addEventListener("click", () => {
    exportArea.value = JSON.stringify(entries, null, 2);
    modalExport.classList.remove("hidden");
  });

  modalClose.addEventListener("click", () => modalExport.classList.add("hidden"));

  downloadJson.addEventListener("click", () => {
    const blob = new Blob([exportArea.value], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `t20_export_${todayISO}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // -------------------------------
  // 🔄 رندر اولیه
  // -------------------------------
  renderAll();
});