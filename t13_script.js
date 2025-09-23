const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("charCount");
const successMessage = document.getElementById("successMessage");
const resetBtn = document.getElementById("resetBtn");

// شمارشگر کاراکترها
messageInput.addEventListener("input", () => {
  let remaining = 300 - messageInput.value.length;
  charCount.textContent = `${remaining} کاراکتر باقی مانده`;
});

// ذخیره‌سازی در LocalStorage
function saveData() {
  localStorage.setItem("contactData", JSON.stringify({
    name: nameInput.value,
    email: emailInput.value,
    subject: subjectInput.value,
    message: messageInput.value
  }));
}

function loadData() {
  let data = localStorage.getItem("contactData");
  if (data) {
    data = JSON.parse(data);
    nameInput.value = data.name || "";
    emailInput.value = data.email || "";
    subjectInput.value = data.subject || "";
    messageInput.value = data.message || "";
    charCount.textContent = `${300 - messageInput.value.length} کاراکتر باقی مانده`;
  }
}

form.addEventListener("input", saveData);
window.addEventListener("load", loadData);

// ارسال فرم
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
    alert("لطفا همه فیلدها را پر کنید");
    return;
  }

  successMessage.classList.remove("hidden");
  successMessage.classList.add("show");

  form.reset();
  localStorage.removeItem("contactData");
  charCount.textContent = "۳۰۰ کاراکتر باقی مانده";

  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 4000);
});

// دکمه ریست
resetBtn.addEventListener("click", () => {
  form.reset();
  localStorage.removeItem("contactData");
  charCount.textContent = "۳۰۰ کاراکتر باقی مانده";
});