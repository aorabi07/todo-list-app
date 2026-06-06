// ------------------- Login & Register -------------------
function login(){
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if(!username || !password){
        alert("Please enter username and password.");
        return;
    }

    let user = JSON.parse(localStorage.getItem(username));
    if(user && user.password === password){
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials or user not registered.");
    }
}

function register(){
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if(!username || !password){
        alert("Please enter username and password.");
        return;
    }

    if(localStorage.getItem(username)){
        alert("Username already exists. Please login.");
        return;
    }

    let user = { username, password };
    localStorage.setItem(username, JSON.stringify(user));
    alert("Registration successful! Now login.");
}

// ------------------- To-Do List -------------------
if(window.location.pathname.includes("index.html")){
    if(localStorage.getItem('loggedIn') !== 'true'){
        window.location.href = 'login.html';
    }
}

let currentUser = JSON.parse(localStorage.getItem('user')).username;

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

function logout(){
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

function addTask() {
    let input = document.getElementById("taskInput");
    let deadlineInput = document.getElementById("taskDeadline");

    let task = input.value.trim();
    let deadline = deadlineInput.value;

    if(task === ""){ alert("Please enter a task!"); return; }

    let now = new Date();
    let dateStr = now.toLocaleString();
    let deadlineStr = deadline ? new Date(deadline).toLocaleString() : "No deadline";

    let tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    tasks.push({ text: task, done: false, created: dateStr, deadline: deadlineStr });
    localStorage.setItem('tasks_' + currentUser, JSON.stringify(tasks));

    input.value = ""; deadlineInput.value = "";
    loadTasks();
}

function loadTasks(){
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    tasks.forEach((task,index) => {
        let li = document.createElement("li");
        li.innerHTML = `<span class="${task.done ? "done" : ""}" onclick="toggleDone(${index})">${task.text}</span>
                        <small>Created: ${task.created}</small>
                        <small>Deadline: ${task.deadline}</small>
                        <button onclick="deleteTask(${index})">X</button>`;
        taskList.appendChild(li);
    });
}

function toggleDone(index){
    let tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks_' + currentUser, JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index){
    let tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    tasks.splice(index,1);
    localStorage.setItem('tasks_' + currentUser, JSON.stringify(tasks));
    loadTasks();
}

function clearAll(){
    if(confirm("Are you sure you want to delete all tasks?")){
        localStorage.removeItem('tasks_' + currentUser);
        loadTasks();
    }
}

// ------------------- Theme -------------------
function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme(){
    let theme = localStorage.getItem("theme");
    if(theme === "dark") document.body.classList.add("dark");
}