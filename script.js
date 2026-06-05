/* ── Canvas ── */
const cv=document.getElementById('c'),cx=cv.getContext('2d'),W=800,H=640,OFFSET_Y=80;
const CL=[213,148,105],CM=[167,109,69],CD=[90,45,15],CB=[12,5,1];
function r(c,a=1){return `rgba(${c[0]},${c[1]},${c[2]},${a})`;}
function drawBgGlobal(){cx.clearRect(0,0,W,H);cx.strokeStyle=r(CM,0.04);cx.lineWidth=0.5;for(let x=0;x<W;x+=35){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}for(let y=0;y<H;y+=35){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}}
const MC={ox:145,oy:25,scale:0.9,W:500,H:320,bars:[22,42,62,45,55,78,100],BW:44,GAP:14};
MC.AX=45;MC.AY=20;MC.AW=430;MC.AH=250;MC.BASE=MC.AY+MC.AH;MC.totalW=MC.bars.length*(MC.BW+MC.GAP)-MC.GAP;MC.SX=MC.AX+(MC.AW-MC.totalW)/2;
function mc_bx(i){return MC.SX+i*(MC.BW+MC.GAP);}function mc_bcx(i){return mc_bx(i)+MC.BW/2;}function mc_topY(i){return MC.BASE-(MC.bars[i]/100)*MC.AH;}
function mc_getCurveY(pts,x){if(!pts||pts.length<2)return MC.BASE;for(let i=1;i<pts.length;i++){if(pts[i].x>=x){const a=pts[i-1],b=pts[i],t=(x-a.x)/(b.x-a.x+0.001);return a.y+(b.y-a.y)*t;}}return pts[pts.length-1].y;}
function mc_buildCurve(p){const prog=Math.min(1,p*1.2);const allPts=[{x:MC.SX-40,y:MC.BASE-MC.AH*0.02},{x:MC.SX+MC.totalW*0.28+15,y:MC.BASE-MC.AH*0.30},{x:MC.SX+MC.totalW*0.52+45,y:MC.BASE-MC.AH*0.16},{x:MC.SX+MC.totalW+40,y:MC.BASE-MC.AH*0.72}];const endX=allPts[0].x+(allPts[allPts.length-1].x-allPts[0].x)*prog;const pts=[];for(let i=0;i<allPts.length-1;i++){const p0=allPts[Math.max(0,i-1)],p1=allPts[i],p2=allPts[i+1],p3=allPts[Math.min(allPts.length-1,i+2)];for(let s=(i===0?0:1);s<=80;s++){const t=s/80,t2=t*t,t3=t2*t;const px=0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3);const py=0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3);if(px>endX)break;pts.push({x:px,y:py});}}return pts;}
function mc_drawBar(i,p,curvePts){const bp=Math.max(0,Math.min(1,p*MC.bars.length-i*0.35));const animH=(MC.bars[i]/100)*MC.AH*bp;if(animH<1)return;const x=mc_bx(i),y=MC.BASE-animH;const cyL=mc_getCurveY(curvePts,x),cyR=mc_getCurveY(curvePts,x+MC.BW),curveY=mc_getCurveY(curvePts,x+MC.BW/2);const bp2=new Path2D();bp2.rect(x,y,MC.BW,animH);cx.save();cx.shadowColor=r(CM,0.5);cx.shadowBlur=18;cx.fillStyle=r(CM,0);cx.fill(bp2);cx.shadowBlur=0;cx.save();cx.clip(bp2);let hG=cx.createLinearGradient(x,0,x+MC.BW,0);hG.addColorStop(0,r(CD,0.85));hG.addColorStop(0.15,r(CM,0.55));hG.addColorStop(0.45,r(CL,0.40));hG.addColorStop(0.65,r(CM,0.45));hG.addColorStop(1,r(CD,0.80));cx.fillStyle=hG;cx.fillRect(x,y,MC.BW,animH);let vG=cx.createLinearGradient(x,y,x,MC.BASE);vG.addColorStop(0,'rgba(0,0,0,0.35)');vG.addColorStop(0.4,'rgba(0,0,0,0.1)');vG.addColorStop(0.75,r(CM,0.15));vG.addColorStop(1,r(CL,0.35));cx.fillStyle=vG;cx.fillRect(x,y,MC.BW,animH);cx.restore();cx.save();cx.clip(bp2);cx.beginPath();cx.moveTo(x,Math.max(cyL,y));cx.lineTo(x+MC.BW,Math.max(cyR,y));cx.lineTo(x+MC.BW,MC.BASE);cx.lineTo(x,MC.BASE);cx.closePath();let dk=cx.createLinearGradient(x,curveY,x,MC.BASE);dk.addColorStop(0,'rgba(0,0,0,0.45)');dk.addColorStop(0.6,'rgba(0,0,0,0.72)');dk.addColorStop(1,'rgba(0,0,0,0.88)');cx.fillStyle=dk;cx.fill();cx.restore();cx.save();cx.clip(bp2);let lsh=cx.createLinearGradient(x,y,x,MC.BASE);lsh.addColorStop(0,r(CL,0.9));lsh.addColorStop(0.3,r(CM,0.7));lsh.addColorStop(0.7,r(CD,0.5));lsh.addColorStop(1,r(CL,0.8));cx.fillStyle=lsh;cx.fillRect(x,y,MC.BW*0.04,animH);let tsh=cx.createLinearGradient(0,y,0,y+16);tsh.addColorStop(0,'rgba(255,255,255,0.4)');tsh.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=tsh;cx.fillRect(x,y,MC.BW,16);cx.restore();cx.save();cx.shadowColor=r(CL,0.5);cx.shadowBlur=6;cx.strokeStyle=r(CL,0.3);cx.lineWidth=0.7;cx.strokeRect(x,y,MC.BW,animH);cx.restore();cx.restore();}
function mc_drawCurve(pts){if(!pts||pts.length<2)return;cx.save();cx.beginPath();cx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)cx.lineTo(pts[i].x,pts[i].y);cx.shadowColor=r(CM,0.8);cx.shadowBlur=18;cx.strokeStyle=r(CD,0.6);cx.lineWidth=7;cx.stroke();cx.shadowBlur=10;cx.strokeStyle=r(CM,0.85);cx.lineWidth=4;cx.stroke();cx.shadowBlur=6;cx.strokeStyle=r(CL,0.55);cx.lineWidth=1.5;cx.stroke();cx.restore();}
function mc_drawArrow(p){const x1=mc_bcx(0),y1=mc_topY(0)-30,x2=mc_bcx(6)+10,y2=mc_topY(6)-45;const knots=[{x:x1,y:y1},{x:mc_bcx(2),y:mc_topY(2)-27},{x:mc_bcx(3),y:mc_topY(3)-25},{x:x2,y:y2}];const tot=knots.length-1,maxPt=p*tot,maxI=Math.floor(maxPt),frac=maxPt-maxI;cx.save();cx.shadowColor=r(CL,0.9);cx.shadowBlur=20;cx.strokeStyle=r(CL,0.95);cx.lineWidth=2;cx.lineJoin='round';cx.lineCap='round';cx.beginPath();cx.moveTo(knots[0].x,knots[0].y);for(let i=1;i<=Math.min(maxI,tot);i++)cx.lineTo(knots[i].x,knots[i].y);if(frac>0&&maxI<tot){const a=knots[maxI],b=knots[maxI+1];cx.lineTo(a.x+(b.x-a.x)*frac,a.y+(b.y-a.y)*frac);}cx.stroke();[1,2].forEach(idx=>{if(p*tot>=idx+0.1){const pt=knots[idx];cx.shadowBlur=18;cx.beginPath();cx.arc(pt.x,pt.y,10,0,Math.PI*2);cx.fillStyle=r(CL,0.12);cx.fill();cx.shadowBlur=14;cx.beginPath();cx.arc(pt.x,pt.y,5,0,Math.PI*2);cx.fillStyle=r(CL,0.9);cx.fill();}});if(p>0.95){const last=knots[knots.length-1],prev=knots[knots.length-2];const ang=Math.atan2(last.y-prev.y,last.x-prev.x),al=16;cx.shadowBlur=20;cx.fillStyle=r(CL,1);cx.beginPath();cx.moveTo(last.x,last.y);cx.lineTo(last.x-Math.cos(ang-0.35)*al,last.y-Math.sin(ang-0.35)*al);cx.lineTo(last.x-Math.cos(ang+0.35)*al,last.y-Math.sin(ang+0.35)*al);cx.closePath();cx.fill();}cx.restore();}
const SC={ox:70,oy:230,scale:0.52,W:340,H:215,PX:15,PY:15,PW:310,PH:180};SC.AX=SC.PX+35;SC.AY=SC.PY+12;SC.AW=SC.PW-48;SC.AH=SC.PH-24;SC.BASE=SC.AY+SC.AH;const SC_bars=[42,58,74,88],SC_BW=28,SC_GAP=14,SC_totalW=SC_bars.length*(SC_BW+SC_GAP)-SC_GAP;
function sc_drawPanel(){cx.save();cx.beginPath();cx.roundRect(SC.PX,SC.PY,SC.PW,SC.PH,8);let pg=cx.createLinearGradient(SC.PX,SC.PY,SC.PX+SC.PW,SC.PY+SC.PH);pg.addColorStop(0,'rgba(35,20,8,0.75)');pg.addColorStop(0.5,'rgba(20,11,4,0.82)');pg.addColorStop(1,'rgba(12,6,2,0.88)');cx.fillStyle=pg;cx.fill();cx.strokeStyle=r(CL,0.3);cx.lineWidth=1;cx.stroke();cx.beginPath();cx.roundRect(SC.PX+1,SC.PY+1,SC.PW-2,40,[8,8,0,0]);let ts=cx.createLinearGradient(0,SC.PY,0,SC.PY+40);ts.addColorStop(0,'rgba(255,255,255,0.08)');ts.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=ts;cx.fill();cx.restore();}
function sc_drawAxes(){cx.save();cx.setLineDash([2,5]);cx.strokeStyle=r(CM,0.18);cx.lineWidth=0.6;[0.25,0.5,0.75,1].forEach(f=>{const y=SC.BASE-SC.AH*f;cx.beginPath();cx.moveTo(SC.AX,y);cx.lineTo(SC.AX+SC.AW,y);cx.stroke();});cx.setLineDash([]);cx.strokeStyle=r(CM,0.3);cx.lineWidth=1;cx.beginPath();cx.moveTo(SC.AX,SC.BASE);cx.lineTo(SC.AX+SC.AW,SC.BASE);cx.stroke();cx.beginPath();cx.moveTo(SC.AX,SC.AY);cx.lineTo(SC.AX,SC.BASE);cx.stroke();cx.fillStyle=r(CM,0.4);cx.font='9px monospace';cx.textAlign='right';['25','50','75','100'].forEach((l,i)=>cx.fillText(l,SC.AX-5,SC.BASE-SC.AH*(i+1)*0.25+3));cx.restore();}
function sc_drawBars(p){const startX=SC.AX+(SC.AW-SC_totalW)/2,midX=startX+SC_totalW*0.65;let glow=cx.createRadialGradient(midX,SC.BASE,0,midX,SC.BASE-60,160);glow.addColorStop(0,r(CL,0.35*p));glow.addColorStop(0.4,r(CM,0.12*p));glow.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=glow;cx.fillRect(SC.AX,SC.AY,SC.AW,SC.AH+10);SC_bars.forEach((h,i)=>{const bp=Math.max(0,Math.min(1,p*SC_bars.length-i*0.6));const animH=(h/100)*SC.AH*bp;if(animH<1)return;const bx=startX+i*(SC_BW+SC_GAP),by=SC.BASE-animH;cx.save();const bp2=new Path2D();bp2.rect(bx,by,SC_BW,animH);cx.shadowColor=r(CL,0.9);cx.shadowBlur=22;cx.save();cx.clip(bp2);let grad=cx.createRadialGradient(bx+SC_BW/2,SC.BASE,0,bx+SC_BW/2,SC.BASE,animH*1.3);grad.addColorStop(0,r(CM,0.15));grad.addColorStop(0.45,r(CL,0.30));grad.addColorStop(1,r(CL,0.40));cx.fillStyle=grad;cx.fillRect(bx,by,SC_BW,animH);let shine=cx.createLinearGradient(0,by,0,by+animH*0.45);shine.addColorStop(0,r(CL,0.18));shine.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=shine;cx.fillRect(bx,by,SC_BW,animH*0.45);let lsh=cx.createLinearGradient(bx,by,bx,SC.BASE);lsh.addColorStop(0,r(CL,0.55));lsh.addColorStop(0.4,r(CM,0.35));lsh.addColorStop(1,r(CD,0.2));cx.fillStyle=lsh;cx.fillRect(bx,by,SC_BW*0.04,animH);cx.restore();cx.shadowColor=r(CL,0.8);cx.shadowBlur=22;cx.strokeStyle=r(CL,0.55);cx.lineWidth=1.2;cx.stroke(bp2);cx.restore();});const ghostH=(90/100)*SC.AH,ghostX=startX+4*(SC_BW+SC_GAP),ghostY=SC.BASE-ghostH,ghostP=Math.max(0,Math.min(1,(p-0.6)*2.5));if(ghostP>0){cx.save();let gf=cx.createLinearGradient(ghostX,ghostY,ghostX,SC.BASE);gf.addColorStop(0,r(CL,0.12*ghostP));gf.addColorStop(0.4,r(CM,0.08*ghostP));gf.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gf;cx.beginPath();cx.roundRect(ghostX,ghostY,SC_BW,ghostH,[3,3,0,0]);cx.fill();cx.shadowColor=r(CL,0.3*ghostP);cx.shadowBlur=6;cx.strokeStyle=r(CL,0.18*ghostP);cx.lineWidth=0.6;cx.beginPath();cx.roundRect(ghostX,ghostY,SC_BW,ghostH,[3,3,0,0]);cx.stroke();cx.restore();}}
const SB={ox:240,oy:289,scale:0.55,AX:48,AY:18,AW:252,AH:120,BASE:138};const SB_bars=[52,64,78,92],SB_BW=32,SB_GAP=18,SB_totalW=SB_bars.length*(SB_BW+SB_GAP)-SB_GAP,SB_SX=SB.AX+(SB.AW-SB_totalW)/2;
function sb_drawAxes(){cx.save();cx.setLineDash([2,5]);cx.strokeStyle=r(CM,0.32);cx.lineWidth=0.7;[0.25,0.5,0.75,1].forEach(f=>{const y=SB.BASE-SB.AH*f;cx.beginPath();cx.moveTo(SB.AX,y);cx.lineTo(SB.AX+SB.AW,y);cx.stroke();});cx.setLineDash([]);cx.shadowColor=r(CL,0.9);cx.shadowBlur=10;cx.strokeStyle=r(CL,0.75);cx.lineWidth=1.4;cx.beginPath();cx.moveTo(SB.AX,SB.BASE);cx.lineTo(SB.AX+SB.AW,SB.BASE);cx.stroke();cx.shadowBlur=22;cx.strokeStyle=r(CM,0.35);cx.lineWidth=3.5;cx.beginPath();cx.moveTo(SB.AX,SB.BASE);cx.lineTo(SB.AX+SB.AW,SB.BASE);cx.stroke();cx.shadowBlur=0;cx.shadowColor=r(CL,0.8);cx.shadowBlur=8;cx.strokeStyle=r(CL,0.65);cx.lineWidth=1.2;cx.beginPath();cx.moveTo(SB.AX,SB.AY);cx.lineTo(SB.AX,SB.BASE);cx.stroke();cx.shadowBlur=18;cx.strokeStyle=r(CM,0.28);cx.lineWidth=3;cx.beginPath();cx.moveTo(SB.AX,SB.AY);cx.lineTo(SB.AX,SB.BASE);cx.stroke();cx.restore();}
function sb_drawBars(p){const LIFT=14;SB_bars.forEach((h,i)=>{const isActive=i===3,bp=Math.max(0,Math.min(1,p*SB_bars.length-i*0.5)),animH=(h/100)*SB.AH*bp;if(animH<1)return;const bx=SB_SX+i*(SB_BW+SB_GAP),by=SB.BASE-animH-LIFT;cx.save();const bp2=new Path2D();bp2.rect(bx,by,SB_BW,animH);if(isActive){cx.shadowColor=r(CL,0.9);cx.shadowBlur=22;cx.save();cx.clip(bp2);let grad=cx.createRadialGradient(bx+SB_BW/2,SB.BASE,0,bx+SB_BW/2,SB.BASE,animH*1.3);grad.addColorStop(0,r(CM,0.15));grad.addColorStop(0.45,r(CL,0.30));grad.addColorStop(1,r(CL,0.40));cx.fillStyle=grad;cx.fillRect(bx,by,SB_BW,animH);let shine=cx.createLinearGradient(0,by,0,by+animH*0.45);shine.addColorStop(0,r(CL,0.18));shine.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=shine;cx.fillRect(bx,by,SB_BW,animH*0.45);cx.restore();cx.shadowColor=r(CL,0.8);cx.shadowBlur=22;cx.strokeStyle=r(CL,0.55);cx.lineWidth=1.2;cx.stroke(bp2);}else{cx.save();cx.clip(bp2);let grad=cx.createRadialGradient(bx+SB_BW/2,SB.BASE,0,bx+SB_BW/2,by,animH);grad.addColorStop(0,r(CD,0.2));grad.addColorStop(0.5,r(CM,0.1));grad.addColorStop(1,r(CL,0.06));cx.fillStyle=grad;cx.fillRect(bx,by,SB_BW,animH);cx.restore();cx.shadowColor=r(CL,0.3);cx.shadowBlur=4;cx.strokeStyle=r(CL,0.22);cx.lineWidth=0.8;cx.stroke(bp2);}cx.restore();});const x1=SB_SX+SB_BW/2,y1=SB.BASE-(SB_bars[0]/100)*SB.AH-22-14,x2=SB_SX+2.5*(SB_BW+SB_GAP)+SB_BW/2,y2=SB.BASE-(SB_bars[3]/100)*SB.AH*0.85-32-14,cpx=x1+(x2-x1)*0.5,cpy=y1+(y2-y1)*0.5+22;cx.save();cx.shadowColor=r(CL,0.7);cx.shadowBlur=35;cx.strokeStyle=r(CM,0.25);cx.lineWidth=4;cx.beginPath();const steps=80,maxStep=Math.floor(steps*p);for(let i=0;i<=maxStep;i++){const t=i/steps,mt=1-t;const bx2=mt*mt*x1+2*mt*t*cpx+t*t*x2,by2=mt*mt*y1+2*mt*t*cpy+t*t*y2;if(i===0)cx.moveTo(bx2,by2);else cx.lineTo(bx2,by2);}cx.stroke();cx.shadowBlur=8;cx.strokeStyle=r(CL,0.7);cx.lineWidth=0.8;cx.beginPath();for(let i=0;i<=maxStep;i++){const t=i/steps,mt=1-t;const bx2=mt*mt*x1+2*mt*t*cpx+t*t*x2,by2=mt*mt*y1+2*mt*t*cpy+t*t*y2;if(i===0)cx.moveTo(bx2,by2);else cx.lineTo(bx2,by2);}cx.stroke();if(p>0.92){const t1=0.96,mt1=1-t1,bxa=mt1*mt1*x1+2*mt1*t1*cpx+t1*t1*x2,bya=mt1*mt1*y1+2*mt1*t1*cpy+t1*t1*y2,ang=Math.atan2(y2-bya,x2-bxa),al=10;cx.shadowBlur=15;cx.strokeStyle=r(CL,0.7);cx.lineWidth=1.5;cx.beginPath();cx.moveTo(x2,y2);cx.lineTo(x2-Math.cos(ang-0.42)*al,y2-Math.sin(ang-0.42)*al);cx.moveTo(x2,y2);cx.lineTo(x2-Math.cos(ang+0.42)*al,y2-Math.sin(ang+0.42)*al);cx.stroke();}cx.restore();}
const PIE={ox:75,oy:30,scale:0.648,CX:100,CY:100,RAD:72,GAP:0.055};const pie_segs=[{pct:25,filled:true},{pct:23},{pct:10},{pct:15},{pct:27}];const pie_activeSweep=(pie_segs[0].pct/100)*Math.PI*2,pie_activeCenter=-Math.PI/4,pie_startAngle=pie_activeCenter-pie_activeSweep/2;
function pie_draw(p){let angle=pie_startAngle;const segAngles=[];pie_segs.forEach(seg=>{const tot=(seg.pct/100)*Math.PI*2;segAngles.push({start:angle,sweep:tot-PIE.GAP,seg});angle+=tot;});segAngles.forEach(({start,sweep,seg},i)=>{const segP=Math.max(0,Math.min(1,p*pie_segs.length-i*0.4)),animSweep=sweep*segP;if(animSweep<=0)return;cx.save();let ox=0,oy=0;if(seg.filled){const mid=start+sweep/2,off=7;ox=Math.cos(mid)*off;oy=Math.sin(mid)*off;cx.shadowColor=r(CL,0.8);cx.shadowBlur=22;}cx.beginPath();cx.moveTo(PIE.CX+ox,PIE.CY+oy);cx.arc(PIE.CX+ox,PIE.CY+oy,PIE.RAD,start,start+animSweep);cx.closePath();if(seg.filled){let grad=cx.createRadialGradient(PIE.CX+ox,PIE.CY+oy,0,PIE.CX+ox,PIE.CY+oy,PIE.RAD);grad.addColorStop(0,r(CM,0.15));grad.addColorStop(0.5,r(CL,0.25));grad.addColorStop(1,r(CL,0.35));cx.fillStyle=grad;cx.fill();cx.beginPath();cx.moveTo(PIE.CX+ox,PIE.CY+oy);cx.arc(PIE.CX+ox,PIE.CY+oy,PIE.RAD,start,start+animSweep*0.45);cx.closePath();cx.fillStyle=r(CL,0.12);cx.fill();cx.beginPath();cx.moveTo(PIE.CX+ox,PIE.CY+oy);cx.arc(PIE.CX+ox,PIE.CY+oy,PIE.RAD,start,start+animSweep);cx.closePath();cx.strokeStyle=r(CL,0.55);cx.lineWidth=1.2;cx.stroke();}else{let grad=cx.createRadialGradient(PIE.CX,PIE.CY,0,PIE.CX,PIE.CY,PIE.RAD);grad.addColorStop(0,r(CD,0.2));grad.addColorStop(1,r(CM,0.08));cx.fillStyle=grad;cx.fill();cx.beginPath();cx.moveTo(PIE.CX,PIE.CY);cx.arc(PIE.CX,PIE.CY,PIE.RAD,start,start+animSweep);cx.closePath();cx.strokeStyle=r(CL,0.18);cx.lineWidth=0.8;cx.stroke();}cx.restore();});cx.save();angle=pie_startAngle;pie_segs.forEach(seg=>{const tot=(seg.pct/100)*Math.PI*2;cx.strokeStyle='rgb(5,3,2)';cx.lineWidth=4;cx.lineCap='butt';cx.beginPath();cx.moveTo(PIE.CX,PIE.CY);cx.lineTo(PIE.CX+Math.cos(angle)*(PIE.RAD+2),PIE.CY+Math.sin(angle)*(PIE.RAD+2));cx.stroke();angle+=tot;});cx.restore();}
const LP={ox:40,oy:120,scale:0.765,W:160,H:200,rows:4,PX:14,PY:30,ROW_H:26};LP.PH=LP.rows*LP.ROW_H;LP.VBX=LP.W-22;LP.VBY=LP.PY-4;LP.VBH=LP.PH+8;
function lp_draw(p){for(let i=0;i<LP.rows;i++){const prog=Math.max(0,Math.min(1,p*LP.rows-i*0.5));if(prog<=0)continue;const ry=LP.PY+i*LP.ROW_H,dotX=LP.PX+6,dotY=ry+LP.ROW_H/2;cx.save();cx.globalAlpha=prog;let dg=cx.createRadialGradient(dotX,dotY,0,dotX,dotY,8);dg.addColorStop(0,r(CL,0.35));dg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=dg;cx.fillRect(dotX-8,dotY-8,16,16);cx.beginPath();cx.arc(dotX,dotY,3,0,Math.PI*2);let dotG=cx.createRadialGradient(dotX-1,dotY-1,0,dotX,dotY,3);dotG.addColorStop(0,r(CL,0.95));dotG.addColorStop(1,r(CM,0.55));cx.fillStyle=dotG;cx.fill();cx.restore();cx.save();cx.globalAlpha=prog;const lx=LP.PX+18,maxW=LP.VBX-lx-10,lw1=maxW*(0.6+i*0.06),lw2=maxW*(0.35+i*0.04);let lg1=cx.createLinearGradient(lx,0,lx+lw1,0);lg1.addColorStop(0,r(CL,0.6));lg1.addColorStop(1,r(CL,0.04));cx.fillStyle=lg1;cx.beginPath();cx.roundRect(lx,dotY-5,lw1,3.5,2);cx.fill();let lg2=cx.createLinearGradient(lx,0,lx+lw2,0);lg2.addColorStop(0,r(CM,0.38));lg2.addColorStop(1,r(CM,0.02));cx.fillStyle=lg2;cx.beginPath();cx.roundRect(lx,dotY+2,lw2,2.5,2);cx.fill();cx.restore();}cx.save();let vg=cx.createLinearGradient(0,LP.VBY,0,LP.VBY+LP.VBH);vg.addColorStop(0,r(CL,0.25));vg.addColorStop(0.5,r(CM,0.18));vg.addColorStop(1,r(CD,0.05));cx.fillStyle=vg;cx.beginPath();cx.roundRect(LP.VBX,LP.VBY,4,LP.VBH*p,2);cx.fill();cx.restore();}
function drawGearShape(gx,gy,outerR,innerR,holeR,teeth,angle,bearing=false,glass=false,grey=false,brightHole=false){cx.save();cx.translate(gx,gy);cx.rotate(angle);const TAU=Math.PI*2,step=TAU/teeth,half=step*0.5,trap=half*0.1;let og=cx.createRadialGradient(0,0,innerR,0,0,outerR*1.5);og.addColorStop(0,r(CM,0.2));og.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=og;cx.beginPath();cx.arc(0,0,outerR*1.5,0,TAU);cx.fill();cx.beginPath();for(let i=0;i<teeth;i++){const a=(i/teeth)*TAU-Math.PI/2;cx.arc(0,0,innerR,a,a+half);cx.lineTo(Math.cos(a+half+trap)*outerR,Math.sin(a+half+trap)*outerR);cx.arc(0,0,outerR,a+half+trap,a+step-trap);cx.lineTo(Math.cos(a+step)*innerR,Math.sin(a+step)*innerR);}cx.closePath();if(glass){let mf;if(grey){mf=cx.createRadialGradient(-outerR*0.15,-outerR*0.2,0,0,0,outerR);mf.addColorStop(0,'rgba(180,180,185,0.13)');mf.addColorStop(0.5,'rgba(130,130,140,0.09)');mf.addColorStop(1,'rgba(80,80,90,0.12)');}else{mf=cx.createRadialGradient(-outerR*0.15,-outerR*0.2,0,0,0,outerR);mf.addColorStop(0,r(CL,0.04));mf.addColorStop(0.5,r(CM,0.06));mf.addColorStop(1,r(CD,0.10));}cx.fillStyle=mf;cx.fill();let hl=cx.createLinearGradient(-outerR*0.6,-outerR*0.7,outerR*0.1,outerR*0.1);hl.addColorStop(0,grey?'rgba(220,220,230,0.16)':'rgba(255,210,160,0.13)');hl.addColorStop(0.4,grey?'rgba(180,180,190,0.07)':'rgba(255,185,110,0.05)');hl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=hl;cx.fill();}else{let mf=cx.createRadialGradient(-outerR*0.2,-outerR*0.25,0,0,0,outerR);mf.addColorStop(0,r(CM,0.92));mf.addColorStop(0.3,r(CD,0.82));mf.addColorStop(0.7,r([50,22,6],0.9));mf.addColorStop(1,r(CB,0.97));cx.fillStyle=mf;cx.fill();let hl=cx.createLinearGradient(-outerR,-outerR,outerR*0.3,outerR*0.3);hl.addColorStop(0,'rgba(255,200,140,0.22)');hl.addColorStop(0.5,'rgba(255,170,90,0.07)');hl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=hl;cx.fill();}cx.strokeStyle=r(CL,0.55);cx.lineWidth=1.8;cx.stroke();cx.save();cx.globalCompositeOperation='destination-out';cx.beginPath();cx.arc(0,0,holeR,0,TAU);cx.fillStyle='rgba(0,0,0,1)';cx.fill();cx.restore();cx.beginPath();cx.arc(0,0,holeR,0,TAU);if(brightHole){cx.shadowColor=r(CL,1);cx.shadowBlur=14;cx.strokeStyle=r(CL,0.85);cx.lineWidth=2.2;}else{cx.strokeStyle=r(CL,0.4);cx.lineWidth=1.5;}cx.stroke();cx.shadowBlur=0;if(bearing){const raceR=holeR*0.6,band=(holeR-raceR)*0.28,ringOuter=raceR+band,ringInner=raceR-band;cx.beginPath();cx.arc(0,0,ringOuter,0,Math.PI*2);cx.arc(0,0,ringInner,0,Math.PI*2,true);cx.closePath();let rf=cx.createRadialGradient(0,0,ringInner,0,0,ringOuter);rf.addColorStop(0,r(CD,0.2));rf.addColorStop(1,r(CM,0.08));cx.fillStyle=rf;cx.fill();cx.beginPath();cx.arc(0,0,ringOuter,0,Math.PI*2);cx.strokeStyle=r(CL,0.5);cx.lineWidth=1.8;cx.stroke();cx.beginPath();cx.arc(0,0,ringInner,0,Math.PI*2);cx.strokeStyle=r(CL,0.35);cx.lineWidth=1.5;cx.stroke();cx.beginPath();cx.arc(0,0,raceR,0,Math.PI*2);cx.strokeStyle=r(CB,0.55);cx.lineWidth=(ringOuter-ringInner)*0.825;cx.stroke();}cx.restore();}
function drawGearConnectors(p){if(p<0.75)return;const a=Math.min(1,(p-0.75)/0.25);cx.save();cx.lineCap='round';cx.lineJoin='round';const R=8,OY=OFFSET_Y;{const startX=723,startY=165+OY,rightX=731,endY=254+OY,endX=676;cx.shadowColor=`rgba(255,190,110,${0.95*a})`;cx.shadowBlur=12;cx.strokeStyle=`rgba(255,210,140,${0.98*a})`;cx.lineWidth=1.2;cx.beginPath();cx.moveTo(startX,startY);cx.lineTo(rightX-R,startY);cx.arcTo(rightX,startY,rightX,startY+R,R);cx.lineTo(rightX,endY-R);cx.arcTo(rightX,endY,rightX-R,endY,R);cx.lineTo(endX,endY);cx.stroke();const as=7;cx.fillStyle=`rgba(255,210,140,${0.98*a})`;cx.beginPath();cx.moveTo(endX,endY);cx.lineTo(endX+as*1.2,endY-as*0.55);cx.lineTo(endX+as*1.2,endY+as*0.55);cx.closePath();cx.fill();}{const x1=544,y1=254+OY,xc=521,x2=521,y2=272+OY;cx.shadowColor=`rgba(180,110,50,${0.6*a})`;cx.shadowBlur=7;cx.strokeStyle=`rgba(190,130,70,${0.8*a})`;cx.lineWidth=1.2;cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(xc+R,y1);cx.arcTo(xc,y1,xc,y1+R,R);cx.lineTo(x2,y2);cx.stroke();const as=7;cx.fillStyle=`rgba(190,130,70,${0.8*a})`;cx.beginPath();cx.moveTo(x2,y2);cx.lineTo(x2-as*0.55,y2-as*1.2);cx.lineTo(x2+as*0.55,y2-as*1.2);cx.closePath();cx.fill();}{const startX=700,startY=137+OY,midY=63+OY,bigCX=628,bottomY=171+OY,endX=568,fadeZone=38,seg1=startY-midY,seg2=startX-bigCX,seg3=bottomY-midY,seg4=bigCX-endX,total=seg1+seg2+seg3+seg4,drawn=a*total;const pts=[];for(let i=0;i<=60;i++)pts.push({x:startX,y:startY-(startY-midY)*i/60,d:seg1*i/60});for(let i=1;i<=60;i++)pts.push({x:startX-(startX-bigCX)*i/60,y:midY,d:seg1+seg2*i/60});for(let i=1;i<=60;i++)pts.push({x:bigCX,y:midY+(bottomY-midY)*i/60,d:seg1+seg2+seg3*i/60});for(let i=1;i<=60;i++)pts.push({x:bigCX-(bigCX-endX)*i/60,y:bottomY,d:seg1+seg2+seg3+seg4*i/60});const corners=[seg1,seg1+seg2,seg1+seg2+seg3],getFade=d=>{let m=fadeZone;for(const c of corners)m=Math.min(m,Math.abs(d-c));return Math.min(1,m/fadeZone);};cx.lineWidth=1.2;for(let i=1;i<pts.length;i++){if(pts[i].d>drawn)break;const fade=Math.min(getFade(pts[i-1].d),getFade(pts[i].d)),fa=fade*a;cx.save();cx.shadowColor=`rgba(180,110,50,${fa*0.6})`;cx.shadowBlur=7*fa;cx.strokeStyle=`rgba(190,130,70,${fa*0.8})`;cx.beginPath();cx.moveTo(pts[i-1].x,pts[i-1].y);cx.lineTo(pts[i].x,pts[i].y);cx.stroke();cx.restore();}if(drawn>=total-2){const as=7;cx.save();cx.shadowColor=`rgba(180,110,50,${0.6*a})`;cx.shadowBlur=7;cx.fillStyle=`rgba(190,130,70,${0.8*a})`;cx.beginPath();cx.moveTo(endX,bottomY);cx.lineTo(endX+as*1.2,bottomY-as*0.55);cx.lineTo(endX+as*1.2,bottomY+as*0.55);cx.closePath();cx.fill();cx.restore();}}cx.restore();}
function drawConnectors(p){if(p<0.8)return;const a=(p-0.8)/0.2;cx.save();const scLeft=85,scBottom=230+180*0.52+OFFSET_Y,sbAxisX=240+48*0.55+10-30,cornerY=scBottom+18;cx.globalAlpha=a*0.65;cx.strokeStyle='rgba(190,128,80,0.85)';cx.lineWidth=1.1;cx.lineCap='round';cx.lineJoin='round';const totalLen=(cornerY-scBottom)+(sbAxisX-scLeft),drawLen=totalLen*Math.min(1,(p-0.5)*2.5),seg1=cornerY-scBottom;cx.beginPath();if(drawLen<=seg1){cx.moveTo(scLeft,scBottom);cx.lineTo(scLeft,scBottom+drawLen);}else{const hLen=drawLen-seg1;cx.moveTo(scLeft,scBottom);cx.lineTo(scLeft,cornerY-6);cx.arcTo(scLeft,cornerY,scLeft+6,cornerY,6);cx.lineTo(scLeft+hLen,cornerY);}cx.stroke();if(drawLen>=totalLen-5){cx.shadowColor='rgba(213,148,105,0.5)';cx.shadowBlur=6;cx.beginPath();cx.moveTo(sbAxisX,cornerY);cx.lineTo(sbAxisX-8,cornerY-5);cx.moveTo(sbAxisX,cornerY);cx.lineTo(sbAxisX-8,cornerY+5);cx.stroke();}cx.restore();}

