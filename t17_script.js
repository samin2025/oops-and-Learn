let countdown;
let timeLeft;
let isRunning = false;

// آرایه مانتراهای فارسی و جهانی با توضیح کوتاه
const quotes = [
  // مانتراهای فارسی/معنوی
  { text: "من در سکوت پاسخ‌ها را می‌یابم." },
  { text: "شکرگزاری قلبم را آرام می‌کند." },
  { text: "زندگی آینه‌ی نیت‌های من است." },
  { text: "هر نفس فرصتی برای حضور است." },
  { text: "ساده زیستن راه آرامش است." },
  { text: "من نور حقیقت را در خود می‌بینم." },
  { text: "دل آرام، جهان را روشن می‌کند." },
  { text: "هر تجربه، درس روح من است." },
  { text: "آگاهی من مسیرم را روشن می‌کند." },
  { text: "نور درونم همیشه روشن است." },
  { text: "صبورم و به زمان اعتماد دارم." },
  { text: "من خود را شناخته‌ام و رشد می‌کنم." },
  { text: "لحظه‌ها را با آرامش تجربه می‌کنم." },
  { text: "من با نیت پاک می‌بخشم و می‌گیرم." },
  { text: "انعکاس خود را در دیگران می‌بینم." },
  { text: "عشق و مهربانی راهنمای من هستند." },
  { text: "آرامش از درونم می‌آید." },
  { text: "هر سختی فرصتی برای رشد است." },
  { text: "زیبایی جهان را درک می‌کنم." },
  { text: "هر روز فرصتی برای آگاهی است." },
  { text: "من از هر چیزی درس می‌گیرم." },
  { text: "دل آرامم، جهان را آرام می‌کند." },
  { text: "با نگاه پاک، همه چیز زیباست." },
  { text: "طلوع هر روز، فرصتی تازه است." },
  { text: "در حال حاضر حضور دارم." },
  { text: "افکار مثبت مسیرم را روشن می‌کنند." },
  { text: "قدر لحظه‌ها را می‌دانم." },
  { text: "من در حال، بزرگ‌ترین هدیه را دارم." },
  { text: "زندگی آینه‌ی اعمال من است." },
  { text: "پذیرش، کلید رهایی من است." },
  { text: "عشق و مهر، نیروی من هستند." },
  { text: "سادگی رمز خوشبختی من است." },
  { text: "هر تجربه فرصتی برای فهم خود است." },
  { text: "هر لحظه می‌تواند آغاز تازه باشد." },
  { text: "دل شاد، بزرگ‌ترین دارایی من است." },
  { text: "آرام‌تر بودن، بینش بیشتری می‌آورد." },
  { text: "پذیرش خود، راه آرامش است." },
  { text: "صبر و آگاهی همراهان من هستند." },

  // مانتراهای جهانی معروف با توضیح کوتاه
  { text: "Om Mani Padme Hum", desc: "مانترای بودایی نماد شفقت و مهربانی مطلق است." },
  { text: "Hare Krishna", desc: "مانترای هندوئی که نام خدای کریشنا را صدا می‌زند و باعث شادی و عشق الهی می‌شود." },
  { text: "Om", desc: "صدای اولیه و مقدس هستی که به آرامش و اتحاد با کائنات کمک می‌کند." },
  { text: "Om Namah Shivaya", desc: "مانترای هندوئی برای پرستش خداوند شیوا و رسیدن به آرامش درونی." },
  { text: "Soham", desc: "به معنای 'من آن هستم'، مانترای مدیتیشن برای اتحاد با هستی." },
  { text: "Gayatri Mantra", desc: "مانترای هندوئی برای روشنایی ذهن و آگاهی معنوی." },
  { text: "Mahamrityunjaya Mantra", desc: "مانترای شفابخش و محافظت‌کننده در برابر بیماری‌ها و خطرات." },
  { text: "Hare Rama", desc: "مانترای هندوئی برای آرامش ذهن و ارتقای انرژی مثبت." },
  { text: "Om Shanti", desc: "مانترای صلح و آرامش؛ معنای آن 'صلح بر من و جهان' است." },
  { text: "Lokah Samastah Sukhino Bhavantu", desc: "مانترا هندوئی به معنای 'باشد که همه موجودات خوشبخت و آزاد باشند'." }
];

let usedQuotes = [];

const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");

startPauseBtn.addEventListener("click", () => {
  if (!isRunning) {
    if (timeLeft === undefined) {
      const minutes = parseInt(document.getElementById("minutes").value) || 0;
      const seconds = parseInt(document.getElementById("seconds").value) || 0;
      timeLeft = (minutes * 60) + seconds;
      if (timeLeft <= 0) {
        alert("لطفا زمان معتبر وارد کنید!");
        return;
      }
    }
    startCountdown();
    startPauseBtn.innerText = "توقف";
  } else {
    pauseCountdown();
    startPauseBtn.innerText = "ادامه";
  }
});

resetBtn.addEventListener("click", resetTimer);

function startCountdown() {
  isRunning = true;
  const alarm = document.getElementById("alarmSound");
  alarm.pause();
  alarm.currentTime = 0;

  countdown = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(countdown);
      isRunning = false;
      startPauseBtn.innerText = "شروع";

      // انتخاب مانترا تصادفی بدون تکرار
      if (usedQuotes.length === quotes.length) usedQuotes = [];
      let selectedQuote;
      do {
        selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
      } while (usedQuotes.includes(selectedQuote));
      usedQuotes.push(selectedQuote);

      const messageEl = document.getElementById("message");
      if (selectedQuote.desc) {
        messageEl.innerText = `🎉 ${selectedQuote.text}\n${selectedQuote.desc}`;
      } else {
        messageEl.innerText = `🎉 ${selectedQuote.text}`;
      }

      alarm.currentTime = 0;
      alarm.play().catch(err => console.log("صدا پخش نشد:", err));
    }
  }, 1000);
}

function pauseCountdown() {
  clearInterval(countdown);
  isRunning = false;
}

function resetTimer() {
  clearInterval(countdown);
  isRunning = false;

  const timerEl = document.getElementById("timer");
  const messageEl = document.getElementById("message");
  const alarm = document.getElementById("alarmSound");

  timerEl.innerText = "00:00:00";
  messageEl.innerText = "";
  
  document.getElementById("minutes").value = "";
  document.getElementById("seconds").value = "";

  alarm.pause();
  alarm.currentTime = 0;

  timeLeft = undefined;
  startPauseBtn.innerText = "شروع";
}

function updateTimerDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  document.getElementById("timer").innerText =
    `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}