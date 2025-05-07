const colorTypes = [
  {
    buttons: document.querySelectorAll('.Gy_color'),
    line: document.querySelector('.line13'),
    prefix: 'Gy'
  },
  {
    buttons: document.querySelectorAll('.vivid_color'),
    line: document.querySelector('.line11'),
    prefix: 'v'
  },
  {
    buttons: document.querySelectorAll('.bright_color'),
    line: document.querySelector('.line12'),
    prefix: 'b'
  },
  {
    buttons: document.querySelectorAll('.deep_color'),
    line: document.querySelector('.line10'),
    prefix: 'dp'
  },
  {
    buttons: document.querySelectorAll('.light_color'),
    line: document.querySelector('.line9'),
    prefix: 'lt'
  },
  {
    buttons: document.querySelectorAll('.soft_color'),
    line: document.querySelector('.line8'),
    prefix: 'sf'
  },
  {
    buttons: document.querySelectorAll('.dull_color'),
    line: document.querySelector('.line7'),
    prefix: 'd'
  },
  {
    buttons: document.querySelectorAll('.dark_color'),
    line: document.querySelector('.line6'),
    prefix: 'dk'
  },
  {
    buttons: document.querySelectorAll('.pale_color'),
    line: document.querySelector('.line5'),
    prefix: 'p'
  },
  {
    buttons: document.querySelectorAll('.lightgray_color'),
    line: document.querySelector('.line4'),
    prefix: 'ltg'
  },
  {
    buttons: document.querySelectorAll('.gray_color'),
    line: document.querySelector('.line3'),
    prefix: 'g'
  },
  {
    buttons: document.querySelectorAll('.darkgray_color'),
    line: document.querySelector('.line2'),
    prefix: 'dkg'
  },
];

const gray = "#eaeaea"
const white = "#ffffff"

const container = document.querySelector('.container');
const lines = document.querySelector('.lines');
const colorText = document.querySelector('.text');

const ww = window.innerWidth / 2;
const wh = window.innerHeight / 3;
let fixedOriginX = 0;
let fixedOriginY = 0;

const reset = document.querySelector('.reset');
let rc = 0;
reset.addEventListener('click', (e) => {
  e.preventDefault();  // デフォルトの挙動をキャンセルしてタッチイベントを確実に処理
  if (windowWidth <= 1024) {
    container.style.transform = `scale(0.5)`
    container.style.top = wh + "px";
    container.style.left = "50%";
  } else {
    container.style.transform = `scale(0.8)`
    container.style.top = "50%";
    container.style.left = "35%";
  }
  scale = 0.8;
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

  const isTouchDevice = window.ontouchstart !== undefined;
  const ev = {
    down: isTouchDevice ? 'touchstart' : 'mousedown',
    move: isTouchDevice ? 'touchmove'  : 'mousemove',
    up  : isTouchDevice ? 'touchend'   : 'mouseup',
  };

  moveableElement.addEventListener(ev.down, e => {
    if (e.type === 'touchstart' && e.touches.length === 1) {
      isTouching = true;
      const touch = e.touches[0];
      startX = touch.pageX - moveableElement.offsetLeft;
      startY = touch.pageY - moveableElement.offsetTop;
      startWidth = moveableElement.offsetWidth;
      startHeight = moveableElement.offsetHeight;
  
    } else if (e.type === 'touchstart' && e.touches.length === 2) {
      lastDistance = getDistance(e.touches[0], e.touches[1]);
  
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      const rect = moveableElement.getBoundingClientRect();
      fixedOriginX = mid.x - rect.left;
      fixedOriginY = mid.y - rect.top;
  
      moveableElement.style.transformOrigin = `${fixedOriginX}px ${fixedOriginY}px`;
  
    } else if (e.type === 'mousedown') {
      MisTouching = true;
      MstartX = e.pageX - moveableElement.offsetLeft;
      MstartY = e.pageY - moveableElement.offsetTop;
      MstartWidth = moveableElement.offsetWidth;
      MstartHeight = moveableElement.offsetHeight;
    }
  });
  
  moveableElement.addEventListener(ev.move, e => {
    if (e.type === 'touchmove' && isTouching && e.touches.length === 1) {
      const touch = e.touches[0];
      moveableElement.style.left = touch.pageX - startX + 'px';
      moveableElement.style.top = touch.pageY - startY + 'px';
  
    } else if (e.type === 'touchmove' && e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = getDistance(t1, t2);
      const scaleChange = currentDistance / lastDistance;
      scale *= scaleChange;
      scale = Math.max(0.5, Math.min(scale, 2));
      moveableElement.style.transform = `scale(${scale})`;
  
      lastDistance = currentDistance;

      if (rc === 0) {
      } else {
        scale = 0.5;
        rc = 0;
      }
  
    } else if (e.type === 'mousemove' && MisTouching) {
      moveableElement.style.left = e.pageX - MstartX + 'px';
      moveableElement.style.top = e.pageY - MstartY + 'px';
    }
  }, { passive: false });
  
  moveableElement.addEventListener(ev.up, () => {
    isTouching = false;
    MisTouching = false;
  });
  
  // ✅ 追加: マウスホイール/トラックパッドによる拡大縮小
  moveableElement.addEventListener('wheel', e => {
    e.preventDefault(); // ページスクロールを防止
  
    const scaleChange = e.deltaY > 0 ? 0.95 : 1.05;
    scale *= scaleChange;
    if (rc === 0) {
    } else {
      scale = 0.8;
      rc = 0;
    }
    scale = Math.max(0.5, Math.min(scale, 2));
    moveableElement.style.transform = `scale(${scale})`;
  }, { passive: false });
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
  setupHoverEffect(type.buttons, type.line, type.prefix);
});

