const apiKey = "6fc39b9e77f26d6d870240ef85558d50";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    alert("لطفا نام شهر را وارد کنید.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fa`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      weatherResult.innerHTML = `<p>شهر یافت نشد ❌</p>`;
      return;
    }

    weatherResult.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <p>🌡️ دما: ${data.main.temp}°C</p>
      <p>☁️ وضعیت: ${data.weather[0].description}</p>
      <p>💧 رطوبت: ${data.main.humidity}%</p>
      <p>💨 باد: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    console.error(error);
    alert("خطا در دریافت اطلاعات آب‌وهوا.");
  }
}