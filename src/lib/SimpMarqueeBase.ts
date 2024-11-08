import { ISimpMarqueeCssProps, ISimpMarqueeProps, TDirection, TTypeSimpMarquee } from './simpMarquee.types';
import { CLASSES } from './consts';

export class SimpMarqueeBase<T extends ISimpMarqueeCssProps | ISimpMarqueeProps> {
  protected localInitError = false;

  protected props: T;
  protected direction: TDirection = 'left';
  protected isVertical = false;

  protected handlerResizeBind!: () => void;

  typeSimpMarquee: 'css' | 'js' = 'js';

  resultFullSize = 0;


  protected wrapper!: HTMLElement;
  protected container!: HTMLElement;
  protected items!: HTMLElement;

  protected sizeWrapper!: number;
  protected sizeItems!: number;
  protected sizeContainer!: number;

  protected cloneWith = 3;
  protected startInitPosition = 0;

  MAX_COUNT_CLONE = 100;
  CURRENT_COUNT_CLONE = 1;


  constructor(props: T, typeSimpMarquee:TTypeSimpMarquee) {
    this.props = props;
    const { wrapperSelector} = this.props;

    this.typeSimpMarquee = typeSimpMarquee;
    if (typeof wrapperSelector === 'string') {
      this.wrapper = document.querySelector(wrapperSelector) as HTMLElement;
    } else {
      this.wrapper = wrapperSelector;
    }
    if (!this.wrapper) {
      console.warn('Now found element with selector "' + wrapperSelector + '"');
      return;
    }

    this.container = this.wrapper.querySelector<HTMLElement>('.simp_marquee__container') as HTMLElement;

    this.items = this.wrapper.querySelector<HTMLElement>('.simp_marquee__items') as HTMLElement;

    if (!this.container || !this.items) {
      console.warn('Now found element (body or items)');
      this.setLocalInitError();
      return;
    }

    this.initBase();
  }

  protected initBase() {
    const { direction = 'left', cloneWith= 3 } = this.props;
    this.direction = direction;
    if (this.direction === 'top' || this.direction === 'bottom') {
      this.isVertical = true;
    }

    this.cloneWith = cloneWith;

    if (this.isVertical && !this.wrapper.classList.contains(CLASSES.vertical)) {
      this.wrapper.classList.add(CLASSES.vertical)
    }

    this.handlerResizeBind = this.debounce(this.handlerResize.bind(this), 200);
  };
  private setLocalInitError() {
    this.localInitError = true;
  }

  protected debounce(func:any, delay:number) {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  protected initSize() {
    this.updateSize();
    window.addEventListener('resize', this.handlerResizeBind)
  }
  protected handlerResize() {
    this.updateSize();
    // this.setInitItemsInit();
    this.reinitItems();
  }
  public updateSize() {
    if (this.isVertical) {
      this.sizeWrapper = this.wrapper.offsetHeight;
      this.sizeItems = this.items.scrollHeight;
      this.sizeContainer = this.container.scrollHeight;
    } else {
      this.sizeWrapper = this.wrapper.offsetWidth;
      this.sizeItems = this.items.scrollWidth;
      this.sizeContainer = this.container.scrollWidth;
    }
    if (this.typeSimpMarquee === 'css') {
      this.resultFullSize = this.sizeWrapper * this.cloneWith;
    } else {
      this.resultFullSize = Math.max(this.sizeWrapper, this.sizeItems) * this.cloneWith
    }
    this.startInitPosition = Math.max(this.sizeWrapper, this.sizeItems) * -1
  }
  protected setSizeContainer() {
    this.sizeContainer = this.isVertical ? this.container.scrollHeight : this.container.scrollWidth;
  }
  protected setInitItems() {
    const isCSS = this.typeSimpMarquee === 'css';

    if (!isCSS) {
      this.addCloneDom(true);
    }
    this.addCloneDom(false);
    this.setSizeContainer();

    this.CURRENT_COUNT_CLONE += 1;

    if (this.sizeContainer < this.resultFullSize && this.CURRENT_COUNT_CLONE < this.MAX_COUNT_CLONE) {
      this.setInitItems();
    }
  }
  protected reinitItems() {
    if (this.sizeContainer < this.resultFullSize) {
      this.setInitItems();
      if(this.typeSimpMarquee === 'css') {
        this.wrapper.classList.remove(CLASSES.cssStart);
        setTimeout(() => {
          this.wrapper.classList.add(CLASSES.cssStart);
        }, 40)
      }
    }
  }
  private addCloneDom(isStart: boolean) {
    const cloneItems = this.items.cloneNode(true) as HTMLElement;
    const posClass = (isStart ? CLASSES.cloneStart : CLASSES.cloneEnd);
    cloneItems.classList.add(CLASSES.clone, posClass);

    if (isStart) {
      this.container.prepend(cloneItems);
    } else {
      this.container.append(cloneItems);
    }
  }

  protected destroyBase() {
    const deleteNodes = this.container.querySelectorAll(`.${CLASSES.clone}`);
    deleteNodes.forEach((el) => el.remove());
    window.removeEventListener('resize', this.handlerResizeBind);
  }
  protected destroyAfter() {
    // @ts-ignore
    this.wrapper = undefined;
    // @ts-ignore
    this.container = undefined;
    // @ts-ignore
    this.items = undefined;

  }
}

