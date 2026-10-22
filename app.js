import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const authMsg = $('authMsg');
let auth, db, currentUser, notes=[], questions=[];
const validConfig = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).includes("PASTE_");
if (validConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    $('configNotice').classList.add('hidden');
    onAuthStateChanged(auth, async user => {
      currentUser = user || null;
      $('app').classList.toggle('hidden', !user);
      $('authCard').classList.toggle('hidden', !!user);
      if (user) { $('who').textContent = user.email; await loadAll(); }
    });
  } catch(e) { authMsg.textContent = 'Firebase सेटअप जाँचें: ' + e.message; }
} else { authMsg.textContent = 'पहले firebase-config.js में Firebase की config भरें।'; }

$('signup').onclick = async () => {
  if (!auth) return authMsg.textContent='पहले Firebase सेटअप करें।';
  const email=$('email').value.trim(), password=$('password').value;
  if(password.length<12) return authMsg.textContent='बेहतर सुरक्षा के लिए कम से कम 12 अक्षर का पासवर्ड रखें।';
  try { await createUserWithEmailAndPassword(auth,email,password); authMsg.textContent='खाता बन गया।'; }
  catch(e){ authMsg.textContent=humanError(e); }
};
$('login').onclick = async () => {
  if (!auth) return authMsg.textContent='पहले Firebase सेटअप करें।';
  try { await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value); authMsg.textContent=''; }
  catch(e){ authMsg.textContent=humanError(e); }
};
$('logout').onclick = () => signOut(auth);
function humanError(e){ return ({'auth/invalid-credential':'ईमेल या पासवर्ड सही नहीं है।','auth/email-already-in-use':'इस ईमेल से खाता पहले से है।','auth/invalid-email':'ईमेल सही नहीं है.','auth/too-many-requests':'बहुत प्रयास हुए। बाद में कोशिश करें।','auth/weak-password':'पासवर्ड कमजोर है।'})[e.code] || 'काम पूरा नहीं हुआ। Firebase सेटअप और इंटरनेट जाँचें।'; }

document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{['notes','questions','backup'].forEach(id=>$(id).classList.toggle('hidden',id!==b.dataset.tab));});
async function loadAll(){
  try {
    const [ns,qs]=await Promise.all([
      getDocs(collection(db,'users',currentUser.uid,'notes')),
      getDocs(collection(db,'users',currentUser.uid,'questions'))
    ]);
    notes=ns.docs.map(d=>({id:d.id,...d.data()})); questions=qs.docs.map(d=>({id:d.id,...d.data()}));
    renderNotes(); renderQuestions();
  } catch(e) { alert('डेटा नहीं खुला। Firestore Rules और इंटरनेट जाँचें।'); }
}
$('saveNote').onclick=async()=>{
  const title=$('noteTitle').value.trim(), body=$('noteBody').value.trim();
  if(!title||!body) return alert('शीर्षक और नोट्स भरें।');
  try { await addDoc(collection(db,'users',currentUser.uid,'notes'),{title,body,createdAt:serverTimestamp()}); $('noteTitle').value='';$('noteBody').value='';await loadAll(); }
  catch(e){alert('नोट सेव नहीं हुआ। सुरक्षा नियम जाँचें।');}
};
function renderNotes(){
 const root=$('noteList');root.replaceChildren();
 notes.forEach(n=>{const box=document.createElement('article');box.className='item';const h=document.createElement('h3');h.textContent=n.title;const p=document.createElement('p');p.textContent=n.body;const b=document.createElement('button');b.className='danger';b.textContent='नोट हटाएँ';b.onclick=async()=>{if(confirm('यह नोट हटाएँ?')){await deleteDoc(doc(db,'users',currentUser.uid,'notes',n.id));await loadAll();}};box.append(h,p,b);root.append(box);});
 if(!notes.length) root.textContent='अभी कोई नोट नहीं है।';
}
$('saveQuestion').onclick=async()=>{
 const question=$('qText').value.trim(), options=[0,1,2,3].map(i=>$('o'+i).value.trim()), correct=+$('correct').value, explanation=$('explanation').value.trim();
 if(!question||options.some(x=>!x))return alert('प्रश्न और चारों विकल्प भरें।');
 try{await addDoc(collection(db,'users',currentUser.uid,'questions'),{question,options,correct,explanation,createdAt:serverTimestamp()});$('qText').value='';[0,1,2,3].forEach(i=>$('o'+i).value='');$('explanation').value='';await loadAll();}
 catch(e){alert('MCQ सेव नहीं हुआ। सुरक्षा नियम जाँचें।');}
};
function renderQuestions(){const root=$('questionList');root.replaceChildren();questions.forEach(q=>{const box=document.createElement('article');box.className='item';const h=document.createElement('h3');h.textContent=q.question;const p=document.createElement('p');p.textContent=q.options.map((o,i)=>'ABCD'[i]+'. '+o).join('\n')+'\nसही उत्तर: '+'ABCD'[q.correct];const b=document.createElement('button');b.className='danger';b.textContent='MCQ हटाएँ';b.onclick=async()=>{if(confirm('यह प्रश्न हटाएँ?')){await deleteDoc(doc(db,'users',currentUser.uid,'questions',q.id));await loadAll();}};box.append(h,p);if(q.explanation){const ex=document.createElement('p');ex.textContent='व्याख्या: '+q.explanation;box.append(ex);}box.append(b);root.append(box);});if(!questions.length)root.textContent='अभी कोई MCQ नहीं है।';}
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),notes,questions},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='bio-study-backup.json';a.click();URL.revokeObjectURL(url);$('backupMsg').textContent='बैकअप डाउनलोड हुआ। इसे निजी जगह पर रखें।';};
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
