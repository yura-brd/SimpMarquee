var c = Object.defineProperty;
var u = (r, s, t) => s in r ? c(r, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[s] = t;
var e = (r, s, t) => u(r, typeof s != "symbol" ? s + "" : s, t);
const n = {
  css: "simp_marquee--css",
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
    if (this.typeSimpMarquee = t, typeof i == "string" ? this.wrapper = document.querySelector(i) : this.wrapper = i, !this.wrapper) {
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
    const { direction: s = "left", cloneWith: t = 3 } = this.props;
    this.direction = s, (this.direction === "top" || this.direction === "bottom") && (this.isVertical = !0), this.cloneWith = t, this.isVertical && !this.wrapper.classList.contains(n.vertical) && this.wrapper.classList.add(n.vertical), this.handlerResizeBind = this.debounce(this.handlerResize.bind(this), 200);
  }
  setLocalInitError() {
    this.localInitError = !0;
  }
  debounce(s, t) {
    let i;
    return (...a) => {
      clearTimeout(i), i = setTimeout(() => s.apply(this, a), t);
    };
  }
  initSize() {
    this.updateSize(), window.addEventListener("resize", this.handlerResizeBind);
  }
  handlerResize() {
    this.updateSize(), this.reinitItems();
  }
  updateSize() {
    this.isVertical ? (this.sizeWrapper = this.wrapper.offsetHeight, this.sizeItems = this.items.scrollHeight, this.sizeContainer = this.container.scrollHeight) : (this.sizeWrapper = this.wrapper.offsetWidth, this.sizeItems = this.items.scrollWidth, this.sizeContainer = this.container.scrollWidth), this.typeSimpMarquee === "css" ? this.resultFullSize = this.sizeWrapper * this.cloneWith : this.resultFullSize = Math.max(this.sizeWrapper, this.sizeItems) * this.cloneWith, this.startInitPosition = Math.max(this.sizeWrapper, this.sizeItems) * -1;
  }
  setSizeContainer() {
    this.sizeContainer = this.isVertical ? this.container.scrollHeight : this.container.scrollWidth;
  }
  setInitItems() {
    this.typeSimpMarquee === "css" || this.addCloneDom(!0), this.addCloneDom(!1), this.setSizeContainer(), this.CURRENT_COUNT_CLONE += 1, this.sizeContainer < this.resultFullSize && this.CURRENT_COUNT_CLONE < this.MAX_COUNT_CLONE && this.setInitItems();
  }
  reinitItems() {
    this.sizeContainer < this.resultFullSize && (this.setInitItems(), this.typeSimpMarquee === "css" && (this.wrapper.classList.remove(n.cssStart), setTimeout(() => {
      this.wrapper.classList.add(n.cssStart);
    }, 40)));
  }
  addCloneDom(s) {
    const t = this.items.cloneNode(!0), i = s ? n.cloneStart : n.cloneEnd;
    t.classList.add(n.clone, i), s ? this.container.prepend(t) : this.container.append(t);
  }
  destroyBase() {
    this.container.querySelectorAll(`.${n.clone}`).forEach((t) => t.remove()), window.removeEventListener("resize", this.handlerResizeBind);
  }
  destroyAfter() {
    this.wrapper = void 0, this.container = void 0, this.items = void 0;
  }
}
class p extends h {
  constructor(t) {
    super(t, "js");
    e(this, "isCanNextStep", !0);
    e(this, "nextStepPX", 0);
    e(this, "animationStart", null);
    e(this, "initialMousePosition", 0);
    e(this, "speed", 80);
    e(this, "isDragging", !1);
    e(this, "isAddedDraggableClass", !1);
    e(this, "requestId", null);
    e(this, "isInertia", !0);
    e(this, "inertiaFriction", 0.95);
    // 0.8 - .99
    e(this, "inertiaThreshold", 10);
    e(this, "inertiaAfterPause", 300);
    e(this, "idSetTimeoutStartInertia", null);
    e(this, "handlerMouseMoveBind");
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
    e(this, "velocity", 0);
    e(this, "animationFrameInertia", null);
    !this.localInitError && (this.initSetSetting(), this.init());
  }
  initSetSetting() {
    const { speed: t = 8, isObserverPause: i = !0 } = this.props, { isInertia: a = !0, inertiaFriction: o = 0.95, inertiaThreshold: l = 10, inertiaAfterPause: d = 300 } = this.props;
    this.isObserverPause = i, this.speed = t * 10, this.inertiaAfterPause = d, this.isInertia = a, o >= 0.8 && o <= 0.99 && (this.inertiaFriction = o), this.inertiaThreshold = l;
  }
  init() {
    this.handlerMouseMoveBind = this.handlerMouseMove.bind(this), this.animateNextStepBind = this.animateNextStep.bind(this), this.handlerTouchMoveBind = this.handlerTouchMove.bind(this), this.mouseEnterHandlerBind = this.mouseEnterHandler.bind(this), this.mouseDownHandlerBind = this.mouseDownHandler.bind(this), this.touchStartHandlerBind = this.touchStartHandler.bind(this), this.initSize(), this.setInitItems(), this.setInitPosition(), this.isObserverPause && (this.callbackObserverBind = this.callbackObserver.bind(this), this.observer = new IntersectionObserver(this.callbackObserverBind, this.observerOptions), this.observer.observe(this.wrapper)), this.requestId = requestAnimationFrame(this.animateNextStepBind), this.container.addEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.addEventListener("mousedown", this.mouseDownHandlerBind), this.isTouchDevice && this.container.addEventListener("touchstart", this.touchStartHandlerBind), this.props.callbackInit && this.props.callbackInit(this.wrapper, this);
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
    t.preventDefault(), this.isDragging = !0, this.initialMousePosition = this.getClientPosition(t), this.moveHandlerStart(), this.inertiaClear(), document.addEventListener("touchmove", this.handlerTouchMoveBind), document.addEventListener("touchend", () => {
      this.handlerTouchEnd();
    }, { once: !0 });
  }
  handlerTouchMove(t) {
    if (!this.isDragging) return;
    const i = this.getClientPosition(t) - this.initialMousePosition;
    this.velocity = i, this.addNextStepDirection(i), this.initialMousePosition = this.getClientPosition(t);
  }
  handlerTouchEnd() {
    this.isDragging = !1, this.moveEndHandler(), this.startInertia(), document.removeEventListener("touchmove", this.handlerTouchMoveBind);
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
    this.mouseleaveClear(), this.wrapper.classList.remove(n.draggable), this.isAddedDraggableClass = !1, document.removeEventListener("mousemove", this.handlerMouseMoveBind), this.requestId = requestAnimationFrame(this.animateNextStepBind);
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
    this.requestId && window.cancelAnimationFrame(this.requestId), t && (this.isCanNextStep = !1);
  }
  moveEndHandler() {
    this.mouseleaveClear(), this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }
  animateNextStep(t) {
    if (!this.isCanNextStep || this.animationFrameInertia)
      return;
    this.animationStart || (this.animationStart = t);
    const i = (t - this.animationStart) / 1e3 * this.speed;
    this.addTextStepPX(this.numberFormatRound(i)), this.animationStart = t, this.requestId = requestAnimationFrame(this.animateNextStepBind);
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
    this.destroyBase(), this.inertiaClear(), this.requestId && window.cancelAnimationFrame(this.requestId), this.container.removeEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.removeEventListener("mousedown", this.mouseDownHandlerBind), this.container.removeEventListener("touchstart", this.touchStartHandlerBind), document.removeEventListener("mousemove", this.handlerMouseMoveBind), document.removeEventListener("touchmove", this.handlerTouchMoveBind), this.observer && this.observer.disconnect(), delete this.handlerMouseMoveBind, delete this.handlerTouchMoveBind, delete this.mouseEnterHandlerBind, delete this.mouseDownHandlerBind, delete this.touchStartHandlerBind, delete this.animateNextStepBind, this.destroyAfter();
  }
}
class v extends h {
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
  p as SimpMarquee,
  v as SimpMarqueeCSS
};
