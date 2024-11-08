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


  private handlerMouseMoveBind!: (e: MouseEvent) => void;

  private handlerTouchMoveBind!: (e: TouchEvent) => void;
  private mouseEnterHandlerBind!: () => void;
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

  private readonly isTouchDevice = 'ontouchstart' in window;

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

    this.handlerMouseMoveBind = this.handlerMouseMove.bind(this);
    this.animateNextStepBind = this.animateNextStep.bind(this);

    this.handlerTouchMoveBind = this.handlerTouchMove.bind(this);
    this.mouseEnterHandlerBind = this.mouseEnterHandler.bind(this);
    this.mouseDownHandlerBind = this.mouseDownHandler.bind(this);
    this.touchStartHandlerBind = this.touchStartHandler.bind(this);


    this.initSize();
    // this.setInitItemsInit();
    this.setInitItems();
    this.setInitPosition();

    if (this.isObserverPause) {
      this.callbackObserverBind = this.callbackObserver.bind(this);
      this.observer = new IntersectionObserver(this.callbackObserverBind, this.observerOptions);
      this.observer.observe(this.wrapper);
    }

    // start auto scrolling
    this.requestId = requestAnimationFrame(this.animateNextStepBind);

    // hover in
    this.container.addEventListener('mouseenter', this.mouseEnterHandlerBind);

    // click
    this.container.addEventListener('mousedown', this.mouseDownHandlerBind);

    if (this.isTouchDevice) {
      // Touch events for mobile
      this.container.addEventListener('touchstart', this.touchStartHandlerBind);
    }


    this.props.callbackInit && this.props.callbackInit(this.wrapper, this);
  }
  protected setInitPosition() {
    this.nextStepPX = this.startInitPosition;
    this.move();
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
    this.container.addEventListener('mouseleave', () => {
      this.mouseLeaveHandler()
    }, { once: true });
  }
  mouseLeaveHandler() {
    if(!this.isDragging) {
      this.moveEndHandler();
    }
  }
  mouseDownHandler(e: MouseEvent) {
    this.isDragging = true;
    this.initialMousePosition = this.getClientPosition(e);
    document.addEventListener('mouseup', (e) => {
      this.handlerMouseup(e);
    }, { once: true });
    document.addEventListener('mousemove', this.handlerMouseMoveBind);
  }
  touchStartHandler(e: TouchEvent) {
    e.preventDefault();
    this.isDragging = true;
    this.initialMousePosition = this.getClientPosition(e);
    this.moveHandlerStart();
    this.inertiaClear();

    document.addEventListener('touchmove', this.handlerTouchMoveBind);
    document.addEventListener('touchend', () => {
      this.handlerTouchEnd();
    }, {once: true });
  }


  private handlerTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    const deltaX = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = deltaX;  // Обновляем скорость
    this.addNextStepDirection(deltaX);
    this.initialMousePosition = this.getClientPosition(e);
  }
  private handlerTouchEnd() {
    this.isDragging = false;

    this.moveEndHandler();

    this.startInertia();

    document.removeEventListener('touchmove', this.handlerTouchMoveBind);
  }

  private handlerMouseMove(e: MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    if(!this.isAddedDraggableClass) {
      this.wrapper.classList.add(CLASSES.draggable);
      this.isAddedDraggableClass = true;
    }
    const deltaX = this.getClientPosition(e) - this.initialMousePosition;
    this.velocity = deltaX;  // Обновляем скорость
    this.addNextStepDirection(deltaX);
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

    document.removeEventListener('mousemove', this.handlerMouseMoveBind);

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

      this.addNextStepDirection(this.velocity)
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

    if (!this.animationStart) {
      this.animationStart = timestamp;
    }

    const elapsed = (timestamp - this.animationStart ) / 1000 * this.speed;

    this.addTextStepPX(this.numberFormatRound(elapsed));
    // this.addTextStepPX(1);

    this.animationStart = timestamp;
    this.requestId = requestAnimationFrame(this.animateNextStepBind);
  }

  private getDirectionPosition(pos: number) {
    const isMinus = this.direction === 'left' || this.direction === 'top'  ? -1 : 1;
    return pos * isMinus;
  }
  private addNextStepDirection(pos: number) {
    this.addTextStepPX(this.getDirectionPosition(pos));
  }
  private addTextStepPX(pos: number) {
    if (this.direction === 'left' || this.direction === 'top') {
      this.nextStepPX = this.numberFormatRound(this.nextStepPX - pos);
    } else {
      this.nextStepPX = this.numberFormatRound(this.nextStepPX + pos);
    }

   const startInitPositionCurrent = this.nextStepPX + Math.abs(this.startInitPosition);
    const isNeedUpdate = Math.abs(startInitPositionCurrent) > Math.max(this.sizeWrapper, this.sizeItems);
    if (isNeedUpdate) {
      // this.nextStepPX = startInitPositionCurrent < 0 ? this.nextStepPX + this.sizeItems : this.nextStepPX - this.sizeItems;
      this.nextStepPX += this.numberFormatRound((startInitPositionCurrent < 0 ? 1 : -1) * this.sizeItems);
      this.animationStart = null
    }

    // if(Math.abs(this.nextStepPX) > this.sizeItems) {
      // this.nextStepPX = 0;
    // }
    this.move()

  }
  private move() {
    const position = this.isVertical ? 'translateY' : 'translateX';
    this.container.style.transform = `${position}(${this.nextStepPX}px)`;
  }
  private numberFormatRound(number: number) {
    return Math.round(number * 1000) / 1000
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
    // this.container.removeEventListener('mouseleave', this.mouseLeaveHandlerBind);
    this.container.removeEventListener('mousedown', this.mouseDownHandlerBind);
    this.container.removeEventListener('touchstart', this.touchStartHandlerBind);
    // document.removeEventListener('mouseup', this.handlerMouseupBind);
    document.removeEventListener('mousemove', this.handlerMouseMoveBind);
    document.removeEventListener('touchmove', this.handlerTouchMoveBind);
    // document.removeEventListener('touchend', this.handlerTouchEndBind);

    this.observer && this.observer.disconnect();

    // @ts-ignore
    delete this.handlerMouseMoveBind;
    // @ts-ignore
    // delete this.handlerMouseupBind;
    // @ts-ignore
    delete this.handlerTouchMoveBind;
    // @ts-ignore
    // delete this.handlerTouchEndBind;
    // @ts-ignore
    delete this.mouseEnterHandlerBind;
    // @ts-ignore
    // delete this.mouseLeaveHandlerBind;
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
