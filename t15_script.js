// هندل فرم تماس
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("formStatus").innerText = "پیام شما ارسال شد ✅";
  this.reset();
});

// متغیرها
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentsList = document.getElementById("commentsList");
const ratingStars = document.getElementById("ratingStars");

let currentRating = 0;

// سیستم ستاره‌ای
ratingStars.innerHTML = "";
for (let i = 1; i <= 5; i++) {
  const star = document.createElement("span");
  star.textContent = "☆";
  star.style.fontSize = "20px";
  star.style.cursor = "pointer";
  star.onclick = () => setRating(i);
  ratingStars.appendChild(star);
}

function setRating(rating) {
  currentRating = rating;
  [...ratingStars.children].forEach((star, index) => {
    star.textContent = index < rating ? "★" : "☆";
  });
}

// خواندن نظرات از localStorage
let comments = JSON.parse(localStorage.getItem("comments_t15")) || [];

// نمایش نظرات روی صفحه
function renderComments() {
  commentsList.innerHTML = "";
  comments.forEach((commentObj, index) => {
    const li = document.createElement("li");

    // متن نظر
    const textSpan = document.createElement("span");
    textSpan.textContent = commentObj.text;
    li.appendChild(textSpan);

    // نمایش امتیاز
    const ratingSpan = document.createElement("span");
    ratingSpan.textContent = " | ⭐ " + commentObj.rating;
    ratingSpan.style.marginRight = "10px";
    li.appendChild(ratingSpan);

    // نمایش تاریخ و ساعت
    const timeSpan = document.createElement("small");
    timeSpan.textContent = " 🕒 " + commentObj.date;
    timeSpan.style.marginRight = "10px";
    timeSpan.style.color = "#555";
    li.appendChild(timeSpan);

    // دکمه ویرایش
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => startEditing(li, index, commentObj);
    li.appendChild(editBtn);

    // دکمه حذف
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      comments.splice(index, 1);
      localStorage.setItem("comments_t15", JSON.stringify(comments));
      renderComments();
    };
    li.appendChild(delBtn);

    commentsList.appendChild(li);
  });
}

// شروع ویرایش
function startEditing(li, index, oldObj) {
  li.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldObj.text;
  li.appendChild(input);

  // انتخاب ستاره‌ها در ویرایش
  const editStars = document.createElement("div");
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = i <= oldObj.rating ? "★" : "☆";
    star.style.cursor = "pointer";
    star.onclick = () => {
      oldObj.rating = i;
      [...editStars.children].forEach((s, idx) => {
        s.textContent = idx < i ? "★" : "☆";
      });
    };
    editStars.appendChild(star);
  }
  li.appendChild(editStars);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "✅";
  saveBtn.onclick = () => {
    const newText = input.value.trim();
    if (newText !== "") {
      oldObj.text = newText;
      localStorage.setItem("comments_t15", JSON.stringify(comments));
      renderComments();
    }
  };
  li.appendChild(saveBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "❌";
  cancelBtn.onclick = () => renderComments();
  li.appendChild(cancelBtn);
}

// هندل ثبت نظر
commentForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const commentText = commentInput.value.trim();
  if (commentText === "" || currentRating === 0) return;

  const now = new Date();
  const formattedDate =
    now.toLocaleDateString("fa-IR") + " " + now.toLocaleTimeString("fa-IR");

  comments.push({
    text: commentText,
    rating: currentRating,
    date: formattedDate
  });
  localStorage.setItem("comments_t15", JSON.stringify(comments));
  renderComments();

  commentInput.value = "";
  setRating(0); // ریست ستاره‌ها
});

// بارگذاری اولیه
renderComments();