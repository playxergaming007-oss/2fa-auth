(function(){
  const $=id=>document.getElementById(id);
  const secretInput=$('secret'),clearKeyBtn=$('clearKeyBtn'),keyInputWrap=secretInput.closest('.key-input-wrap'),
    otpDisplay=$('otpDisplay'),timerPill=$('timerPill'),timerNum=$('timerNum'),copyBtn=$('copyBtn'),refreshBtn=$('refreshBtn'),
    pasteBtn=$('pasteBtn'),scanBtn=$('scanBtn'),scanOverlay=$('scanOverlay'),scanVideo=$('scanVideo'),scanStatus=$('scanStatus'),
    scanClose=$('scanClose'),scanCanvas=$('scanCanvas'),toast=$('toast'),segCover=$('segCover'),segHead=$('segHead');

  function base32Decode(input){
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const clean=input.replace(/=+$/,'').toUpperCase().replace(/[^A-Z2-7]/g,'');
    let bits='';
    for(const ch of clean){const v=alphabet.indexOf(ch);if(v===-1)continue;bits+=v.toString(2).padStart(5,'0');}
    const bytes=[];
    for(let i=0;i+8<=bits.length;i+=8)bytes.push(parseInt(bits.substring(i,i+8),2));
    return new Uint8Array(bytes);
  }
  async function hotp(keyBytes,counter){
    const buf=new ArrayBuffer(8),view=new DataView(buf);
    view.setUint32(0,Math.floor(counter/2**32));view.setUint32(4,counter>>>0);
    const k=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-1'},false,['sign']);
    const h=new Uint8Array(await crypto.subtle.sign('HMAC',k,buf));
    const o=h[h.length-1]&0x0f;
    const bin=((h[o]&0x7f)<<24)|((h[o+1]&0xff)<<16)|((h[o+2]&0xff)<<8)|(h[o+3]&0xff);
    return(bin%1_000_000).toString().padStart(6,'0');
  }
  function extractSecret(raw){
    const s=raw.trim();
    if(s.startsWith('otpauth://')){try{const v=new URL(s).searchParams.get('secret');if(v)return v;}catch(e){}}
    return s;
  }
  let lastCode=null,manualOffset=0,lastRealWindow=null,validKey=false;
  const formatCode=c=>c.slice(0,3)+' '+c.slice(3);

  function sweepColor(f){
    const st=[{at:0,h:189,s:82,l:58},{at:.45,h:255,s:78,l:64},{at:.75,h:32,s:90,l:58},{at:1,h:0,s:72,l:32}];
    let a=st[0],b=st[st.length-1];
    for(let i=0;i<st.length-1;i++){if(f>=st[i].at&&f<=st[i+1].at){a=st[i];b=st[i+1];break;}}
    const t=Math.min(1,Math.max(0,(f-a.at)/((b.at-a.at)||1)));
    return'hsl('+(a.h+(b.h-a.h)*t).toFixed(0)+', '+(a.s+(b.s-a.s)*t).toFixed(0)+'%, '+(a.l+(b.l-a.l)*t).toFixed(0)+'%)';
  }

  async function refresh(){
    const secretVal=extractSecret(secretInput.value);
    secretInput.classList.remove('invalid');
    if(!secretVal){
      otpDisplay.textContent='------';otpDisplay.classList.add('placeholder');timerNum.textContent='--';
      copyBtn.disabled=true;validKey=false;segCover.style.width='100%';return;
    }
    let keyBytes;
    try{keyBytes=base32Decode(secretVal);if(!keyBytes.length)throw 0;}
    catch(e){
      secretInput.classList.add('invalid');otpDisplay.textContent='ERROR';otpDisplay.classList.add('placeholder');
      copyBtn.disabled=true;validKey=false;segCover.style.width='100%';return;
    }
    validKey=true;
    const rw=Math.floor(Math.floor(Date.now()/1000)/30);
    if(lastRealWindow!==null&&rw!==lastRealWindow)manualOffset=0;
    lastRealWindow=rw;
    const code=await hotp(keyBytes,rw+manualOffset);
    if(code!==lastCode){otpDisplay.textContent=formatCode(code);otpDisplay.classList.remove('placeholder');lastCode=code;}
    copyBtn.disabled=false;
  }

  function animateVisuals(){
    if(validKey){
      const sec=(Date.now()/1000)%30,f=sec/30,c=sweepColor(f);
      segCover.style.width=((1-f)*100)+'%';
      timerNum.textContent=Math.ceil(30-sec)+'s';
      timerPill.style.color=c;
      timerPill.style.background=c.replace('hsl(','hsla(').replace(')',', 0.12)');
      timerPill.style.borderColor=c.replace('hsl(','hsla(').replace(')',', 0.35)');
      segHead.style.opacity='1';segHead.style.left=(f*100)+'%';
      segHead.style.setProperty('--head-glow',c.replace('hsl(','hsla(').replace(')',', 0.85)'));
    }else segHead.style.opacity='0';
    requestAnimationFrame(animateVisuals);
  }

  function showToast(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1400);}
  const plain=()=>otpDisplay.textContent.replace(/\s/g,'');
  async function copyGenerated(){
    try{await navigator.clipboard.writeText(plain());showToast(t('t_code')+otpDisplay.textContent);}
    catch(e){showToast(t('t_genfail'));}
  }
  function updateClearBtn(){keyInputWrap.classList.toggle('has-value',secretInput.value.length>0);}
  function reset(v){secretInput.value=v;lastCode=null;manualOffset=0;updateClearBtn();}

  copyBtn.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(plain());showToast(t('t_copied'));}catch(e){showToast(t('t_nocopy'));}
  });
  pasteBtn.addEventListener('click',async()=>{
    try{
      reset((await navigator.clipboard.readText()).trim());
      await refresh();
      if(validKey)await copyGenerated();else showToast(t('t_invalid'));
    }catch(e){showToast(t('t_clip'));}
  });
  secretInput.addEventListener('input',()=>{lastCode=null;manualOffset=0;updateClearBtn();refresh();});
  clearKeyBtn.addEventListener('click',()=>{reset('');refresh();secretInput.focus();});
  refreshBtn.addEventListener('click',async()=>{
    refreshBtn.classList.remove('spinning');void refreshBtn.offsetWidth;refreshBtn.classList.add('spinning');
    manualOffset+=1;lastCode=null;await refresh();
    if(!validKey){showToast(t('t_enter'));return;}
    await copyGenerated();
  });

  let scanStream=null,scanRAF=null;
  async function startScan(){
    scanOverlay.classList.add('show');scanStatus.textContent=t('scan_hint');
    try{
      scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
      scanVideo.srcObject=scanStream;await scanVideo.play();tickScan();
    }catch(e){scanStatus.textContent=t('t_cam');}
  }
  function stopScan(){
    if(scanRAF)cancelAnimationFrame(scanRAF);
    if(scanStream){scanStream.getTracks().forEach(x=>x.stop());scanStream=null;}
    scanOverlay.classList.remove('show');
  }
  function tickScan(){
    if(!scanStream)return;
    const ctx=scanCanvas.getContext('2d',{willReadFrequently:true});
    if(scanVideo.readyState===scanVideo.HAVE_ENOUGH_DATA){
      scanCanvas.width=scanVideo.videoWidth;scanCanvas.height=scanVideo.videoHeight;
      ctx.drawImage(scanVideo,0,0);
      const img=ctx.getImageData(0,0,scanCanvas.width,scanCanvas.height);
      if(window.jsQR){
        const r=jsQR(img.data,img.width,img.height);
        if(r&&r.data){
          reset(r.data);stopScan();
          refresh().then(()=>{if(validKey)copyGenerated();else showToast(t('t_qrbad'));});
          return;
        }
      }
    }
    scanRAF=requestAnimationFrame(tickScan);
  }
  scanBtn.addEventListener('click',startScan);
  scanClose.addEventListener('click',stopScan);

  updateClearBtn();refresh();animateVisuals();setInterval(refresh,1000);
})();
