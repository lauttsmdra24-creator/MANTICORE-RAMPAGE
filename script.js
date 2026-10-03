const $=s=>document.querySelector(s),W=320,H=180,GY=150;
if(matchMedia('(pointer:coarse)').matches||'ontouchstart' in window)document.body.classList.add('touch');
const cv=$('#cv');let c=cv.getContext('2d');const mainC=c;
const R=(x,y,w,h,k)=>{c.fillStyle=k;c.fillRect(Math.round(x),Math.round(y),w,h)};
const HM=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'];
function heart(x,y,s,k){HM.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch=='X')R(x+i*s,y+j*s,s,s,k)}))}
{const x=$('.hp').getContext('2d');x.fillStyle='#e8334a';HM.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch=='X')x.fillRect(i,j,1,1)}))}
let page=1,rafOn=false;
function go(n){page=n;document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));$('#p'+n).classList.add('on');if(n==5){startCf();startSky();sfx.chime()}}

// ---------- audio (synth, no files) ----------
let snOn=true;try{snOn=localStorage.getItem('mrSnd')!=='0'}catch(e){}
let AC,mg,sg,mus=false,mstep=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=snOn?.2:0;mg.connect(AC.destination);sg=AC.createGain();sg.gain.value=snOn?.5:0;sg.connect(AC.destination)}catch(e){}}if(AC&&AC.state=='suspended')AC.resume();return AC}
function tone(f,d,type='square',v=.3,t0=0,f2,out){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(out||sg);o.start(t);o.stop(t+d+.02)}
function noise(d,v=.3,f1=1000,f2=f1,t0=0,type='lowpass',out){const a=ac();if(!a)return;const n=Math.max(1,a.sampleRate*d|0),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;
 const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+t0;s.buffer=b;fl.type=type;fl.frequency.setValueAtTime(f1,t);fl.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(g);g.connect(out||sg);s.start(t)}
const sfx={
 click:()=>tone(660,.08,'square',.2,0,990),
 tick:()=>tone(440+Math.random()*200,.05,'square',.12),
 roar:()=>{noise(.7,.5,900,150);tone(120,.6,'sawtooth',.4,0,40);tone(90,.6,'square',.25,0,35)},
 shoot:()=>noise(.18,.18,2500,800,0,'bandpass'),
 snap:()=>{noise(.12,.35,3000,500);tone(900,.1,'square',.2,0,200)},
 spike:()=>{noise(.25,.3,1800,300,0,'bandpass');tone(500,.2,'sawtooth',.2,0,150)},
 boom:()=>{noise(.5,.5,500,60);tone(140,.4,'sawtooth',.3,0,50);tone(300,.3,'square',.15,.05,120)},
 hurt:()=>{tone(300,.3,'square',.35,0,70);noise(.2,.3,800,200)},
 wave:()=>[392,523,659].forEach((f,i)=>tone(f,.25,'triangle',.3,i*.12)),
 win:()=>[523,659,784,1046,784,1046].forEach((f,i)=>tone(f,.3,'square',.22,i*.14)),
 lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.4,'sawtooth',.25,i*.25)),
 chime:()=>[784,988,1175,1568].forEach((f,i)=>tone(f,.6,'sine',.3,i*.15))
};
const SC=[146.8,155.6,185,196,220,233.1,261.6,293.7],LEAD=[4,-1,5,4,2,-1,1,2,4,-1,7,6,5,4,2,-1,4,-1,5,4,2,-1,1,0,1,2,4,5,4,2,1,0];
function startMus(){if(mus||!ac())return;mus=true;setInterval(()=>{if(!AC||AC.state!='running'||!snOn)return;const s=mstep++%32,b=s%16,g=page==3&&running,hi=g&&G.gi>=4,m=LEAD[s];
 if(b==0){tone(73.4,2.3,'sine',.7,0,0,mg);tone(110,2.3,'triangle',.3,0,0,mg);if(s==16)tone(116.5,2.3,'triangle',.25,0,0,mg)}
 if(g){
  if([0,3,6,8,11,14].includes(b)){const f=(s>=16&&(b==6||b==14))?98:73.4;tone(f,.22,'triangle',.8,0,f*.8,mg)}
  if(b==0||b==6||b==8||(hi&&b==11)){tone(120,.15,'sine',.9,0,50,mg);noise(.08,.4,400,100,0,'lowpass',mg)}
  if(b==4||b==12)noise(.06,.3,4500,2500,0,'highpass',mg);
  if(b==15||(hi&&(b==2||b==10)))noise(.03,.15,6000,6000,0,'highpass',mg);
  if(hi&&b%2==0)noise(.02,.08,8000,8000,0,'highpass',mg);
  if(m>=0){const f=SC[m]*(hi?4:2);tone(f,.24,'triangle',.5,0,0,mg);tone(f*1.005,.24,'square',.07,0,0,mg)}
 }else if(s%4==0&&m>=0)tone(SC[m]*2,.9,'sine',.4,0,0,mg)},150)}
