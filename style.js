const colorTypes = [
  {
    buttons: document.querySelectorAll('.vivid_color'),
    line: document.querySelector('.line11'),
    text: document.querySelector('.vivid_text'),
    prefix: 'v'
  },
  {
    buttons: document.querySelectorAll('.bright_color'),
    line: document.querySelector('.line12'),
    text: document.querySelector('.bright_text'),
    prefix: 'b'
  },
  {
    buttons: document.querySelectorAll('.deep_color'),
    line: document.querySelector('.line10'),
    text: document.querySelector('.deep_text'),
    prefix: 'dp'
  },
  {
    buttons: document.querySelectorAll('.light_color'),
    line: document.querySelector('.line9'),
    text: document.querySelector('.light_text'),
    prefix: 'lt'
  },
  {
    buttons: document.querySelectorAll('.soft_color'),
    line: document.querySelector('.line8'),
    text: document.querySelector('.soft_text'),
    prefix: 'sf'
  },
  {
    buttons: document.querySelectorAll('.dull_color'),
    line: document.querySelector('.line7'),
    text: document.querySelector('.dull_text'),
    prefix: 'd'
  },
  {
    buttons: document.querySelectorAll('.dark_color'),
    line: document.querySelector('.line6'),
    text: document.querySelector('.dark_text'),
    prefix: 'dk'
  },
  {
    buttons: document.querySelectorAll('.pale_color'),
    line: document.querySelector('.line5'),
    text: document.querySelector('.pale_text'),
    prefix: 'p'
  },
  {
    buttons: document.querySelectorAll('.lightgray_color'),
    line: document.querySelector('.line4'),
    text: document.querySelector('.lightgray_text'),
    prefix: 'ltg'
  },
  {
    buttons: document.querySelectorAll('.gray_color'),
    line: document.querySelector('.line3'),
    text: document.querySelector('.gray_text'),
    prefix: 'g'
  },
  {
    buttons: document.querySelectorAll('.darkgray_color'),
    line: document.querySelector('.line2'),
    text: document.querySelector('.darkgray_text'),
    prefix: 'dkg'
  },
];

const gray = "#eaeaea"
const white = "#ffffff"

const container = document.querySelector('.container');
const lines = document.querySelector('.lines');

const ww = window.innerWidth / 2;
const wh = window.innerHeight / 3;
let fixedOriginX = 0;
let fixedOriginY = 0;

const reset = document.querySelector('.reset');
let rc = 0;
reset.addEventListener('click', (e) => {
  e.preventDefault();  // デフォルトの挙動をキャンセルしてタッチイベントを確実に処理
  container.style.transform = `scale(0.5)`
  container.style.top = wh + "px";
  container.style.left = ww + "px";
  container.style.transformOrigin = "top left";
  rc++;
});

document.addEventListener('DOMContentLoaded', () => {
  const moveableElement = document.querySelector('.container');
  if (!moveableElement.style.left) moveableElement.style.left = ww + "px";
  if (!moveableElement.style.top) moveableElement.style.top = wh + "px";

  let isTouching = false;
  let startX, startY, startWidth, startHeight;
  let scale = 0.5;
  let lastDistance = 0;
  let lastX = 0, lastY = 0;

  const rect = moveableElement.getBoundingClientRect();

  if (rect.left < 0) {
    moveableElement.style.left = '0px';
  }
  if (rect.top < 0) {
    moveableElement.style.top = '0px';
  }
  if (rect.right > window.innerWidth) {
    moveableElement.style.left = (window.innerWidth - rect.width) + 'px';
  }
  if (rect.bottom > window.innerHeight) {
    moveableElement.style.top = (window.innerHeight - rect.height) + 'px';
  }

  function getDistance(t1, t2) {
    const dx = t2.pageX - t1.pageX;
    const dy = t2.pageY - t1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function getMidpoint(t1, t2) {
    return {
      x: (t1.pageX + t2.pageX) / 2,
      y: (t1.pageY + t2.pageY) / 2
    };
  }

  moveableElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isTouching = true;
      const touch = e.touches[0];
      startX = touch.pageX - moveableElement.offsetLeft;
      startY = touch.pageY - moveableElement.offsetTop;
      startWidth = moveableElement.offsetWidth;
      startHeight = moveableElement.offsetHeight;
    } else if (e.touches.length === 2) {
      lastDistance = getDistance(e.touches[0], e.touches[1]);

      const mid = getMidpoint(e.touches[0], e.touches[1]);
      const rect = moveableElement.getBoundingClientRect();
      fixedOriginX = mid.x - rect.left;
      fixedOriginY = mid.y - rect.top;

      moveableElement.style.transformOrigin = `${originX}px ${originY}px`;
    }
  });

  moveableElement.addEventListener('touchmove', (e) => {
    if (isTouching && e.touches.length === 1) {
      const touch = e.touches[0];
      moveableElement.style.left = touch.pageX - startX + 'px';
      moveableElement.style.top = touch.pageY - startY + 'px';
    } else if (e.touches.length === 2) {
      e.preventDefault();

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = getDistance(t1, t2);
      const scaleChange = currentDistance / lastDistance;
      scale *= scaleChange;
      scale = Math.max(0.5, Math.min(scale, 2));
      moveableElement.style.transform = `scale(${scale})`;

      const mid = getMidpoint(t1, t2);
      
      // 拡大の基準点をタッチ位置の中心に設定
      const centerX = (t1.pageX + t2.pageX) / 2;
      const centerY = (t1.pageY + t2.pageY) / 2;

      if (rc === 0) {
        
      } else {
        scale = 0.5;
        rc = 0;
      }

      lastDistance = currentDistance;
    }
  }, { passive: false });

  moveableElement.addEventListener('touchend', () => {
    isTouching = false;
  });
});

