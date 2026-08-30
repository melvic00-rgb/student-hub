/* =====================================================
   STUDENT HUB JAVASCRIPT
===================================================== */


/* ================= NAVIGATION ================= */

const pages =
    document.querySelectorAll(".page");

const navButtons =
    document.querySelectorAll(".nav-btn");


function openPage(pageName) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    const selected =
        document.getElementById(pageName);

    if(selected) {

        selected.classList.add(
            "active-page"
        );

    }


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openPage(
                button.dataset.page
            );

        }
    );

});


document.querySelectorAll(
    "[data-page-link]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openPage(
                button.dataset.pageLink
            );

        }
    );

});


/* ================= DATE ================= */

const now = new Date();


document.getElementById(
    "currentDate"
).textContent =
now.toLocaleDateString(
    "en-US",
    {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }
);


const hour =
new Date().getHours();


let greeting =
"Good evening!";


if(hour < 12) {

    greeting =
    "Good morning!";

}
else if(hour < 18) {

    greeting =
    "Good afternoon!";

}


document.getElementById(
    "greeting"
).textContent =
greeting;


/* ================= SCHEDULE ================= */

const schedule = {

    Monday: [

        {
            name: "INFOSYS 01",
            start: "07:00",
            end: "08:30",
            room: "ICT-1"
        },

        {
            name: "ICT 01",
            start: "11:00",
            end: "12:00",
            room: "ICT-1"
        },

        {
            name: "COMPUTER PROGRAMMING 1",
            start: "14:00",
            end: "16:00",
            room: "ICT-1"
        }

    ],


    Tuesday: [

        {
            name: "ICT 01 Laboratory",
            start: "08:00",
            end: "11:00",
            room: "CE-16 Lab"
        },

        {
            name: "GE 09",
            start: "13:00",
            end: "14:30",
            room: "LED-8"
        }

    ],


    Wednesday: [

        {
            name: "INFOSYS 01",
            start: "07:00",
            end: "08:30",
            room: "ICT-1"
        },

        {
            name: "PE 01",
            start: "09:00",
            end: "11:00",
            room: "GYM"
        },

        {
            name: "ICT 01",
            start: "11:00",
            end: "12:00",
            room: "ICT-1"
        }

    ],


    Thursday: [

        {
            name: "INFOSYS 02 Laboratory",
            start: "07:00",
            end: "10:00",
            room: "CE Lab-10"
        },

        {
            name: "INFOSYS 02",
            start: "10:00",
            end: "13:00",
            room: "CE Lab-10"
        },

        {
            name: "GE 09",
            start: "13:00",
            end: "14:30",
            room: "LED-8"
        }

    ],


    Friday: [

        {
            name: "GEMST 03",
            start: "07:00",
            end: "09:00",
            room: "CE-12"
        },

        {
            name: "GEMST 03",
            start: "15:30",
            end: "17:00",
            room: "ICT-1"
        }

    ]

};


const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


function formatTime(time) {

    let [hour, minute] =
        time.split(":").map(Number);


    const suffix =
        hour >= 12 ? "PM" : "AM";


    hour =
        hour % 12 || 12;


    return (
        hour +
        ":" +
        String(minute).padStart(2, "0") +
        " " +
        suffix
    );

}


/* ================= TODAY ================= */

function renderToday() {

    const today =
        dayNames[new Date().getDay()];


    const classes =
        schedule[today] || [];


    const container =
        document.getElementById(
            "todayClasses"
        );


    container.innerHTML = "";


    if(classes.length === 0) {

        container.innerHTML =
            `<div class="empty">
                🎉 No classes today!
            </div>`;

        return;

    }


    classes.forEach(item => {

        const div =
            document.createElement("div");


        div.className =
            "today-class";


        div.innerHTML = `

            <strong>
                ${item.name}
            </strong>

            <span>
                ${formatTime(item.start)}
                –
                ${formatTime(item.end)}
                • 📍 ${item.room}
            </span>

        `;


        container.appendChild(div);

    });

}


renderToday();


/* ================= NEXT CLASS ================= */

function updateNextClass() {

    const now =
        new Date();


    let next = null;


    for(let offset = 0; offset < 7; offset++) {

        const dayIndex =
            (now.getDay() + offset) % 7;


        const day =
            dayNames[dayIndex];


        const classes =
            schedule[day] || [];


        for(const item of classes) {

            const target =
                new Date(now);


            target.setDate(
                now.getDate() + offset
            );


            const [hour, minute] =
                item.start
                .split(":")
                .map(Number);


            target.setHours(
                hour,
                minute,
                0,
                0
            );


            if(target > now) {

                next = {
                    ...item,
                    time: target
                };

                break;

            }

        }


        if(next) break;

    }


    if(!next) return;


    document.getElementById(
        "nextClassName"
    ).textContent =
        next.name;


    document.getElementById(
        "nextClassInfo"
    ).textContent =
        `${formatTime(next.start)}
        – ${formatTime(next.end)}
        • 📍 ${next.room}`;


    const difference =
        next.time - now;


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    let text = "";


    if(days > 0) {

        text += days + "d ";

    }


    text +=
        String(hours).padStart(2, "0")
        + ":"
        + String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0");


    document.getElementById(
        "countdown"
    ).textContent =
        text;

}