['pointerdown','keydown'].forEach(e=>addEventListener(e,()=>{ac();startMus()}));
document.addEventListener('click',e=>{if(e.target.closest('.pb,.nx'))sfx.click()});
function snIcon(){const cn=$('#snd canvas'),x=cn.getContext('2d');x.clearRect(0,0,10,8);x.fillStyle='#fff6d8';['....X','...XX','XXXXX','XXXXX','XXXXX','XXXXX','...XX','....X'].forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch=='X')x.fillRect(i,j,1,1)}));
 if(snOn){[[6,3],[6,4],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]].forEach(q=>x.fillRect(q[0],q[1],1,1))}else{x.fillStyle='#ff6b6b';[[6,2],[7,3],[8,4],[9,5],[9,2],[8,3],[7,4],[6,5]].forEach(q=>x.fillRect(q[0],q[1],1,1))}}
$('#snd').onclick=()=>{snOn=!snOn;try{localStorage.setItem('mrSnd',snOn?'1':'0')}catch(e){}ac();if(sg){sg.gain.value=snOn?.5:0;mg.gain.value=snOn?.2:0}snIcon();if(snOn)sfx.click()};snIcon();
document.addEventListener('visibilitychange',()=>{if(AC)document.hidden?AC.suspend():AC.resume()});

