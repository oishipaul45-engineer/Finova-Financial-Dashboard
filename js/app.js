import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN",{maximumFractionDigits:2});
const today = () => new Date().toISOString().slice(0,10);

let currentUser = null;
let transactions = [];
let budgets = [];
let goals = [];
let lineChart = null;
let doughnutChart = null;
let isRegister = false;

function showToast(message,type="success"){
  const el=document.createElement("div");
  el.className="toast "+type; el.textContent=message;
  $("toastContainer").appendChild(el);
  setTimeout(()=>el.remove(),3200);
}

function setAuthMode(register){
  isRegister=register;
  $("authTitle").textContent=register?"Create Your Account":"Welcome Back!";
  $("authDescription").textContent=register?"Join Finova and take control of your finances.":"Login to access your personal financial dashboard.";
  $("nameField").classList.toggle("hidden",!register);
  $("fullName").required=register;
  $("forgotRow").classList.toggle("hidden",register);
  $("authSubmit").textContent=register?"Create Account →":"Login to Finova →";
  $("switchText").textContent=register?"Already have an account?":"Don't have an account?";
  $("switchBtn").textContent=register?"Login":"Create account";
  $("authMessage").textContent="";
}
$("switchBtn").addEventListener("click",()=>setAuthMode(!isRegister));

$("authForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const email=$("email").value.trim(), password=$("password").value, name=$("fullName").value.trim();
  $("authSubmit").disabled=true; $("authSubmit").textContent="Please wait...";
  try{
    if(isRegister){
      const result=await createUserWithEmailAndPassword(auth,email,password);
      if(name) await updateProfile(result.user,{displayName:name});
      showToast("Account created successfully.");
    }else{
      await signInWithEmailAndPassword(auth,email,password);
    }
  }catch(error){
    const messages={
      "auth/email-already-in-use":"This email already has an account.",
      "auth/invalid-email":"Please enter a valid email address.",
      "auth/weak-password":"Password must contain at least 6 characters.",
      "auth/invalid-credential":"Incorrect email or password.",
      "auth/user-not-found":"No account found. Please register.",
      "auth/too-many-requests":"Too many attempts. Please try again later.",
      "auth/network-request-failed":"Network error. Check your connection."
    };
    $("authMessage").textContent=messages[error.code]||"Authentication failed. Please try again.";
  }finally{
    $("authSubmit").disabled=false;
    $("authSubmit").textContent=isRegister?"Create Account →":"Login to Finova →";
  }
});

$("forgotBtn").addEventListener("click",async()=>{
  const email=$("email").value.trim();
  if(!email){$("authMessage").textContent="Enter your email address first.";return}
  try{
    await sendPasswordResetEmail(auth,email);
    $("authMessage").className="auth-message success";
    $("authMessage").textContent="Password reset link sent to your email.";
  }catch{
    $("authMessage").className="auth-message";
    $("authMessage").textContent="Unable to send reset email. Check the address.";
  }
});

function userCollection(name){ return collection(db,"users",currentUser.uid,name); }
function userDoc(name,id){ return doc(db,"users",currentUser.uid,name,id); }

async function loadData(){
  const [txSnap,budgetSnap,goalSnap]=await Promise.all([
    getDocs(query(userCollection("transactions"),orderBy("date","desc"))),
    getDocs(userCollection("budgets")),
    getDocs(userCollection("goals"))
  ]);
  transactions=txSnap.docs.map(d=>({id:d.id,...d.data()}));
  budgets=budgetSnap.docs.map(d=>({id:d.id,...d.data()}));
  goals=goalSnap.docs.map(d=>({id:d.id,...d.data()}));
}

function monthKey(date){return String(date).slice(0,7)}
function thisMonth(){return monthKey(today())}

function getTotals(){
  const allIncome=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+Number(t.amount||0),0);
  const allExpense=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+Number(t.amount||0),0);
  const monthTx=transactions.filter(t=>monthKey(t.date)===thisMonth());
  const monthIncome=monthTx.filter(t=>t.type==="income").reduce((s,t)=>s+Number(t.amount||0),0);
  const monthExpense=monthTx.filter(t=>t.type==="expense").reduce((s,t)=>s+Number(t.amount||0),0);
  return {allIncome,allExpense,balance:allIncome-allExpense,monthIncome,monthExpense,saving:monthIncome-monthExpense};
}

