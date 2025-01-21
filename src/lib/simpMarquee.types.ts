import { SimpMarquee } from './SimpMarquee';
import { SimpMarqueeCSS } from './SimpMarqueeCSS';

export type TTypeSimpMarquee = 'css' | 'js';
export type TDirection = 'left' | 'right' | 'top' | 'bottom';
export interface ISimpMarqueeBaseProps {
  wrapperSelector: HTMLElement | string;
  cloneWith?: 1 | 3 | 5 | 7;
  direction?: TDirection;
}
export interface ISimpMarqueeProps extends ISimpMarqueeBaseProps {
  speed?: number;
  isInertia?: boolean;
  inertiaFriction?: number; //  0.8 - .99
  inertiaThreshold?: number;
  inertiaAfterPause?: number;
  isObserverPause?: boolean;
  minIntervalFPS?: number; // 33 - 50,
  isWheel?: boolean;

  callbackInit?: (wrapper: HTMLElement, simpMarquee: SimpMarquee) => void
  callbackTick?: (wrapper: HTMLElement, simpMarquee: SimpMarquee, position: number) => void
}

export interface ISimpMarqueeCssProps  extends ISimpMarqueeBaseProps {
  callbackInit?: (wrapper: HTMLElement, simpMarqueeCss: SimpMarqueeCSS) => void
}
