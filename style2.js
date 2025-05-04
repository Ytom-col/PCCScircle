const vivids = document.querySelectorAll('.vivid_color');

vivids.forEach((item, index) => {
  const angle = index * 15 - 90;
  item.style.transform = `rotate(${angle}deg) translate(0px, -290px)`;
});

const colors = [
  {color: document.querySelectorAll('.bright_color'), translateY: -315},
  {color: document.querySelectorAll('.deep_color'), translateY: -265},
  {color: document.querySelectorAll('.light_color'), translateY: -240},
  {color: document.querySelectorAll('.soft_color'), translateY: -215},
  {color: document.querySelectorAll('.dull_color'), translateY: -190},
  {color: document.querySelectorAll('.dark_color'), translateY: -165},
  {color: document.querySelectorAll('.pale_color'), translateY: -140},
  {color: document.querySelectorAll('.lightgray_color'), translateY: -115},
  {color: document.querySelectorAll('.gray_color'), translateY: -90},
  {color: document.querySelectorAll('.darkgray_color'), translateY: -65},
  {color: document.querySelectorAll('.colornum > p'), translateY: -330}
];

colors.forEach(type => {
  setupHoverEffect(type.color, type.translateY);
});

function setupHoverEffect(colorlist, translateY) {
  colorlist.forEach((item, index) => {
    const angle = index * 30 - 75;
    item.style.transform = `rotate(${angle}deg) translate(0px, ${translateY}px)`;
  });
};