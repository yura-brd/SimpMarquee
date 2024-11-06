import { ISimpMarqueeProps } from './simpMarquee.types';
import { SimpMarqueeBase } from './SimpMarqueeBase';
import { CLASSES } from './consts';

class SimpMarquee extends SimpMarqueeBase<ISimpMarqueeProps> {
  private isCanNextStep = true;
  private nextStepPX = 0;

  private animationStart: number | null = null;

  private initialMousePosition = 0;

  private speed = 80;
  private isDragging = false;

  private isAddedDraggableClass = false;

  private requestId: number | null = null;

  private isInertia = true;
  private inertiaFriction = .95; // 0.8 - .99
  private inertiaThreshold = 10;
  private inertiaAfterPause = 300;

  private idSetTimeoutStartInertia: number | null  = null


  private handlerMousemoveBind!: (e: MouseEvent) => void;
  private handlerMouseupBind!: (e: MouseEvent) => void;

  private handlerTouchMoveBind!: (e: TouchEvent) => void;
  private handlerTouchEndBind!: (e: TouchEvent) => void;
  private mouseEnterHandlerBind!: () => void;
  private mouseLeaveHandlerBind!: () => void;
  private mouseDownHandlerBind!: (e: MouseEvent) => void;
  private touchStartHandlerBind!: (e: TouchEvent) => void;

  private animateNextStepBind!: (data: any) => void;

  private isObserverPause = false;
  private callbackObserverBind!: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
  observer!: IntersectionObserver;
  observerOptions = {
    root: null, // null означает, что корнем является viewport
    rootMargin: '0px', // отступы вокруг корня
    threshold: 0 // процент видимости (0.5 означает 50% элемента должно быть видно)
  };


  private velocity = 0;
  private animationFrameInertia: number | null = null;



  constructor(props: ISimpMarqueeProps) {
    super(props, 'js');

    if(this.localInitError) {
      return;
    }
    this.initSetSetting()
    this.init()

  }

  private initSetSetting() {
    const { speed = 8, isObserverPause = true} = this.props;
    const { isInertia = true, inertiaFriction= .95, inertiaThreshold = 10, inertiaAfterPause = 300} = this.props;


    this.isObserverPause = isObserverPause;
    this.speed = speed * 10;
    this.inertiaAfterPause = inertiaAfterPause;
    this.isInertia = isInertia;
    if (inertiaFriction >= .8 && inertiaFriction <= .99) {
      this.inertiaFriction = inertiaFriction;
    }
    this.inertiaThreshold = inertiaThreshold;
  }
  private init() {

    this.handlerMousemoveBind = this.handlerMousemove.bind(this);
    this.handlerMouseupBind = this.handlerMouseup.bind(this);
    this.animateNextStepBind = this.animateNextStep.bind(this);

    this.handlerTouchMoveBind = this.handlerTouchMove.bind(this);
    this.handlerTouchEndBind = this.handlerTouchEnd.bind(this);
    this.mouseEnterHandlerBind = this.mouseEnterHandler.bind(this);
    this.mouseLeaveHandlerBind = this.mouseLeaveHandler.bind(this);
    this.mouseDownHandlerBind = this.mouseDownHandler.bind(this);
    this.touchStartHandlerBind = this.touchStartHandler.bind(this);

    this.requestId = requestAnimationFrame(this.animateNextStepBind);

    this.initSize();
    this.setInitItems();

    if (this.isObserverPause) {
      this.callbackObserverBind = this.callbackObserver.bind(this);
      this.observer = new IntersectionObserver(this.callbackObserverBind, this.observerOptions);
      this.observer.observe(this.wrapper);
    }

    this.container.addEventListener('mouseenter', this.mouseEnterHandlerBind);
    this.container.addEventListener('mouseleave', this.mouseLeaveHandlerBind);
    this.container.addEventListener('mousedown', this.mouseDownHandlerBind);

    // Touch events for mobile
    this.container.addEventListener('touchstart', this.touchStartHandlerBind);

    this.props.callbackInit && this.props.callbackInit(this.wrapper, this);
  }

