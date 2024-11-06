import { SimpMarquee } from './SimpSelect';
export type TDirection = 'left' | 'right' | 'top' | 'bottom';
export interface ISimpMarqueeProps {
    wrapperSelector: HTMLElement | string;
    speed?: number;
    isInertia?: boolean;
    inertiaFriction?: number;
    inertiaThreshold?: number;
    inertiaAfterPause?: number;
    cloneWith?: 3 | 5 | 7;
    direction?: TDirection;
    callbackInit?: (wrapper: HTMLElement, simpMarquee: SimpMarquee) => void;
}
