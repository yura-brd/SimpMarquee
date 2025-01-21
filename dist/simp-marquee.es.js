var m = Object.defineProperty;
var p = (a, s, t) => s in a ? m(a, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[s] = t;
var e = (a, s, t) => p(a, typeof s != "symbol" ? s + "" : s, t);
const n = {
  css: "simp_marquee--css",
  start: "simp_marquee--start",
  cssStart: "simp_marquee--css_start",
  clone: "simp_marquee-clone",
  cloneStart: "simp_marquee--clone_start",
  cloneEnd: "simp_marquee--clone_end",
  draggable: "simp_marquee--draggable",
  vertical: "simp_marquee--vertical"
};
class h {
  constructor(s, t) {
    e(this, "localInitError", !1);
    e(this, "props");
    e(this, "direction", "left");
    e(this, "isVertical", !1);
    e(this, "handlerResizeBind");
    e(this, "typeSimpMarquee", "js");
    e(this, "isCSS", !1);
    e(this, "resultFullSize", 0);
    e(this, "wrapper");
    e(this, "container");
    e(this, "items");
    e(this, "sizeWrapper");
    e(this, "sizeItems");
    e(this, "sizeContainer");
    e(this, "cloneWith", 3);
    e(this, "startInitPosition", 0);
    e(this, "MAX_COUNT_CLONE", 100);
    e(this, "CURRENT_COUNT_CLONE", 1);
    this.props = s;
    const { wrapperSelector: i } = this.props;
    if (this.typeSimpMarquee = t, this.typeSimpMarquee === "css" && (this.isCSS = !0), typeof i == "string" ? this.wrapper = document.querySelector(i) : this.wrapper = i, !this.wrapper) {
      console.warn('Now found element with selector "' + i + '"');
      return;
    }
    if (this.container = this.wrapper.querySelector(".simp_marquee__container"), this.items = this.wrapper.querySelector(".simp_marquee__items"), !this.container || !this.items) {
      console.warn("Now found element (body or items)"), this.setLocalInitError();
      return;
    }
    this.initBase();
  }
  initBase() {
    const { direction: s = "left", cloneWith: t } = this.props;
    this.direction = s, (this.direction === "top" || this.direction === "bottom") && (this.isVertical = !0), t || (this.cloneWith = this.isCSS ? 2 : 3), this.isVertical && !this.wrapper.classList.contains(n.vertical) && this.wrapper.classList.add(n.vertical), this.handlerResizeBind = this.debounce(this.handlerResize.bind(this), 200);
  }
  setLocalInitError() {
    this.localInitError = !0;
  }
  debounce(s, t) {
    let i;
    return (...r) => {
      clearTimeout(i), i = setTimeout(() => s.apply(this, r), t);
    };
  }
  initSize() {
    this.updateSize(), window.addEventListener("resize", this.handlerResizeBind);
  }
  handlerResize() {
    this.updateSize(), this.reinitItems();
  }
  updateSize() {
    this.isVertical ? (this.sizeWrapper = this.wrapper.offsetHeight, this.sizeItems = this.items.scrollHeight, this.sizeContainer = this.container.scrollHeight) : (this.sizeWrapper = this.wrapper.offsetWidth, this.sizeItems = this.items.scrollWidth, this.sizeContainer = this.container.scrollWidth), this.isCSS ? this.resultFullSize = this.sizeWrapper * this.cloneWith : this.resultFullSize = Math.max(this.sizeWrapper, this.sizeItems) * this.cloneWith, this.startInitPosition = Math.max(this.sizeWrapper, this.sizeItems) * -1;
  }
  setSizeContainer() {
    this.sizeContainer = this.isVertical ? this.container.scrollHeight : this.container.scrollWidth;
  }
  setInitItemsHalf() {
  }
  setInitItems() {
    const s = this.isCSS ? 1 : 2, t = Math.min(Math.max(Math.ceil(this.resultFullSize / this.sizeItems) - 1, s), this.MAX_COUNT_CLONE);
    let i = document.createDocumentFragment();
    for (let r = 0; r < t; r++)
      i.appendChild(this.addCloneDom(!1));
    i && this.container.appendChild(i), i = null;
  }
  reinitItems() {
    this.sizeContainer < this.resultFullSize && (this.setInitItems(), this.isCSS && (this.wrapper.classList.remove(n.cssStart), setTimeout(() => {
      this.wrapper.classList.add(n.cssStart);
    }, 40)));
  }
  addCloneDom(s) {
    const t = this.items.cloneNode(!0);
    return t.classList.add(n.clone), t;
  }
  destroyBase() {
    this.container.querySelectorAll(`.${n.clone}`).forEach((t) => t.remove()), window.removeEventListener("resize", this.handlerResizeBind);
  }
  destroyAfter() {
    this.wrapper = void 0, this.container = void 0, this.items = void 0;
  }
}
class S extends h {
  constructor(t) {
    super(t, "js");
    e(this, "isCanNextStep", !0);
    e(this, "nextStepPX", 0);
    e(this, "animationStart", null);
    e(this, "initialMousePosition", 0);
    e(this, "speed", 80);
    e(this, "isDragging", !1);
    e(this, "isMoved", !1);
    e(this, "isWheel", !1);
    e(this, "isAddedDraggableClass", !1);
    e(this, "requestId", null);
    e(this, "isInertia", !0);
    e(this, "inertiaFriction", 0.95);
    // 0.8 - .99
    e(this, "inertiaThreshold", 10);
    e(this, "inertiaAfterPause", 300);
    e(this, "idSetTimeoutStartInertia", null);
    e(this, "handlerMouseMoveBind");
    e(this, "handlerWheelMoveBind");
    e(this, "handlerTouchMoveBind");
    e(this, "mouseEnterHandlerBind");
    e(this, "mouseDownHandlerBind");
    e(this, "touchStartHandlerBind");
    e(this, "animateNextStepBind");
    e(this, "isObserverPause", !1);
    e(this, "callbackObserverBind");
    e(this, "observer");
    e(this, "observerOptions", {
      root: null,
      // null означает, что корнем является viewport
      rootMargin: "0px",
      // отступы вокруг корня
      threshold: 0
      // процент видимости (0.5 означает 50% элемента должно быть видно)
    });
    e(this, "isTouchDevice", "ontouchstart" in window);
    e(this, "minIntervalFPS", 0);
    e(this, "velocity", 0);
    e(this, "animationFrameInertia", null);
    !this.localInitError && (this.initSetSetting(), this.init());
  }
  initSetSetting() {
    const { speed: t = 8, isObserverPause: i = !0, isWheel: r = !0, minIntervalFPS: l = 0 } = this.props, { isInertia: d = !0, inertiaFriction: o = 0.95, inertiaThreshold: c = 10, inertiaAfterPause: u = 300 } = this.props;
    this.isWheel = r, this.minIntervalFPS = l, this.isObserverPause = i, this.speed = t * 10, this.inertiaAfterPause = u, this.isInertia = d, o >= 0.8 && o <= 0.99 && (this.inertiaFriction = o), this.inertiaThreshold = c;
  }
  init() {
    this.handlerMouseMoveBind = this.handlerMouseMove.bind(this), this.handlerWheelMoveBind = this.handlerWheelMove.bind(this), this.animateNextStepBind = this.animateNextStep.bind(this), this.handlerTouchMoveBind = this.handlerTouchMove.bind(this), this.mouseEnterHandlerBind = this.mouseEnterHandler.bind(this), this.mouseDownHandlerBind = this.mouseDownHandler.bind(this), this.touchStartHandlerBind = this.touchStartHandler.bind(this), this.initSize(), this.setInitItems(), this.setInitPosition(), this.isObserverPause && (this.callbackObserverBind = this.callbackObserver.bind(this), this.observer = new IntersectionObserver(this.callbackObserverBind, this.observerOptions), this.observer.observe(this.wrapper)), this.requestId = requestAnimationFrame(this.animateNextStepBind), this.wrapper.classList.add(n.start), this.container.addEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.addEventListener("mousedown", this.mouseDownHandlerBind), this.isTouchDevice && this.container.addEventListener("touchstart", this.touchStartHandlerBind), this.isWheel && this.container.addEventListener("wheel", this.handlerWheelMoveBind), this.props.callbackInit && this.props.callbackInit(this.wrapper, this);
  }
  setInitPosition() {
    this.nextStepPX = this.startInitPosition, this.move();
  }
  callbackObserver(t) {
    t.forEach((i) => {
      i.isIntersecting ? this.isCanNextStep || this.start() : this.isCanNextStep && this.stop();
    });
  }
  mouseEnterHandler() {
    this.moveHandlerStart(), this.inertiaClear(), this.container.addEventListener("mouseleave", () => {
      this.mouseLeaveHandler();
    }, { once: !0 });
  }
  mouseLeaveHandler() {
    this.isDragging || this.moveEndHandler();
  }
  mouseDownHandler(t) {
    this.isDragging = !0, this.initialMousePosition = this.getClientPosition(t), document.addEventListener("mouseup", (i) => {
      this.handlerMouseup(i);
    }, { once: !0 }), document.addEventListener("mousemove", this.handlerMouseMoveBind);
  }
  touchStartHandler(t) {
    this.isDragging = !0, this.isMoved = !1, this.initialMousePosition = this.getClientPosition(t), this.moveHandlerStart(), this.inertiaClear(), document.addEventListener("touchmove", this.handlerTouchMoveBind), document.addEventListener("touchend", (i) => {
      this.isMoved && i.preventDefault(), this.isMoved = !1, this.handlerTouchEnd();
    }, { once: !0 });
  }
  handlerTouchMove(t) {
    if (!this.isDragging) return;
    this.isMoved = !0;
    const i = this.getClientPosition(t), r = i - this.initialMousePosition;
    this.velocity = r, this.addNextStepDirection(r), this.initialMousePosition = i;
  }
  handlerTouchEnd() {
    this.isDragging = !1, this.moveEndHandler(), this.startInertia(), document.removeEventListener("touchmove", this.handlerTouchMoveBind);
  }
  handlerWheelMove(t) {
    const i = Math.abs(t.deltaX) > Math.abs(t.deltaY);
    (this.isVertical && !i || !this.isVertical && i) && t.preventDefault(), window.requestAnimationFrame(() => {
      const r = this.isVertical ? t.deltaY : t.deltaX;
      this.addNextStepDirection(r);
    });
  }
  handlerMouseMove(t) {
    if (!this.isDragging)
      return;
    this.isAddedDraggableClass || (this.wrapper.classList.add(n.draggable), this.isAddedDraggableClass = !0);
    const i = this.getClientPosition(t) - this.initialMousePosition;
    this.velocity = i, this.addNextStepDirection(i), this.initialMousePosition = this.getClientPosition(t);
  }
  getClientPosition(t) {
    return t instanceof MouseEvent ? this.isVertical ? t.clientY : t.clientX : this.isVertical ? t.touches[0].clientY : t.touches[0].clientX;
  }
  handlerMouseup(t) {
    this.mouseleaveClear(), this.wrapper.classList.remove(n.draggable), this.isAddedDraggableClass = !1, document.removeEventListener("mousemove", this.handlerMouseMoveBind);
    const i = t.target;
    i && this.wrapper.contains(i) && this.moveHandlerStart(), this.startInertia();
  }
  startInertia() {
    this.isInertia && Math.abs(this.velocity) > this.inertiaThreshold && this.requestInertia();
  }
  requestInertia() {
    let t = !0;
    const i = () => {
      if (this.idSetTimeoutStartInertia && window.clearTimeout(this.idSetTimeoutStartInertia), this.moveHandlerStart(!1), this.addNextStepDirection(this.velocity), this.velocity *= this.inertiaFriction, Math.abs(this.velocity) > 0.5)
        t = !0, this.animationFrameInertia = requestAnimationFrame(i);
      else {
        if (t = !1, this.cancelAnimationFrameInertia(), !this.isCanNextStep)
          return;
        this.inertiaAfterPause ? this.idSetTimeoutStartInertia = window.setTimeout(() => {
          this.start();
        }, this.inertiaAfterPause) : this.start();
      }
    };
    t ? this.animationFrameInertia = requestAnimationFrame(i) : this.animationFrameInertia && this.cancelAnimationFrameInertia();
  }
  inertiaClear() {
    this.velocity = 0, this.cancelAnimationFrameInertia();
  }
  mouseleaveClear() {
    this.isDragging = !1, this.isCanNextStep = !0, this.animationStart = null, this.initialMousePosition = 0;
  }
  moveHandlerStart(t = !0) {
    this.cancelAnimationFrameInertia(), t && (this.isCanNextStep = !1);
  }
  moveEndHandler() {
    this.mouseleaveClear(), this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }
  animateNextStep(t) {
    if (!this.isCanNextStep || this.animationFrameInertia) {
      this.requestId && cancelAnimationFrame(this.requestId);
      return;
    }
    if (this.minIntervalFPS && this.animationStart && t - this.animationStart < this.minIntervalFPS) {
      this.requestId = requestAnimationFrame(this.animateNextStepBind);
      return;
    }
    this.animationStart || (this.animationStart = t);
    const i = (t - this.animationStart) / 1e3 * this.speed;
    this.addTextStepPX(this.numberFormatRound(i)), this.animationStart = t, requestAnimationFrame(this.animateNextStepBind);
  }
  getDirectionPosition(t) {
    const i = this.direction === "left" || this.direction === "top" ? -1 : 1;
    return t * i;
  }
  addNextStepDirection(t) {
    this.addTextStepPX(this.getDirectionPosition(t));
  }
  addTextStepPX(t) {
    this.direction === "left" || this.direction === "top" ? this.nextStepPX = this.numberFormatRound(this.nextStepPX - t) : this.nextStepPX = this.numberFormatRound(this.nextStepPX + t);
    const i = this.nextStepPX + Math.abs(this.startInitPosition);
    Math.abs(i) > Math.max(this.sizeWrapper, this.sizeItems) && (this.nextStepPX += this.numberFormatRound((i < 0 ? 1 : -1) * this.sizeItems), this.animationStart = null), this.move();
  }
  move() {
    this.props.callbackTick && this.props.callbackTick(this.wrapper, this, this.nextStepPX);
    const t = this.isVertical ? "translateY" : "translateX";
    this.container.style.transform = `${t}(${this.nextStepPX}px)`;
  }
  numberFormatRound(t) {
    return Math.round(t * 1e3) / 1e3;
  }
  cancelAnimationFrameInertia() {
    this.animationFrameInertia && cancelAnimationFrame(this.animationFrameInertia), this.animationFrameInertia = null;
  }
  stop() {
    this.moveHandlerStart(), this.inertiaClear();
  }
  start() {
    this.cancelAnimationFrameInertia(), this.moveEndHandler();
  }
  updateSpeed(t) {
    typeof t == "number" && (this.speed = t * 10, this.moveEndHandler());
  }
  destroy() {
    this.destroyBase(), this.cancelAnimationFrameInertia(), this.inertiaClear(), this.requestId && window.cancelAnimationFrame(this.requestId), this.container.removeEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.removeEventListener("mousedown", this.mouseDownHandlerBind), this.container.removeEventListener("touchstart", this.touchStartHandlerBind), document.removeEventListener("mousemove", this.handlerMouseMoveBind), document.removeEventListener("touchmove", this.handlerTouchMoveBind), this.observer && this.observer.disconnect(), delete this.handlerMouseMoveBind, delete this.handlerTouchMoveBind, delete this.mouseEnterHandlerBind, delete this.mouseDownHandlerBind, delete this.touchStartHandlerBind, delete this.animateNextStepBind, this.destroyAfter();
  }
}
class f extends h {
  constructor(s) {
    super(s, "css"), !this.localInitError && (this.initSetSetting(), this.init());
  }
  initSetSetting() {
    this.wrapper.classList.add(n.css);
  }
  init() {
    this.wrapper.classList.add(n.cssStart), this.props.callbackInit && this.props.callbackInit(this.wrapper, this), this.initSize(), this.setInitItems();
  }
  destroy() {
    this.destroyBase(), this.wrapper.classList.remove(n.css), this.wrapper.classList.remove(n.cssStart), this.destroyAfter();
  }
}
export {
  S as SimpMarquee,
  f as SimpMarqueeCSS
};
