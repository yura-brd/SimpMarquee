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
    inertiaFriction?: number;
    inertiaThreshold?: number;
    inertiaAfterPause?: number;
    isObserverPause?: boolean;
    minIntervalFPS?: number;
    callbackInit?: (wrapper: HTMLElement, simpMarquee: SimpMarquee) => void;
}
export interface ISimpMarqueeCssProps extends ISimpMarqueeBaseProps {
    callbackInit?: (wrapper: HTMLElement, simpMarqueeCss: SimpMarqueeCSS) => void;
}
