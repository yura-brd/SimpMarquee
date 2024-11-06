import { ISimpMarqueeCssProps } from './simpMarquee.types';
import { SimpMarqueeBase } from './SimpMarqueeBase';
export declare class SimpMarqueeCSS extends SimpMarqueeBase<ISimpMarqueeCssProps> {
    constructor(props: ISimpMarqueeCssProps);
    private initSetSetting;
    private init;
    destroy(): void;
}