updateNextClass();


setInterval(
    updateNextClass,
    1000
);


/* ================= TASKS ================= */

let tasks =
    JSON.parse(
        localStorage.getItem(
            "studentTasks"
        )
    ) || [];


const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );


addTaskBtn.addEventListener(
    "click",
    addTask
);


function addTask() {

    const name =
        document.getElementById(
            "taskName"
        ).value.trim();


    const subject =
        document.getElementById(
            "taskSubject"
        ).value;


    const date =
        document.getElementById(
            "taskDate"
        ).value;


    const priority =
        document.getElementById(
            "taskPriority"
        ).value;


    if(!name) {

        alert(
            "Please enter an assignment name."
        );

        return;

    }


    tasks.push({

        id: Date.now(),

        name,

        subject,

        date,

        priority,

        completed: false

    });


    saveTasks();


    document.getElementById(
        "taskName"
    ).value = "";


    document.getElementById(
        "taskDate"
    ).value = "";


    renderTasks();

}


function saveTasks() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

}


function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if(task) {

        task.completed =
            !task.completed;

    }


    saveTasks();

    renderTasks();

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}


function renderTasks() {

    const list =
        document.getElementById(
            "taskList"
        );


    const dashboard =
        document.getElementById(
            "dashboardTasks"
        );


    list.innerHTML = "";

    dashboard.innerHTML = "";


    if(tasks.length === 0) {

        list.innerHTML =
            `<div class="empty">
                No assignments yet 🎉
            </div>`;


        dashboard.innerHTML =
            `<div class="empty">
                You're all caught up! 🎉
            </div>`;

    }


    tasks.sort((a,b) => {

        if(!a.date) return 1;

        if(!b.date) return -1;

        return a.date.localeCompare(
            b.date
        );

    });


    tasks.forEach(task => {

        const item =
            document.createElement("div");


        item.className =
            "task-item " +
            (task.completed
                ? "done"
                : "");


        item.innerHTML = `

            <input
                class="task-check"
                type="checkbox"
                ${task.completed
                    ? "checked"
                    : ""}
            >

            <div class="task-content">

                <strong>
                    ${task.name}
                </strong>

                <small>
                    ${task.subject}
                    ${task.date
                        ? " • Due: " + task.date
                        : ""}
                    • ${task.priority}
                </small>

            </div>

            <button
                class="delete-btn">
                ×
            </button>

        `;


        item.querySelector(
            ".task-check"
        ).addEventListener(
            "change",
            () => toggleTask(task.id)
        );


        item.querySelector(
            ".delete-btn"
        ).addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        list.appendChild(item);

    });


    tasks
        .filter(task => !task.completed)
        .slice(0, 4)
        .forEach(task => {

            const item =
                document.createElement("div");


            item.className =
                "today-class";


            item.innerHTML = `

                <strong>
                    ${task.name}
                </strong>

                <span>
                    ${task.subject}
                    ${task.date
                        ? " • Due: " + task.date
                        : ""}
                </span>

            `;


            dashboard.appendChild(item);

        });


    updateTaskStats();

}


function updateTaskStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const progress =
        total === 0
            ? 0
            : Math.round(
                completed / total * 100
            );


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    document.getElementById(
        "taskProgress"
    ).textContent =
        progress + "%";


    document.getElementById(
        "taskSummary"
    ).textContent =
        `${completed}/${total} completed`;

}


renderTasks();


/* ================= SUBJECT NOTES ================= */

const noteSubject =
    document.getElementById(
        "noteSubject"
    );


const notesBox =
    document.getElementById(
        "notesBox"
    );


function loadNotes() {

    const subject =
        noteSubject.value;


    notesBox.value =
        localStorage.getItem(
            "notes_" + subject
        ) || "";

}


function saveNotes() {

    const subject =
        noteSubject.value;


    localStorage.setItem(
        "notes_" + subject,
        notesBox.value
    );

}


noteSubject.addEventListener(
    "change",
    loadNotes
);


notesBox.addEventListener(
    "input",
    saveNotes
);


loadNotes();


/* SUBJECT → NOTES */

