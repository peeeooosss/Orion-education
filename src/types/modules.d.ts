declare module "canvas-confetti" {
  export interface ConfettiOptions {
    particleCount?: number;
    startVelocity?: number;
    spread?: number;
    ticks?: number;
    dragFriction?: number;
    decreasingVelocity?: boolean;
    x?: number;
    y?: number;
    origin?: { x?: number; y?: number } | number;
    angle?: number;
    spreadMult?: number;
    scalar?: number;
    zIndex?: number;
    clock?: unknown;
    flat?: boolean;
    emoji?: boolean;
    emojiSize?: number;
    emojiStyle?: unknown;
    pause?: boolean;
  }
  export interface ConfettiStatic {
    (options: ConfettiOptions): void;
    reset(): void;
    stop(): void;
    addConfetti(options: ConfettiOptions): void;
    frameInitializationFunction?: () => void;
  }
  const confetti: ConfettiStatic;
  export default confetti;
  export const confetti: ConfettiStatic;
}
