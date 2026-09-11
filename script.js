// =====================================
// REGISTER
// =====================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("message");


        // Password requirements
        const validPassword =
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password);


        if (!validPassword) {

            message.textContent =
                "Invalid password. Please use a strong password.";

            return;
        }


        // Confirm password
        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        const user = {
            name: name,
            email: email,
            password: password
        };


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        alert("Registration successful!");

        window.location.href = "login.html";

    });
}


// =====================================
// LOGIN
// =====================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const errorMessage =
            document.getElementById("errorMessage");

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            errorMessage.textContent =
                "No account found. Please register first.";

            return;
        }


        const user =
            JSON.parse(savedUser);


        if (
            email === user.email &&
            password === user.password
        ) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            window.location.href =
                "index.html";

        } else {

            errorMessage.textContent =
                "Invalid email or password";

        }

    });
}


// =====================================
// TODO APP
// =====================================

const todoForm =
    document.getElementById("todoForm");

if (todoForm) {

    // Check login
    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "login.html";
    }


    loadTasks();


    todoForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const input =
                document.getElementById("todoInput");

            const priority =
                document.getElementById("priority");

            const taskDate =
                document.getElementById("taskDate");

            const taskTime =
                document.getElementById("taskTime");


            const title =
                input.value.trim();


            if (title === "") {
                return;
            }


            const task = {

                id: Date.now(),

                title: title,

                priority: priority.value,

                date: taskDate.value,

                time: taskTime.value,

                completed: false

            };


            const tasks =
                JSON.parse(
                    localStorage.getItem("tasks") || "[]"
                );


            tasks.push(task);


            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            input.value = "";

            taskDate.value = "";

            taskTime.value = "";

            priority.value = "Medium";


            loadTasks();

        }
    );
}


// =====================================
// LOAD TASKS
// =====================================

function loadTasks() {

    const list =
        document.getElementById("todoList");

    if (!list) {
        return;
    }


    const tasks =
        JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );


    list.innerHTML = "";


    if (tasks.length === 0) {

        list.innerHTML =
            '<div class="empty">No tasks yet.</div>';

        updateTaskCount(tasks);

        return;
    }


    tasks.forEach(function(task) {

        const div =
            document.createElement("div");

        div.className =
            "task" +
            (task.completed ? " completed" : "");


        let details = task.priority;


        if (task.date) {

            details +=
                " 📅 " + task.date;

        }


        if (task.time) {

            details +=
                " ⏰ " + task.time;

        }


        div.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div class="task-content">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-details">
                        ${details}
                    </div>

                </div>

            </div>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        `;


        list.appendChild(div);

    });


    updateTaskCount(tasks);
}


// =====================================
// UPDATE TASK COUNT
// =====================================

function updateTaskCount(tasks) {

    const count =
        document.getElementById("taskCount");

    if (!count) {
        return;
    }


    const remaining =
        tasks.filter(
            task => !task.completed
        ).length;


    if (remaining === 1) {

        count.textContent =
            "1 task remaining";

    } else {

        count.textContent =
            remaining + " tasks remaining";

    }
}


// =====================================
// COMPLETE / UNCOMPLETE
// =====================================

function toggleTask(id) {

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );


    tasks.forEach(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

    });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    loadTasks();
}


// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    loadTasks();
}


// =====================================
// CLEAR COMPLETED
// =====================================

function clearCompleted() {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );


    tasks =
        tasks.filter(
            task => !task.completed
        );


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    loadTasks();
}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem("isLoggedIn");

    window.location.href =
        "login.html";
}


// =====================================
// SECURITY: DISPLAY TASK TEXT SAFELY
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}