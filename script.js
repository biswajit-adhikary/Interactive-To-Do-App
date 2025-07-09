// Add event listener to load tasks when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Get references to the HTML elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// --- Event Listeners ---
// Add event listener to the "Add" button to add a task when clicked
addTaskBtn.addEventListener("click", addTask);

// Add event listener to the input field to add a task when "Enter" is pressed
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Use event delegation for handling clicks on the task list
taskList.addEventListener("click", handleTaskClick);

// --- Core Functions ---
// Function to generate a simple unique identifier
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to add a new task to the list
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = {
      id: generateUUID(),
      text: taskText,
      completed: false,
    };
    const taskItem = createTaskItem(newTask);
    taskList.appendChild(taskItem);
    saveTasks();
    taskInput.value = "";
    if (taskInput.classList.contains("empty-task")) {
      taskInput.classList.remove("empty-task");
    }
  } else {
    taskInput.focus();
    taskInput.classList.add("empty-task");
  }
}

// Function to create a new task item element (li)
function createTaskItem(task) {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";
  taskItem.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.id = task.id;

  const taskTextLabel = document.createElement("label");
  taskTextLabel.className = "task-text";
  taskTextLabel.textContent = task.text;
  taskTextLabel.htmlFor = task.id;

  if (task.completed) {
    taskTextLabel.classList.add("completed");
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskTextLabel);
  taskItem.appendChild(deleteBtn);

  return taskItem;
}

// Function to handle clicks within the task list
function handleTaskClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem) return;

  if (target.type === "checkbox") {
    const taskText = taskItem.querySelector(".task-text");
    taskText.classList.toggle("completed");
  } else if (target.classList.contains("delete-btn")) {
    taskItem.remove();
  }
  saveTasks();
}

// --- Local Storage Functions ---
// Function to save the current list of tasks to Local Storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((taskItem) => {
    const task = {
      id: taskItem.dataset.id,
      text: taskItem.querySelector(".task-text").textContent,
      completed: taskItem.querySelector('input[type="checkbox"]').checked,
    };
    tasks.push(task);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from Local Storage when the page loads
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task);
    taskList.appendChild(taskItem);
  });
}
