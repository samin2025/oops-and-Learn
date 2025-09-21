// --- To-Do List با LocalStorage ---
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  if (taskList) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task;
      const delBtn = document.createElement("button");
      delBtn.textContent = "حذف";
      delBtn.onclick = () => deleteTask(index);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  }
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value.trim() !== "") {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(input.value.trim());
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    loadTasks();
  }
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

window.onload = loadTasks;

// --- Lightbox ---
function openLightbox(img) {
  document.getElementById("lightbox").style.display = "block";
  document.getElementById("lightbox-img").src = img.src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}