// ---------- sprites ----------
function pyr(x,b,w,h,k){for(let i=0;i<h;i+=2){const ww=Math.round(w*(1-i/h));R(x+(w-ww)/2,b-i-2,ww,2,k)}}
const RN=[['..X..','.XXX.','X.X.X','..X..','.X.X.'],['X...X','.X.X.','..X..','.X.X.','X...X'],['XXXX.','X...X','XXXX.','X....','X....']],motes=[...Array(22)].map(()=>({x:Math.random()*W,y:80+Math.random()*70,v:6+Math.random()*10,ph:Math.random()*6}));
function circ(cx,cy,r,k){for(let dy=-r;dy<=r;dy++){const w=Math.round(Math.sqrt(r*r-dy*dy));R(cx-w,cy+dy,2*w,1,k)}}
function drawM(x,o){const st=Math.floor(o.t*8)%2,b='#5a1a14',d='#2a0a0a',m='#140404',l='#8c2a1c',r='#ff2a2a',k=o.kick>0?6:0,fl=Math.floor(o.t*5)%2*3,bone='#e8e0c8',wg='#3a0d12';
 R(x+4,GY-42-fl,2,20+fl,m);R(x+6,GY-40-fl,14,3,wg);R(x+8,GY-37-fl,12,4,wg);R(x+10,GY-33,12,5,wg);R(x+12,GY-46-fl,2,10,m);R(x+17,GY-40-fl,2,8,m);R(x+20,GY-34-fl,2,6,m);
 R(x+2,GY-8+st,4,8-st,d);R(x+10,GY-8,4,8,b);R(x+20,GY-8+(1-st),4,8-(1-st),d);R(x+27,GY-8,4,8,b);
 R(x+5,GY-1,2,1,bone);R(x+29,GY-1,3,1,bone);R(x+31,GY-1,1,1,bone);
 R(x,GY-22,30,14,b);R(x,GY-11,30,3,d);for(let i=0;i<4;i++)R(x+8+i*4,GY-20,1,7,d);
 for(let i=0;i<5;i++)R(x+2+i*5,GY-26,3,5,m);
 R(x-3,GY-20,4,4,'#7a1018');R(x-7,GY-24,4,6,'#7a1018');R(x-9,GY-31,4,8,'#7a1018');R(x-9,GY-37,4,7,'#7a1018');R(x-6,GY-41,5,4,'#7a1018');R(x-2+k,GY-41,4,3,'#7a1018');
 R(x+2+k,GY-40,7,2,bone);R(x+8+k,GY-39,2,3,bone);R(x+5+k,GY-36+(fl?1:0),1,2,'#7cff3a');R(x+9+k,GY-35+(fl?1:0),1,2,'#7cff3a');
 R(x+22,GY-38,3,10,m);R(x+26,GY-43,3,14,m);R(x+30,GY-39,3,9,m);R(x+20,GY-33,3,9,m);R(x+24,GY-33,6,20,m);
 R(x+28,GY-32,14,13,b);R(x+31,GY-39,2,8,bone);R(x+39,GY-37,2,6,bone);R(x+33,GY-33,9,2,m);
 R(x+33,GY-30,8,5,'#ff2a2a55');R(x+34,GY-29,5,3,r);R(x+37,GY-29,1,3,'#000');R(x+30,GY-31,1,10,r);R(x+38,GY-26,6,6,l);R(x+41,GY-25,1,1,m);
 if(o.roar>0){R(x+35,GY-21,9,9,'#3a0508');R(x+36,GY-21,2,5,'#fff');R(x+41,GY-21,2,5,'#fff');R(x+34,GY-12,11,3,b);R(x+37,GY-14,2,3,'#fff');R(x+42,GY-14,2,3,'#fff');R(x+38,GY-16,4,2,r)}
 else{R(x+35,GY-20,9,1,m);R(x+37,GY-19,1,3,'#fff');R(x+42,GY-19,1,3,'#fff')}}
function drawA(x,aim,t){const f=Math.floor(t*6)%2;
 R(x+2,GY-8,3,8-f,'#8c2f2f');R(x+6,GY-8,3,8,'#8c2f2f');R(x+1,GY-1,4,1,'#4a2c18');R(x+6,GY-1,4,1,'#4a2c18');
 R(x,GY-18,10,11,'#3d5a8c');R(x,GY-19,10,2,'#b33');R(x+2,GY-24,6,6,'#d9a27a');R(x,GY-27,10,3,'#2b3a5c');R(x+1,GY-28,6,1,'#2b3a5c');
 R(x-5,GY-27,2,19,'#6b4423');R(x-6,GY-24,1,13,'#6b4423');R(x-3,GY-27,1,19,'#eee');
 if(aim)R(x-9,GY-18,12,1,'#ddd')}
function drawE(x,t){const f=Math.floor(t*4)%2,g='#8a8f9c',e='#6f7480';
 R(x+2,GY-9,6,9-f,e);R(x+10,GY-9,6,9,g);R(x+22,GY-9,6,9-(1-f),e);R(x+29,GY-9,6,9,g);
 R(x,GY-28,36,20,g);R(x+32,GY-26,6,3,e);R(x-12,GY-34,16,18,g);R(x-4,GY-32,8,14,e);
 R(x-17,GY-24,6,15,g);R(x-19,GY-12,3,3,g);R(x-16,GY-13,3,2,'#fff');R(x-9,GY-28,2,2,'#c22');R(x-15,GY-14,3,2,'#f4efe0');R(x+4,GY-28,28,3,'#b2543a')}

