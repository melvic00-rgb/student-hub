
const KEY = "studentHubDataV1";
const subjects = ["INFOSYS 01","INFOSYS 02","ICT 01","COMPUTER PROGRAMMING 1","GE 09","PE 01","GEMST 03"];

const schedule = {
  1:[["INFOSYS 01","07:00","08:30","ICT-1"],["ICT 01","11:00","12:00","ICT-1"],["COMPUTER PROGRAMMING 1","14:00","16:00","ICT-1"]],
  2:[["ICT 01","08:00","11:00","CE-16 Lab"],["GE 09","13:00","14:30","LED-8"]],
  3:[["INFOSYS 01","07:00","08:30","ICT-1"],["PE 01","09:00","11:00","GYM"],["ICT 01","11:00","12:00","ICT-1"]],
  4:[["INFOSYS 02","07:00","10:00","CE Lab-10"],["INFOSYS 02","10:00","13:00","CE Lab-10"],["GE 09","13:00","14:30","LED-8"]],
  5:[["GEMST 03","07:00","09:00","CE-12"],["GEMST 03","15:30","17:00","ICT-1"]]
};

const quiz = [
 ["What does CPU stand for?",["Central Processing Unit","Computer Personal Unit","Control Program Utility"],0],
 ["Which memory is volatile?",["RAM","ROM","SSD"],0],
 ["Which language is commonly used for web page structure?",["HTML","SQL","Python"],0],
 ["What does URL mean?",["Uniform Resource Locator","Universal Routing Link","User Resource List"],0],
 ["Which one is an operating system?",["Windows","HTML","Ethernet"],0]
];

let data = JSON.parse(localStorage.getItem(KEY) || '{"tasks":[],"allowance":0,"expenses":[],"notes":{},"theme":"light"}');
const save = ()=>localStorage.setItem(KEY,JSON.stringify(data));
const $ = id=>document.getElementById(id);

function money(n){return "₱"+Number(n||0).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active-page",p.id===id));
  document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.pageLink)));
document.querySelectorAll("[data-note]").forEach(b=>b.addEventListener("click",()=>{showPage("notes");$("noteSubject").value=b.dataset.note;loadNote()}));

function updateConnection(){
  const online=navigator.onLine;
  $("connectionText").textContent=online?"Online":"Offline";
  $("connectionStatus").className=online?"connection-online":"connection-offline";
}
addEventListener("online",updateConnection); addEventListener("offline",updateConnection);

