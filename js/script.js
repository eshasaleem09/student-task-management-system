/* =========================================
   STUDYFLOW
   Student Task Management System
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm = document.getElementById("taskForm");
const taskModal = document.getElementById("taskModal");
const openTaskModal = document.getElementById("openTaskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyDescription = document.getElementById("emptyDescription");
const emptyStateButton = document.getElementById("emptyStateButton");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const completionRate = document.getElementById("completionRate");
const progressFill = document.getElementById("progressFill");

const pendingNavCount = document.getElementById("pendingNavCount");
const completedNavCount = document.getElementById("completedNavCount");

const taskSectionTitle = document.getElementById("taskSectionTitle");
const taskSectionDescription =
    document.getElementById("taskSectionDescription");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");

const themeToggle = document.getElementById("themeToggle");


/* =========================================
   APPLICATION STATE
========================================= */

let tasks =
    JSON.parse(localStorage.getItem("studyflowTasks")) || [];

let currentView = "all";


/* =========================================
   INITIAL SAMPLE TASKS
========================================= */

if (tasks.length === 0) {

    tasks = [
        {
            id: createId(),
            title: "Prepare OOP assignment",
            description:
                "Complete the C++ OOP questions and review the concepts.",
            priority: "high",
            date: getDateOffset(2),
            completed: false
        },

        {
            id: createId(),
            title: "Review software engineering notes",
            description:
                "Revise software development processes and life cycle models.",
            priority: "medium",
            date: getDateOffset(4),
            completed: false
        },

        {
            id: createId(),
            title: "Update project documentation",
            description:
                "Review the README and add project setup instructions.",
            priority: "low",
            date: getDateOffset(6),
            completed: true
        }
    ];

    saveTasks();
}


/* =========================================
   UTILITY FUNCTIONS
========================================= */

function createId() {

    return (
        Date.now().toString() +
        Math.random().toString(36).substring(2, 8)
    );
}


function getDateOffset(days) {

    const date = new Date();

    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];
}


function saveTasks() {

    localStorage.setItem(
        "studyflowTasks",
        JSON.stringify(tasks)
    );
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


function formatDate(dateString) {

    if (!dateString) {
        return "No due date";
    }

    const date = new Date(
        dateString + "T00:00:00"
    );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );
}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedPriority =
        priorityFilter.value;


    const filteredTasks = tasks.filter(task => {

        const title =
            task.title.toLowerCase();

        const description =
            task.description.toLowerCase();


        const matchesSearch =
            title.includes(searchTerm) ||
            description.includes(searchTerm);


        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;


        const matchesView =
            currentView === "all" ||

            (
                currentView === "pending" &&
                !task.completed
            ) ||

            (
                currentView === "completed" &&
                task.completed
            );


        return (
            matchesSearch &&
            matchesPriority &&
            matchesView
        );

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        showEmptyState();

        return;
    }


    emptyState.classList.add("hidden");


    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });
}


/* =========================================
   CREATE TASK CARD
========================================= */

function createTaskElement(task) {

    const article =
        document.createElement("article");


    article.className = "task-card";


    /* Add completed class */

    if (task.completed) {

        article.classList.add("completed");

    }


    article.innerHTML = `

        <!-- COMPLETE BUTTON -->

        <button
            class="task-check"
            data-action="complete"
            data-id="${task.id}"
            aria-label="${
                task.completed
                    ? "Mark task as pending"
                    : "Mark task as complete"
            }"
            title="${
                task.completed
                    ? "Mark task as pending"
                    : "Mark task as complete"
            }"
        >
            ${task.completed ? "✓" : ""}
        </button>


        <!-- TASK CONTENT -->

        <div class="task-content">

            <h4 class="task-title">
                ${escapeHTML(task.title)}
            </h4>

            <p class="task-description">
                ${escapeHTML(task.description)}
            </p>

        </div>


        <!-- TASK META -->

        <div class="task-meta">

            <span class="priority ${task.priority}">
                ${task.priority}
            </span>

            <span class="task-date">
                ${formatDate(task.date)}
            </span>


            <!-- DELETE BUTTON -->

            <button
                class="delete-task"
                data-action="delete"
                data-id="${task.id}"
                aria-label="Delete task"
                title="Delete task"
            >
                ×
            </button>

        </div>

    `;


    return article;
}


/* =========================================
   EMPTY STATE
========================================= */

function showEmptyState() {

    emptyState.classList.remove("hidden");


    if (currentView === "completed") {

        emptyTitle.textContent =
            "No completed tasks yet";

        emptyDescription.textContent =
            "Complete a task and it will appear here.";

        emptyStateButton.textContent =
            "View Pending Tasks";

    }

    else if (currentView === "pending") {

        emptyTitle.textContent =
            "You're all caught up";

        emptyDescription.textContent =
            "There are no pending tasks right now.";

        emptyStateButton.textContent =
            "View All Tasks";

    }

    else {

        emptyTitle.textContent =
            "No tasks found";

        emptyDescription.textContent =
            "Create a task or change your filters.";

        emptyStateButton.textContent =
            "Add a Task";

    }
}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const rate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalTasks.textContent =
        total;


    pendingTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;


    completionRate.textContent =
        rate;


    progressFill.style.width =
        `${rate}%`;


    pendingNavCount.textContent =
        pending;


    completedNavCount.textContent =
        completed;
}


