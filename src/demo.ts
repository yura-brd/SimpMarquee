import { SimpMarquee, SimpMarqueeCSS } from './lib/main';
new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_3',
  speed: 3
})


// @ts-ignore
// window['aa'] = new SimpMarquee({
//   wrapperSelector: '.js_simp_marquee_1',
//   speed: 10,
//   cloneWith: 1,
//   isObserverPause: true,
// })

function findNearestVisibleElement(container:HTMLElement, elements:NodeListOf<HTMLElement>) {
  // Получаем границы области видимости родителя
  const containerRect = container.getBoundingClientRect();

  // Получаем смещение по оси X
  const transformMatrix = window.getComputedStyle(container).transform;
  const translateX = transformMatrix === 'none' ? 0 : parseFloat(transformMatrix.split(',')[4]);

  let closestElement = null;
  let minDistance = Infinity;

  elements.forEach(element => {
    const elementRect = element.getBoundingClientRect();

    // Проверяем, что элемент не прокручен (не выходит за границы родителя)
    const isInVisibleRange = (
      elementRect.left >= containerRect.left + translateX &&
      elementRect.right <= containerRect.right + translateX
    );

    if (isInVisibleRange) {
      // Если элемент в области видимости, выбираем его
      closestElement = element;
      minDistance = 0; // Видимый элемент
    } else {
      // Считаем расстояние до видимой области (если элемент не виден)
      const distance = Math.min(
        Math.abs(elementRect.left - (containerRect.left + translateX)),
        Math.abs(elementRect.right - (containerRect.right + translateX))
      );

      if (distance < minDistance) {
        closestElement = element;
        minDistance = distance;
      }
    }
  });

  return closestElement;
}
let isNeedStop = false;
const scrollAnimation = new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_1',
  speed: 80,
  cloneWith: 1,
  isObserverPause: true,
  callbackTick: ()  => {
    if (!isNeedStop) {
      return;
    }
    // console.log('position', position);
    //
    // const elements = wrapper.querySelectorAll<HTMLElement>('[data-selected]')
    // const nearestElement = findNearestVisibleElement(wrapper, elements);
    // if (nearestElement) {
    //   console.log('Ближайший элемент:', nearestElement);
    //   simpMarquee.stop()
    //   // Можно выполнить дополнительное действие с элементом
    // }
    // if (position < -9000) {
    //   simpMarquee.stop()
    // }
  }
});
// @ts-ignore
window['scrollAnimation'] = aaa;
function updateSpeed(speed: number) {
  const newSpeed = speed - 10;
  scrollAnimation.updateSpeed(newSpeed);
  if (speed > 20) {
    setTimeout(() => {
      updateSpeed(newSpeed)
    }, 1000)
  } else {
    isNeedStop = true;
  }
}
updateSpeed(80);

new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_2',
  speed: 8,
  direction: 'right',
})
const init = 1;

if (init) {



  new SimpMarquee({
    wrapperSelector: '.js_simp_marquee_vertical_1',
    speed: 4,
    direction: 'top',
    callbackInit: (wrapper, simpMarquee)  => {
      console.log('wrapper', wrapper);
      console.log('simpMarquee', simpMarquee);
    }
  })

  new SimpMarquee({
    wrapperSelector: '.js_simp_marquee_vertical_2',
    speed: 10,
    direction: 'bottom',
  })

  new SimpMarqueeCSS({
    wrapperSelector: '.js_simp_marquee_css_1'
  })

  new SimpMarqueeCSS({
    wrapperSelector: '.js_simp_marquee_css_2'
  })
}

