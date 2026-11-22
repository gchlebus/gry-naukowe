export const CARS=[
{id:'volvo',name:'Volvo XC60',variant:'T8 · stabilny SUV',paint:'Szary metalik',color:0x7b838b,roof:0x7b838b,width:1.94,length:4.7,height:1.7,max:67,accel:16,grip:7.4},
{id:'yaris',name:'Toyota Yaris',variant:'Selection · lekki i zwinny',paint:'Biel z czarnym dachem',color:0xf1f1e9,roof:0x10161b,width:1.75,length:3.95,height:1.45,max:53,accel:13,grip:10},
{id:'tesla',name:'Tesla Model 3',variant:'Performance · napęd elektryczny',paint:'Perłowa biel',color:0xf5f4ee,roof:0x202930,width:1.85,length:4.7,height:1.4,max:75,accel:23,grip:8.6},
{id:'bmw',name:'BMW M3 G80',variant:'Competition · szybki i precyzyjny',paint:'Isle of Man Green',color:0x076b53,roof:0x142424,width:1.91,length:4.8,height:1.43,max:78,accel:20,grip:9.1}];
export const CITIES=[
{id:'krakow',name:'Kraków',route:'Sprint nad Wisłą',tag:'ZŁOTA GODZINA',description:'Miniesz Wawel, wejdziesz w szybki łuk i wyskoczysz z rampy nad Wisłą.',sky:0x9dbdc9,ground:0x66775d,buildings:[0xcab89e,0xd5c6b0,0xb59c83],sun:0xffdc9f,points:[[0,0,0],[0,0,150],[-80,1,290],[-210,0,330],[-320,0,230],[-300,2,40],[-220,0,-90],[-80,0,-110]],ramp:.27,boost:[.12,.54],gold:43,silver:55},
{id:'lodz',name:'Łódź',route:'Fabryczny ekspres',tag:'CEGŁA I NEON',description:'Ceglane hale i kominy Manufaktury wyznaczają trasę. Oszczędzaj dopalacz na wyjście z ciasnych zakrętów.',sky:0x8893ad,ground:0x555e58,buildings:[0x965f4c,0xb77757,0x754d43],sun:0xffbaa1,points:[[0,0,0],[20,0,170],[-50,0,290],[-230,0,280],[-270,2,130],[-150,0,50],[-230,0,-130],[-80,0,-190]],ramp:.47,boost:[.08,.72],gold:42,silver:57},
{id:'raciborz',name:'Racibórz',route:'Skok nad Odrą',tag:'ZAMEK NAD RZEKĄ',description:'Za zamkiem trasa biegnie wzdłuż Odry. Rozpędź się na szerokim łuku przed skokiem.',sky:0xafccd3,ground:0x62815e,buildings:[0xd1b68c,0xb8a384,0xe0ccaa],sun:0xffedc3,points:[[0,0,0],[0,0,180],[-130,0,310],[-300,0,270],[-370,0,90],[-280,0,-80],[-130,0,-140],[-30,0,-100]],ramp:.35,boost:[.16,.65],gold:46,silver:60},
{id:'warszawa',name:'Warszawa',route:'Pętla wieżowców',tag:'BŁĘKITNA GODZINA',description:'Najdłuższa prosta prowadzi pod warszawskie wieżowce. Wypatruj sylwetki Pałacu Kultury.',sky:0x667b9b,ground:0x596568,buildings:[0x627d8d,0x849aa3,0x526b79],sun:0xffcf9c,points:[[0,0,0],[0,0,230],[-110,0,400],[-340,0,360],[-430,0,180],[-330,0,-70],[-140,0,-180],[-40,0,-120]],ramp:.6,boost:[.08,.4],gold:55,silver:70}];
export function freshState(){return {distance:0,lateral:0,lateralSpeed:0,speed:0,time:0,checkpoint:0,checkpointDistance:0,boost:1,height:0,verticalSpeed:0,finished:false,lastRamp:-1,penalties:0};}
export function step(s,input,dt,car,length,city){
 if(s.finished)return []; dt=Math.min(.05,Math.max(0,dt)); const events=[];s.time+=dt;
 const activeBoost=input.boost&&s.boost>0&&input.throttle;
 s.boost=Math.max(0,Math.min(1,s.boost+(activeBoost?-.32:.095)*dt));
 const phase=s.distance/length;
 const pad=city.boost.some(x=>phase>x&&phase<x+.026)&&Math.abs(s.lateral)<6;
 s.speed=Math.max(0,Math.min(car.max*(activeBoost||pad?1.35:1.05),s.speed+((input.throttle?car.accel:0)+(activeBoost||pad?30:0)-(input.brake?32:0)-1.8-s.speed*s.speed*.0032)*dt));
 const drift=input.drift&&s.speed>15;
 s.lateralSpeed+=(input.steer*s.speed*(drift?.85:.55)-(input.curvature||0)*s.speed*s.speed*.65-s.lateralSpeed*(drift?2.1:car.grip))*dt;
 s.lateral+=s.lateralSpeed*dt;
 if(Math.abs(s.lateral)>8){s.lateral=Math.sign(s.lateral)*8;s.lateralSpeed*=-.3;s.speed*=Math.pow(.25,dt);events.push('barrier');}
 s.distance=Math.min(length,s.distance+s.speed*dt);
 const lapRamp=Math.floor(s.distance/(length*city.ramp));
 if(phase>=city.ramp&&phase<city.ramp+.018&&s.height<=0&&s.lastRamp!==lapRamp){s.verticalSpeed=s.speed*.2;s.height=.05;s.lastRamp=lapRamp;events.push('jump');}
 if(s.height>0){s.verticalSpeed-=18*dt;s.height+=s.verticalSpeed*dt;if(s.height<=0){s.height=0;s.verticalSpeed=0;events.push('land');}}
 const next=(s.checkpoint+1)*.2*length;
 if(s.checkpoint<4&&s.distance>=next){s.checkpoint++;s.checkpointDistance=next;events.push('checkpoint');}
 if(s.distance>=length&&s.checkpoint===4){s.finished=true;events.push('finish');}
 s.boosting=activeBoost||pad;return events;
}
export function respawn(s){s.distance=s.checkpointDistance;s.lateral=0;s.lateralSpeed=0;s.speed=0;s.height=0;s.verticalSpeed=0;s.time+=3;s.penalties+=3;}
export function formatTime(t){const m=Math.floor(t/60);return `${String(m).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;}
