let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let taskDiv = document.querySelector(".tasks");

// Empty Array To store Tasks
let arrayofTasks = [];
let editMode = false;
let editId = null;

if (localStorage.getItem("tasks")) {
    arrayofTasks = JSON.parse(localStorage.getItem("tasks"));
}

getDataFromLocalStorage();

// Add Task or Edit Task
submit.addEventListener("click", function (e) {
    if (input.value !== "") {
        if (editMode) {
            // Edit task
            updateTask(editId, input.value);
        } else {
            // Add new task
            addTaskToArray(input.value);
        }
        input.value = "";
        editMode = false; // Reset edit mode
    }
});

taskDiv.addEventListener("click", (e) => {
    // Delete Task
    if (e.target.classList.contains("del")) {
        deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
        e.target.parentElement.remove();
    }

    // Toggle Complete Status
    if (e.target.classList.contains("task")) {
        toggleStatusTaskWith(e.target.getAttribute("data-id"));
        e.target.classList.toggle("done");
    }

    // Edit Task
    if (e.target.classList.contains("edit")) {
        editMode = true;
        editId = e.target.parentElement.getAttribute("data-id");
        let taskText = e.target.parentElement.firstChild.textContent;
        input.value = taskText; // Put task text in input field
    }
});

function addTaskToArray(taskText) {
    const task = {
        id: Date.now(),
        title: taskText,
        completed: false,
    };

    arrayofTasks.push(task);
    addElementsToPage(arrayofTasks);
    addDataToLocalStorage(arrayofTasks);
}

function updateTask(id, newText) {
    arrayofTasks = arrayofTasks.map(task => {
        if (task.id == id) {
            task.title = newText;
        }
        return task;
    });
    addElementsToPage(arrayofTasks);
    addDataToLocalStorage(arrayofTasks);
}

function addElementsToPage(arrayofTasks) {
    taskDiv.innerHTML = "";
    arrayofTasks.forEach((task) => {
        let div = document.createElement("div");
        div.className = "task";
        if (task.completed) {
            div.classList.add("done");
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));

        // Create Edit Button
        let editSpan = document.createElement("span");
        editSpan.className = "edit";
        editSpan.appendChild(document.createTextNode("Edit"));
        div.appendChild(editSpan);

        // Create Delete Button
        let deleteSpan = document.createElement("span");
        deleteSpan.className = "del";
        deleteSpan.appendChild(document.createTextNode("Delete"));
        div.appendChild(deleteSpan);

        taskDiv.appendChild(div);
    });
}

function addDataToLocalStorage(arrayofTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(arrayofTasks));
}

function getDataFromLocalStorage() {
    let data = window.localStorage.getItem("tasks");
    if (data) {
        let tasks = JSON.parse(data);
        addElementsToPage(tasks);
    }
}

function deleteTaskWith(taskId) {
    arrayofTasks = arrayofTasks.filter((task) => task.id != taskId);
    addDataToLocalStorage(arrayofTasks);
}

function toggleStatusTaskWith(taskId) {
    arrayofTasks = arrayofTasks.map((task) => {
        if (task.id == taskId) {
            task.completed = !task.completed;
        }
        return task;
    });
    addDataToLocalStorage(arrayofTasks);
}