// 拡大縮小を無効化
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
});


colorTypes.forEach(type => {
  setupHoverEffect(type.buttons, type.line, type.text, type.prefix);
});

function setupHoverEffect(buttonList, targetLine, targetText, prefix) {
  buttonList.forEach(button => {
    button.addEventListener("mouseover", function() {
      targetLine.style.backgroundColor = gray;
      targetText.style.display = 'flex';
      let text = button.textContent;
      if (prefix === 'p' || prefix === 'lt') {
        targetText.textContent = prefix + text + "+";
      } else {
        targetText.textContent = prefix + text;
      }
    });

    button.addEventListener("mouseout", function() {
      targetLine.style.backgroundColor = white;
      targetText.style.display = 'none';
    });
  });
}

const deletebt = document.querySelector('.deletebt');
const hitjud = document.getElementById("hitjud");
const up = document.querySelector('.up');
const down = document.querySelector('.down');

const disps = document.querySelector('.dispcolors');
const disp = document.querySelector('.dispcolor');

const dp1 = document.querySelector('.dispcolor1');
const dp1t = document.querySelector('.dispcolor1 > p');
const dp2 = document.querySelector('.dispcolor2');
const dp2t = document.querySelector('.dispcolor2 > p');
const dp3 = document.querySelector('.dispcolor3');
const dp3t = document.querySelector('.dispcolor3 > p');
const dp4 = document.querySelector('.dispcolor4');
const dp4t = document.querySelector('.dispcolor4 > p');

const dps = [dp1, dp2, dp3, dp4]

let cc = 0; // color count
const windowWidth = window.innerWidth; 
const windowHeight = window.innerHeight; 

let picUp = 0;
let whatPic = null;
let whatPicNum = null;
let currentParentClass = null;
let toWhat = null;
let toWhatNum = null;
const trash = document.querySelector('.trash');
const blackSc = document.querySelector('.blackScreen');

