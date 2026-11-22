import {CARS,CITIES,freshState,step,respawn,formatTime} from './game.mjs';
const embeddedArt = JSON.parse(document.getElementById('car-assets')?.textContent || '{}');
function carArt(id, view) {
  const file = id + '-' + view + '.webp';
  return embeddedArt[file] || './src/cars/' + file;
}
const $=id=>document.getElementById(id);let world,track,cityIndex=0,carIndex=0,state=freshState(),mode='menu',countdown=3,elapsed=0,last=0,noticeUntil=0;const keys=new Set();let musicOn=false,engine,osc,gain,storageOK=true;
function bestKey(){return `polish-rush-v1:${CITIES[cityIndex].id}:${CARS[carIndex].id}`;}
function readBest(){try{const value=Number(localStorage.getItem(bestKey()));return value>0&&Number.isFinite(value)?value:null;}catch{storageOK=false;return null;}}
function updateBest(){const best=readBest();$('best').textContent=best?'Rekord: '+formatTime(best):'Brak rekordu na tej trasie';}
function uiChoices() {
  const city = CITIES[cityIndex], car = CARS[carIndex];
  $('cities').innerHTML = CITIES.map((item, i) =>
    `<button data-city="${i}" class="${i === cityIndex ? 'active' : ''}" aria-pressed="${i === cityIndex}"><strong>${item.name}</strong></button>`
  ).join('');
  $('cars').innerHTML = CARS.map((item, i) =>
    `<button data-car="${i}" class="${i === carIndex ? 'active' : ''}" aria-pressed="${i === carIndex}"><span class="swatch" style="background:#${item.color.toString(16).padStart(6,'0')}"></span><span>${item.name}<small>${item.variant}</small></span></button>`
  ).join('');
  $('paint').textContent = car.paint;
  $('model-name').textContent = car.name;
  $('car-photo').src = carArt(car.id, 'garage');
  $('car-photo').alt = car.name + ' – ' + car.paint;
  $('route-description').textContent = city.description;
  $('route-name').textContent = city.route;
  $('route-length').textContent = track ? `${(track.length / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} km · 4 bramki` : '';
  updateBest();
}
$('cities').onclick = event => {
  const button = event.target.closest('[data-city]');
  if (!button) return;
  cityIndex = Number(button.dataset.city);
  if (world) track = world.loadCity(CITIES[cityIndex]);
  state = freshState();
  uiChoices();
  $('cities').querySelector('[aria-pressed="true"]').focus();
};
$('cars').onclick = event => {
  const button = event.target.closest('[data-car]');
  if (!button) return;
  carIndex = Number(button.dataset.car);
  if (world) world.loadCar(CARS[carIndex], carArt(CARS[carIndex].id, 'chase'));
  uiChoices();
  $('cars').querySelector('[aria-pressed="true"]').focus();
};
function ensureEngine(){try{if(!engine){engine=new AudioContext();osc=engine.createOscillator();gain=engine.createGain();osc.type='sawtooth';const filter=engine.createBiquadFilter();filter.type='lowpass';filter.frequency.value=220;osc.connect(filter).connect(gain).connect(engine.destination);gain.gain.value=0;osc.start();}engine.resume().catch(()=>{});}catch{}}
function notice(text,seconds=1.2){$('message').textContent=text;noticeUntil=elapsed+seconds;}
function start(){if(!world)return;state=freshState();keys.clear();countdown=3;mode='countdown';$('menu').hidden=true;$('hud').hidden=false;$('modal').hidden=true;document.body.classList.add('racing');$('race-city').textContent=CITIES[cityIndex].name.toUpperCase()+' / '+CARS[carIndex].name.toUpperCase();ensureEngine();$('start').blur();}
function pause(){if(!['race','countdown'].includes(mode))return;mode=mode==='race'?'paused':'paused-countdown';keys.clear();$('result-label').textContent='PRZERWA';$('result-title').textContent='Wyścig wstrzymany';$('result-detail').textContent='Stoper ruszy po wznowieniu jazdy.';$('resume').hidden=false;$('modal').hidden=false;$('resume').focus();}
function resume(){mode=mode==='paused-countdown'?'countdown':'race';$('modal').hidden=true;last=performance.now();}
function garage(){mode='menu';keys.clear();state=freshState();$('modal').hidden=true;$('hud').hidden=true;$('menu').hidden=false;document.body.classList.remove('racing');updateBest();$('start').focus();}
function finish(){mode='finished';const old=readBest(),record=!old||state.time<old;if(record){try{localStorage.setItem(bestKey(),String(state.time));}catch{storageOK=false;}}const city=CITIES[cityIndex];const medal=state.time<city.gold?'ZŁOTO':state.time<city.silver?'SREBRO':'BRĄZ';$('result-label').textContent=medal+' / META';$('result-title').textContent=formatTime(state.time);$('result-detail').textContent=`${record?'Nowy rekord!':'Rekord: '+formatTime(old)} ${state.penalties?'Kara za powrót na trasę: '+state.penalties+' s. ':''}${storageOK?'': 'Przeglądarka blokuje zapis wyniku.'}`;$('resume').hidden=true;$('modal').hidden=false;$('retry').focus();}
$('start').onclick=start;$('retry').onclick=start;$('pause').onclick=pause;$('resume').onclick=resume;$('garage').onclick=garage;
$('sound').onclick=async()=>{const audio=$('music');if(musicOn){audio.pause();musicOn=false;}else{try{audio.volume=.35;await audio.play();musicOn=true;}catch{$('sound').textContent='Muzyka niedostępna';return;}}$('sound').setAttribute('aria-pressed',String(musicOn));$('sound').textContent=musicOn?'♫ Wyłącz muzykę':'♫ Włącz muzykę';};
const driving=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft','ShiftRight']);
addEventListener('keydown',e=>{if((mode==='race'||mode==='countdown')&&(driving.has(e.code)||['KeyR','Enter','Escape'].includes(e.code)))e.preventDefault();if(driving.has(e.code))keys.add(e.code);if(e.repeat)return;if(e.code==='Escape'){if(mode.startsWith('paused'))resume();else pause();}if(e.code==='KeyR'&&mode!=='menu')start();if(e.code==='Enter'&&mode==='race'){respawn(state);notice('BRAMKA · +3 s');}});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();pause();}});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);b.onlostpointercapture=()=>keys.delete(b.dataset.key);}
function map(){if(!track)return;const ctx=$('map').getContext('2d'),points=track.curve.getSpacedPoints(120),xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),minZ=Math.min(...zs),scale=Math.min(160/(Math.max(...xs)-minX),120/(Math.max(...zs)-minZ));const xy=p=>[20+(p.x-minX)*scale,140-(p.z-minZ)*scale];ctx.clearRect(0,0,200,160);ctx.strokeStyle='#9bb2b5';ctx.lineWidth=3;ctx.beginPath();points.forEach((p,i)=>{const [x,y]=xy(p);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();for(let i=1;i<5;i++){const [x,y]=xy(track.curve.getPointAt(i*.2));ctx.fillStyle=i<=state.checkpoint?'#d0ff70':'#65888e';ctx.fillRect(x-3,y-3,6,6);}const [x,y]=xy(track.curve.getPointAt(Math.min(.99999,state.distance/track.length)));ctx.fillStyle='#d0ff70';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000||0,.05);last=now;elapsed+=dt;if(mode==='countdown'){countdown-=dt;$('message').textContent=String(Math.ceil(Math.max(0,countdown)));if(countdown<=0){mode='race';notice('START!',.7);}}
 if(mode==='race'){const t=state.distance/track.length,t1=track.curve.getTangentAt(t),t2=track.curve.getTangentAt((t+.003)%1);const angle=Math.atan2(t2.x*t1.z-t2.z*t1.x,t1.x*t2.x+t1.z*t2.z);const input={throttle:keys.has('ArrowUp')||keys.has('KeyW'),brake:keys.has('ArrowDown')||keys.has('KeyS'),steer:Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA')),boost:keys.has('ShiftLeft')||keys.has('ShiftRight'),drift:keys.has('Space'),curvature:-angle/(track.length*.003)};const events=step(state,input,dt,CARS[carIndex],track.length,CITIES[cityIndex]);if(events.includes('checkpoint'))notice(`BRAMKA ${state.checkpoint} / 4`);if(events.includes('jump'))notice('SKOK!',.8);if(events.includes('finish'))finish();if(elapsed>noticeUntil)$('message').textContent=state.boosting?'DOPALACZ':'';}
 if(gain){gain.gain.setTargetAtTime(mode==='race'?.013:0,engine.currentTime,.1);osc.frequency.setTargetAtTime(35+state.speed*2.3,engine.currentTime,.1);}
 $('timer').textContent=formatTime(state.time);$('checkpoint').textContent=`BRAMKA ${state.checkpoint} / 4`;$('speed').querySelector('strong').textContent=Math.round(state.speed*3.6);$('boost-meter').style.transform=`scaleX(${state.boost})`;if(mode!=='menu')map();world.draw(state,mode,elapsed);}
uiChoices();$('start').disabled=true;$('start').textContent='Ładowanie trasy…';
try{const {createWorld}=await import('./scene.js');world=createWorld($('world'));track=world.loadCity(CITIES[cityIndex]);world.loadCar(CARS[carIndex], carArt(CARS[carIndex].id, 'chase'));uiChoices();$('start').disabled=false;$('start').innerHTML='Rozpocznij wyścig <span>↗</span>';requestAnimationFrame(tick);}catch(error){console.error(error);$('error').hidden=false;$('error').textContent='Nie udało się wczytać trasy. Sprawdź, czy przeglądarka obsługuje WebGL 2 i ma włączoną akcelerację graficzną, a następnie odśwież stronę.';}
