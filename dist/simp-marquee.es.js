var c = Object.defineProperty;
var u = (r, s, e) => s in r ? c(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var t = (r, s, e) => u(r, typeof s != "symbol" ? s + "" : s, e);
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
  constructor(s, e) {
    t(this, "localInitError", !1);
    t(this, "props");
    t(this, "direction", "left");
    t(this, "isVertical", !1);
    t(this, "handlerResizeBind");
    t(this, "typeSimpMarquee", "js");
    t(this, "resultFullSize", 0);
    t(this, "wrapper");
    t(this, "container");
    t(this, "items");
    t(this, "sizeWrapper");
    t(this, "sizeItems");
    t(this, "sizeContainer");
    t(this, "cloneWith", 3);
    t(this, "MAX_COUNT_CLONE", 100);
    t(this, "CURRENT_COUNT_CLONE", 1);
    this.props = s;
    const { wrapperSelector: i } = this.props;
    if (this.typeSimpMarquee = e, typeof i == "string" ? this.wrapper = document.querySelector(i) : this.wrapper = i, !this.wrapper) {
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
    const { direction: s = "left", cloneWith: e = 3 } = this.props;
    this.direction = s, (this.direction === "top" || this.direction === "bottom") && (this.isVertical = !0), this.cloneWith = e, this.isVertical && !this.wrapper.classList.contains(n.vertical) && this.wrapper.classList.add(n.vertical), this.handlerResizeBind = this.debounce(this.handlerResize.bind(this), 200);
  }
  setLocalInitError() {
    this.localInitError = !0;
  }
  debounce(s, e) {
    let i;
    return (...a) => {
      clearTimeout(i), i = setTimeout(() => s.apply(this, a), e);
    };
  }
  initSize() {
    this.updateSize(), window.addEventListener("resize", this.handlerResizeBind);
  }
  handlerResize() {
    this.updateSize(), this.reinitItems();
  }
  updateSize() {
    this.isVertical ? (this.sizeWrapper = this.wrapper.scrollHeight, this.sizeItems = this.items.scrollHeight, this.sizeContainer = this.container.scrollHeight) : (this.sizeWrapper = this.wrapper.scrollWidth, this.sizeItems = this.items.scrollWidth, this.sizeContainer = this.container.scrollWidth), this.typeSimpMarquee === "css" ? this.resultFullSize = this.sizeWrapper * this.cloneWith : this.resultFullSize = Math.max(this.sizeWrapper, this.sizeItems) * this.cloneWith;
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
    const e = this.items.cloneNode(!0);
    e.classList.add(n.clone, s ? n.cloneStart : n.cloneEnd), s ? this.container.prepend(e) : this.container.append(e);
  }
  destroyBase() {
    this.container.querySelectorAll(`.${n.clone}`).forEach((e) => e.remove()), window.removeEventListener("resize", this.handlerResizeBind);
  }
  destroyAfter() {
    this.wrapper = void 0, this.container = void 0, this.items = void 0;
  }
}
class p extends h {
  constructor(e) {
    super(e, "js");
    t(this, "isCanNextStep", !0);
    t(this, "nextStepPX", 0);
    t(this, "animationStart", null);
    t(this, "initialMousePosition", 0);
    t(this, "speed", 80);
    t(this, "isDragging", !1);
    t(this, "isAddedDraggableClass", !1);
    t(this, "requestId", null);
    t(this, "isInertia", !0);
    t(this, "inertiaFriction", 0.95);
    // 0.8 - .99
    t(this, "inertiaThreshold", 10);
    t(this, "inertiaAfterPause", 300);
    t(this, "idSetTimeoutStartInertia", null);
    t(this, "handlerMousemoveBind");
    t(this, "handlerMouseupBind");
    t(this, "handlerTouchMoveBind");
    t(this, "handlerTouchEndBind");
    t(this, "mouseEnterHandlerBind");
    t(this, "mouseLeaveHandlerBind");
    t(this, "mouseDownHandlerBind");
    t(this, "touchStartHandlerBind");
    t(this, "animateNextStepBind");
    t(this, "isObserverPause", !1);
    t(this, "callbackObserverBind");
    t(this, "observer");
    t(this, "observerOptions", {
      root: null,
      // null означает, что корнем является viewport
      rootMargin: "0px",
      // отступы вокруг корня
      threshold: 0
      // процент видимости (0.5 означает 50% элемента должно быть видно)
    });
    t(this, "velocity", 0);
    t(this, "animationFrameInertia", null);
    !this.localInitError && (this.initSetSetting(), this.init());
  }
  initSetSetting() {
    const { speed: e = 8, isObserverPause: i = !0 } = this.props, { isInertia: a = !0, inertiaFriction: o = 0.95, inertiaThreshold: d = 10, inertiaAfterPause: l = 300 } = this.props;
    this.isObserverPause = i, this.speed = e * 10, this.inertiaAfterPause = l, this.isInertia = a, o >= 0.8 && o <= 0.99 && (this.inertiaFriction = o), this.inertiaThreshold = d;
  }
  init() {
    this.handlerMousemoveBind = this.handlerMousemove.bind(this), this.handlerMouseupBind = this.handlerMouseup.bind(this), this.animateNextStepBind = this.animateNextStep.bind(this), this.handlerTouchMoveBind = this.handlerTouchMove.bind(this), this.handlerTouchEndBind = this.handlerTouchEnd.bind(this), this.mouseEnterHandlerBind = this.mouseEnterHandler.bind(this), this.mouseLeaveHandlerBind = this.mouseLeaveHandler.bind(this), this.mouseDownHandlerBind = this.mouseDownHandler.bind(this), this.touchStartHandlerBind = this.touchStartHandler.bind(this), this.requestId = requestAnimationFrame(this.animateNextStepBind), this.initSize(), this.setInitItems(), this.isObserverPause && (this.callbackObserverBind = this.callbackObserver.bind(this), this.observer = new IntersectionObserver(this.callbackObserverBind, this.observerOptions), this.observer.observe(this.wrapper)), this.container.addEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.addEventListener("mouseleave", this.mouseLeaveHandlerBind), this.container.addEventListener("mousedown", this.mouseDownHandlerBind), this.container.addEventListener("touchstart", this.touchStartHandlerBind), this.props.callbackInit && this.props.callbackInit(this.wrapper, this);
  }
  callbackObserver(e) {
    e.forEach((i) => {
      i.isIntersecting ? this.isCanNextStep || this.start() : this.isCanNextStep && this.stop();
    });
  }
  mouseEnterHandler() {
    this.moveHandlerStart(), this.inertiaClear();
  }
  mouseLeaveHandler() {
    this.isDragging || this.moveEndHandler();
  }
  mouseDownHandler(e) {
    this.isDragging = !0, this.initialMousePosition = this.getClientPosition(e), document.addEventListener("mouseup", this.handlerMouseupBind), document.addEventListener("mousemove", this.handlerMousemoveBind);
  }
  touchStartHandler(e) {
    e.preventDefault(), this.isDragging = !0, this.initialMousePosition = this.getClientPosition(e), this.moveHandlerStart(), this.inertiaClear(), document.addEventListener("touchmove", this.handlerTouchMoveBind), document.addEventListener("touchend", this.handlerTouchEndBind);
  }
  handlerTouchMove(e) {
    if (!this.isDragging) return;
    const i = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = i, this.addTextStepDirection(i), this.initialMousePosition = this.getClientPosition(e);
  }
  handlerTouchEnd() {
    this.isDragging = !1, this.moveEndHandler(), this.startInertia(), document.removeEventListener("touchmove", this.handlerTouchMoveBind), document.removeEventListener("touchend", this.handlerTouchEndBind);
  }
  handlerMousemove(e) {
    if (!this.isDragging)
      return;
    this.isAddedDraggableClass || (this.wrapper.classList.add(n.draggable), this.isAddedDraggableClass = !0);
    const i = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = i, this.addTextStepDirection(i), this.initialMousePosition = this.getClientPosition(e);
  }
  getClientPosition(e) {
    return e instanceof MouseEvent ? this.isVertical ? e.clientY : e.clientX : this.isVertical ? e.touches[0].clientY : e.touches[0].clientX;
  }
  handlerMouseup(e) {
    this.mouseleaveClear(), this.wrapper.classList.remove(n.draggable), this.isAddedDraggableClass = !1, document.removeEventListener("mouseup", this.handlerMouseupBind), document.removeEventListener("mousemove", this.handlerMousemoveBind), this.requestId = requestAnimationFrame(this.animateNextStepBind);
    const i = e.target;
    i && this.wrapper.contains(i) && this.moveHandlerStart(), this.startInertia();
  }
  startInertia() {
    this.isInertia && Math.abs(this.velocity) > this.inertiaThreshold && this.requestInertia();
  }
  requestInertia() {
    let e = !0;
    const i = () => {
      if (this.idSetTimeoutStartInertia && window.clearTimeout(this.idSetTimeoutStartInertia), this.moveHandlerStart(!1), this.addTextStepDirection(this.velocity), this.velocity *= this.inertiaFriction, Math.abs(this.velocity) > 0.5)
        e = !0, this.animationFrameInertia = requestAnimationFrame(i);
      else {
        if (e = !1, this.cancelAnimationFrameInertia(), !this.isCanNextStep)
          return;
        this.inertiaAfterPause ? this.idSetTimeoutStartInertia = window.setTimeout(() => {
          this.start();
        }, this.inertiaAfterPause) : this.start();
      }
    };
    e ? this.animationFrameInertia = requestAnimationFrame(i) : this.animationFrameInertia && this.cancelAnimationFrameInertia();
  }
  inertiaClear() {
    this.velocity = 0, this.cancelAnimationFrameInertia();
  }
  mouseleaveClear() {
    this.isDragging = !1, this.isCanNextStep = !0, this.animationStart = null, this.initialMousePosition = 0;
  }
  moveHandlerStart(e = !0) {
    this.requestId && window.cancelAnimationFrame(this.requestId), e && (this.isCanNextStep = !1);
  }
  moveEndHandler() {
    this.mouseleaveClear(), this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }
  animateNextStep(e) {
    if (!this.isCanNextStep || this.animationFrameInertia)
      return;
    this.nextStepPX * -1 >= this.sizeItems && (this.nextStepPX = this.sizeItems - this.nextStepPX * -1, this.animationStart = null), this.animationStart || (this.animationStart = e);
    const i = (e - this.animationStart) / 1e3 * this.speed;
    this.addTextStepPX(i), this.animationStart = e, this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }
  addTextStepDirection(e) {
    const i = this.direction === "left" || this.direction === "top" ? -1 : 1;
    this.addTextStepPX(e * i);
  }
  addTextStepPX(e) {
    this.direction === "left" || this.direction === "top" ? this.nextStepPX -= e : this.nextStepPX += e, Math.abs(this.nextStepPX) > this.sizeItems && (this.nextStepPX = 0), this.move();
  }
  move() {
    const e = this.isVertical ? "translateY" : "translateX";
    this.container.style.transform = `${e}(${this.nextStepPX}px)`;
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
  updateSpeed(e) {
    typeof e == "number" && (this.speed = e * 10, this.moveEndHandler());
  }
  destroy() {
    this.destroyBase(), this.inertiaClear(), this.requestId && window.cancelAnimationFrame(this.requestId), this.container.removeEventListener("mouseenter", this.mouseEnterHandlerBind), this.container.removeEventListener("mouseleave", this.mouseLeaveHandlerBind), this.container.removeEventListener("mousedown", this.mouseDownHandlerBind), this.container.removeEventListener("touchstart", this.touchStartHandlerBind), document.removeEventListener("mouseup", this.handlerMouseupBind), document.removeEventListener("mousemove", this.handlerMousemoveBind), document.removeEventListener("touchmove", this.handlerTouchMoveBind), document.removeEventListener("touchend", this.handlerTouchEndBind), this.observer && this.observer.disconnect(), delete this.handlerMousemoveBind, delete this.handlerMouseupBind, delete this.handlerTouchMoveBind, delete this.handlerTouchEndBind, delete this.mouseEnterHandlerBind, delete this.mouseLeaveHandlerBind, delete this.mouseDownHandlerBind, delete this.touchStartHandlerBind, delete this.animateNextStepBind, this.destroyAfter();
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