document.querySelectorAll('.hitjud').forEach(jud => {
  const parent = jud.parentElement;
  const parentclass = parent.classList[0];

  let bg = null;
  let tx = null;
  let bg2 = null;
  let tx2 = null;

  parent.addEventListener('mouseenter', function() {
    if (windowWidth <= 1024) return;

    // すでにボタンがあるなら追加しない（重複防止）
    if (parent.querySelector('.up')) return;
    

    const up = document.createElement('button');
    up.classList.add('up');
    up.style.display = "flex";

    up.addEventListener('click', function() {
      switch (parentclass) {
        case 'dispcolor2':
          bg2 = sessionStorage.getItem('dp2c');
          tx2 = sessionStorage.getItem('dp2t');
          bg = sessionStorage.getItem('dp1c');
          tx = sessionStorage.getItem('dp1t');
          dp1.style.backgroundColor = bg2;
          dp1t.innerHTML = tx2;
          dp2.style.backgroundColor = bg;
          dp2t.innerHTML = tx;
          sessionStorage.setItem('dp2c', bg);
          sessionStorage.setItem('dp2t', tx);
          sessionStorage.setItem('dp1c', bg2);
          sessionStorage.setItem('dp1t', tx2);
          break;
        case 'dispcolor3':
          bg2 = sessionStorage.getItem('dp3c');
          tx2 = sessionStorage.getItem('dp3t');
          bg = sessionStorage.getItem('dp2c');
          tx = sessionStorage.getItem('dp2t');
          dp2.style.backgroundColor = bg2;
          dp2t.innerHTML = tx2;
          dp3.style.backgroundColor = bg;
          dp3t.innerHTML = tx;
          sessionStorage.setItem('dp3c', bg);
          sessionStorage.setItem('dp3t', tx);
          sessionStorage.setItem('dp2c', bg2);
          sessionStorage.setItem('dp2t', tx2);
          break;
        case 'dispcolor4':
          bg2 = sessionStorage.getItem('dp4c');
          tx2 = sessionStorage.getItem('dp4t');
          bg = sessionStorage.getItem('dp3c');
          tx = sessionStorage.getItem('dp3t');
          dp3.style.backgroundColor = bg2;
          dp3t.innerHTML = tx2;
          dp4.style.backgroundColor = bg;
          dp4t.innerHTML = tx;
          sessionStorage.setItem('dp4c', bg);
          sessionStorage.setItem('dp4t', tx);
          sessionStorage.setItem('dp3c', bg2);
          sessionStorage.setItem('dp3t', tx2);
          break;
      }
    });

    const down = document.createElement('button');
    down.classList.add('down');
    down.style.display = "flex";

    down.addEventListener('click', function() {
      switch (parentclass) {
        case 'dispcolor1':
          bg2 = sessionStorage.getItem('dp2c');
          tx2 = sessionStorage.getItem('dp2t');
          bg = sessionStorage.getItem('dp1c');
          tx = sessionStorage.getItem('dp1t');
          dp1.style.backgroundColor = bg2;
          dp1t.innerHTML = tx2;
          dp2.style.backgroundColor = bg;
          dp2t.innerHTML = tx;
          sessionStorage.setItem('dp2c', bg);
          sessionStorage.setItem('dp2t', tx);
          sessionStorage.setItem('dp1c', bg2);
          sessionStorage.setItem('dp1t', tx2);
          break;
        case 'dispcolor2':
          bg2 = sessionStorage.getItem('dp3c');
          tx2 = sessionStorage.getItem('dp3t');
          bg = sessionStorage.getItem('dp2c');
          tx = sessionStorage.getItem('dp2t');
          dp2.style.backgroundColor = bg2;
          dp2t.innerHTML = tx2;
          dp3.style.backgroundColor = bg;
          dp3t.innerHTML = tx;
          sessionStorage.setItem('dp3c', bg);
          sessionStorage.setItem('dp3t', tx);
          sessionStorage.setItem('dp2c', bg2);
          sessionStorage.setItem('dp2t', tx2);
          break;
        case 'dispcolor3':
          bg2 = sessionStorage.getItem('dp4c');
          tx2 = sessionStorage.getItem('dp4t');
          bg = sessionStorage.getItem('dp3c');
          tx = sessionStorage.getItem('dp3t');
          dp3.style.backgroundColor = bg2;
          dp3t.innerHTML = tx2;
          dp4.style.backgroundColor = bg;
          dp4t.innerHTML = tx;
          sessionStorage.setItem('dp4c', bg);
          sessionStorage.setItem('dp4t', tx);
          sessionStorage.setItem('dp3c', bg2);
          sessionStorage.setItem('dp3t', tx2);
          break;
      }
    });

    const deletebt = document.createElement('button');
    deletebt.classList.add('deletebt');
    deletebt.style.display = "flex";

    deletebt.addEventListener('click', function() {
      switch (parentclass) {
        case 'dispcolor1':
          if (window.getComputedStyle(dp2).display === "none") {
            dp1.style.display = "none";
            sessionStorage.removeItem('dp1c');
            sessionStorage.removeItem('dp1t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
                dp1.style.borderRadius = "10px 10px 0px 0px";
                dp3.style.borderRadius = "0px 0px 10px 10px";
                break;
              case 3:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                dp1.style.borderRadius = "10px 10px 0px 0px";
                dp2.style.borderRadius = "0px 0px 10px 10px";
                break;
              case 2:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                sessionStorage.removeItem('dp2c');
                sessionStorage.removeItem('dp2t');
                dp2.style.display = "none";
                dp1.style.borderRadius = "10px 10px 10px 10px";
                down.style.display = "none";
                break;
            }
          }
          cc--;
          break;
        case 'dispcolor2':
          if (window.getComputedStyle(dp3).display === "none") {
            dp2.style.display = "none";
            dp1.style.borderRadius = "10px 10px 10px 10px";
            sessionStorage.removeItem('dp2c');
            sessionStorage.removeItem('dp2t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
                dp3.style.borderRadius = "0px 0px 10px 10px";
                break;
              case 3:
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                dp1.style.borderRadius = "10px 10px 0px 0px";
                dp2.style.borderRadius = "0px 0px 10px 10px";
                down.style.display = "none";
                break;
              case 2:
                sessionStorage.removeItem('dp2c');
                sessionStorage.removeItem('dp2t');
                dp2.style.display = "none";
                dp1.style.borderRadius = "10px 10px 10px 10px";
                break;
            }
          }
          cc--;
          break;
        case 'dispcolor3':
          if (window.getComputedStyle(dp4).display === "none") {
            dp3.style.display = "none";
            dp2.style.borderRadius = "0px 0px 10px 10px";
            sessionStorage.removeItem('dp3c');
            sessionStorage.removeItem('dp3t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
                dp3.style.borderRadius = "0px 0px 10px 10px";
                down.style.display = "none";
                break;
              case 3:
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                dp2.style.borderRadius = "0px 0px 10px 10px";
                
                break;
            }
          }
          cc--;
          break;
        case 'dispcolor4':
          dp3.style.borderRadius = "0px 0px 10px 10px";
          sessionStorage.removeItem('dp4c');
          sessionStorage.removeItem('dp4t');
          down.style.display = "none";
          dp4.style.display = "none";
          cc--;
          break;
          
      }
    });

    parent.appendChild(up);
    parent.appendChild(down);
    parent.appendChild(deletebt);

    // 条件に応じた表示制御
    switch (parentclass) {
      case 'dispcolor1':
        up.style.display = "none";
        if (cc === 1) down.style.display = "none";
        break;
      case 'dispcolor2':
        if (cc === 2) down.style.display = "none";
        break;
      case 'dispcolor3':
        if (cc === 3) down.style.display = "none";
        break;
      case 'dispcolor4':
        down.style.display = "none";
        if (cc === 4) down.style.display = "none";
        break;
    }
  });
  parent.addEventListener('mouseleave', function () {
    if (windowWidth <= 1024) return;
    parent.querySelectorAll('.up, .down, .deletebt').forEach(el => el.remove());
  });

  parent.addEventListener('click', function() {
    if (windowWidth >= 1025) return;
  
    let picBg = null;
    let picTx = null;
    let toBg = null;
    let toTx = null;
    const thisClass = document.querySelector('.' + parentclass);

    /*
    const drop = document.createElement('div');
    drop.classList.add('isDrop');
    drop.style.display = "flex";
    */
  
    switch (picUp) {
      case 0:
        console.log("case 0");
        thisClass.style.height = "40%";
        blackSc.style.display = "flex";
        trash.style.display = "flex";
        whatPic = parentclass;
        whatPicNum = whatPic.slice(-1);
        currentParentClass = parentclass; // ← 保存
        
        picUp = 1;
        console.log("I pick " + whatPic);
        break;
      case 1:
        console.log("case 1");
        toWhat = parentclass;
        toWhatNum = toWhat.slice(-1);
        if (toWhat === whatPic) {
          console.log("it's same color");
        } else if (toWhat === 'dispcolor1') {
          picBg = sessionStorage.getItem(`dp${whatPicNum}c`);
          picTx = sessionStorage.getItem(`dp${whatPicNum}t`);
          toBg = sessionStorage.getItem(`dp${toWhatNum}c`);
          toTx = sessionStorage.getItem(`dp${toWhatNum}t`);
          document.querySelector(`.dispcolor${whatPicNum}`).style.backgroundColor = toBg;
          document.querySelector(`.dispcolor${whatPicNum} > p`).innerHTML = toTx;
          dp1.style.backgroundColor = picBg;
          dp1t.innerHTML = picTx;
          sessionStorage.setItem(`dp${whatPicNum}c`, toBg);
          sessionStorage.setItem(`dp${whatPicNum}t`, toTx);
          sessionStorage.setItem('dp1c', picBg);
          sessionStorage.setItem('dp1t', picTx);
          console.log("I move to " + toWhat);
          document.querySelector(`.dispcolor${whatPicNum}`).style.height = "30%";
          blackSc.style.display = "none";
          trash.style.display = "none";
          whatPic = null;
          toWhat = null;
          currentParentClass = null;
          bg = null;
          tx = null;
          picUp = 0;
          console.log(picUp);
        } else if (toWhat === 'dispcolor2') {
          picBg = sessionStorage.getItem(`dp${whatPicNum}c`);
          picTx = sessionStorage.getItem(`dp${whatPicNum}t`);
          toBg = sessionStorage.getItem(`dp${toWhatNum}c`);
          toTx = sessionStorage.getItem(`dp${toWhatNum}t`);
          document.querySelector(`.dispcolor${whatPicNum}`).style.backgroundColor = toBg;
          document.querySelector(`.dispcolor${whatPicNum} > p`).innerHTML = toTx;
          dp2.style.backgroundColor = picBg;
          dp2t.innerHTML = picTx;
          sessionStorage.setItem(`dp${whatPicNum}c`, toBg);
          sessionStorage.setItem(`dp${whatPicNum}t`, toTx);
          sessionStorage.setItem('dp2c', picBg);
          sessionStorage.setItem('dp2t', picTx);
          console.log("I move to " + toWhat);
          document.querySelector(`.dispcolor${whatPicNum}`).style.height = "30%";
          blackSc.style.display = "none";
          trash.style.display = "none";
          whatPic = null;
          toWhat = null;
          currentParentClass = null;
          bg = null;
          tx = null;
          picUp = 0;
          console.log(picUp);
        } else if (toWhat === 'dispcolor3') {
          picBg = sessionStorage.getItem(`dp${whatPicNum}c`);
          picTx = sessionStorage.getItem(`dp${whatPicNum}t`);
          toBg = sessionStorage.getItem(`dp${toWhatNum}c`);
          toTx = sessionStorage.getItem(`dp${toWhatNum}t`);
          document.querySelector(`.dispcolor${whatPicNum}`).style.backgroundColor = toBg;
          document.querySelector(`.dispcolor${whatPicNum} > p`).innerHTML = toTx;
          dp3.style.backgroundColor = picBg;
          dp3t.innerHTML = picTx;
          sessionStorage.setItem(`dp${whatPicNum}c`, toBg);
          sessionStorage.setItem(`dp${whatPicNum}t`, toTx);
          sessionStorage.setItem('dp3c', picBg);
          sessionStorage.setItem('dp3t', picTx);
          console.log("I move to " + toWhat);
          document.querySelector(`.dispcolor${whatPicNum}`).style.height = "30%";
          blackSc.style.display = "none";
          trash.style.display = "none";
          whatPic = null;
          toWhat = null;
          currentParentClass = null;
          bg = null;
          tx = null;
          picUp = 0;
          console.log(picUp);
        } else if (toWhat === 'dispcolor4') {
          picBg = sessionStorage.getItem(`dp${whatPicNum}c`);
          picTx = sessionStorage.getItem(`dp${whatPicNum}t`);
          toBg = sessionStorage.getItem(`dp${toWhatNum}c`);
          toTx = sessionStorage.getItem(`dp${toWhatNum}t`);
          document.querySelector(`.dispcolor${whatPicNum}`).style.backgroundColor = toBg;
          document.querySelector(`.dispcolor${whatPicNum} > p`).innerHTML = toTx;
          dp4.style.backgroundColor = picBg;
          dp4t.innerHTML = picTx;
          sessionStorage.setItem(`dp${whatPicNum}c`, toBg);
          sessionStorage.setItem(`dp${whatPicNum}t`, toTx);
          sessionStorage.setItem('dp4c', picBg);
          sessionStorage.setItem('dp4t', picTx);
          console.log("I move to " + toWhat);
          document.querySelector(`.dispcolor${whatPicNum}`).style.height = "30%";
          blackSc.style.display = "none";
          trash.style.display = "none";
          whatPic = null;
          toWhat = null;
          currentParentClass = null;
          bg = null;
          tx = null;
          picUp = 0;
          console.log(picUp);
        }
        thisClass.style.height = "30%";
        blackSc.style.display = "none";
        trash.style.display = "none";
        whatPic = null;
        toWhat = null;
        currentParentClass = null;
        bg = null;
        tx = null;
        picUp = 0;
        console.log(picUp);
        break;
    }

  
    trash.addEventListener('click', function() {
      if (!currentParentClass) return;
      switch (parentclass) {
        case 'dispcolor1':
          if (window.getComputedStyle(dp2).display === "none") {
            dp1.style.display = "none";
            sessionStorage.removeItem('dp1c');
            sessionStorage.removeItem('dp1t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
                
                dp1.style.width = "33%";
                dp2.style.width = "34%";
                dp3.style.width = "33%";
                dp2.style.right = "33%";
                dp3.style.left = "67%";
                break;
              case 3:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                
                dp1.style.width = "50%";
                dp2.style.width = "50%";
                dp2.style.right = "0";
                break;
              case 2:
                bg = sessionStorage.getItem('dp2c');
                tx = sessionStorage.getItem('dp2t');
                dp1.style.backgroundColor = bg;
                dp1t.innerHTML = tx;
                sessionStorage.setItem('dp1c', bg);
                sessionStorage.setItem('dp1t', tx);
                sessionStorage.removeItem('dp2c');
                sessionStorage.removeItem('dp2t');
                dp2.style.display = "none";
  
                dp1.style.width = "100%";
                break;
            }
          }
          break;
        case 'dispcolor2':
          if (window.getComputedStyle(dp3).display === "none") {
            dp2.style.display = "none";
            dp1.style.width = "100%";
            sessionStorage.removeItem('dp2c');
            sessionStorage.removeItem('dp2t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
  
                dp1.style.width = "33%";
                dp2.style.width = "34%";
                dp3.style.width = "33%";
                dp2.style.right = "33%";
                dp3.style.left = "67%";
                break;
              case 3:
                bg = sessionStorage.getItem('dp3c');
                tx = sessionStorage.getItem('dp3t');
                dp2.style.backgroundColor = bg;
                dp2t.innerHTML = tx;
                sessionStorage.setItem('dp2c', bg);
                sessionStorage.setItem('dp2t', tx);
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                
                dp1.style.width = "50%";
                dp2.style.width = "50%";
                dp2.style.right = "0";
                break;
              case 2:
                sessionStorage.removeItem('dp2c');
                sessionStorage.removeItem('dp2t');
                dp2.style.display = "none";
                
                dp1.style.width = "100%";
                break;
            }
          }
          break;
        case 'dispcolor3':
          if (window.getComputedStyle(dp4).display === "none") {
            dp3.style.display = "none";
            dp1.style.width = "50%";
            dp2.style.width = "50%";
            dp2.style.right = "0";
            sessionStorage.removeItem('dp3c');
            sessionStorage.removeItem('dp3t');
          } else {
            switch(cc) {
              case 4:
                bg = sessionStorage.getItem('dp4c');
                tx = sessionStorage.getItem('dp4t');
                dp3.style.backgroundColor = bg;
                dp3t.innerHTML = tx;
                sessionStorage.setItem('dp3c', bg);
                sessionStorage.setItem('dp3t', tx);
                sessionStorage.removeItem('dp4c');
                sessionStorage.removeItem('dp4t');
                dp4.style.display = "none";
  
                dp1.style.width = "33%";
                dp2.style.width = "34%";
                dp3.style.width = "33%";
                dp2.style.right = "33%";
                dp3.style.left = "67%";
                break;
              case 3:
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                
                dp1.style.width = "50%";
                dp2.style.width = "50%";
                dp2.style.right = "0";
                break;
            }
          }
          break;
        case 'dispcolor4':
          sessionStorage.removeItem('dp4c');
          sessionStorage.removeItem('dp4t');
          dp4.style.display = "none";
  
          dp1.style.width = "33%";
          dp2.style.width = "34%";
          dp3.style.width = "33%";
          dp2.style.right = "33%";
          dp3.style.left = "67%";
          break;
          
      }
      cc--;
      thisClass.style.height = "30%";
      blackSc.style.display = "none";
      trash.style.display = "none";

      currentParentClass = null;
      whatPic = null;
      picUp = 0;
    }, { once: true });
  });
});

