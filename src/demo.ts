import { SimpMarquee, SimpMarqueeCSS } from './lib/main';
new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_3',
  speed: 15
})
// @ts-ignore
window['aa'] = new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_1',
  speed: 10,
  cloneWith: 1,
  isObserverPause: true
})
new SimpMarquee({
  wrapperSelector: '.js_simp_marquee_2',
  speed: 8,
  direction: 'right',
})
const init = 1;

if (init) {

  new SimpMarquee({
    wrapperSelector: '.js_simp_marquee_3',
    speed: 15
  })

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