let gearAngle=0,last=null,startT=null;
const DUR=2600;
function ease(t){return 1-Math.pow(1-t,3);}
function withTransform(ox,oy,scale,fn){cx.save();cx.translate(ox,oy);cx.scale(scale,scale);fn();cx.restore();}
function resizeCanvas(){const dpr=window.devicePixelRatio||1;cv.width=800*dpr;cv.height=640*dpr;cx.setTransform(dpr,0,0,dpr,0,0);}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

function frame(ts){
  if(!startT)startT=ts;if(!last)last=ts;
  const dt=(ts-last)/1000;last=ts;gearAngle+=dt*0.35;
  const t=Math.min(1,(ts-startT)/DUR),p=ease(t);
  cx.clearRect(0,0,W,H);drawBgGlobal();
  cx.save();const gx=W*0.52,gy=H*0.54;let wg=cx.createRadialGradient(gx,gy,0,gx,gy,480);wg.addColorStop(0,`rgba(90,42,12,${0.65*p})`);wg.addColorStop(0.3,`rgba(70,32,8,${0.50*p})`);wg.addColorStop(0.55,`rgba(45,18,4,${0.28*p})`);wg.addColorStop(0.8,`rgba(20,8,2,${0.10*p})`);wg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=wg;cx.fillRect(0,0,W,H);cx.restore();
  withTransform(MC.ox,MC.oy+OFFSET_Y,MC.scale,()=>{cx.save();cx.shadowColor=r(CL,1);cx.shadowBlur=20;cx.strokeStyle=r(CL,0.9*p);cx.lineWidth=1.5;cx.beginPath();cx.moveTo(MC.SX-10,MC.BASE);cx.lineTo(MC.SX+MC.totalW+10,MC.BASE);cx.stroke();cx.shadowBlur=40;cx.strokeStyle=r(CM,0.4*p);cx.lineWidth=4;cx.stroke();cx.shadowBlur=8;cx.strokeStyle=r(CM,0.3*p);cx.lineWidth=1;cx.beginPath();cx.moveTo(MC.SX-10,MC.AY);cx.lineTo(MC.SX-10,MC.BASE);cx.stroke();cx.restore();const curvePts=mc_buildCurve(p);MC.bars.forEach((_,i)=>mc_drawBar(i,p,curvePts));mc_drawCurve(curvePts);mc_drawArrow(p);});
  withTransform(SC.ox,SC.oy+OFFSET_Y,SC.scale,()=>{sc_drawPanel();sc_drawAxes();sc_drawBars(p);});
  withTransform(PIE.ox,PIE.oy+OFFSET_Y,PIE.scale,()=>{pie_draw(p);});
  withTransform(LP.ox,LP.oy+OFFSET_Y,LP.scale,()=>{lp_draw(p);});
  withTransform(SB.ox,SB.oy+OFFSET_Y,SB.scale,()=>{sb_drawAxes();sb_drawBars(p);});
  withTransform(568,5+OFFSET_Y,0.60,()=>{drawGearShape(100,100,110,91,63,8,gearAngle,false,true);});
  withTransform(670,140+OFFSET_Y,0.255,()=>{drawGearShape(100,100,110,91,63,8,-gearAngle*0.8,false,true,true);});
  const ratio=85/63;
  withTransform(490,160+OFFSET_Y,0.72,()=>{drawGearShape(160,130,85,70,51,8,gearAngle,false,true,false,true);drawGearShape(43,217,63,52,38,8,-gearAngle*ratio,true,true);});
  drawConnectors(p);drawGearConnectors(p);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ── Burger menu ── */
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

function closeMobileMenu() {
  burger.classList.remove('open');
  navMenu.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.querySelector('header').style.paddingRight = '';
}

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
  if(navMenu.classList.contains('open')) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.querySelector('header').style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.querySelector('header').style.paddingRight = '';
  }
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── Scroll header ── */
window.addEventListener('scroll',()=>{
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 20);

  const sections = [
    { id: 'nav-home',     top: 0 },
    { id: 'nav-services', top: document.getElementById('services')?.offsetTop || 9999 },
    { id: 'nav-approach', top: document.getElementById('approach')?.offsetTop || 9999 },
    { id: 'nav-contacts', top: document.getElementById('contacts')?.offsetTop || 9999 },
  ];
  const scrollY = window.scrollY + 120;
  let current = 'nav-home';
  sections.forEach(s => { if(scrollY >= s.top) current = s.id; });
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const el = document.getElementById(current);
  if(el) el.classList.add('active');
});

/* ── Modal ── */
function openConsultModal(){
  document.getElementById('consultModal').classList.add('active');
  const ciMsg=document.getElementById('ci-msg');
  const counter=document.getElementById('charCount');
  counter.textContent=ciMsg.innerText.length;
}
function closeConsultModal(){
  document.getElementById('consultModal').classList.remove('active');
}
document.getElementById('consultModal').addEventListener('click',function(e){
  if(e.target===this) closeConsultModal();
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeConsultModal(); });

/* ── Custom Fields ── */
(function(){
  const MAX=250;
  const cfName=document.getElementById('cf-name');
  const cfContact=document.getElementById('cf-contact');
  const ciName=document.getElementById('ci-name');
  const ciContact=document.getElementById('ci-contact');
  const ciMsg=document.getElementById('ci-msg');
  const counter=document.getElementById('charCount');

  ciName.addEventListener('input',()=>cfName.classList.remove('invalid'));
  ciContact.addEventListener('input',()=>cfContact.classList.remove('invalid'));

  ciMsg.addEventListener('input',()=>{
    const text=ciMsg.innerText;
    if(text.length>MAX){
      const sel=window.getSelection();
      ciMsg.innerText=text.slice(0,MAX);
      const range=document.createRange();
      range.selectNodeContents(ciMsg);range.collapse(false);
      sel.removeAllRanges();sel.addRange(range);
    }
    counter.textContent=Math.min(ciMsg.innerText.length,MAX);
  });

  [ciName,ciContact].forEach(el=>{
    el.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault();});
  });
  [ciName,ciContact,ciMsg].forEach(el=>{
    el.addEventListener('paste',e=>{
      e.preventDefault();
      document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));
    });
  });
})();

/* ── Custom Select ── */
(function(){
  const cs=document.getElementById('customSelect');
  const trigger=document.getElementById('customSelectTrigger');
  const dropdown=document.getElementById('customSelectDropdown');
  const valSpan=document.getElementById('customSelectValue');
  const hidden=document.getElementById('consultType');
  const options=dropdown.querySelectorAll('.custom-select-option');
  trigger.addEventListener('click',e=>{e.stopPropagation();cs.classList.toggle('open');});
  options.forEach(opt=>{
    opt.addEventListener('click',()=>{
      const val=opt.dataset.value;
      hidden.value=val;
      valSpan.textContent=val;
      cs.classList.add('selected');
      cs.classList.remove('open','invalid');
      options.forEach(o=>o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
  document.addEventListener('click',()=>cs.classList.remove('open'));
})();

/* ── Toast ── */
function showToast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.remove('show','error');
  if(type==='error') t.classList.add('error');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show','error'),3500);
  }));
}

/* ── Validation ── */
function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
function isCanadianPhone(v){const n=v.replace(/\D/g,'');return n.length===10||(n.length===11&&n.startsWith('1'));}

/* ── Form submit ── */
function submitConsultForm(){
  const cfName=document.getElementById('cf-name');
  const cfContact=document.getElementById('cf-contact');
  const name=document.getElementById('ci-name').innerText.trim();
  const contact=document.getElementById('ci-contact').innerText.trim();
  const type=document.getElementById('consultType').value;
  const message=document.getElementById('ci-msg').innerText.trim();

  cfName.classList.remove('invalid');
  cfContact.classList.remove('invalid');

  if(!name){cfName.classList.add('invalid');showToast('Please enter your name.','error');return;}
  if(!contact){cfContact.classList.add('invalid');showToast('Please enter your email or phone.','error');return;}
  if(!isEmail(contact)&&!isCanadianPhone(contact)){cfContact.classList.add('invalid');showToast('Invalid email or phone number.','error');return;}

  const btn=document.querySelector('#consultModal .btn-consult');
  btn.textContent='Sending...';btn.disabled=true;

  const params=new URLSearchParams({name,contact,type,message});
  const url='https://script.google.com/macros/s/AKfycbxKsKnTR9_AIHq-o0qsvDLNh94VW4gcgnrV8nZFMxNTCWX9Z2lMMEQ3VXWkiWp4sSRf/exec?'+params.toString();

  fetch(url,{method:'GET',mode:'no-cors'})
    .then(()=>{
      btn.textContent='Send Request';btn.disabled=false;
      closeConsultModal();
      document.getElementById('ci-name').innerText='';
      document.getElementById('ci-contact').innerText='';
      document.getElementById('ci-msg').innerText='';
      document.getElementById('consultType').value='';
      document.getElementById('customSelectValue').textContent='Type of inquiry (optional)';
      document.getElementById('customSelect').classList.remove('selected','open');
      document.querySelectorAll('.custom-select-option').forEach(o=>o.classList.remove('active'));
      document.getElementById('charCount').textContent='0';
      showToast('Request sent successfully!');
    })
    .catch(()=>{
      btn.textContent='Send Request';btn.disabled=false;
      showToast('Something went wrong. Please try again.','error');
    });
}