// colorTypes のクリック効果設定
colorTypes.forEach(type => {
  setupclickEffect(type.buttons, type.prefix);
});

const disptext = document.querySelector('.dispcolor > p');

const body = document.querySelector('body');
let offset = 0; // 追加される要素のオフセット

function setupclickEffect(buttonList, prefix) {
  buttonList.forEach(button => {
    button.addEventListener("click", function() {
      const color = window.getComputedStyle(button).backgroundColor;
      const text = button.textContent;

      

      // 最初のクリック
      switch (cc) {
        case 0:
          dp1.style.display = "flex";
          if (prefix === 'p' || prefix === 'lt') {
            dp1t.innerHTML = color + `<br>` + prefix + text + "+";
            sessionStorage.setItem('dp1t', color + `<br>` + prefix + text + "+");
          } else {
            dp1t.innerHTML = color + `<br>` + prefix + text;
            sessionStorage.setItem('dp1t', color + `<br>` + prefix + text);
          } 
          dp1.style.backgroundColor = color;
          sessionStorage.setItem('dp1c', color);
          dp1.style.borderRadius = "10px 10px 10px 10px";
          if (windowWidth <= 1024) {
            dp1.style.borderRadius = "0px 0px 0px 0px";
            dp1.style.width = "100%";
          }
          cc++;
          break;
        case 1:
          dp2.style.display = "flex";
          if (prefix === 'p' || prefix === 'lt') {
            dp2t.innerHTML = color + `<br>` + prefix + text + "+";
            sessionStorage.setItem('dp2t', color + `<br>` + prefix + text + "+");
          } else {
            dp2t.innerHTML = color + `<br>` + prefix + text;
            sessionStorage.setItem('dp2t', color + `<br>` + prefix + text);
          } 
          dp2.style.backgroundColor = color;
          sessionStorage.setItem('dp2c', color);
          dp1.style.borderRadius = "10px 10px 0px 0px";
          dp2.style.borderRadius = "0px 0px 10px 10px";
          if (windowWidth <= 1024) {
            dp1.style.borderRadius = "0px 0px 0px 0px";
            dp2.style.borderRadius = "0px 0px 0px 0px";

            dp1.style.width = "50%";
            dp2.style.width = "50%";
            dp2.style.right = "0";
          }
          cc++;
          break;
        case 2:
          dp3.style.display = "flex";
          if (prefix === 'p' || prefix === 'lt') {
            dp3t.innerHTML = color + `<br>` + prefix + text + "+";
            sessionStorage.setItem('dp3t', color + `<br>` + prefix + text + "+");
          } else {
            dp3t.innerHTML = color + `<br>` + prefix + text;
            sessionStorage.setItem('dp3t', color + `<br>` + prefix + text);
          } 
          dp3.style.backgroundColor = color;
          sessionStorage.setItem('dp3c', color);
          dp2.style.borderRadius = "0px 0px 0px 0px";
          dp3.style.borderRadius = "0px 0px 10px 10px";
          if (windowWidth <= 1024) {
            dp3.style.borderRadius = "0px 0px 0px 0px";

            dp1.style.width = "33%";
            dp2.style.width = "34%";
            dp3.style.width = "33%";
            dp2.style.right = "33%";
            dp3.style.left = "67%";
          }
          cc++;
          break;
        case 3:
          dp4.style.display = "flex";
          if (prefix === 'p' || prefix === 'lt') {
            dp4t.innerHTML = color + `<br>` + prefix + text + "+";
            sessionStorage.setItem('dp4t', color + `<br>` + prefix + text + "+");
          } else {
            dp4t.innerHTML = color + `<br>` + prefix + text;
            sessionStorage.setItem('dp4t', color + `<br>` + prefix + text);
          } 
          dp4.style.backgroundColor = color;
          sessionStorage.setItem('dp4c', color);
          dp3.style.borderRadius = "0px 0px 0px 0px";
          dp4.style.borderRadius = "0px 0px 10px 10px";
          if (windowWidth <= 1024) {
            dp4.style.borderRadius = "0px 0px 0px 0px";

            dp1.style.width = "25%";
            dp2.style.width = "25%";
            dp3.style.width = "25%";
            dp4.style.width = "25%";
            dp2.style.right = "50%";
            dp3.style.left = "50%";
          }
          cc++;
          break;
        case 4:
          break;
      }
    });
  });
}