// ---------- game ----------
const GROUPS=[['A',3,'THE SHADOW ARCHERS'],['E',3,'STAMPEDE OF THE ANCIENTS'],['A',4,'RAIN OF CURSED ARROWS'],['E',4,'THE TITAN HERD'],['A',4,'RAIN OF CURSED ARROWS'],['M',5,'JUDGEMENT OF THE DESERT']],TOTAL=22;
let G,K={},running=false,last=0,stars=[...Array(40)].map(()=>({x:Math.random()*W,y:Math.random()*75,s:Math.random()})),wind=[...Array(26)].map(()=>({x:Math.random()*W,y:Math.random()*60+100,v:80+Math.random()*120}));
function reset(){G={mx:36,hp:3,done:0,gi:0,en:[],ar:[],wv:[],sp:[],pt:[],t:0,off:0,cdB:0,cdD:0,roar:0,kick:0,flash:0,sh:0,ban:0,bt:'',bs:'',dust:0,combo:0,delay:1.2,fin:false}}
function startGame(){reset();$('#over').style.display='none';running=true;last=performance.now();if(!rafOn){rafOn=true;requestAnimationFrame(tick)}}
function burst(x,y,k,n){for(let i=0;i<n;i++)G.pt.push({x,y,vx:(Math.random()-.5)*130,vy:-Math.random()*100,k:Array.isArray(k)?k[i%k.length]:k,l:1})}
function hurt(){G.hp--;G.flash=.5;sfx.hurt();G.sh=.3;G.combo=0;if(G.hp<=0){running=false;sfx.lose();$('#over').style.display='flex'}}
function block(){if(!running||G.cdB>0)return;G.cdB=.7;G.roar=.5;G.sh=.15;sfx.roar();G.wv.push({ox:G.mx+42,r:6})}
function destroy(){if(!running||G.cdD>0)return;G.cdD=.5;G.kick=.3;sfx.spike();G.sp.push({x:G.mx+6,y:GY-40})}
function spawn(){const g=GROUPS[G.gi++],n=g[1];G.bt='WAVE '+G.gi;sfx.wave();G.bs=g[2];G.ban=2.2;
 if(g[0]=='A'||g[0]=='M')for(let j=0;j<(g[0]=='A'?n:3);j++)G.en.push({k:'A',x:350+j*28,tx:185+j*36,st:'in',tm:.5+Math.random()*1.6});
 if(g[0]=='E'||g[0]=='M')for(let j=0;j<(g[0]=='E'?n:2);j++)G.en.push({k:'E',x:360+j*75})}
