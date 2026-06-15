const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("simpleTasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("simpleTasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  list.innerHTML = "";

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " is-done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `切换任务：${task.title}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `删除任务：${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, title, deleteButton);
    list.appendChild(item);
  });

  const remaining = tasks.filter((task) => !task.done).length;
  remainingCount.textContent = remaining;
  emptyState.classList.toggle("is-hidden", visibleTasks.length > 0);
}

function addTask(title) {
  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    done: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  addTask(title);
  input.value = "";
  input.focus();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach((filter) => filter.classList.remove("is-active"));
    button.classList.add("is-active");
    renderTasks();
  });
});

renderTasks();
