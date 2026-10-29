const doctors = [
  {id:"d1",name:"Dr. Ananya Rao",initials:"AR",department:"Cardiology",experience:"12 years experience",time:"9:00 AM – 1:00 PM",fee:500,rating:"4.9"},
  {id:"d2",name:"Dr. Karthik Menon",initials:"KM",department:"General Medicine",experience:"9 years experience",time:"10:00 AM – 2:00 PM",fee:300,rating:"4.8"},
  {id:"d3",name:"Dr. Meera Iyer",initials:"MI",department:"Dermatology",experience:"8 years experience",time:"11:00 AM – 4:00 PM",fee:400,rating:"4.9"},
  {id:"d4",name:"Dr. Rahul Sharma",initials:"RS",department:"Pediatrics",experience:"10 years experience",time:"9:30 AM – 12:30 PM",fee:350,rating:"4.7"}
];
let appointments = JSON.parse(localStorage.getItem("qlesAppointments") || "[]");
let chosenRating = 5;
const $ = id => document.getElementById(id);
const today = new Date();
$("visitDate").min = today.toISOString().slice(0,10);
$("visitDate").value = today.toISOString().slice(0,10);

function save(){localStorage.setItem("qlesAppointments",JSON.stringify(appointments));}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600);}
function renderDoctors(){
  const query=$("searchDoctor").value.toLowerCase().trim(), dep=$("departmentFilter").value;
  const filtered=doctors.filter(d=>(dep==="all"||d.department===dep)&&(`${d.name} ${d.department}`).toLowerCase().includes(query));
  $("doctorGrid").innerHTML=filtered.length?filtered.map(d=>`<article class="doctor-card"><div class="doctor-avatar">${d.initials}</div><h3>${d.name}</h3><div class="doctor-specialty">${d.department}</div><div class="doctor-meta">★ ${d.rating} patient rating<br>${d.experience}<br>Available: ${d.time}</div><div class="doctor-bottom"><div class="fee">₹${d.fee}<small>consultation fee</small></div><button class="btn btn-primary" data-book="${d.id}">Book slot</button></div></article>`).join(""):`<div class="empty-state">No doctors match your search.</div>`;
}
function renderAppointments(){
  const active=appointments.filter(a=>a.status==="Booked");
  $("activeCount").textContent=active.length;$("appointmentBadge").textContent=appointments.length;
  $("appointmentList").innerHTML=appointments.length?appointments.slice().reverse().map(a=>`<article class="appointment-item"><div class="appointment-avatar">${a.initials}</div><div class="appointment-details"><strong>${a.doctor}</strong><span>${a.department} · ${a.date} · ${a.time}</span><span>${a.queue} · ₹${a.fee} demo payment</span><span class="status ${a.status==="Cancelled"?"cancelled":""}">${a.status}</span></div>${a.status==="Booked"?`<button class="cancel-btn" data-cancel="${a.id}">Cancel</button>`:""}</article>`).join(""):`<div class="empty-state"><span>▤</span><strong>No appointments yet</strong><p>Choose a doctor above to book your first slot.</p></div>`;
}
function openBooking(id){
  const d=doctors.find(x=>x.id===id);if(!d)return;
  $("doctorId").value=d.id;$("selectedDoctorInfo").innerHTML=`<strong>${d.name}</strong><span>${d.department} · ${d.experience} · ${d.time}</span>`;
  $("feeAmount").textContent=`₹${d.fee}`;$("bookingMessage").textContent="";$("bookingDialog").showModal();
}
$("doctorGrid").addEventListener("click",e=>{const b=e.target.closest("[data-book]");if(b)openBooking(b.dataset.book);});
$("closeDialog").addEventListener("click",()=>$("bookingDialog").close());
$("searchDoctor").addEventListener("input",renderDoctors);$("departmentFilter").addEventListener("change",renderDoctors);
$("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();const d=doctors.find(x=>x.id===$("doctorId").value);
  if(!$("patientName").value.trim()||!$("patientPhone").value.trim())return;
  const id=Date.now(), queue=`Q-${String(15+appointments.length).padStart(3,"0")}`;
  appointments.push({id,doctor:d.name,initials:d.initials,department:d.department,fee:d.fee,date:$("visitDate").value,time:$("visitTime").value,patient:$("patientName").value.trim(),phone:$("patientPhone").value.trim(),queue,status:"Booked"});
  save();renderAppointments();$("heroQueue").textContent=queue;$("heroWait").textContent=`${12+appointments.length*3} minutes`;
  $("bookingDialog").close();$("bookingForm").reset();$("visitDate").value=today.toISOString().slice(0,10);toast(`Booking confirmed! Demo payment successful. Queue ${queue}`);
});
$("appointmentList").addEventListener("click",e=>{
  const b=e.target.closest("[data-cancel]");if(!b)return;
  const a=appointments.find(x=>String(x.id)===b.dataset.cancel);if(!a)return;
  if(confirm(`Cancel appointment with ${a.doctor}?`)){a.status="Cancelled";save();renderAppointments();toast("Appointment cancelled in the demo.");}
});
$("trackForm").addEventListener("submit",e=>{
  e.preventDefault();const q=$("queueInput").value.trim().toUpperCase();if(!q)return;
  const a=appointments.find(x=>x.queue.toUpperCase()===q&&x.status==="Booked");
  const number=Math.max(1,parseInt(q.replace(/\D/g,""),10)||14), ahead=Math.max(0,(number%7)-1), wait=ahead*6+6;
  $("trackResult").innerHTML=`<div class="track-big">${q.replace(/[<>]/g,"")}</div><div><strong>${a?"Appointment found":"Queue estimate: "+wait+" min"}</strong><p>${a?`Booked for ${a.patient} · ${a.doctor}`:`Approximately ${ahead} patient(s) ahead. This is a simulated estimate.`}</p></div>`;
});
document.querySelectorAll(".star").forEach(btn=>btn.addEventListener("click",()=>{
  chosenRating=Number(btn.dataset.rating);document.querySelectorAll(".star").forEach(s=>s.classList.toggle("selected",Number(s.dataset.rating)<=chosenRating));
}));
$("ratingForm").addEventListener("submit",e=>{e.preventDefault();$("ratingMessage").textContent=`Thank you! Your ${chosenRating}-star demo rating has been recorded in this session.`;$("ratingFeedback").value="";$("ratingName").value="";toast("Thanks for your feedback!");});
$("resetDemo").addEventListener("click",()=>{if(confirm("Clear all QLES demo appointments from this browser?")){appointments=[];save();renderAppointments();$("heroQueue").textContent="Q-014";$("heroWait").textContent="18 minutes";toast("Demo data reset.");}});
renderDoctors();renderAppointments();