function score(){G.done++;G.combo++}
function update(dt){const d=(K.d?1:0)-(K.a?1:0);G.mx=Math.max(24,Math.min(110,G.mx+d*60*dt));G.off+=(45+d*35)*dt;G.t+=dt;
 G.cdB-=dt;G.cdD-=dt;G.roar-=dt;G.kick-=dt;G.flash-=dt;G.sh-=dt;G.ban-=dt;G.dust-=dt;
 if(G.dust<=0){G.dust=.1;G.pt.push({x:G.mx+4,y:GY-1,vx:-35-Math.random()*25,vy:-25,k:'#f0c995',l:.4})}
 motes.forEach(m=>{m.y-=m.v*dt;m.x-=(5-(K.d?-8:0))*dt;if(m.y<20){m.y=GY;m.x=Math.random()*W}});
 if(!G.en.length&&!G.fin){G.delay-=dt;if(G.delay<=0){if(G.gi>=GROUPS.length){G.fin=true;setTimeout(win,1200)}else spawn()}}
 G.en.forEach(e=>{if(e.k=='A'){
   if(e.st=='in'){e.x-=90*dt;if(e.x<=e.tx){e.x=e.tx;e.st='aim'}}
   else if(e.st=='aim'){e.tm-=dt;if(e.tm<=0){G.ar.push({x:e.x-9,y:GY-18,o:e});sfx.shoot();e.st='wait'}}
   else if(e.st=='flee'){e.x+=130*dt;if(e.x>350)e.dead=1}
  }else{e.x-=55*dt;if(e.x-18<=G.mx+42){hurt();burst(e.x,GY-20,['#8a8f9c','#6f7480'],14);e.dead=1;G.done++}}});
 G.wv.forEach(w=>w.r+=170*dt);G.wv=G.wv.filter(w=>w.r<130);
 G.ar=G.ar.filter(a=>{a.x-=135*dt;
  if(G.wv.some(w=>a.x<=w.ox+w.r&&a.x>=w.ox-4)){burst(a.x,a.y,['#ddd','#6b4423','#fff'],10);sfx.snap();if(a.o.st=='wait'){a.o.st='flee';score()}return false}
  if(a.x<=G.mx+38){hurt();burst(a.x,a.y,'#c33',8);a.o.st='aim';a.o.tm=.9+Math.random();return false}return true});
 G.sp=G.sp.filter(s=>{s.x+=300*dt;s.y+=50*dt;
  const t=G.en.filter(e=>e.k=='E'&&!e.dead&&s.x>=e.x-18).sort((a,b)=>a.x-b.x)[0];
  if(t){burst(t.x,GY-20,['#8a8f9c','#6f7480','#f4efe0','#c22'],30);sfx.boom();t.dead=1;score();G.sh=.2;return false}return s.x<345});
 G.pt.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=220*dt;p.l-=dt});G.pt=G.pt.filter(p=>p.l>0&&p.y<GY+20);
 const n=G.en.length;G.en=G.en.filter(e=>!e.dead);if(n&&!G.en.length)G.delay=1.4}