  callbackObserver(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!this.isCanNextStep) {
          this.start();
        }
      } else {
        if (this.isCanNextStep) {
          this.stop();
        }
      }
    });
  }
  mouseEnterHandler() {
    this.moveHandlerStart();
    this.inertiaClear();
  }
  mouseLeaveHandler() {
    if(!this.isDragging) {
      this.moveEndHandler();
    }
  }
  mouseDownHandler(e: MouseEvent) {
    this.isDragging = true;
    this.initialMousePosition = this.getClientPosition(e);
    document.addEventListener('mouseup', this.handlerMouseupBind);
    document.addEventListener('mousemove', this.handlerMousemoveBind);
  }
  touchStartHandler(e: TouchEvent) {
    e.preventDefault();
    this.isDragging = true;
    this.initialMousePosition = this.getClientPosition(e);
    this.moveHandlerStart();
    this.inertiaClear();

    document.addEventListener('touchmove', this.handlerTouchMoveBind);
    document.addEventListener('touchend', this.handlerTouchEndBind);
  }


  private handlerTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    const deltaX = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = deltaX;  // Обновляем скорость
    this.addTextStepDirection(deltaX);
    this.initialMousePosition = this.getClientPosition(e);
  }
  private handlerTouchEnd() {
    this.isDragging = false;

    this.moveEndHandler();

    this.startInertia();

    document.removeEventListener('touchmove', this.handlerTouchMoveBind);
    document.removeEventListener('touchend', this.handlerTouchEndBind);
  }

  private handlerMousemove(e: MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    if(!this.isAddedDraggableClass) {
      this.wrapper.classList.add(CLASSES.draggable);
      this.isAddedDraggableClass = true;
    }
    const deltaX = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = deltaX;  // Обновляем скорость
    this.addTextStepDirection(deltaX);
    this.initialMousePosition = this.getClientPosition(e);
  }
  private getClientPosition(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent) {
      return this.isVertical ? e.clientY : e.clientX;
    }
    return this.isVertical ? e.touches[0].clientY :  e.touches[0].clientX;
  }

  private handlerMouseup(e: MouseEvent) {
    this.mouseleaveClear();

    this.wrapper.classList.remove(CLASSES.draggable);
    this.isAddedDraggableClass = false;

    document.removeEventListener('mouseup', this.handlerMouseupBind);
    document.removeEventListener('mousemove', this.handlerMousemoveBind);

    this.requestId = requestAnimationFrame(this.animateNextStepBind);

    const target: HTMLElement = e.target as HTMLElement;
    if (target && this.wrapper.contains(target)) {
      this.moveHandlerStart();
    }

    this.startInertia();
  }

  private startInertia() {
    if(this.isInertia && Math.abs(this.velocity) > this.inertiaThreshold) {
      this.requestInertia();
    }
  }
  private requestInertia() {
    let isInertiaNext = true;
    const inertia = () => {
      this.idSetTimeoutStartInertia && window.clearTimeout(this.idSetTimeoutStartInertia);

      this.moveHandlerStart(false); // set pause after inertia

      this.addTextStepDirection(this.velocity)
      this.velocity *= this.inertiaFriction; // Замедление скорости

      if (Math.abs(this.velocity) > 0.5) {
        isInertiaNext = true;
        this.animationFrameInertia = requestAnimationFrame(inertia);
      } else {
        isInertiaNext = false;
        this.cancelAnimationFrameInertia();
        if (!this.isCanNextStep) {
          return;
        }
        if (this.inertiaAfterPause) {
          this.idSetTimeoutStartInertia = window.setTimeout(() => {
            this.start();
          }, this.inertiaAfterPause)
        } else {
          this.start();
        }
      }
    }
    if (isInertiaNext) {
      this.animationFrameInertia = requestAnimationFrame(inertia);
    } else if (this.animationFrameInertia) {
      this.cancelAnimationFrameInertia();
    }
  }
  private inertiaClear() {
    this.velocity = 0;
    this.cancelAnimationFrameInertia();
  }
  private mouseleaveClear() {
    this.isDragging = false;
    this.isCanNextStep = true;
    this.animationStart = null;
    this.initialMousePosition = 0;
  }
  private moveHandlerStart(isClearNextStep = true) {
    this.requestId && window.cancelAnimationFrame(this.requestId);

    if (isClearNextStep) {
      this.isCanNextStep = false;
    }
  }
  private moveEndHandler() {
    this.mouseleaveClear();
    this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }

  private animateNextStep(timestamp: number) {
    if(!this.isCanNextStep || this.animationFrameInertia) {
      return;
    }

    // if ((timestamp -  (this.animationStart || 0) ) < 1000 / 30) {
    //   this.requestId = requestAnimationFrame(this.animateNextStepBind);
    //   return;
    // }

    if ((this.nextStepPX * -1) >= this.sizeItems) {
      this.nextStepPX = this.sizeItems - (this.nextStepPX * -1);
      this.animationStart = null
    }

    if (!this.animationStart) {
      this.animationStart = timestamp;
    }

    const elapsed = (timestamp - this.animationStart ) / 1000 * this.speed;

    this.addTextStepPX(elapsed);

    this.animationStart = timestamp;
    this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }

  private addTextStepDirection(pos: number) {
    const isMinus = this.direction === 'left' || this.direction === 'top'  ? -1 : 1
    this.addTextStepPX(pos * isMinus);
  }
  private addTextStepPX(pos: number) {
    if (this.direction === 'left' || this.direction === 'top') {
      this.nextStepPX -= pos;
    } else {
      this.nextStepPX += pos;
    }

    if(Math.abs(this.nextStepPX) > this.sizeItems) {
      this.nextStepPX = 0;
    }
    this.move()

  }
  private move() {
    const position = this.isVertical ? 'translateY' : 'translateX';
    this.container.style.transform = `${position}(${this.nextStepPX}px)`;
    // if (this.nextStepPX * -1 < 0) {
    //   // console.log(this.wrapper);
    //   // console.log(this.nextStepPX * -1);
    // }
    // if (this.isVertical) {
    //   this.wrapper.scrollTop = this.nextStepPX * -1;
    // } else {
    //   this.wrapper.scrollLeft = this.nextStepPX * -1;
    // }
  }

  private cancelAnimationFrameInertia() {
    this.animationFrameInertia && cancelAnimationFrame(this.animationFrameInertia);
    this.animationFrameInertia = null;
  }
  public stop() {
    this.moveHandlerStart();
    this.inertiaClear();
  }
  public start() {
    this.cancelAnimationFrameInertia();
    this.moveEndHandler();
  }

  public updateSpeed(newSpeed: number) {
    if (typeof newSpeed !== 'number') {
      return;
    }
    this.speed = newSpeed * 10;
    this.moveEndHandler();
  }

  public destroy() {
    this.destroyBase();
    this.inertiaClear();
    this.requestId && window.cancelAnimationFrame(this.requestId);
    this.container.removeEventListener('mouseenter', this.mouseEnterHandlerBind);
    this.container.removeEventListener('mouseleave', this.mouseLeaveHandlerBind);
    this.container.removeEventListener('mousedown', this.mouseDownHandlerBind);
    this.container.removeEventListener('touchstart', this.touchStartHandlerBind);
    document.removeEventListener('mouseup', this.handlerMouseupBind);
    document.removeEventListener('mousemove', this.handlerMousemoveBind);
    document.removeEventListener('touchmove', this.handlerTouchMoveBind);
    document.removeEventListener('touchend', this.handlerTouchEndBind);

    this.observer && this.observer.disconnect();

    // @ts-ignore
    delete this.handlerMousemoveBind;
    // @ts-ignore
    delete this.handlerMouseupBind;
    // @ts-ignore
    delete this.handlerTouchMoveBind;
    // @ts-ignore
    delete this.handlerTouchEndBind;
    // @ts-ignore
    delete this.mouseEnterHandlerBind;
    // @ts-ignore
    delete this.mouseLeaveHandlerBind;
    // @ts-ignore
    delete this.mouseDownHandlerBind;
    // @ts-ignore
    delete this.touchStartHandlerBind;
    // @ts-ignore
    delete this.animateNextStepBind;

    this.destroyAfter();
  }
}

export { SimpMarquee };