document.querySelectorAll(
    "[data-note]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const subject =
                button.dataset.note;


            noteSubject.value =
                subject;


            loadNotes();


            openPage("notes");

        }
    );

});


/* ================= GRADE CALCULATOR ================= */

document.getElementById(
    "calculateGradeBtn"
).addEventListener(
    "click",
    calculateGrade
);


function calculateGrade() {

    const activity =
        Number(
            document.getElementById(
                "activityScore"
            ).value
        );


    const quiz =
        Number(
            document.getElementById(
                "quizScore"
            ).value
        );


    const exam =
        Number(
            document.getElementById(
                "examScore"
            ).value
        );


    if(
        activity < 0 ||
        activity > 100 ||
        quiz < 0 ||
        quiz > 100 ||
        exam < 0 ||
        exam > 100
    ) {

        alert(
            "Please enter scores from 0 to 100."
        );

        return;

    }


    /*
        Current weighting:

        Activities = 30%
        Quizzes    = 30%
        Exam       = 40%
    */


    const finalGrade =
        activity * .30 +
        quiz * .30 +
        exam * .40;


    document.getElementById(
        "finalGrade"
    ).textContent =
        finalGrade.toFixed(2);


    let message;


    if(finalGrade >= 90) {

        message =
            "Excellent work! 🔥";

    }
    else if(finalGrade >= 85) {

        message =
            "Very good! Keep it up! 💪";

    }
    else if(finalGrade >= 75) {

        message =
            "Passing! Keep improving. 👍";

    }
    else {

        message =
            "Keep studying. You can improve! 📚";

    }


    document.getElementById(
        "gradeMessage"
    ).textContent =
        message;

}


/* ================= QUIZ ================= */

const questions = [

    {
        question:
            "What does HTML stand for?",

        options: [

            "Hyper Text Markup Language",

            "High Tech Modern Language",

            "Hyperlink Text Management Language",

            "Home Tool Markup Language"

        ],

        answer: 0

    },


    {
        question:
            "Which language is used to style webpages?",

        options: [

            "HTML",

            "CSS",

            "Python",

            "SQL"

        ],

        answer: 1

    },


    {
        question:
            "Which language adds interactivity to webpages?",

        options: [

            "HTML",

            "CSS",

            "JavaScript",

            "SQL"

        ],

        answer: 2

    },


    {
        question:
            "What does CPU stand for?",

        options: [

            "Central Processing Unit",

            "Computer Personal Unit",

            "Central Program Utility",

            "Computer Processing Utility"

        ],

        answer: 0

    },


    {
        question:
            "Which computer bus carries actual data?",

        options: [

            "Address Bus",

            "Data Bus",

            "Power Bus",

            "Control Bus"

        ],

        answer: 1

    }

];


let quizIndex = 0;

let quizScore = 0;


function renderQuiz() {

    const area =
        document.getElementById(
            "quizArea"
        );


    if(
        quizIndex >= questions.length
    ) {

        area.innerHTML = `

            <div class="quiz-question"
                 style="text-align:center">

                🎉 Quiz Complete!

            </div>

            <div class="grade-result">

                <span>Your Score</span>

                <strong>
                    ${quizScore}/${questions.length}
                </strong>

                <small>
                    ${Math.round(
                        quizScore /
                        questions.length *
                        100
                    )}%
                </small>

            </div>

            <br>

            <button
                class="primary-btn"
                id="restartQuiz">

                Try Again

            </button>

        `;


        document.getElementById(
            "restartQuiz"
        ).addEventListener(
            "click",
            restartQuiz
        );


        return;

    }


    const question =
        questions[quizIndex];


    area.innerHTML = `

        <p class="eyebrow">
            QUESTION ${quizIndex + 1}
            OF ${questions.length}
        </p>

        <div class="quiz-question">

            ${question.question}

        </div>

        <div id="options"></div>

    `;


    const options =
        document.getElementById(
            "options"
        );


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                String.fromCharCode(
                    65 + index
                ) +
                ". " +
                option;


            button.addEventListener(
                "click",
                () => {

                    if(
                        index ===
                        question.answer
                    ) {

                        quizScore++;

                    }


                    quizIndex++;

                    renderQuiz();

                }
            );


            options.appendChild(
                button
            );

        }
    );

}


function restartQuiz() {

    quizIndex = 0;

    quizScore = 0;

    renderQuiz();

}


renderQuiz();


/* ================= BUDGET ================= */

let allowance =
    Number(
        localStorage.getItem(
            "allowance"
        )
    ) || 0;


let expenses =
    JSON.parse(
        localStorage.getItem(
            "expenses"
        )
    ) || [];


document.getElementById(
    "saveAllowanceBtn"
).addEventListener(
    "click",
    saveAllowance
);


