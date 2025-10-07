//console.log("✅ t19_script.js لود شد!"); //جهت تست
document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const langSelect = document.getElementById("langSelect");
  const translateBtn = document.getElementById("translateBtn");
  const result = document.getElementById("result");

  // سرورهای مختلف برای پشتیبان
  const servers = [
    "https://libretranslate.de/translate",
    "https://translate.astian.org/translate",
    "https://libretranslate.it/translate",
    "https://translate.argosopentech.com/translate"
  ];

  // پیام‌های انگیزشی برای حس مثبت بعد از ترجمه
  const motivationMessages = [
    "✨ عالیه! هر ترجمه یعنی یک گام به جلو در مسیر یادگیری.",
    "🌱 تو داری مرزهای زبون رو می‌شکنی، ادامه بده!",
    "🚀 ترجمه‌ی جدید یعنی ذهن بازتر و نگاه جهانی‌تر!",
    "💪 فوق‌العاده! یادگیری یعنی حرکت به سمت آزادی.",
    "🌈 کلماتت دارن قدرت می‌گیرن، درخشیدی!"
  ];

  async function translateText(text, targetLang) {
    for (const server of servers) {
      try {
        const response = await fetch(server, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: "auto",
            target: targetLang,
            format: "text",
          }),
        });

        if (!response.ok) throw new Error("Server not responding");
        const data = await response.json();
        if (data && data.translatedText) return data.translatedText;
      } catch (err) {
        console.warn(`❌ خطا از ${server}: ${err.message}`);
        continue;
      }
    }
    throw new Error("هیچ سرور فعالی پیدا نشد.");
  }

  translateBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    const targetLang = langSelect.value;

    if (!text) {
      result.innerHTML = "<p class='error'>📝 لطفاً متنی بنویس تا برات ترجمه کنم!</p>";
      return;
    }

    result.innerHTML = "<p class='loading'>⏳ در حال ترجمه... کمی صبر کن.</p>";

    try {
      const translated = await translateText(text, targetLang);
      const message = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

      result.innerHTML = `
        <div class="translation-box">
          <p class="translated-text">${translated}</p>
          <p class="motivation">${message}</p>
        </div>
      `;
    } catch (err) {
      result.innerHTML = `
        <div class="error-box">
          <p>⚠️ متأسفم! ترجمه انجام نشد.</p>
          <p>📡 لطفاً اینترنت یا VPN خود را بررسی کن و دوباره تلاش کن.</p>
          <p style="font-size:0.9rem;opacity:0.7;">(${err.message})</p>
        </div>
      `;
    }
  });
});