function renderStats(){
  const t=getTotals();
  $("balanceValue").textContent=money(t.balance);
  $("incomeValue").textContent=money(t.monthIncome);
  $("expenseValue").textContent=money(t.monthExpense);
  $("savingValue").textContent=money(t.saving);
  $("incomeNote").textContent="Income this month";
  $("expenseNote").textContent="Expenses this month";
  $("savingNote").textContent="Monthly savings";
  $("balanceNote").textContent=`${transactions.length} transaction${transactions.length===1?"":"s"}`;
}

function categories(){
  return [...new Set(transactions.map(t=>t.category).filter(Boolean))].sort();
}
function populateCategoryFilter(){
  const current=$("categoryFilter").value;
  $("categoryFilter").innerHTML='<option value="all">All categories</option>'+
    categories().map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  if(categories().includes(current)) $("categoryFilter").value=current;
}
function escapeHtml(v){
  return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function renderTransactions(){
  const search=$("searchInput").value.toLowerCase().trim();
  const filter=$("transactionFilter").value;
  const cat=$("categoryFilter").value;
  const filtered=transactions.filter(t=>{
    const text=`${t.name||""} ${t.category||""} ${t.method||""}`.toLowerCase();
    return (!search||text.includes(search)) && (filter==="all"||t.type===filter) && (cat==="all"||t.category===cat);
  });
  if(!filtered.length){
    $("transactionBody").innerHTML='<tr><td colspan="7" class="empty-state">No transactions found. Add your first transaction to get started.</td></tr>';
    return;
  }
  $("transactionBody").innerHTML=filtered.map(t=>{
    const type=t.type==="income"?"Income":"Expense";
    return `<tr>
      <td><strong>${escapeHtml(t.name)}</strong><div class="muted" style="font-size:10px;margin-top:3px">${escapeHtml(t.method||"")}</div></td>
      <td>${formatDate(t.date)}</td>
      <td>${escapeHtml(t.category)}</td>
      <td class="${t.type}">${type}</td>
      <td><span class="status">Completed</span></td>
      <td class="${t.type}">${t.type==="income"?"+":"-"}${money(t.amount)}</td>
      <td class="action-cell">
        <button class="table-action" title="Edit" data-edit="${t.id}">✎</button>
        <button class="table-action danger" title="Delete" data-delete="${t.id}">×</button>
      </td>
    </tr>`;
  }).join("");
}
function formatDate(d){
  if(!d)return"-";
  return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}

$("transactionBody").addEventListener("click",async e=>{
  const edit=e.target.closest("[data-edit]"), del=e.target.closest("[data-delete]");
  if(edit) openTransactionModal(edit.dataset.edit);
  if(del){
    const item=transactions.find(t=>t.id===del.dataset.delete);
    if(item && confirm(`Delete "${item.name}"?`)){
      try{await deleteDoc(userDoc("transactions",item.id));transactions=transactions.filter(t=>t.id!==item.id);refreshAll();showToast("Transaction deleted.");}
      catch{showToast("Could not delete transaction.","error")}
    }
  }
});

function openModal(id){$(id).classList.add("open")}
function closeModal(id){$(id).classList.remove("open")}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)b.classList.remove("open")}));

function openTransactionModal(id=null){
  $("transactionForm").reset();$("transactionId").value=id||"";
  $("txDate").value=today();$("txType").value="expense";$("transactionModalTitle").textContent=id?"Edit Transaction":"Add Transaction";
  if(id){
    const t=transactions.find(x=>x.id===id);if(!t)return;
    $("txName").value=t.name||"";$("txAmount").value=t.amount||"";$("txType").value=t.type||"expense";
    $("txCategory").value=t.category||"";$("txDate").value=t.date||today();$("txMethod").value=t.method||"Other";$("txNotes").value=t.notes||"";
  }
  openModal("transactionModal");
}
$("addTransactionBtn").addEventListener("click",()=>openTransactionModal());

