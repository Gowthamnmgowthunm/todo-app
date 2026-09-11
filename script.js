// ==========================================
// CHECK LOGIN
// ==========================================

if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/todo-app/")
) {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "login.html";

    }
}


// ==========================================
// TODO APP
// ==========================================

const todoForm =
    document.getElementById("todoForm");

const todoInput =
    document.getElementById("todoInput");

const priority =
    document.getElementById("priority");

const taskDate =
    document.getElementById("taskDate");

const taskTime =
    document.getElementById("taskTime");

const todoList =
    document.getElementById("todoList");

const taskCount =
    document.getElementById("taskCount");


// ==========================================
// LOAD TASKS
// ==========================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    if (!todoList) {
        return;
    }

    todoList.innerHTML = "";

    tasks.forEach(function(task, index) {

        const li =
            document.createElement("li");

        li.className =
            task.completed
            ? "completed"
            : "";


        li.innerHTML = `

            <div>

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${index})"
                >

                <strong>
                    ${escapeHTML(task.text)}
                </strong>

                <div>

                    Priority:
                    ${escapeHTML(task.priority)}

                    ${
                        task.date
                        ? " | Date: " + escapeHTML(task.date)
                        : ""
                    }

                    ${
                        task.time
                        ? " | Time: " + escapeHTML(task.time)
                        : ""
                    }

                </div>

            </div>


            <button
                onclick="deleteTask(${index})"
            >
                Delete
            </button>

        `;


        todoList.appendChild(li);

    });


    updateTaskCount();

}


// ==========================================
// ADD TASK
// ==========================================

if (todoForm) {

    todoForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const text =
                todoInput.value.trim();

            if (!text) {
                return;
            }


            const newTask = {

                text: text,

                priority:
                    priority.value,

                date:
                    taskDate.value,

                time:
                    taskTime.value,

                completed: false

            };


            tasks.push(newTask);


            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            todoInput.value = "";

            taskDate.value = "";

            taskTime.value = "";


            displayTasks();

        }
    );

}


// ==========================================
// COMPLETE TASK
// ==========================================

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayTasks();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(index) {

    tasks.splice(index, 1);


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayTasks();

}


// ==========================================
// CLEAR COMPLETED
// ==========================================

function clearCompleted() {

    tasks =
        tasks.filter(function(task) {

            return !task.completed;

        });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    displayTasks();

}


// ==========================================
// TASK COUNT
// ==========================================

function updateTaskCount() {

    if (!taskCount) {
        return;
    }

    const remaining =
        tasks.filter(function(task) {

            return !task.completed;

        }).length;


    taskCount.textContent =
        remaining + " tasks remaining";

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "isLoggedIn"
    );


    window.location.href =
        "login.html";

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayTasks();