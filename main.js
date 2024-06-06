const svg = document.getElementById("svg");
const hSpacingr = document.getElementById("hSpacing");
const angChanger = document.getElementById("angChange");
const vAngr = document.getElementById("vAng");
const iterationsr = document.getElementById("iterations");
const nr = document.getElementById("n");
const l1r = document.getElementById("l1");
const l2r = document.getElementById("l2");
const l3r = document.getElementById("l3");
const l5r = document.getElementById("l5");
let linecount = 0;
function drawLine({ x1, y1, x2, y2 }, color = "black", xOff = 0, yOff = 0) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1 + xOff);
  line.setAttribute("y1", -y1 - yOff);
  line.setAttribute("x2", x2 + xOff);
  line.setAttribute("y2", -y2 - yOff);
  line.setAttribute("stroke", color);
  // line.setAttribute("opacity", ".3")
  line.setAttribute("stroke-width", 1);
  svg.appendChild(line);
  linecount++;
  // const sL = document.createElementNS("http://www.w3.org/2000/svg", "line");
  // sL.setAttribute("x1", x1+xOff);
  // sL.setAttribute("y1", -y1-yOff);
  // sL.setAttribute("x2", (x2+x1)/2 + xOff);
  // sL.setAttribute("y2", (-y2-y1)/2 - yOff);
  // sL.setAttribute("stroke", "yellow");
  // sL.setAttribute("stroke-width", 2);
  // svg.appendChild(sL);
}




function intersectLines({ x1, y1, x2, y2 }, { x1: x3, y1: y3, x2: x4, y2: y4 }) {
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (d === 0) {
    return null;
  }
  const xi = ((x3 - x4) * (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
  const yi = ((y3 - y4) * (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;
  return { x: xi, y: yi };
}

function mirrorOverY(mirrorY, mSeg, vSeg, cSeg) {
  const mirroredMountainSegments = [];
  for (let i = 0; i < mSeg.length; i++) {
    mirroredMountainSegments.push({
      x1: mSeg[i].x1,
      y1: 2 * mirrorY - mSeg[i].y1,
      x2: mSeg[i].x2,
      y2: 2 * mirrorY - mSeg[i].y2,
    });
  }
  mSeg.push(...mirroredMountainSegments);

  const mirroredValleySegments = [];
  for (let i = 0; i < vSeg.length; i++) {
    mirroredValleySegments.push({
      x1: vSeg[i].x1,
      y1: 2 * mirrorY - vSeg[i].y1,
      x2: vSeg[i].x2,
      y2: 2 * mirrorY - vSeg[i].y2,
    });
  }
  vSeg.push(...mirroredValleySegments);

  const mirroredCutSegments = [];
  for (let i = 0; i < cSeg.length; i++) {
    mirroredCutSegments.push({
      x1: cSeg[i].x1,
      y1: 2 * mirrorY - cSeg[i].y1,
      x2: cSeg[i].x2,
      y2: 2 * mirrorY - cSeg[i].y2,
    });
  }
  cSeg.push(...mirroredCutSegments);
}

function mirrorOverX(mirrorX, mSeg, vSeg, cSeg) {
  const mirroredMountainSegments = [];
  for (let i = 0; i < mSeg.length; i++) {
    if (!(Math.abs(mSeg[i].x1 - mirrorX) < 0.0000000001 && Math.abs(mSeg[i].x2 - mirrorX) < 0.0000000001)) {
      mirroredMountainSegments.push({
        x1: 2 * mirrorX - mSeg[i].x1,
        y1: mSeg[i].y1,
        x2: 2 * mirrorX - mSeg[i].x2,
        y2: mSeg[i].y2,
      });
    }
  }
  mSeg.push(...mirroredMountainSegments);
  const mirroredValleySegments = [];
  for (let i = 0; i < vSeg.length; i++) {
    if (!(Math.abs(vSeg[i].x1 - mirrorX) < 0.0000000001 && Math.abs(vSeg[i].x2 - mirrorX) < 0.0000000001)) {
      mirroredValleySegments.push({
        x1: 2 * mirrorX - vSeg[i].x1,
        y1: vSeg[i].y1,
        x2: 2 * mirrorX - vSeg[i].x2,
        y2: vSeg[i].y2,
      });
    }
  }
  vSeg.push(...mirroredValleySegments);
  const mirroredCutSegments = [];
  for (let i = 0; i < cSeg.length; i++) {
    if (!(Math.abs(cSeg[i].x1 - mirrorX) < 0.0000000001 && Math.abs(cSeg[i].x2 - mirrorX) < 0.0000000001)) {
      mirroredCutSegments.push({
        x1: 2 * mirrorX - cSeg[i].x1,
        y1: cSeg[i].y1,
        x2: 2 * mirrorX - cSeg[i].x2,
        y2: cSeg[i].y2,
      });
    }
  }
  cSeg.push(...mirroredCutSegments);
}

function xytox2y2({ x, y }) {
  return { x2: x, y2: y };
}

function draw_reg_irreg(x, y, hSpacing, angChange, vAng, iterations, l1, l2, l3, l5) {
  const mountainSegments = [];
  const valleySegments = [];
  const highlightSegments = [];
  const cutSegments = [];

  const mVert = [];
  for (let i = 0; i < iterations; i++) {
    mVert.push({ x1: i * hSpacing, y1: 0, x2: i * hSpacing, y2: -l1 });
  }
  mountainSegments.push(...mVert);
  const vDown = [];
  for (let i = 0; i < iterations; i++) {
    vDown.push({
      x1: mVert[i].x2,
      y1: mVert[i].y2,
      x2: mVert[i].x2 + Math.cos((3 * Math.PI) / 2 + i * angChange) * l2,
      y2: mVert[i].y2 + Math.sin((3 * Math.PI) / 2 + i * angChange) * l2,
    });
  }

  valleySegments.push(...vDown);
  const rVtL = [];
  for (let i = 0; i < iterations; i++) {
    rVtL.push({
      x1: mVert[i].x2,
      y1: mVert[i].y2,
      x2: mVert[i].x2 + Math.cos(Math.PI / 2 - vAng + (i * angChange) / 2) * 100,
      y2: mVert[i].y2 + Math.sin(Math.PI / 2 - vAng + (i * angChange) / 2) * 100,
    });
  }
  const lVtL = [];
  for (let i = 1; i < iterations; i++) {
    lVtL.push({
      x1: mVert[i].x2,
      y1: mVert[i].y2,
      x2: mVert[i].x2 + Math.cos(Math.PI / 2 + vAng + (i * angChange) / 2) * 100,
      y2: mVert[i].y2 + Math.sin(Math.PI / 2 + vAng + (i * angChange) / 2) * 100,
    });
  }
  const lVt = [];
  for (let i = 0; i < iterations - 1; i++) {
    const { x: x2, y: y2 } = intersectLines(rVtL[i], lVtL[i]);
    lVt.push({
      x1: mVert[i].x2,
      y1: mVert[i].y2,
      x2,
      y2,
    });
  }
  valleySegments.push(...lVt);
  const rVt = [];
  for (let i = 0; i < iterations - 1; i++) {
    rVt.push({
      x1: mVert[i + 1].x2,
      y1: mVert[i + 1].y2,
      x2: lVt[i].x2,
      y2: lVt[i].y2,
    });
  }
  valleySegments.push(...rVt);

  const vVert = [];
  for (let i = 0; i < iterations - 1; i++) {
    vVert.push({
      x1: lVt[i].x2,
      y1: lVt[i].y2,
      x2: lVt[i].x2,
      y2: 0,
    });
  }
  valleySegments.push(...vVert);

  const mDown = [];

  for (let i = 0; i < iterations - 1; i++) {
    mDown.push({
      x1: lVt[i].x2,
      y1: lVt[i].y2,
      x2: lVt[i].x2 + Math.cos((3 * Math.PI) / 2 + (i + 0.5) * angChange) * l2,
      y2: lVt[i].y2 + Math.sin((3 * Math.PI) / 2 + (i + 0.5) * angChange) * l2,
    });
  }
  mountainSegments.push(...mDown);

  const rmV = [];
  for (let i = 0; i < iterations - 1; i++) {
    rmV.push({
      x1: vDown[i].x2,
      y1: vDown[i].y2,
      x2: mDown[i].x2,
      y2: mDown[i].y2,
    });
  }
  mountainSegments.push(...rmV);
  const lmV = [];
  for (let i = 0; i < iterations - 1; i++) {
    lmV.push({
      x1: vDown[i + 1].x2,
      y1: vDown[i + 1].y2,
      x2: mDown[i].x2,
      y2: mDown[i].y2,
    });
  }
  mountainSegments.push(...lmV);

  const mVert2L = [];
  for (let i = 0; i < iterations; i++) {
    mVert2L.push({
      x1: vDown[i].x2,
      y1: vDown[i].y2,
      x2: vDown[i].x2,
      y2: -600,
    });
  }

  const vVert2L = [];
  for (let i = 0; i < iterations - 1; i++) {
    vVert2L.push({
      x1: mDown[i].x2,
      y1: mDown[i].y2,
      x2: mDown[i].x2,
      y2: -600,
    });
  }
  const PI = Math.PI;
  const tempForrvV = intersectLines(vVert2L[0], {
    x1: mVert[0].x1,
    y1: -(l1 + l2 + l3),
    x2: mVert[0].x1 + Math.cos(Math.atan2(rmV[0].y2 - rmV[0].y1, rmV[0].x2 - rmV[0].x1)) * 100,
    y2: -(l1 + l2 + l3) + Math.sin(Math.PI / 2 - vAng) * 100,
  });
  const rvV = [
    {
      x1: mVert[0].x1,
      y1: -(l1 + l2 + l3),
      x2: tempForrvV.x,
      y2: tempForrvV.y,
    },
  ];
  const lvV = [];

  for (let i = 0; i < iterations - 2; i++) {
    let rVAng = Math.atan2(rvV[i].y2 - rvV[i].y1, rvV[i].x2 - rvV[i].x1); //might need to negate
    // console.log(rVAng);
    let angFromTop = PI - (PI / 2 - rVAng - ((2 * i + 1) * angChange) / 2);
    let angFromRight = PI / 2 - angFromTop;
    lvV.push({
      x1: rvV[i].x2,
      y1: rvV[i].y2,
      ...((a) => ({ x2: a.x, y2: a.y }))(
        intersectLines(mVert2L[i + 1], {
          x1: rvV[i].x2,
          y1: rvV[i].y2,
          x2: rvV[i].x2 + Math.cos(angFromRight) * 100,
          y2: rvV[i].y2 + Math.sin(angFromRight) * 100,
        })
      ),
    });
    let lVAng = Math.atan2(lvV[i].y2 - lvV[i].y1, lvV[i].x2 - lvV[i].x1); //might need to negate
    // console.log(lVAng);
    angFromTop = PI - (PI / 2 - lVAng - ((2 * i + 2) * angChange) / 2);
    angFromRight = PI / 2 - angFromTop;
    rvV.push({
      x1: lvV[i].x2,
      y1: lvV[i].y2,
      ...((a) => ({ x2: a.x, y2: a.y }))(
        intersectLines(vVert2L[i + 1], {
          x1: lvV[i].x2,
          y1: lvV[i].y2,
          x2: lvV[i].x2 + Math.cos(angFromRight) * 100,
          y2: lvV[i].y2 + Math.sin(angFromRight) * 100,
        })
      ),
    });
  }

  valleySegments.push(...lvV);
  valleySegments.push(...rvV);

  const mVert2 = [];
  for (let i = 0; i < iterations - 1; i++) {
    mVert2.push({
      x1: vDown[i].x2,
      y1: vDown[i].y2,
      x2: rvV[i].x1,
      y2: rvV[i].y1,
    });
  }

  mountainSegments.push(...mVert2);
  const vVert2 = [];
  for (let i = 0; i < iterations - 1; i++) {
    vVert2.push({
      x1: mDown[i].x2,
      y1: mDown[i].y2,
      x2: rvV[i].x2,
      y2: rvV[i].y2,
    });
  }
  valleySegments.push(...vVert2);

  const vDown2L = [];
  for (let i = 0; i < iterations - 1; i++) {
    vDown2L.push({
      x1: mVert2[i].x2,
      y1: mVert2[i].y2,
      x2: mVert2[i].x2 + Math.cos((3 * Math.PI) / 2 - i * angChange) * l2,
      y2: mVert2[i].y2 + Math.sin((3 * Math.PI) / 2 - i * angChange) * l2,
    });
  }

  const mDown2L = [];
  for (let i = 0; i < iterations - 1; i++) {
    mDown2L.push({
      x1: vVert2[i].x2,
      y1: vVert2[i].y2,
      x2: vVert2[i].x2 + Math.cos((3 * Math.PI) / 2 - (i + 0.5) * angChange) * 100,
      y2: vVert2[i].y2 + Math.sin((3 * Math.PI) / 2 - (i + 0.5) * angChange) * 100,
    });
  }
  const vDown2 = [vDown2L[0]];

  for (let i = 1; i < iterations - 1; i++) {
    vDown2.push({
      x1: vDown2L[i].x1,
      y1: vDown2L[i].y1,
      ...xytox2y2(intersectLines(vDown2L[i], mVert[i])),
    });
  }

  valleySegments.push(...vDown2);

  const mDown2 = [];

  for (let i = 0; i < iterations - 1; i++) {
    mDown2.push({
      x1: mDown2L[i].x1,
      y1: mDown2L[i].y1,
      ...xytox2y2(intersectLines(mDown2L[i], vVert[i])),
    });
  }

  mountainSegments.push(...mDown2);
  let rmV2 = [];
  for (let i = 0; i < iterations - 1; i++) {
    rmV2.push({
      x1: vDown2[i].x2,
      y1: vDown2[i].y2,
      x2: mDown2[i].x2,
      y2: mDown2[i].y2,
    });
  }
  let lmV2 = [];
  for (let i = 0; i < iterations - 2; i++) {
    lmV2.push({
      x1: vDown2[i + 1].x2,
      y1: vDown2[i + 1].y2,
      x2: mDown2[i].x2,
      y2: mDown2[i].y2,
    });
  }
  mountainSegments.push(...rmV2);
  mountainSegments.push(...lmV2);
  let mDown3 = [];
  for (let i = 0; i < iterations - 1; i++) {
    mDown3.push({
      x1: vDown2[i].x2,
      y1: vDown2[i].y2,
      x2: vDown2[i].x2,
      y2: -(l1 + 2 * l2 + l3 + l5),
    });
  }
  mountainSegments.push(...mDown3);

  let vDown3 = [];
  for (let i = 0; i < iterations - 1; i++) {
    vDown3.push({
      x1: mDown2[i].x2,
      y1: mDown2[i].y2,
      x2: mDown2[i].x2,
      y2: -(l1 + 2 * l2 + l3 + l5),
    });
  }
  valleySegments.push(...vDown3);
  // cutSegments.push({x1:mDown3[0].x2,y1:mDown3[0].y2,x2:mDown3[mDown3.length-1].x2,y2:mDown3[mDown3.length-1].y2})

  // cutSegments.push({x1:mVert[0].x1,y1:mVert[0].y1,x2:mVert[mVert.length-1].x1,y2:mVert[mVert.length-1].y1})
  mirrorOverX(0, mountainSegments, valleySegments, cutSegments);

  for (let i = 0; i < mountainSegments.length; i++) {
    drawLine(mountainSegments[i], "blue", x, y);
  }
  for (let i = 0; i < valleySegments.length; i++) {
    drawLine(valleySegments[i], "red", x, y);
  }
  for (let i = 0; i < highlightSegments.length; i++) {
    drawLine(highlightSegments[i], "green", x, y);
  }
  for (let i = 0; i < cutSegments.length; i++) {
    drawLine(cutSegments[i], "black", x, y);
  }
}

function repeat_draw_ri(x, y, hSpacing, angChange, vAng, iterations, n, l1, l2, l3, l5) {
  for (let i = 0; i < n; i++) {
    draw_reg_irreg(x, y - i * (l1 + 2 * l2 + l3 + l5), hSpacing, angChange, vAng, iterations, l1, l2, l3, l5);
  }
}

// repeat_draw_ri(0, 500, 50, Math.PI / 10, Math.PI / 3, 6, 7, 50, 50, 20, 100);
repeat_draw_ri(0, 500, 50, Math.PI / 20, Math.PI / 4, 6, 7, 50, 50, 50, 100);

hSpacingr.addEventListener("input", update)
angChanger.addEventListener("input", update)
vAngr.addEventListener("input", update)
iterationsr.addEventListener("input", update)
nr.addEventListener("input", update)
l1r.addEventListener("input", update)
l2r.addEventListener("input", update)
l3r.addEventListener("input", update)
l5r.addEventListener("input", update)
function update() {
  svg.innerHTML = "";
  repeat_draw_ri(0, 500, hSpacingr.value, Math.PI * angChanger.value, Math.PI * vAngr.value, iterationsr.value, nr.value, parseInt(l1r.value), parseInt(l2r.value), parseInt(l3r.value), parseInt(l5r.value));

}

const phi = (1 + Math.sqrt(5)) / 2;
const chevMountain = [];
const chevValley = [];
const chevDownD = 10;
let chevDown = 70;
const chevRight = 100;
const linearChevDownChange = 0;
function chev(x, y, n, parity, chDD = chevDownD, chD = chevDown) {
  if (n <= 0) {
    return;
  }
  drawLine({ x1: x, y1: y, x2: x + chevRight, y2: y - chDD * parity }, "red");
  chev(x + chevRight, y - chDD * parity, n - 1, parity * -1, chDD, chD);
  // chev(x,y-50,n-1,parity)
  if (parity < 0) {
    drawLine({ x1: x, y1: y, x2: x, y2: y - chD - linearChevDownChange / 2 }, "red");
    // drawLine({x1:x,y1:y,x2:x+chevRight,y2:y-(chDD+chD-linearChevDownChange)*(parity)},"blue")
    // console.log(Math.atan((chDD+chD-linearChevDownChange)/chevRight)-Math.atan(chDD/chevRight))
  } else {
    drawLine({ x1: x, y1: y, x2: x, y2: y - chD }, "red");
    drawLine(
      {
        x1: x,
        y1: y,
        x2: x + chevRight,
        y2: y - (chDD + chD + linearChevDownChange / 1.5) * parity,
      },
      "blue"
    );
    drawLine(
      {
        x1: x,
        y1: y,
        x2: x - chevRight,
        y2: y - (chDD + chD + linearChevDownChange / 1.5) * parity,
      },
      "blue"
    );
    // console.log(Math.atan((chDD+chD+linearChevDownChange/1.5)/chevRight)-Math.atan(chDD/chevRight))
  }
}

// for (var i = 0; i<12;i++){
//   chev(-500,700-i*chevDown-(i*(i+1)/2*linearChevDownChange),8,1,((i+1)*linearChevDownChange)/1.5+chevDownD,chevDown+(i+1)*linearChevDownChange)
// }

function zigZag(x1, y1, x2, y2, n, distance, color) {
  for (let i = 0; i < n; i++) {
    drawLine({ x1, y1, x2, y2 }, color);
    if (i % 2 == 0) {
      x1 += 2 * distance;
    } else {
      x2 += 2 * distance;
    }
  }
}
chevDown = 70;
let lastY = 500;
let lastY2 = 520;
let iY1 = lastY;
let iY2 = lastY2;
let gsCols = 8; // only even rn
// zigZag(-500,lastY,-500+chevRight,lastY2,gsCols,chevRight,"black")
// let yy2 = chevRight*Math.tan(Math.atan((lastY-lastY2)/chevRight)+Math.PI/4)
// zigZag(-500,lastY,-500+chevRight,lastY-yy2,gsCols,chevRight,"blue")
// lastY2 = lastY-yy2
// lastY -= chevDown

// for (let i = 0; i<4;i++){
//   if (Math.abs(Math.atan((lastY+chevDown*(phi**(i-1))-lastY2)/chevRight)+Math.PI/2)>Math.abs(2*(Math.atan((lastY-lastY2)/chevRight)+Math.PI/2))){
//     zigZag(-500,lastY,-500+chevRight,lastY2,gsCols,chevRight,"purple")
//   }else
//   if (Math.abs(lastY2-lastY)>chevRight){
//     zigZag(-500,lastY,-500+chevRight,lastY2,gsCols,chevRight,"green")
//   }
//   else{
//     zigZag(-500,lastY,-500+chevRight,lastY2,gsCols,chevRight,"red")
//   }
//   let yy2 = chevRight*Math.tan(Math.atan((lastY-lastY2)/chevRight)+Math.PI/4)
//   zigZag(-500,lastY,-500+chevRight,lastY-yy2,gsCols,chevRight,"blue")
//   lastY2 = lastY-yy2
//   lastY -= chevDown*(phi**i)
// }
// let lastRowUp = -0
// for (let i = -1; i>= lastRowUp;i--){
//   iY1 += chevDown*(phi**i)
//   {
//     zigZag(-500,iY1,-500+chevRight,iY2,gsCols,chevRight,"blue")
//   }
//   let yy2 = chevRight*Math.tan(Math.atan((iY1-iY2)/chevRight)-Math.PI/4)
//   iY2 = iY1-yy2
//   if (i === lastRowUp){
//     zigZag(-500,iY1,-500+chevRight,iY2,gsCols,chevRight,"black")
//   } else
//   if (Math.abs(Math.atan((iY1+chevDown*(phi**(i-1))-iY2)/chevRight)+Math.PI/2)>Math.abs(2*(Math.atan((iY1-iY2)/chevRight)+Math.PI/2))){
//     zigZag(-500,iY1,-500+chevRight,iY2,gsCols,chevRight,"purple")
//   }else
//   if (Math.abs(iY2-iY1)>chevRight){
//     zigZag(-500,iY1,-500+chevRight,iY2,gsCols,chevRight,"green")
//   }else
//   {
//   zigZag(-500,iY1,-500+chevRight,iY2,gsCols,chevRight,"red")
//   }
// }
// zigZag(-500,lastY,-500+chevRight,lastY2,gsCols,chevRight,"black")
// for (let i = 2; i<gsCols; i+=2){
//   drawLine({x1:-500+i*chevRight,y1:iY1,x2:-500+i*chevRight,y2:lastY},"red")
//   drawLine({x1:-500+(i-1)*chevRight,y1:iY2,x2:-500+(i-1)*chevRight,y2:lastY2},"red")
// }
// drawLine({x1:-500+(gsCols-1)*chevRight,y1:iY2,x2:-500+(gsCols-1)*chevRight,y2:lastY2},"red")
// drawLine({x1:-500,y1:iY1,x2:-500,y2:lastY},"black")
// drawLine({x1:-500+gsCols*chevRight,y1:iY1,x2:-500+gsCols*chevRight,y2:lastY},"black")
var theta = (Math.PI / 180) * 30;
var herrVAng = (Math.PI / 180) * 45;
var herrD = 100;
function herringDown(x1, y1, row) {
  if (row % 2 == 0) {
    return {
      x2: x1 + herrD * Math.sin(theta),
      y2: y1 - herrD * Math.cos(theta),
    };
  } else {
    return { x2: x1, y2: y1 - herrD };
  }
}
function herringRight(x1, y1, row, column) {
  if (column % 2 == 0) {
    return xytox2y2(
      intersectLines(
        {
          x1: x1,
          y1: y1,
          x2: x1 + 100 * Math.cos(Math.PI / 2 - herrVAng + theta / 2),
          y2: y1 + 100 * Math.sin(Math.PI / 2 - herrVAng + theta / 2),
        },
        { x1: x1 + 100, y1: y1, x2: x1 + 100, y2: y1 + 100 }
      )
    );
  } else {
    return xytox2y2(
      intersectLines(
        {
          x1: x1,
          y1: y1,
          x2: x1 - 100 * Math.cos(Math.PI / 2 + herrVAng + theta / 2),
          y2: y1 - 100 * Math.sin(Math.PI / 2 + herrVAng + theta / 2),
        },
        { x1: x1 + 100, y1: y1, x2: x1 + 100, y2: y1 + 100 }
      )
    );
  }
}

function herring(x, y, row, column) {
  drawLine({ x1: x, y1: y, ...herringDown(x, y, row) }, (column + row) % 2 == 0 ? "blue" : "red");
  drawLine({ x1: x, y1: y, ...herringRight(x, y, row, column) }, row % 2 == 0 ? "blue" : "red");
  if (column > 0) {
    const temp = herringRight(x, y, row, column);
    herring(temp.x2, temp.y2, row, column - 1);
  }
}
function herringrows(x, y, row, column) {
  herring(x, y, row, column);
  if (row > 0) {
    const temp = herringDown(x, y, row);
    herringrows(temp.x2, temp.y2, row - 1, column);
  }
}
// herringrows(-800,400,18,10)
function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
console.log(linecount);
// saveSvg(svg,"temp reg_irreg 50 60 3 6 7 20 25 25 30 5-14-2024.svg")