function cactus(x,y){R(x,y-22,4,22,'#3f7a3a');R(x+1,y-22,1,22,'#5fa24a');R(x-6,y-15,6,3,'#3f7a3a');R(x-6,y-19,3,7,'#3f7a3a');R(x+4,y-10,6,3,'#3f7a3a');R(x+7,y-15,3,8,'#3f7a3a')}
function draw(){c=mainC;const p=Math.min(1,G.done/TOTAL);c.save();if(G.sh>0)c.translate((Math.random()*5-2)|0,(Math.random()*5-2)|0);
 ['#0d1033','#1b1550','#2d1f6b','#4a2b82','#7a3d8c','#b25a86','#e09a7a'].forEach((k,i)=>R(-4,i*18,W+8,18,k));
 stars.forEach(s=>R(((s.x-G.off*.05)%W+W)%W,s.y,1,1,(Math.floor(G.t*2+s.s*5)%2)?'#fff':'#9fb0e0'));
 for(let x=-4;x<W+4;x+=2){const y=20+Math.sin((x+G.off*.1)/30+G.t*.7)*8+Math.sin(x/11-G.t)*2;c.globalAlpha=.13+.05*Math.sin(x/14+G.t);R(x,y,2,16,'#5dffc8');c.globalAlpha=.1;R(x,y+12,2,14,'#c27bff')}
 for(let i=0;i<5;i++){c.globalAlpha=.3+.3*Math.sin(G.t*2+i);const gx=((i*80-G.off*.2)%400+400)%400-30,gy=14+(i*17)%36+Math.sin(G.t+i)*3;RN[i%3].forEach((row,j)=>[...row].forEach((ch,q)=>{if(ch=='X')R(gx+q*2,gy+j*2,2,2,'#ffd54a')}))}
 c.globalAlpha=.4*p;R(-4,0,W+8,142,'#a0102a');c.globalAlpha=1;
 const mc=p>.4?'#ffc2a8':'#f4efd0';circ(256,36,22,mc+'22');circ(256,36,15,mc);circ(251,32,3,'#0002');circ(262,41,2,'#0002');circ(260,29,2,'#0002');
 for(let i=0;i<3;i++){const px=((i*210-G.off*.08)%630+630)%630-80;pyr(px,108,70+i*14,38+i*6,'#5c3a78');R(px+30,100,3,8,'#2a1458')}
 for(let i=0;i<5;i++){const px=((i*140+60-G.off*.12)%700+700)%700-30;R(px,96,5,14,'#6b4585');R(px-1,94,7,3,'#6b4585');R(px+1,91,3,2,'#ffd54a')}
 for(let x=-4;x<W+4;x+=2){let h=98+Math.sin((x+G.off*.15)/38)*10+Math.sin((x+G.off*.15)/17)*4;R(x,h,2,H,'#b9805a');
  h=122+Math.sin((x+G.off*.4)/30)*7;R(x,h,2,H,'#d6955f')}
 R(-4,142,W+8,H,'#e0a96d');for(let i=0;i<14;i++)R((((i*47-G.off)%340)+340)%340-10,156+(i%3)*8,12,1,'#c98f55');
 for(let i=0;i<4;i++)cactus(((i*130-G.off*.8)%520+520)%520-40,148);
 c.globalAlpha=.75;for(let a=0;a<6.28;a+=.3){R(G.mx+16+Math.cos(a+G.t)*30,GY+3+Math.sin(a+G.t)*5,2,1,'#ffd54a')}c.globalAlpha=1;
 G.en.slice().sort((a,b)=>b.x-a.x).forEach(e=>e.k=='A'?drawA(e.x,e.st=='aim'||e.st=='wait',G.t):drawE(e.x,G.t));
 if(G.flash<=0||Math.floor(G.t*20)%2)drawM(G.mx,G);
 G.wv.forEach(w=>{for(let k=0;k<3;k++){const r=w.r-k*10;if(r<4)continue;for(let an=-1.15;an<=1.15;an+=.12)R(w.ox+Math.cos(an)*r,GY-24+Math.sin(an)*r*.9,2,2,k==0?'#ffe9a3':k==1?'#fff':'#c9a0ff')}});
 G.ar.forEach(a=>{R(a.x,a.y,10,1,'#ddd');R(a.x-2,a.y-1,3,3,'#9aa');R(a.x+8,a.y-1,2,3,'#c33')});
 G.sp.forEach(s=>{R(s.x-6,s.y,6,3,'#7cff3a88');R(s.x,s.y,9,3,'#e8d9a0');R(s.x+9,s.y,3,3,'#fff')});
 G.pt.forEach(q=>R(q.x,q.y,2,2,q.k));
 motes.forEach(m=>R(m.x+Math.sin(G.t*2+m.ph)*3,m.y,2,2,'#ffe9a3cc'));
 if(G.flash>.3){c.globalAlpha=.3;R(-4,0,W+8,H,'#f00');c.globalAlpha=1}
 if(G.roar>.4){c.globalAlpha=.15;R(-4,0,W+8,H,'#fff');c.globalAlpha=1}
 c.restore();
 for(let i=0;i<3;i++)heart(6+i*17,6,2,i<G.hp?'#e8334a':'#2a3260');
 R(104,6,112,10,'#1a0d3d');R(106,8,108,6,'#2a3a7a');R(106,8,108*p,6,p>.7?'#ff5d3a':'#ffd54a');
 c.font='6px "Press Start 2P",monospace';c.textAlign='center';c.fillStyle='#fff';c.fillText(Math.round(p*100)+'%',160,14);
 if(G.combo>=2){c.textAlign='right';c.fillStyle='#ffd54a';c.font='7px "Press Start 2P",monospace';c.fillText('COMBO x'+G.combo,292,14)}
 if(G.ban>0){const a=Math.min(1,G.ban);c.globalAlpha=a;c.textAlign='center';c.font='16px "Press Start 2P",monospace';c.fillStyle='#1a0d3d';c.fillText(G.bt,162,74);c.fillStyle='#ffe9a3';c.fillText(G.bt,160,72);c.globalAlpha=1}
 if(G.cdB>0)R(6,24,Math.max(0,G.cdB/.7*20),2,'#bff8ff')}
