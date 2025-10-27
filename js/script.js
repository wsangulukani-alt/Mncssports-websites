// Google Search function
function googleSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) { alert('Please enter a search term.'); return; }
  if (q === 'google') { window.open('https://www.google.com', '_blank'); return; }
  window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}+Malawi+Sports`, '_blank');
}

// CC History localStorage
const CC_KEY = 'mncs_cc_list';
function loadCCHistory() {
  try {
    const raw = localStorage.getItem(CC_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const datalist = document.getElementById('ccHistoryList');
    datalist.innerHTML = '';
    arr.forEach(email => { const opt = document.createElement('option'); opt.value = email; datalist.appendChild(opt); });
  } catch(e) { console.error('CC load error', e); }
}
function saveCCHistory(email) {
  if (!email) return;
  email = email.trim();
  if (!validateEmail(email)) return;
  try {
    let arr = JSON.parse(localStorage.getItem(CC_KEY) || '[]');
    arr = arr.filter(e => e.toLowerCase() !== email.toLowerCase());
    arr.unshift(email);
    if (arr.length > 7) arr = arr.slice(0,7);
    localStorage.setItem(CC_KEY, JSON.stringify(arr));
    loadCCHistory();
  } catch(e) { console.error('CC save error', e); }
}

// File upload
function uploadFile() {
  const fileInput = document.getElementById("fileUpload");
  const docSelect = document.getElementById("uploadedDocSelect");
  if (fileInput.files.length === 0) { alert("Please select a file."); return; }
  const fileName = fileInput.files[0].name;
  const option = document.createElement("option");
  option.value = fileName; option.text = fileName;
  if (!Array.from(docSelect.options).some(o => o.value === fileName)) docSelect.add(option);
  document.getElementById("pdfViewer").innerHTML = `<p>Uploaded Document: ${fileName}</p>`;
}

// Email validation
function validateEmail(email) { if (!email) return false; const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return re.test(email); }

// Send email
function sendReport() {
  const recipient = document.getElementById("emailRecipient").value.trim();
  const cc = document.getElementById("emailCC").value.trim();
  const subject = document.getElementById("emailSubject").value.trim();
  const message = document.getElementById("emailMessage").value.trim();
  const file = document.getElementById("uploadedDocSelect").value;
  if (!recipient || !subject || !file) { alert("Please fill required fields and select a document."); return; }
  if (!validateEmail(recipient)) { alert('Recipient email is invalid.'); return; }
  if (cc && !validateEmail(cc)) { alert('CC email is invalid.'); return; }
  if (cc) saveCCHistory(cc);
  let mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  if (cc) mailtoLink += `&cc=${encodeURIComponent(cc)}`;
  window.open(mailtoLink, '_blank');
}

// Admin account
function createAccount() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass = document.getElementById('adminPassword').value;
  const remember = document.getElementById('rememberMe').checked;
  if (!email || !pass) { alert('Please fill in both Email and Password.'); return; }
  if (!validateEmail(email)) { alert('Please enter a valid email.'); return; }
  alert(`Admin account created successfully!\nEmail: ${email}`);
  if (remember) { try{ localStorage.setItem('mncs_last_admin', email); }catch(e){console.warn(e);} }
  saveCCHistory(email);
  document.getElementById('adminPassword').value = '';
}

// Toggle password
document.getElementById('toggleAdminPass').addEventListener('click', function(){
  const p = document.getElementById('adminPassword');
  const icon = this.querySelector('i');
  if(p.type === 'password'){ p.type='text'; icon.classList.replace('fa-eye','fa-eye-slash'); }
  else { p.type='password'; icon.classList.replace('fa-eye-slash','fa-eye'); }
});

// Gallery
let galleryIndex = 0; const track = document.getElementById('galleryTrack'); let autoSlideInterval = null;
function updateGalleryPosition() { const item = track.querySelector('.gallery-item'); if(!item) return; const itemWidth = item.offsetWidth + 20; track.style.transform = `translateX(${-galleryIndex * itemWidth}px)`; }
function nextSlide(){ const items = track.children.length; galleryIndex++; if(galleryIndex>=items) galleryIndex=0; updateGalleryPosition(); }
function prevSlide(){ const items = track.children.length; galleryIndex--; if(galleryIndex<0) galleryIndex=items-1; updateGalleryPosition(); }
function manualNext(){ stopAutoSlide(); nextSlide(); startAutoSlide(); }
function manualPrev(){ stopAutoSlide(); prevSlide(); startAutoSlide(); }
function startAutoSlide(){ if(autoSlideInterval) return; autoSlideInterval=setInterval(nextSlide,4000); }
function stopAutoSlide(){ if(autoSlideInterval){ clearInterval(autoSlideInterval); autoSlideInterval=null; } }
window.addEventListener('resize', updateGalleryPosition);
window.addEventListener('load', function(){
  loadCCHistory();
  try{ const last=localStorage.getItem('mncs_last_admin'); if(last) document.getElementById('adminEmail').value=last; }catch(e){}
  updateGalleryPosition();
  startAutoSlide();
});
const galleryContainer=document.querySelector('.gallery-container');
galleryContainer.addEventListener('mouseenter', stopAutoSlide);
galleryContainer.addEventListener('mouseleave', startAutoSlide);