$("transactionForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const id=$("transactionId").value;
  const data={
    name:$("txName").value.trim(),amount:Number($("txAmount").value),type:$("txType").value,
    category:$("txCategory").value.trim(),date:$("txDate").value,method:$("txMethod").value,
    notes:$("txNotes").value.trim(),updatedAt:serverTimestamp()
  };
  try{
    if(id){await updateDoc(userDoc("transactions",id),data);transactions=transactions.map(t=>t.id===id?{...t,...data}:t);showToast("Transaction updated.");}
    else{const ref=await addDoc(userCollection("transactions"),{...data,createdAt:serverTimestamp()});transactions.unshift({id:ref.id,...data});showToast("Transaction added.");}
    closeModal("transactionModal");refreshAll();
  }catch(error){console.error(error);showToast("Could not save transaction. Check Firestore rules.","error")}
});

function renderBudgets(){
  if(!budgets.length){$("budgetList").innerHTML='<div class="empty-state">No budgets yet. Create one to track your spending.</div>';return}
  const expenses=transactions.filter(t=>t.type==="expense"&&monthKey(t.date)===thisMonth());
  $("budgetList").innerHTML=budgets.map(b=>{
    const spent=expenses.filter(t=>String(t.category).toLowerCase()===String(b.category).toLowerCase()).reduce((s,t)=>s+Number(t.amount||0),0);
    const limit=Number(b.amount||0), pct=limit?Math.min((spent/limit)*100,100):0, over=spent>limit;
    return `<div class="budget-item">
      <div class="budget-head"><strong>${escapeHtml(b.category)}</strong><span class="${over?"danger":""}">${money(spent)} / ${money(limit)}</span></div>
      <div class="progress"><span style="width:${pct}%;${over?"background:var(--red)":""}"></span></div>
      <div class="progress-meta"><span>${Math.round((spent/Math.max(limit,1))*100)}% used</span><button class="table-action danger" data-budget-delete="${b.id}">Remove</button></div>
    </div>`;
  }).join("");
}
$("budgetList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-budget-delete]");if(!b)return;
  if(confirm("Remove this budget?")){await deleteDoc(userDoc("budgets",b.dataset.budgetDelete));budgets=budgets.filter(x=>x.id!==b.dataset.budgetDelete);renderBudgets();renderInsights();showToast("Budget removed.")}
});
$("addBudgetBtn").addEventListener("click",()=>{$("budgetForm").reset();openModal("budgetModal")});
$("budgetForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const data={category:$("budgetCategory").value.trim(),amount:Number($("budgetAmount").value),createdAt:serverTimestamp()};
  try{const ref=await addDoc(userCollection("budgets"),data);budgets.push({id:ref.id,...data});closeModal("budgetModal");renderBudgets();renderInsights();showToast("Budget created.");}
  catch{showToast("Could not save budget.","error")}
});

function renderGoals(){
  if(!goals.length){$("goalList").innerHTML='<div class="empty-state">No savings goals yet. Add one and start planning.</div>';return}
  $("goalList").innerHTML=goals.map(g=>{
    const target=Number(g.target||0),saved=Number(g.saved||0),pct=target?Math.min(saved/target*100,100):0;
    return `<div class="goal-item">
      <div class="goal-head"><strong>${escapeHtml(g.name)}</strong><button class="table-action danger" data-goal-delete="${g.id}">×</button></div>
      <div class="goal-value">${money(saved)} of ${money(target)}</div>
      <div class="progress"><span style="width:${pct}%"></span></div>
      <div class="progress-meta"><span>${Math.round(pct)}% complete</span><span>${g.date?formatDate(g.date):"No deadline"}</span></div>
    </div>`;
  }).join("");
}
$("goalList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-goal-delete]");if(!b)return;
  if(confirm("Remove this savings goal?")){await deleteDoc(userDoc("goals",b.dataset.goalDelete));goals=goals.filter(x=>x.id!==b.dataset.goalDelete);renderGoals();showToast("Goal removed.")}
});
$("addGoalBtn").addEventListener("click",()=>{$("goalForm").reset();$("goalSaved").value=0;openModal("goalModal")});
$("goalForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const data={name:$("goalName").value.trim(),target:Number($("goalTarget").value),saved:Number($("goalSaved").value||0),date:$("goalDate").value,createdAt:serverTimestamp()};
  try{const ref=await addDoc(userCollection("goals"),data);goals.push({id:ref.id,...data});closeModal("goalModal");renderGoals();showToast("Savings goal created.");}
  catch{showToast("Could not save goal.","error")}
});