function saveAllowance() {

    const value =
        Number(
            document.getElementById(
                "allowanceInput"
            ).value
        );


    if(value < 0) return;


    allowance = value;


    localStorage.setItem(
        "allowance",
        allowance
    );


    document.getElementById(
        "allowanceInput"
    ).value = "";


    renderBudget();

}


document.getElementById(
    "addExpenseBtn"
).addEventListener(
    "click",
    addExpense
);


function addExpense() {

    const name =
        document.getElementById(
            "expenseName"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "expenseAmount"
            ).value
        );


    if(!name || amount <= 0) {

        alert(
            "Please enter a valid expense."
        );

        return;

    }


    expenses.push({

        id: Date.now(),

        name,

        amount

    });


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    document.getElementById(
        "expenseName"
    ).value = "";


    document.getElementById(
        "expenseAmount"
    ).value = "";


    renderBudget();

}


function deleteExpense(id) {

    expenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    renderBudget();

}


function renderBudget() {

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );


    const remaining =
        allowance - total;


    document.getElementById(
        "allowanceDisplay"
    ).textContent =
        "₱" +
        allowance.toFixed(2);


    document.getElementById(
        "expenseDisplay"
    ).textContent =
        "₱" +
        total.toFixed(2);


    document.getElementById(
        "remainingDisplay"
    ).textContent =
        "₱" +
        remaining.toFixed(2);


    const list =
        document.getElementById(
            "expenseList"
        );


    list.innerHTML = "";


    if(expenses.length === 0) {

        list.innerHTML =
            `<div class="empty">
                No expenses yet.
            </div>`;

        return;

    }


    expenses.forEach(expense => {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "expense-row";


        row.innerHTML = `

            <span>
                ${expense.name}
            </span>

            <strong>
                ₱${expense.amount.toFixed(2)}
            </strong>

            <button
                class="delete-btn">
                ×
            </button>

        `;


        row.querySelector(
            ".delete-btn"
        ).addEventListener(
            "click",
            () =>
                deleteExpense(
                    expense.id
                )
        );


        list.appendChild(row);

    });

}


renderBudget();


/* ================= DARK MODE ================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        dark
    );

}


document.getElementById(
    "themeBtn"
).addEventListener(
    "click",
    toggleTheme
);


document.getElementById(
    "mobileTheme"
).addEventListener(
    "click",
    toggleTheme
);


if(
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

}


/* ================= AUTO REFRESH ================= */

setInterval(() => {

    renderToday();

}, 60000);

/* =====================================================
   PWA SERVICE WORKER
===================================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(registration => {

                    console.log(
                        "Student Hub PWA ready!",
                        registration.scope
                    );

                })
                .catch(error => {

                    console.error(
                        "Service Worker registration failed:",
                        error
                    );

                });

        }
    );

}

// Register Student Hub as a PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("Student Hub PWA is ready!");
            })
            .catch(error => {
                console.error("PWA error:", error);
            });
    });
}

/* =====================================================
   PREMIUM PWA FEATURES
===================================================== */


/* ================= SPLASH SCREEN ================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const splash =
            document.getElementById(
                "splashScreen"
            );

        if (splash) {

            splash.classList.add(
                "hide"
            );

        }

    }, 1000);

});


/* ================= CONNECTION STATUS ================= */

const connectionStatus =
    document.getElementById(
        "connectionStatus"
    );

const connectionText =
    document.getElementById(
        "connectionText"
    );


function updateConnectionStatus() {

    if (!connectionStatus) return;


    if (navigator.onLine) {

        connectionStatus.classList.remove(
            "offline"
        );

        connectionText.textContent =
            "Online";

    } else {

        connectionStatus.classList.add(
            "offline"
        );

        connectionText.textContent =
            "Offline";

    }

}


window.addEventListener(
    "online",
    updateConnectionStatus
);


window.addEventListener(
    "offline",
    updateConnectionStatus
);


updateConnectionStatus();


/* ================= MOBILE NAVIGATION ================= */

const mobileNavButtons =
    document.querySelectorAll(
        ".mobile-nav-btn"
    );


mobileNavButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const page =
                button.dataset.page;


            openPage(page);


            mobileNavButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );

        }
    );

});


/* Keep mobile navigation synchronized */

const originalOpenPage =
    window.openPage;


/* ================= INSTALL PROMPT ================= */

let deferredInstallPrompt = null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredInstallPrompt =
            event;

        console.log(
            "Student Hub can be installed."
        );

    }
);


window.addEventListener(
    "appinstalled",
    () => {

        deferredInstallPrompt = null;

        console.log(
            "Student Hub installed successfully!"
        );

    }
);