function tick(ts){const dt=Math.min(.05,(ts-last)/1000);last=ts;if(page==3){if(running)update(dt);draw()}requestAnimationFrame(tick)}
function win(){if(!running)return;running=false;sfx.win();go(4)}

// ---------- input ----------
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if('ad'.includes(k)&&k.length==1)K[k]=true;if(k=='w'&&!e.repeat)block();if(k=='s'&&!e.repeat)destroy()});
addEventListener('keyup',e=>{K[e.key.toLowerCase()]=false});
document.querySelectorAll('.cb').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('dn');if(k=='w')block();else if(k=='s')destroy();else K[k]=true});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{b.classList.remove('dn');if(k=='a'||k=='d')K[k]=false}));
 b.addEventListener('contextmenu',e=>e.preventDefault())});

// ---------- flow ----------
const bar=$('#bar');for(let i=0;i<14;i++)bar.appendChild(document.createElement('i'));
$('#play').onclick=()=>{go(2);let n=0;bar.querySelectorAll('i').forEach(i=>i.classList.remove('f'));
 const iv=setInterval(()=>{bar.children[n++]?.classList.add('f');sfx.tick();if(n>=15){clearInterval(iv);go(3);startGame()}},170)};
$('#retry').onclick=startGame;$('#how').onclick=()=>$('#hw').classList.add('on');$('#hx').onclick=()=>$('#hw').classList.remove('on');
$('#nx').onclick=()=>go(5);
$('#home').onclick=()=>{go(1)};

// ---------- starry sky ----------
let skOn=false;function startSky(){if(skOn)return;skOn=true;const k=$('#sk'),x=k.getContext('2d');k.width=innerWidth/3|0;k.height=innerHeight/3|0;const w=k.width,h=k.height;
 const st=[...Array(Math.round(w*h/260))].map(()=>({x:Math.random()*w|0,y:Math.random()*h*.75|0,s:Math.random()*6}));let t0=performance.now(),tt=0;
 (function f(t){if(page!=5){skOn=false;return}tt+=(t-t0)/1000;t0=t;x.clearRect(0,0,w,h);
  x.fillStyle='rgba(255,233,163,.12)';x.beginPath();x.arc(w*.82,h*.17,14,0,7);x.fill();x.fillStyle='#ffe9a3';x.beginPath();x.arc(w*.82,h*.17,9,0,7);x.fill();
  st.forEach(q=>{x.fillStyle=Math.floor(tt*.8+q.s)%3?'#fff':'#8fa0e8';x.fillRect(q.x,q.y,1,1)});
  requestAnimationFrame(f)})(t0)}

// ---------- confetti ----------
let cfOn=false;function startCf(){const cf=$('#cf'),x=cf.getContext('2d');cf.width=innerWidth/3|0;cf.height=innerHeight/3|0;
 const cols=['#ff5d8f','#ffd54a','#ffd54a','#8f7bff','#fff','#6bdc6b'];
 const ps=[...Array(110)].map(()=>({x:Math.random()*cf.width,y:-Math.random()*cf.height,v:20+Math.random()*40,s:2+(Math.random()*2|0),k:cols[Math.random()*6|0],w:Math.random()*6}));
 if(cfOn)return;cfOn=true;let t0=performance.now();
 (function f(t){if(page!=5){cfOn=false;return}const dt=(t-t0)/1000;t0=t;x.clearRect(0,0,cf.width,cf.height);
  ps.forEach(p=>{p.y+=p.v*dt;p.w+=dt*4;p.x+=Math.sin(p.w)*.4;if(p.y>cf.height){p.y=-4;p.x=Math.random()*cf.width}x.fillStyle=p.k;x.fillRect(p.x|0,p.y|0,p.s,p.s)});requestAnimationFrame(f)})(t0)}