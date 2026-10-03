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
  const B32=/^[A-Z2-7]+=*$/;
  // Validates typed/pasted text or QR content. Returns {ok,secret} | {err:key} | {short:true} | {empty:true}
  function analyze(raw,fromQr){
    const s=(raw||'').trim();
    if(!s)return{empty:true};
    if(/^otpauth-migration:\/\//i.test(s)){const k=parseMigration(s);return k?{ok:true,secret:k}:{err:'q_migr'};}
    if(/^otpauth:\/\//i.test(s)){
      let u;try{u=new URL(s);}catch(e){return{err:'q_invalid'};}
      if(u.hostname.toLowerCase()!=='totp')return{err:'q_unsup'};
      const p=u.searchParams,sec=(p.get('secret')||'').replace(/[\s-]/g,'').toUpperCase();
      if(!sec||!B32.test(sec))return{err:'q_invalid'};
      if((p.get('algorithm')||'SHA1').toUpperCase()!=='SHA1'||(p.get('digits')||'6')!=='6'||(p.get('period')||'30')!=='30')return{err:'q_unsup'};
      return{ok:true,secret:sec};
    }
    if(/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^www\./i.test(s))return{err:fromQr?'q_notfa':'k_url'};
    const c=s.replace(/[\s-]/g,'').toUpperCase();
    if(fromQr)return/^[A-Z2-7]{16,}$/.test(s.replace(/[\s-]/g,''))?{ok:true,secret:c}:{err:'q_text'};
    if(!B32.test(c))return{err:'k_invalid'};
    if(c.length<8)return{short:true};
    return{ok:true,secret:c};
  }
  const keyErr=$('keyError');
  function showKeyErr(k){keyErr.textContent=k?t(k):'';keyErr.hidden=!k;}

  let lastCode=null,manualOffset=0,lastRealWindow=null,validKey=false;
  const formatCode=c=>c.slice(0,3)+' '+c.slice(3);

  function sweepColor(f){
    const st=[{at:0,h:189,s:82,l:58},{at:.45,h:255,s:78,l:64},{at:.75,h:32,s:90,l:58},{at:1,h:0,s:72,l:32}];
    let a=st[0],b=st[st.length-1];
    for(let i=0;i<st.length-1;i++){if(f>=st[i].at&&f<=st[i+1].at){a=st[i];b=st[i+1];break;}}
    const t=Math.min(1,Math.max(0,(f-a.at)/((b.at-a.at)||1)));
    return'hsl('+(a.h+(b.h-a.h)*t).toFixed(0)+', '+(a.s+(b.s-a.s)*t).toFixed(0)+'%, '+(a.l+(b.l-a.l)*t).toFixed(0)+'%)';
  }

  function idle(){
    otpDisplay.textContent='------';otpDisplay.classList.add('placeholder');timerNum.textContent='--';
    copyBtn.disabled=true;validKey=false;segCover.style.width='100%';
  }
  async function refresh(){
    const a=analyze(secretInput.value);
    secretInput.classList.remove('invalid');showKeyErr(null);
    if(a.empty||a.short){idle();return;}
    if(a.err){secretInput.classList.add('invalid');showKeyErr(a.err);idle();return;}
    const keyBytes=base32Decode(a.secret);
    if(!keyBytes.length){secretInput.classList.add('invalid');showKeyErr('k_invalid');idle();return;}
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
  secretInput.addEventListener('blur',()=>{const a=analyze(secretInput.value);if(a.short){secretInput.classList.add('invalid');showKeyErr('k_short');}});
  clearKeyBtn.addEventListener('click',()=>{reset('');refresh();secretInput.focus();});
  refreshBtn.addEventListener('click',async()=>{
    refreshBtn.classList.remove('spinning');void refreshBtn.offsetWidth;refreshBtn.classList.add('spinning');refreshBtn.classList.add('busy');setTimeout(()=>refreshBtn.classList.remove('busy'),900);
    manualOffset+=1;lastCode=null;await refresh();
    if(!validKey){showToast(t('t_enter'));return;}
    await copyGenerated();
  });

  // ---- QR scanning ----
  let scanStream=null,scanRAF=null,detector=null;
  try{if('BarcodeDetector' in window)detector=new BarcodeDetector({formats:['qr_code']});}catch(e){}

  function loadJsQR(){
    return new Promise(res=>{
      if(window.jsQR)return res();
      const el=document.createElement('script');
      el.src='https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      el.onload=el.onerror=()=>res();
      document.head.appendChild(el);
    });
  }
  function base32Encode(bytes){
    const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits='',out='';
    bytes.forEach(b=>bits+=b.toString(2).padStart(8,'0'));
    for(let i=0;i<bits.length;i+=5)out+=A[parseInt(bits.substr(i,5).padEnd(5,'0'),2)];
    return out;
  }
  // Google Authenticator "export accounts" QR (otpauth-migration://) -> first account's secret
  function parseMigration(url){
    try{
      let d=new URL(url).searchParams.get('data').replace(/ /g,'+').replace(/-/g,'+').replace(/_/g,'/');
      const bin=atob(d),buf=Uint8Array.from(bin,c=>c.charCodeAt(0));
      const rd=(b,i)=>{let r=0,sh=0,c;do{c=b[i.p++];r+=(c&0x7f)*Math.pow(2,sh);sh+=7}while(c&0x80);return r};
      const fields=(b)=>{const i={p:0},o=[];while(i.p<b.length){const t=rd(b,i),f=t>>3,w=t&7;
        if(w===0)rd(b,i);else if(w===2){const l=rd(b,i);o.push([f,b.slice(i.p,i.p+l)]);i.p+=l}else if(w===1)i.p+=8;else if(w===5)i.p+=4;else break}return o};
      const acc=fields(buf).find(x=>x[0]===1);
      const sec=fields(acc[1]).find(x=>x[0]===1);
      return base32Encode(sec[1]);
    }catch(e){return null;}
  }

  const scanFrame=$('scanFrame'),scanError=$('scanError'),scanRetry=$('scanRetry');
  let scanTimer=null;
  function showScanView(){
    scanFrame.hidden=false;scanStatus.hidden=false;scanError.hidden=true;
    scanFrame.classList.remove('bad');scanStatus.classList.remove('err');scanStatus.textContent=t('scan_hint');
  }
  function stopStream(){
    if(scanRAF){cancelAnimationFrame(scanRAF);scanRAF=null;}
    if(scanTimer){clearTimeout(scanTimer);scanTimer=null;}
    if(scanStream){scanStream.getTracks().forEach(x=>x.stop());scanStream=null;}
    scanVideo.srcObject=null;
  }
  function stopScan(){stopStream();scanOverlay.classList.remove('show');}
  function camErr(e){
    if(!window.isSecureContext)return'c_insecure';
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return'c_unsup';
    const n=e&&e.name;
    if(n==='NotAllowedError'||n==='SecurityError'||n==='PermissionDeniedError')return'c_denied';
    if(n==='NotFoundError'||n==='DevicesNotFoundError'||n==='OverconstrainedError')return'c_none';
    if(n==='NotReadableError'||n==='TrackStartError'||n==='AbortError')return'c_busy';
    return'c_err';
  }
  function showCamError(k){
    stopStream();
    const p=t(k).split('|');
    $('scanErrTitle').textContent=p[0];$('scanErrText').textContent=p[1]||'';
    const h=$('scanErrHint');h.textContent=p[2]||'';h.hidden=!p[2];
    scanFrame.hidden=true;scanStatus.hidden=true;scanError.hidden=false;
  }
  async function startScan(){
    scanOverlay.classList.add('show');showScanView();
    if(!window.isSecureContext||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showCamError(camErr());return;}
    try{
      try{scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}}});}
      catch(e){
        if(e&&(e.name==='NotFoundError'||e.name==='OverconstrainedError'))scanStream=await navigator.mediaDevices.getUserMedia({video:true});
        else throw e;
      }
      if(!scanOverlay.classList.contains('show')){stopStream();return;}
      scanVideo.srcObject=scanStream;await scanVideo.play();
      if(!detector)await loadJsQR();
      if(!scanStream)return;
      tickScan();
    }catch(e){showCamError(camErr(e));}
  }
  function rejectScan(k){
    scanStatus.textContent=t(k);scanStatus.classList.add('err');scanFrame.classList.add('bad');
    try{navigator.vibrate&&navigator.vibrate(120);}catch(e){}
    scanTimer=setTimeout(()=>{
      scanTimer=null;if(!scanStream)return;
      showScanView();tickScan();
    },2800);
  }
  function onScanned(data){
    const a=analyze(data,true);
    if(!a.ok){rejectScan(a.err||'q_invalid');return;}
    reset(a.secret);stopScan();
    refresh().then(()=>{if(validKey)copyGenerated();});
  }
  async function tickScan(){
    if(!scanStream)return;
    let data=null;
    if(scanVideo.readyState>=2&&scanVideo.videoWidth){
      try{
        if(detector){const c=await detector.detect(scanVideo);if(c.length)data=c[0].rawValue;}
        if(!data&&window.jsQR){
          const w=Math.min(640,scanVideo.videoWidth),h=Math.round(w*scanVideo.videoHeight/scanVideo.videoWidth);
          scanCanvas.width=w;scanCanvas.height=h;
          const ctx=scanCanvas.getContext('2d',{willReadFrequently:true});
          ctx.drawImage(scanVideo,0,0,w,h);
          const img=ctx.getImageData(0,0,w,h);
          const r=jsQR(img.data,w,h,{inversionAttempts:'attemptBoth'});
          if(r&&r.data)data=r.data;
        }
      }catch(e){}
    }
    if(!scanStream)return;
    if(data){onScanned(data);return;}
    scanRAF=requestAnimationFrame(tickScan);
  }
  scanRetry.addEventListener('click',startScan);
  scanBtn.addEventListener('click',startScan);
  scanClose.addEventListener('click',stopScan);

  updateClearBtn();refresh();animateVisuals();setInterval(refresh,1000);
})();