/* =========================================
   ADD TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById("taskTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("taskDescription")
                .value
                .trim();


        const priority =
            document
                .getElementById("taskPriority")
                .value;


        const date =
            document
                .getElementById("taskDate")
                .value;


        if (!title || !description) {

            showToast(
                "Please complete all required fields."
            );

            return;
        }


        /* New tasks always start as pending */

        const newTask = {

            id: createId(),

            title: title,

            description: description,

            priority: priority,

            date: date,

            completed: false

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();

        updateStatistics();


        taskForm.reset();

        closeModal();


        showToast(
            "Task created successfully."
        );

    }
);


/* =========================================
   COMPLETE / DELETE TASK
========================================= */

taskList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const taskId =
            button.dataset.id;


        /* ================================
           COMPLETE TASK
        ================================= */

        if (action === "complete") {

            toggleTask(taskId);

        }


        /* ================================
           DELETE TASK
        ================================= */

        if (action === "delete") {

    const task =
        tasks.find(
            task => task.id === taskId
        );

    if (!task) {
        return;
    }

    const confirmed =
        confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

    if (confirmed) {
        deleteTask(taskId);
    }

}

    }
);


/* =========================================
   TOGGLE TASK COMPLETION
========================================= */

function toggleTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    /* Toggle completion status */

    task.completed =
        !task.completed;


    /* Save the new status */

    saveTasks();


    /* Update interface */

    renderTasks();

    updateStatistics();


    /* Show feedback */

    showToast(
        task.completed
            ? "Task marked as completed."
            : "Task moved back to pending."
    );
}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    renderTasks();

    updateStatistics();


    showToast(
        `"${task?.title || "Task"}" deleted.`
    );
}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================================
   PRIORITY FILTER
========================================= */

priorityFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".nav-item")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                this.classList.add("active");


                currentView =
                    this.dataset.view;


                if (currentView === "all") {

                    taskSectionTitle.textContent =
                        "My Tasks";

                    taskSectionDescription.textContent =
                        "Keep track of everything you need to accomplish.";

                }


                else if (currentView === "pending") {

                    taskSectionTitle.textContent =
                        "Pending Tasks";

                    taskSectionDescription.textContent =
                        "Focus on the work that still needs your attention.";

                }


                else if (currentView === "completed") {

                    taskSectionTitle.textContent =
                        "Completed Tasks";

                    taskSectionDescription.textContent =
                        "A record of the work you've successfully finished.";

                }


                renderTasks();

                closeMobileSidebar();

            }
        );

    });


/* =========================================
   MODAL
========================================= */

openTaskModal.addEventListener(
    "click",
    openModal
);


closeTaskModal.addEventListener(
    "click",
    closeModal
);


cancelTask.addEventListener(
    "click",
    closeModal
);


taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {

            closeModal();

        }

    }
);


function openModal() {

    taskModal.classList.remove(
        "hidden"
    );


    document
        .getElementById("taskTitle")
        .focus();


    document.body.style.overflow =
        "hidden";
}


function closeModal() {

    taskModal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";
}


/* =========================================
   EMPTY STATE BUTTON
========================================= */

emptyStateButton.addEventListener(
    "click",
    function () {

        if (
            currentView === "pending" ||
            currentView === "completed"
        ) {

            currentView = "all";


            document
                .querySelectorAll(".nav-item")
                .forEach(item =>
                    item.classList.remove("active")
                );


            const allTasksButton =
                document.querySelector(
                    '[data-view="all"]'
                );


            if (allTasksButton) {

                allTasksButton.classList.add(
                    "active"
                );

            }


            taskSectionTitle.textContent =
                "My Tasks";


            taskSectionDescription.textContent =
                "Keep track of everything you need to accomplish.";


            renderTasks();

        }

        else {

            openModal();

        }

    }
);


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );
}


/* =========================================
   MOBILE SIDEBAR
========================================= */

mobileMenuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.add(
            "open"
        );


        mobileOverlay.classList.remove(
            "hidden"
        );

    }
);


mobileOverlay.addEventListener(
    "click",
    closeMobileSidebar
);


function closeMobileSidebar() {

    sidebar.classList.remove(
        "open"
    );


    mobileOverlay.classList.add(
        "hidden"
    );
}


/* =========================================
   THEME TOGGLE
========================================= */

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        showToast(
            "Theme preference updated."
        );

    }
);


/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /* Escape closes modal */

        if (
            event.key === "Escape" &&
            !taskModal.classList.contains("hidden")
        ) {

            closeModal();

        }


        /* Ctrl + K focuses search */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);


/* =========================================
   INITIAL RENDER
========================================= */

renderTasks();

updateStatistics();