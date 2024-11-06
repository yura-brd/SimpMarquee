import { SimpMarquee } from './SimpMarquee';
export declare class AnimationManager {
    static instances: SimpMarquee[];
    static isAnimating: boolean;
    static start(): void;
    static animate(): void;
    static register(instance: SimpMarquee): void;
    static unregister(instance: SimpMarquee): void;
}
