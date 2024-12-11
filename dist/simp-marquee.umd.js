(function(n,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(n=typeof globalThis<"u"?globalThis:n||self,s(n.SimpMarqueeLib={}))})(this,function(n){"use strict";var S=Object.defineProperty;var v=(n,s,o)=>s in n?S(n,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[s]=o;var e=(n,s,o)=>v(n,typeof s!="symbol"?s+"":s,o);const s={css:"simp_marquee--css",start:"simp_marquee--start",cssStart:"simp_marquee--css_start",clone:"simp_marquee-clone",cloneStart:"simp_marquee--clone_start",cloneEnd:"simp_marquee--clone_end",draggable:"simp_marquee--draggable",vertical:"simp_marquee--vertical"};class o{constructor(r,t){e(this,"localInitError",!1);e(this,"props");e(this,"direction","left");e(this,"isVertical",!1);e(this,"handlerResizeBind");e(this,"typeSimpMarquee","js");e(this,"isCSS",!1);e(this,"resultFullSize",0);e(this,"wrapper");e(this,"container");e(this,"items");e(this,"sizeWrapper");e(this,"sizeItems");e(this,"sizeContainer");e(this,"cloneWith",3);e(this,"startInitPosition",0);e(this,"MAX_COUNT_CLONE",100);e(this,"CURRENT_COUNT_CLONE",1);this.props=r;const{wrapperSelector:i}=this.props;if(this.typeSimpMarquee=t,this.typeSimpMarquee==="css"&&(this.isCSS=!0),typeof i=="string"?this.wrapper=document.querySelector(i):this.wrapper=i,!this.wrapper){console.warn('Now found element with selector "'+i+'"');return}if(this.container=this.wrapper.querySelector(".simp_marquee__container"),this.items=this.wrapper.querySelector(".simp_marquee__items"),!this.container||!this.items){console.warn("Now found element (body or items)"),this.setLocalInitError();return}this.initBase()}initBase(){const{direction:r="left",cloneWith:t}=this.props;this.direction=r,(this.direction==="top"||this.direction==="bottom")&&(this.isVertical=!0),t||(this.cloneWith=this.isCSS?2:3),this.isVertical&&!this.wrapper.classList.contains(s.vertical)&&this.wrapper.classList.add(s.vertical),this.handlerResizeBind=this.debounce(this.handlerResize.bind(this),200)}setLocalInitError(){this.localInitError=!0}debounce(r,t){let i;return(...a)=>{clearTimeout(i),i=setTimeout(()=>r.apply(this,a),t)}}initSize(){this.updateSize(),window.addEventListener("resize",this.handlerResizeBind)}handlerResize(){this.updateSize(),this.reinitItems()}updateSize(){this.isVertical?(this.sizeWrapper=this.wrapper.offsetHeight,this.sizeItems=this.items.scrollHeight,this.sizeContainer=this.container.scrollHeight):(this.sizeWrapper=this.wrapper.offsetWidth,this.sizeItems=this.items.scrollWidth,this.sizeContainer=this.container.scrollWidth),this.isCSS?this.resultFullSize=this.sizeWrapper*this.cloneWith:this.resultFullSize=Math.max(this.sizeWrapper,this.sizeItems)*this.cloneWith,this.startInitPosition=Math.max(this.sizeWrapper,this.sizeItems)*-1}setSizeContainer(){this.sizeContainer=this.isVertical?this.container.scrollHeight:this.container.scrollWidth}setInitItemsHalf(){}setInitItems(){const r=this.isCSS?1:2,t=Math.min(Math.max(Math.ceil(this.resultFullSize/this.sizeItems)-1,r),this.MAX_COUNT_CLONE);let i=document.createDocumentFragment();for(let a=0;a<t;a++)i.appendChild(this.addCloneDom(!1));i&&this.container.appendChild(i),i=null}reinitItems(){this.sizeContainer<this.resultFullSize&&(this.setInitItems(),this.isCSS&&(this.wrapper.classList.remove(s.cssStart),setTimeout(()=>{this.wrapper.classList.add(s.cssStart)},40)))}addCloneDom(r){const t=this.items.cloneNode(!0);return t.classList.add(s.clone),t}destroyBase(){this.container.querySelectorAll(`.${s.clone}`).forEach(t=>t.remove()),window.removeEventListener("resize",this.handlerResizeBind)}destroyAfter(){this.wrapper=void 0,this.container=void 0,this.items=void 0}}class d extends o{constructor(t){super(t,"js");e(this,"isCanNextStep",!0);e(this,"nextStepPX",0);e(this,"animationStart",null);e(this,"initialMousePosition",0);e(this,"speed",80);e(this,"isDragging",!1);e(this,"isMoved",!1);e(this,"isAddedDraggableClass",!1);e(this,"requestId",null);e(this,"isInertia",!0);e(this,"inertiaFriction",.95);e(this,"inertiaThreshold",10);e(this,"inertiaAfterPause",300);e(this,"idSetTimeoutStartInertia",null);e(this,"handlerMouseMoveBind");e(this,"handlerTouchMoveBind");e(this,"mouseEnterHandlerBind");e(this,"mouseDownHandlerBind");e(this,"touchStartHandlerBind");e(this,"animateNextStepBind");e(this,"isObserverPause",!1);e(this,"callbackObserverBind");e(this,"observer");e(this,"observerOptions",{root:null,rootMargin:"0px",threshold:0});e(this,"isTouchDevice","ontouchstart"in window);e(this,"minIntervalFPS",0);e(this,"velocity",0);e(this,"animationFrameInertia",null);!this.localInitError&&(this.initSetSetting(),this.init())}initSetSetting(){const{speed:t=8,isObserverPause:i=!0,minIntervalFPS:a=0}=this.props,{isInertia:u=!0,inertiaFriction:h=.95,inertiaThreshold:m=10,inertiaAfterPause:p=300}=this.props;this.minIntervalFPS=a,this.isObserverPause=i,this.speed=t*10,this.inertiaAfterPause=p,this.isInertia=u,h>=.8&&h<=.99&&(this.inertiaFriction=h),this.inertiaThreshold=m}init(){this.handlerMouseMoveBind=this.handlerMouseMove.bind(this),this.animateNextStepBind=this.animateNextStep.bind(this),this.handlerTouchMoveBind=this.handlerTouchMove.bind(this),this.mouseEnterHandlerBind=this.mouseEnterHandler.bind(this),this.mouseDownHandlerBind=this.mouseDownHandler.bind(this),this.touchStartHandlerBind=this.touchStartHandler.bind(this),this.initSize(),this.setInitItems(),this.setInitPosition(),this.isObserverPause&&(this.callbackObserverBind=this.callbackObserver.bind(this),this.observer=new IntersectionObserver(this.callbackObserverBind,this.observerOptions),this.observer.observe(this.wrapper)),this.requestId=requestAnimationFrame(this.animateNextStepBind),this.wrapper.classList.add(s.start),this.container.addEventListener("mouseenter",this.mouseEnterHandlerBind),this.container.addEventListener("mousedown",this.mouseDownHandlerBind),this.isTouchDevice&&this.container.addEventListener("touchstart",this.touchStartHandlerBind),this.props.callbackInit&&this.props.callbackInit(this.wrapper,this)}setInitPosition(){this.nextStepPX=this.startInitPosition,this.move()}callbackObserver(t){t.forEach(i=>{i.isIntersecting?this.isCanNextStep||this.start():this.isCanNextStep&&this.stop()})}mouseEnterHandler(){this.moveHandlerStart(),this.inertiaClear(),this.container.addEventListener("mouseleave",()=>{this.mouseLeaveHandler()},{once:!0})}mouseLeaveHandler(){this.isDragging||this.moveEndHandler()}mouseDownHandler(t){this.isDragging=!0,this.initialMousePosition=this.getClientPosition(t),document.addEventListener("mouseup",i=>{this.handlerMouseup(i)},{once:!0}),document.addEventListener("mousemove",this.handlerMouseMoveBind)}touchStartHandler(t){this.isDragging=!0,this.isMoved=!1,this.initialMousePosition=this.getClientPosition(t),this.moveHandlerStart(),this.inertiaClear(),document.addEventListener("touchmove",this.handlerTouchMoveBind),document.addEventListener("touchend",i=>{this.isMoved&&i.preventDefault(),this.isMoved=!1,this.handlerTouchEnd()},{once:!0})}handlerTouchMove(t){if(!this.isDragging)return;this.isMoved=!0;const i=this.getClientPosition(t),a=i-this.initialMousePosition;this.velocity=a,this.addNextStepDirection(a),this.initialMousePosition=i}handlerTouchEnd(){this.isDragging=!1,this.moveEndHandler(),this.startInertia(),document.removeEventListener("touchmove",this.handlerTouchMoveBind)}handlerMouseMove(t){if(!this.isDragging)return;this.isAddedDraggableClass||(this.wrapper.classList.add(s.draggable),this.isAddedDraggableClass=!0);const i=this.getClientPosition(t)-this.initialMousePosition;this.velocity=i,this.addNextStepDirection(i),this.initialMousePosition=this.getClientPosition(t)}getClientPosition(t){return t instanceof MouseEvent?this.isVertical?t.clientY:t.clientX:this.isVertical?t.touches[0].clientY:t.touches[0].clientX}handlerMouseup(t){this.mouseleaveClear(),this.wrapper.classList.remove(s.draggable),this.isAddedDraggableClass=!1,document.removeEventListener("mousemove",this.handlerMouseMoveBind);const i=t.target;i&&this.wrapper.contains(i)&&this.moveHandlerStart(),this.startInertia()}startInertia(){this.isInertia&&Math.abs(this.velocity)>this.inertiaThreshold&&this.requestInertia()}requestInertia(){let t=!0;const i=()=>{if(this.idSetTimeoutStartInertia&&window.clearTimeout(this.idSetTimeoutStartInertia),this.moveHandlerStart(!1),this.addNextStepDirection(this.velocity),this.velocity*=this.inertiaFriction,Math.abs(this.velocity)>.5)t=!0,this.animationFrameInertia=requestAnimationFrame(i);else{if(t=!1,this.cancelAnimationFrameInertia(),!this.isCanNextStep)return;this.inertiaAfterPause?this.idSetTimeoutStartInertia=window.setTimeout(()=>{this.start()},this.inertiaAfterPause):this.start()}};t?this.animationFrameInertia=requestAnimationFrame(i):this.animationFrameInertia&&this.cancelAnimationFrameInertia()}inertiaClear(){this.velocity=0,this.cancelAnimationFrameInertia()}mouseleaveClear(){this.isDragging=!1,this.isCanNextStep=!0,this.animationStart=null,this.initialMousePosition=0}moveHandlerStart(t=!0){this.cancelAnimationFrameInertia(),t&&(this.isCanNextStep=!1)}moveEndHandler(){this.mouseleaveClear(),this.requestId=requestAnimationFrame(this.animateNextStepBind)}animateNextStep(t){if(!this.isCanNextStep||this.animationFrameInertia){this.requestId&&cancelAnimationFrame(this.requestId);return}if(this.minIntervalFPS&&this.animationStart&&t-this.animationStart<this.minIntervalFPS){this.requestId=requestAnimationFrame(this.animateNextStepBind);return}this.animationStart||(this.animationStart=t);const i=(t-this.animationStart)/1e3*this.speed;this.addTextStepPX(this.numberFormatRound(i)),this.animationStart=t,requestAnimationFrame(this.animateNextStepBind)}getDirectionPosition(t){const i=this.direction==="left"||this.direction==="top"?-1:1;return t*i}addNextStepDirection(t){this.addTextStepPX(this.getDirectionPosition(t))}addTextStepPX(t){this.direction==="left"||this.direction==="top"?this.nextStepPX=this.numberFormatRound(this.nextStepPX-t):this.nextStepPX=this.numberFormatRound(this.nextStepPX+t);const i=this.nextStepPX+Math.abs(this.startInitPosition);Math.abs(i)>Math.max(this.sizeWrapper,this.sizeItems)&&(this.nextStepPX+=this.numberFormatRound((i<0?1:-1)*this.sizeItems),this.animationStart=null),this.move()}move(){const t=this.isVertical?"translateY":"translateX";this.container.style.transform=`${t}(${this.nextStepPX}px)`}numberFormatRound(t){return Math.round(t*1e3)/1e3}cancelAnimationFrameInertia(){this.animationFrameInertia&&cancelAnimationFrame(this.animationFrameInertia),this.animationFrameInertia=null}stop(){this.moveHandlerStart(),this.inertiaClear()}start(){this.cancelAnimationFrameInertia(),this.moveEndHandler()}updateSpeed(t){typeof t=="number"&&(this.speed=t*10,this.moveEndHandler())}destroy(){this.destroyBase(),this.cancelAnimationFrameInertia(),this.inertiaClear(),this.requestId&&window.cancelAnimationFrame(this.requestId),this.container.removeEventListener("mouseenter",this.mouseEnterHandlerBind),this.container.removeEventListener("mousedown",this.mouseDownHandlerBind),this.container.removeEventListener("touchstart",this.touchStartHandlerBind),document.removeEventListener("mousemove",this.handlerMouseMoveBind),document.removeEventListener("touchmove",this.handlerTouchMoveBind),this.observer&&this.observer.disconnect(),delete this.handlerMouseMoveBind,delete this.handlerTouchMoveBind,delete this.mouseEnterHandlerBind,delete this.mouseDownHandlerBind,delete this.touchStartHandlerBind,delete this.animateNextStepBind,this.destroyAfter()}}class c extends o{constructor(r){super(r,"css"),!this.localInitError&&(this.initSetSetting(),this.init())}initSetSetting(){this.wrapper.classList.add(s.css)}init(){this.wrapper.classList.add(s.cssStart),this.props.callbackInit&&this.props.callbackInit(this.wrapper,this),this.initSize(),this.setInitItems()}destroy(){this.destroyBase(),this.wrapper.classList.remove(s.css),this.wrapper.classList.remove(s.cssStart),this.destroyAfter()}}n.SimpMarquee=d,n.SimpMarqueeCSS=c,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
