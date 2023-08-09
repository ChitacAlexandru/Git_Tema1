const addTaskDialog = document.getElementById("addTaskDialog");
const taskForm = document.getElementById("taskForm");

const openBtn = document.getElementById("openBtn");
const cancelBtn = document.getElementById("cancelBtn");


let taskId=null;

// add task button opens a dialogue with fields to complete for the task we want to add
openBtn.addEventListener("click", () => {
  addTaskDialog.showModal();
});

// "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
cancelBtn.addEventListener("click", (e) => {
  taskForm.reset();
  taskId = null;
  addTaskDialog.close();
});

addTaskDialog.addEventListener("close", (e) => {
  addTaskDialog.close();
});

function saveTasks(tasks){
  localStorage.setItem("tasks",JSON.stringify(tasks));
}

function getTasks(){
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function markAsCompleted(taskId){
  const tasks = getTasks();
  tasks[taskId].completed = true;
  saveTasks(tasks);
}

function addTask(name,description,email){
  const formData = {
    name: name,
    description: description,
    email: email,
    completed: false,
  }
  const tasks = getTasks();
  tasks.push(formData);
  saveTasks(tasks);
}

function submitTask(event){
  event.preventDefault();

  const title = taskForm.name.value;
  const description = taskForm.description.value;
  const email = taskForm.email.value;

  addTask(title,description,email);
  taskForm.reset();
  addTaskDialog.close();
  displayTasks();
}

function displayTasks(){
  const tasks = getTasks();

  uncompletedTaskList.innerHTML="";
  completedTaskList.innerHTML="";

  tasks.forEach((task,index)=>{
    const taskItem = document.createElement("li");
    taskItem.className="task";
    taskItem.innerHTML= `
    <h3>Name: ${task.name}</h3>
    <p>Description: ${task.description}</p> 
    <p>Email: ${task.email}</p>
    <button class="deleteBtn taskId=${index}">Delete</button>
    `;

    if(task.completed){
      taskItem.classList.add("completed");
    }else{
      taskItem.innerHTML +=`
      <button class="completeBtn" taskId=${index}">Mark as complete</button>
      `
    

    const completeBtn = taskItem.querySelector(".completeBtn");
    completeBtn.addEventListener("click",()=>{
      const taskId = parseInt(completeBtn.getAttribute("taskId"));
      markAsCompleted(taskId);
      displayTasks();
    })
  }

    const deleteBtn = taskItem.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click",()=>{
      const taskId= parseInt(deleteBtn.getAttribute("taskId"));
      tasks.splice(taskId,1);
      saveTasks(tasks);
      displayTasks();
    });
    
    if(task.completed){
      completedTaskList.appendChild(taskItem);
    }else{
  uncompletedTaskList.appendChild(taskItem);
    }
  });
}

taskForm.addEventListener("submit",submitTask);
displayTasks();

/*document.getElementById("taskForm").addEventListener("submit",function(event){ //This is used to make the submit button work when adding a task
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    email: document.getElementById("email").value
  };
  


  //const storedFormData=localStorage.getItem("formData");
  let storedFormData = localStorage.getItem("formData");
  let allFormData =  storedFormData ? JSON.parse(storedFormData) : []; //get existing data or create new array if there is none

  if (!Array.isArray(allFormData)) {
    allFormData = [];
  }

  allFormData.push(storedFormData); //add new data

  localStorage.setItem("taskFormData",JSON.stringify(allFormData)); // store new data

  //Clear fields for next submission
  document.getElementById("name").value="";;
  document.getElementById("description").value="";
  document.getElementById("email").value="";

  displayTasks(allFormData);
})

function displayTasks(formDataArray){
  const taskOutput = document.getElementById("task-container");
  taskOutput.innerHTML = "";

  if(!Array.isArray(formDataArray) || formDataArray.length === 0 ){
    taskOutput.innerHTML= "<p>No tasks available</p>";
    return;
  }
  formDataArray.forEach((formData)=>{
    const div = document.createElement("div");
    div.innerHTML = `<p>Name: ${formData.name} </p> <p>Description: ${formData.description}</p> <p>Email: ${formData.email}</p>`;
    taskOutput.appendChild(div);
  });
}

window.addEventListener("load",function(){
  const storedFormData = localStorage.getItem("taskFormData");
  if(storedFormData){
    const formDataArray = JSON.parse(storedFormData);
   displayTasks(formDataArray);
  }
})
*/

