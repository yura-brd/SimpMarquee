import { ISimpMarqueeCssProps } from './simpMarquee.types';
import { SimpMarqueeBase } from './SimpMarqueeBase';
import { CLASSES } from './consts';

export class SimpMarqueeCSS extends SimpMarqueeBase<ISimpMarqueeCssProps> {
  constructor(props: ISimpMarqueeCssProps) {
    super(props, 'css');

    if(this.localInitError) {
      return;
    }
    this.initSetSetting()
    this.init()
  }

  private initSetSetting() {
    this.wrapper.classList.add(CLASSES.css);
  }
  private init() {
    this.wrapper.classList.add(CLASSES.cssStart);
    this.props.callbackInit && this.props.callbackInit(this.wrapper, this);

    this.initSize()
    this.setInitItems()
  }

  public destroy() {
    this.destroyBase();
    this.wrapper.classList.remove(CLASSES.css);
    this.wrapper.classList.remove(CLASSES.cssStart);

    this.destroyAfter();

  }
}