function setupHoverEffect(buttonList, targetLine, prefix) {
  buttonList.forEach(button => {
    button.addEventListener("mouseover", function() {
      targetLine.style.backgroundColor = gray;
      colorText.style.display = 'flex';
      let text = button.textContent;
      if (prefix === 'p' || prefix === 'lt') {
        colorText.textContent = prefix + text + "+";
      } else if (["W","Bk"].includes(text)) {
        colorText.textContent = text;
      } else {
        colorText.textContent = prefix + text;
      }
    });

    button.addEventListener("mouseout", function() {
      targetLine.style.backgroundColor = white;
      colorText.style.display = 'none';
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

  parent.addEventListener('click', function() {
  
    let picBg = null;
    let picTx = null;
    let toBg = null;
    let toTx = null;
    const thisClass = document.querySelector('.' + parentclass);
  
    switch (picUp) {
      case 0:
        console.log("case 0");
        if (windowWidth <= 1024) {
          thisClass.style.height = "40%";
        } else {
          thisClass.style.width = "40%";
        }
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
        const picdpEle = document.querySelector(`.dispcolor${toWhatNum}`)
        const picdpElet = document.querySelector(`.dispcolor${toWhatNum} > p`)
        const todpEle = document.querySelector(`.dispcolor${whatPicNum}`)
        const todpElet = document.querySelector(`.dispcolor${whatPicNum} > p`)
        const res = () => {
          picBg = sessionStorage.getItem(`dp${whatPicNum}c`);
          picTx = sessionStorage.getItem(`dp${whatPicNum}t`);
          toBg = sessionStorage.getItem(`dp${toWhatNum}c`);
          toTx = sessionStorage.getItem(`dp${toWhatNum}t`);
          todpEle.style.backgroundColor = toBg;
          todpElet.innerHTML = toTx;
          picdpEle.style.backgroundColor = picBg;
          picdpElet.innerHTML = picTx;
          if (todpElet.style.color === "black" && picdpElet.style.color === "black") {
            todpElet.style.color = "black";
            picdpElet.style.color = "black";
          } else if (todpElet.style.color === "black") {
            todpElet.style.color = "white";
            picdpElet.style.color = "black";
          } else if (picdpElet.style.color === "black") {
            picdpElet.style.color = "white";
            todpElet.style.color = "black";
          }
          sessionStorage.setItem(`dp${whatPicNum}c`, toBg);
          sessionStorage.setItem(`dp${whatPicNum}t`, toTx);
          sessionStorage.setItem(`dp${toWhatNum}c`, picBg);
          sessionStorage.setItem(`dp${toWhatNum}t`, picTx);
          console.log("I move to " + toWhat);
          if (windowWidth <= 1024) {
            document.querySelector(`.dispcolor${whatPicNum}`).style.height = "30%";
          } else if(windowWidth >= 1025) {
            document.querySelector(`.dispcolor${whatPicNum}`).style.width = "30%";
          }
          blackSc.style.display = "none";
          trash.style.display = "none";
          whatPic = null;
          toWhat = null;
          currentParentClass = null;
          bg = null;
          tx = null;
          picUp = 0;
          console.log(picUp);
        };
        if (toWhat === whatPic) {
          console.log("it's same color");
          if (windowWidth <= 1024) {
            thisClass.style.height = "30%";
          } else if (windowWidth >= 1025) {
            thisClass.style.width = "30%";
          }
          blackSc.style.display = "none";
          trash.style.display = "none";
          picUp = 0;
        } else if (toWhat === 'dispcolor1') {
          res();
        } else if (toWhat === 'dispcolor2') {
          res();
        } else if (toWhat === 'dispcolor3') {
          res();
        } else if (toWhat === 'dispcolor4') {
          res();
        }
        if (windowWidth <= 1024) {
          dps.style.height = "30%";
        } else {
          dps.style.width = "30%";
        }
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
            reset.style.right = "30px";
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
                
                if (windowWidth <= 1024) {
                  dp1.style.width = "33%";
                  dp2.style.width = "34%";
                  dp3.style.width = "33%";
                  dp2.style.right = "33%";
                  dp3.style.left = "67%";
                } else {
                  dp1.style.height = "33%";
                  dp2.style.height = "34%";
                  dp3.style.height = "33%";
                  dp2.style.top = "33%";
                  dp3.style.top = "67%";
                }
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
                
                if (windowWidth <= 1024) {
                  dp1.style.width = "50%";
                  dp2.style.width = "50%";
                  dp2.style.right = "0";
                } else {
                  dp1.style.height = "50%";
                  dp2.style.height = "50%";
                  dp2.style.top = "50%";
                }
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
  
                if (windowWidth <= 1024) {
                  dp1.style.width = "100%";
                } else {
                  dp1.style.height = "100%";
                }
                break;
            }
          }
          break;
        case 'dispcolor2':
          if (window.getComputedStyle(dp3).display === "none") {
            dp2.style.display = "none";
            if (windowWidth <= 1024) {
              dp1.style.width = "100%";
            } else {
              dp1.style.height = "100%";
            }
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
  
                if (windowWidth <= 1024) {
                  dp1.style.width = "33%";
                  dp2.style.width = "34%";
                  dp3.style.width = "33%";
                  dp2.style.right = "33%";
                  dp3.style.left = "67%";
                } else {
                  dp1.style.height = "33%";
                  dp2.style.height = "34%";
                  dp3.style.height = "33%";
                  dp2.style.top = "33%";
                  dp3.style.top = "67%";
                }
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
                
                if (windowWidth <= 1024) {
                  dp1.style.width = "50%";
                  dp2.style.width = "50%";
                  dp2.style.right = "0";
                } else {
                  dp1.style.height = "50%";
                  dp2.style.height = "50%";
                  dp2.style.top = "50%";
                }
                break;
              case 2:
                sessionStorage.removeItem('dp2c');
                sessionStorage.removeItem('dp2t');
                dp2.style.display = "none";
                
                if (windowWidth <= 1024) {
                  dp1.style.width = "100%";
                } else {
                  dp1.style.height = "100%";
                }
                break;
            }
          }
          break;
        case 'dispcolor3':
          if (window.getComputedStyle(dp4).display === "none") {
            dp3.style.display = "none";
            if (windowWidth <= 1024) {
              dp1.style.width = "50%";
              dp2.style.width = "50%";
              dp2.style.right = "0";
            } else {
              dp1.style.height = "50%";
              dp2.style.height = "50%";
              dp2.style.top = "50%";
            }
            
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
  
                if (windowWidth <= 1024) {
                  dp1.style.width = "33%";
                  dp2.style.width = "34%";
                  dp3.style.width = "33%";
                  dp2.style.right = "33%";
                  dp3.style.left = "67%";
                } else {
                  dp1.style.height = "33%";
                  dp2.style.height = "34%";
                  dp3.style.height = "33%";
                  dp2.style.top = "33%";
                  dp3.style.top = "67%";
                }
                break;
              case 3:
                sessionStorage.removeItem('dp3c');
                sessionStorage.removeItem('dp3t');
                dp3.style.display = "none";
                
                if (windowWidth <= 1024) {
                  dp1.style.width = "50%";
                  dp2.style.width = "50%";
                  dp2.style.right = "0";
                } else {
                  dp1.style.height = "50%";
                  dp2.style.height = "50%";
                  dp2.style.top = "50%";
                }
                break;
            }
          }
          break;
        case 'dispcolor4':
          sessionStorage.removeItem('dp4c');
          sessionStorage.removeItem('dp4t');
          dp4.style.display = "none";
  
          if (windowWidth <= 1024) {
            dp1.style.width = "33%";
            dp2.style.width = "34%";
            dp3.style.width = "33%";
            dp2.style.right = "33%";
            dp3.style.left = "67%";
          } else {
            dp1.style.height = "33%";
            dp2.style.height = "34%";
            dp3.style.height = "33%";
            dp2.style.top = "33%";
            dp3.style.top = "67%";
          }
          break;
          
      }
      cc--;
      if (windowWidth <= 1024) {
        thisClass.style.height = "30%";
      } else {
        thisClass.style.width = "30%";
      }
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
      const num = cc + 1;
      const Gyif = () => {
        const dpEle = document.querySelector(`.dispcolor${num}`);
        const dpElet = document.querySelector(`.dispcolor${num} > p`);
        const sessT = `dp${num}t`;
        const sessC = `dp${num}c`;
        dpEle.style.display = "flex";
        if (prefix === 'p' || prefix === 'lt') {
          dpElet.innerHTML = color + `<br>` + prefix + text + "+";
          sessionStorage.setItem(sessT, color + `<br>` + prefix + text + "+");
        }  else {
          if (["W","-9.0","-8.5","-8.0","-7.5","-7.0","-6.5","-6.0","-5.5"].includes(text)) {
            dpElet.style.color = "black";
          } else {
            dpElet.innerHTML = color + `<br>` + prefix + text;
            dpElet.style.color = "white";
          }
          if (["W","Bk"].includes(text)) {
            dpElet.innerHTML = color + `<br>` + text; 
            sessionStorage.setItem(sessT, color + `<br>` + text);
          } else {
            dpElet.innerHTML = color + `<br>` + prefix + text;
            sessionStorage.setItem(sessT, color + `<br>` + prefix + text);
          } 
        }
        dpEle.style.backgroundColor = color;
        sessionStorage.setItem(sessC, color);
      };
      
      // 最初のクリック
      switch (cc) {
        case 0:
          Gyif();
          if (windowWidth <= 1024) {
            dp1.style.width = "100%";
          } else {
            dp1.style.height = "100%";
            reset.style.right = "calc(30% + 30px)";
          }
          cc++;
          break;
        case 1:
          Gyif();
          if (windowWidth <= 1024) {
            dp1.style.width = "50%";
            dp2.style.width = "50%";
            dp2.style.right = "0";
          } else {
            dp1.style.height = "50%";
            dp2.style.height = "50%";
            dp2.style.top = "50%"
          }
          cc++;
          break;
        case 2:
          Gyif();
          if (windowWidth <= 1024) {
            dp1.style.width = "33%";
            dp2.style.width = "34%";
            dp3.style.width = "33%";
            dp2.style.right = "33%";
            dp3.style.left = "67%";
          } else {
            dp1.style.height = "33%";
            dp2.style.height = "34%";
            dp3.style.height = "33%";
            dp2.style.top = "33%";
            dp3.style.top = "67%";
          }
          cc++;
          break;
        case 3:
          Gyif();
          if (windowWidth <= 1024) {
            dp1.style.width = "25%";
            dp2.style.width = "25%";
            dp3.style.width = "25%";
            dp4.style.width = "25%";
            dp2.style.right = "50%";
            dp3.style.left = "50%";
          } else {
            dp1.style.height = "25%";
            dp2.style.height = "25%";
            dp3.style.height = "25%";
            dp4.style.height = "25%";
            dp2.style.top = "25%";
            dp3.style.top = "50%";
            dp4.style.top = "75%";
          }
          cc++;
          break;
        case 4:
          break;
      }
    });
  });
}
