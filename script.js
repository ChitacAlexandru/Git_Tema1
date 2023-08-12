const addTaskDialog = document.getElementById("addTaskDialog");
const taskForm = document.getElementById("taskForm");

const openBtn = document.getElementById("openBtn");
const cancelBtn = document.getElementById("cancelBtn");

let taskEditId = null;
console.log(taskEditId);

openBtn.addEventListener("click", () => {
  addTaskDialog.showModal();
});

cancelBtn.addEventListener("click", (e) => {
  taskForm.reset();
  taskEditId = null;
  addTaskDialog.close();
});

addTaskDialog.addEventListener("close", (e) => {
  //functionalitate pt escape
  taskForm.reset();
  taskId = null;
  addTaskDialog.close();
});

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function markAsCompleted(taskId) {
  const tasks = getTasks();
  tasks[taskId].completed = true;
  saveTasks(tasks);
}

function addTask(name, description, email) {
  const formData = {
    name: name,
    description: description,
    email: email,
    completed: false,
  };
  const tasks = getTasks();
  tasks.push(formData);
  saveTasks(tasks);
}

function editTaskEvent(index, name, description, email) {
  console.log(taskEditId);
  const tasks = getTasks();
  tasks[index].name = name;
  tasks[index].description = description;
  tasks[index].email = email;
  saveTasks(tasks);
}

function editTaskClick(taskIndex) {
  const tasks = getTasks();
  const editTask = tasks[taskIndex];
  taskForm.name.value = editTask.name;
  taskForm.description.value = editTask.description;
  taskForm.email.value = editTask.email;
  taskEditId = taskIndex;
  console.log(taskEditId);
  addTaskDialog.showModal();
}

function submitTask(event) {
  event.preventDefault();

  const name = taskForm.name.value;
  const description = taskForm.description.value;
  const email = taskForm.email.value;

  if (taskEditId == null) {
    addTask(name, description, email);
  } else {
    editTaskEvent(taskEditId, name, description, email);
    taskEditId = null;
  }
  taskForm.reset();
  addTaskDialog.close();
  displayTasks();
}

function displayTasks() {
  const tasks = getTasks();

  uncompletedTaskList.innerHTML = "";
  completedTaskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task";
    taskItem.innerHTML = `
    <p>Name: ${task.name}</p>
    <p>Description: ${task.description}</p> 
    <p>Email: ${task.email}</p>
    <button class="deleteBtn">Delete</button>
   
    `;

    if (task.completed) {
      taskItem.classList.add("completed");
    } else {
      taskItem.innerHTML += `
      <button class="completeBtn">Mark as complete</button>
      <button class="editBtn" taskid="${index}">Edit task</buton>
      `;

      const completeBtn = taskItem.querySelector(".completeBtn");
      completeBtn.addEventListener("click", () => {
        markAsCompleted(index);
        displayTasks();
      });
      const editBtn = taskItem.querySelector(".editBtn");
      editBtn.addEventListener("click", () => {
        const taskId = parseInt(editBtn.getAttribute("taskid"));
        editTaskClick(taskId);
      });
    }

    const deleteBtn = taskItem.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks(tasks);
      displayTasks();
    });

    if (task.completed) {
      completedTaskList.appendChild(taskItem);
    } else {
      uncompletedTaskList.appendChild(taskItem);
    }
  });
}

taskForm.addEventListener("submit", submitTask);
displayTasks();