function renderInsights(){
  const t=getTotals(), expenseTx=transactions.filter(x=>x.type==="expense");
  const byCat={};expenseTx.forEach(x=>byCat[x.category]=(byCat[x.category]||0)+Number(x.amount||0));
  const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  const savingRate=t.monthIncome?Math.round(t.saving/t.monthIncome*100):0;
  const over=budgets.filter(b=>{
    const spent=expenseTx.filter(x=>monthKey(x.date)===thisMonth()&&x.category.toLowerCase()===b.category.toLowerCase()).reduce((s,x)=>s+Number(x.amount||0),0);
    return spent>Number(b.amount);
  });
  const cards=[];
  cards.push({e:"💡",h:"Savings rate",p:t.monthIncome?`You are saving ${savingRate}% of this month's income.`:"Add income to see your savings rate."});
  cards.push({e:"📊",h:"Top expense",p:top?`${top[0]} is your largest spending category at ${money(top[1])}.`:"Add expenses to discover your spending pattern."});
  cards.push({e:over.length?"⚠️":"🎯",h:over.length?"Budget alert":"On track",p:over.length?`${over.length} budget${over.length>1?"s are":" is"} over the monthly limit.`:"No budget is currently over its limit."});
  $("insights").innerHTML=cards.map(c=>`<div class="insight"><div class="emoji">${c.e}</div><h4>${c.h}</h4><p>${c.p}</p></div>`).join("");
}

function dateDiffDays(a,b){return Math.round((new Date(b)-new Date(a))/86400000)}
function buildChartData(period){
  const now=new Date(), labels=[], income=[], expense=[];
  if(period==="weekly"){
    for(let i=6;i>=0;i--){
      const d=new Date(now);d.setDate(now.getDate()-i);const key=d.toISOString().slice(0,10);
      labels.push(d.toLocaleDateString("en-IN",{weekday:"short"}));
      income.push(sumForDate(key,"income"));expense.push(sumForDate(key,"expense"));
    }
  }else if(period==="yearly"){
    for(let i=5;i>=0;i--){
      const y=now.getFullYear()-i;labels.push(String(y));
      income.push(transactions.filter(t=>String(t.date).startsWith(y+"-")&&t.type==="income").reduce((s,t)=>s+Number(t.amount||0),0));
      expense.push(transactions.filter(t=>String(t.date).startsWith(y+"-")&&t.type==="expense").reduce((s,t)=>s+Number(t.amount||0),0));
    }
  }else{
    for(let i=5;i>=0;i--){
      const d=new Date(now.getFullYear(),now.getMonth()-i,1), key=d.toISOString().slice(0,7);
      labels.push(d.toLocaleDateString("en-IN",{month:"short"}));
      income.push(transactions.filter(t=>monthKey(t.date)===key&&t.type==="income").reduce((s,t)=>s+Number(t.amount||0),0));
      expense.push(transactions.filter(t=>monthKey(t.date)===key&&t.type==="expense").reduce((s,t)=>s+Number(t.amount||0),0));
    }
  }
  return {labels,income,expense};
}
function sumForDate(date,type){return transactions.filter(t=>t.date===date&&t.type===type).reduce((s,t)=>s+Number(t.amount||0),0)}