function updateDashboard(){
  const total=data.tasks.length, done=data.tasks.filter(t=>t.done).length;
  $("totalTasks").textContent=total; $("completedTasks").textContent=done;
  $("taskProgress").textContent=total?Math.round(done/total*100)+"%":"0%";
  const now=new Date(), day=now.getDay(), classes=schedule[day]||[];
  $("todayClasses").innerHTML=classes.length?classes.map(c=>`<div class="class-card"><strong>${c[0]}</strong><span>${c[1]} – ${c[2]}</span><small>📍 ${c[3]}</small></div>`).join(""):"<p style='color:var(--muted)'>No classes today.</p>";
  $("dashboardTasks").innerHTML=data.tasks.filter(t=>!t.done).slice(0,5).map(t=>`<div class="task-row"><span>${escapeHtml(t.name)}<small style="display:block;color:var(--muted)">${t.subject} • ${t.date||"No date"}</small></span></div>`).join("")||"<p style='color:var(--muted)'>No upcoming assignments.</p>";
}
function updateNextClass(){
  const now=new Date(), day=now.getDay(), list=schedule[day]||[];
  const mins=now.getHours()*60+now.getMinutes();
  let next=list.find(c=>{let [h,m]=c[1].split(":").map(Number);return h*60+m>mins});
  if(next){$("nextClassName").textContent=next[0];$("nextClassInfo").textContent=`${next[1]} – ${next[2]} • 📍 ${next[3]}`; 
    const [h,m]=next[1].split(":").map(Number), target=new Date(now);target.setHours(h,m,0,0);
    let s=Math.max(0,Math.floor((target-now)/1000));$("countdown").textContent=new Date(s*1000).toISOString().slice(11,19);
  } else {$("nextClassName").textContent="No more classes";$("nextClassInfo").textContent="Enjoy the rest of your day!";$("countdown").textContent="--:--:--"}
}
function updateDate(){const d=new Date();$("currentDate").textContent=d.toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"});$("greeting").textContent=d.getHours()<12?"Good morning!":d.getHours()<18?"Good afternoon!":"Good evening!"}

function renderTasks(){
  const list=$("taskList");
  $("taskSummary").textContent=`${data.tasks.filter(t=>!t.done).length} pending`;
  list.innerHTML=data.tasks.length?data.tasks.map((t,i)=>`<div class="task-row ${t.done?"done":""}"><span><strong>${escapeHtml(t.name)}</strong><small style="display:block;color:var(--muted)">${t.subject} • ${t.date||"No date"} • ${t.priority}</small></span><div class="row-actions"><button class="small-btn" onclick="toggleTask(${i})">${t.done?"Undo":"Done"}</button><button class="danger" onclick="deleteTask(${i})">Delete</button></div></div>`).join(""):"<p style='color:var(--muted)'>No assignments yet.</p>";
}
window.toggleTask=i=>{data.tasks[i].done=!data.tasks[i].done;save();renderTasks();updateDashboard()};
window.deleteTask=i=>{data.tasks.splice(i,1);save();renderTasks();updateDashboard()};
$("addTaskBtn").onclick=()=>{const name=$("taskName").value.trim();if(!name)return alert("Enter an assignment name.");data.tasks.push({name,subject:$("taskSubject").value,date:$("taskDate").value,priority:$("taskPriority").value,done:false});save();$("taskName").value="";$("taskDate").value="";renderTasks();updateDashboard()};

function renderBudget(){
  const expenses=data.expenses.reduce((a,e)=>a+Number(e.amount),0);
  $("allowanceDisplay").textContent=money(data.allowance);$("expenseDisplay").textContent=money(expenses);$("remainingDisplay").textContent=money(Number(data.allowance)-expenses);
  $("expenseList").innerHTML=data.expenses.length?data.expenses.map((e,i)=>`<div class="expense-row"><span>${escapeHtml(e.name)}<small style="display:block;color:var(--muted)">${e.date}</small></span><div><strong>${money(e.amount)}</strong> <button class="danger" onclick="deleteExpense(${i})">Delete</button></div></div>`).join(""):"<p style='color:var(--muted)'>No expenses yet.</p>";
}
$("saveAllowanceBtn").onclick=()=>{data.allowance=Number($("allowanceInput").value)||0;save();renderBudget();$("allowanceInput").value=""};
$("addExpenseBtn").onclick=()=>{const n=$("expenseName").value.trim(),a=Number($("expenseAmount").value);if(!n||a<=0)return alert("Enter an expense name and amount.");data.expenses.push({name:n,amount:a,date:new Date().toLocaleDateString("en-PH")});save();$("expenseName").value="";$("expenseAmount").value="";renderBudget()};
window.deleteExpense=i=>{data.expenses.splice(i,1);save();renderBudget()};

function loadNote(){const s=$("noteSubject").value;$("notesBox").value=data.notes[s]||""}
$("noteSubject").onchange=loadNote;$("notesBox").oninput=()=>{data.notes[$("noteSubject").value]=$("notesBox").value;save()};
$("calculateGradeBtn").onclick=()=>{const a=Number($("activityScore").value),q=Number($("quizScore").value),e=Number($("examScore").value);if([a,q,e].some(v=>Number.isNaN(v)||v<0||v>100))return alert("Enter valid scores from 0 to 100.");const g=a*.3+q*.3+e*.4;$("finalGrade").textContent=g.toFixed(2);$("gradeMessage").textContent=g>=75?"Passing estimate":"Below passing estimate";};

let qi=0, score=0;
function renderQuiz(){const q=quiz[qi];$("quizArea").innerHTML=`<div class="eyebrow">QUESTION ${qi+1} OF ${quiz.length}</div><h2>${q[0]}</h2>${q[1].map((x,i)=>`<button class="small-btn" style="display:block;width:100%;text-align:left;margin:8px 0" onclick="answerQuiz(${i})">${escapeHtml(x)}</button>`).join("")}<p style="color:var(--muted)">Score: ${score}</p>`}
window.answerQuiz=i=>{if(i===quiz[qi][2])score++;qi++;if(qi>=quiz.length){$("quizArea").innerHTML=`<h2>Quiz complete 🎉</h2><p>Your score: <strong>${score}/${quiz.length}</strong></p><button class="primary-btn" onclick="qi=0;score=0;renderQuiz()">Try Again</button>`}else renderQuiz()};

function theme(){document.body.classList.toggle("dark",data.theme==="dark");}
$("themeBtn").onclick=$("mobileTheme").onclick=()=>{data.theme=data.theme==="dark"?"light":"dark";save();theme()};
theme();

setInterval(updateNextClass,1000);
updateConnection();updateDate();updateDashboard();updateNextClass();renderTasks();renderBudget();loadNote();renderQuiz();
setTimeout(()=>{$("splashScreen").style.display="none"},700);