function updateCharts(){
  const light=document.body.classList.contains("light");
  Chart.defaults.color=light?"#64748b":"#91a3bf";
  const d=buildChartData($("periodFilter").value);
  if(lineChart)lineChart.destroy();if(doughnutChart)doughnutChart.destroy();
  lineChart=new Chart($("lineChart"),{
    type:"line",data:{labels:d.labels,datasets:[
      {label:"Income",data:d.income,borderColor:"#168cff",backgroundColor:"rgba(22,140,255,.12)",fill:true,tension:.35,borderWidth:2,pointRadius:3},
      {label:"Expenses",data:d.expense,borderColor:"#ff5577",backgroundColor:"rgba(255,85,119,.04)",fill:true,tension:.35,borderWidth:2,pointRadius:3}
    ]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{intersect:false,mode:"index"},
      plugins:{legend:{position:"bottom",labels:{usePointStyle:true,padding:18}}},
      scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:light?"#e8eef7":"rgba(145,163,191,.1)"}}}}
  });

  const byCat={};
  transactions.filter(t=>t.type==="expense").forEach(t=>byCat[t.category]=(byCat[t.category]||0)+Number(t.amount||0));
  let entries=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  if(!entries.length)entries=[["No expenses",1]];
  doughnutChart=new Chart($("doughnutChart"),{
    type:"doughnut",data:{labels:entries.map(x=>x[0]),datasets:[{data:entries.map(x=>x[1]),backgroundColor:["#168cff","#00e6a0","#54b5ff","#ffc857","#ff5577","#8b7cff","#46c7a7","#6f8cae"],borderWidth:0,hoverOffset:7}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:"70%",plugins:{legend:{position:"bottom",labels:{usePointStyle:true,padding:13}}}}
  });
}
$("periodFilter").addEventListener("change",updateCharts);

function refreshAll(){
  renderStats();populateCategoryFilter();renderTransactions();renderBudgets();renderGoals();renderInsights();updateCharts();
}

$("searchInput").addEventListener("input",renderTransactions);
$("transactionFilter").addEventListener("change",renderTransactions);
$("categoryFilter").addEventListener("change",renderTransactions);

function applyTheme(theme){
  document.body.classList.toggle("light",theme==="light");
  $("themeBtn").textContent=theme==="light"?"☾ Dark mode":"☼ Light mode";
  updateCharts();
}
applyTheme(localStorage.getItem("finovaTheme")||"dark");
function toggleTheme(){
  const next=document.body.classList.contains("light")?"dark":"light";
  localStorage.setItem("finovaTheme",next);applyTheme(next);
}
$("themeBtn").addEventListener("click",toggleTheme);
$("themeLink").addEventListener("click",e=>{e.preventDefault();toggleTheme()});

$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav a[href^='#']").forEach(a=>a.addEventListener("click",()=>{
  document.querySelectorAll(".nav a").forEach(x=>x.classList.remove("active"));a.classList.add("active");$("sidebar").classList.remove("open");
}));

$("exportBtn").addEventListener("click",()=>{
  const headers=["Name","Date","Category","Type","Payment Method","Amount","Notes"];
  const rows=transactions.map(t=>[t.name,t.date,t.category,t.type,t.method||"",t.amount,t.notes||""]);
  const csv=[headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="finova-transactions.csv";a.click();URL.revokeObjectURL(url);
  showToast("Transactions exported.");
});

$("notificationBtn").addEventListener("click",()=>{
  const over=budgets.filter(b=>{
    const spent=transactions.filter(t=>t.type==="expense"&&monthKey(t.date)===thisMonth()&&t.category.toLowerCase()===b.category.toLowerCase()).reduce((s,t)=>s+Number(t.amount||0),0);
    return spent>Number(b.amount);
  });
  showToast(over.length?`${over.length} budget alert${over.length>1?"s":""} need attention.`:"You're all clear — no budget alerts.");
});

$("logoutBtn").addEventListener("click",async()=>{try{await signOut(auth)}catch{showToast("Could not log out.","error")}});

onAuthStateChanged(auth,async user=>{
  currentUser=user;
  if(user){
    $("authPage").style.display="none";$("dashboard").style.display="block";
    const name=user.displayName||user.email.split("@")[0];
    $("welcomeName").textContent=`Welcome, ${name}!`;
    $("greeting").textContent="Here is your personal financial overview.";
    $("profileInitial").textContent=name.charAt(0).toUpperCase();
    document.title=`Finova | ${name}`;
    try{await loadData();refreshAll()}catch(error){
      console.error(error);
      showToast("Could not load your data. Check Firestore rules/indexes.","error");
      refreshAll();
    }
  }else{
    $("dashboard").style.display="none";$("authPage").style.display="flex";
    transactions=[];budgets=[];goals=[];
  }
});
