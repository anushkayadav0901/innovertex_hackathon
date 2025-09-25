// Memory-efficient animation utilities using CSS transforms and GPU acceleration

export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// GPU-accelerated transform animations
export const createTransformAnimation = (
  element: HTMLElement,
  transforms: {
    translateX?: number;
    translateY?: number;
    translateZ?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    rotate?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  },
  config: AnimationConfig = {}
): Animation => {
  const {
    duration = 300,
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    delay = 0,
    fillMode = 'forwards',
  } = config;

  // Build transform string
  const transformParts: string[] = [];
  
  if (transforms.translateX !== undefined) transformParts.push(`translateX(${transforms.translateX}px)`);
  if (transforms.translateY !== undefined) transformParts.push(`translateY(${transforms.translateY}px)`);
  if (transforms.translateZ !== undefined) transformParts.push(`translateZ(${transforms.translateZ}px)`);
  if (transforms.scale !== undefined) transformParts.push(`scale(${transforms.scale})`);
  if (transforms.scaleX !== undefined) transformParts.push(`scaleX(${transforms.scaleX})`);
  if (transforms.scaleY !== undefined) transformParts.push(`scaleY(${transforms.scaleY})`);
  if (transforms.rotate !== undefined) transformParts.push(`rotate(${transforms.rotate}deg)`);
  if (transforms.rotateX !== undefined) transformParts.push(`rotateX(${transforms.rotateX}deg)`);
  if (transforms.rotateY !== undefined) transformParts.push(`rotateY(${transforms.rotateY}deg)`);
  if (transforms.rotateZ !== undefined) transformParts.push(`rotateZ(${transforms.rotateZ}deg)`);

  const transformString = transformParts.join(' ');

  // Force GPU acceleration
  element.style.willChange = 'transform';
  element.style.transform = element.style.transform || 'translateZ(0)';

  const animation = element.animate(
    [
      { transform: element.style.transform },
      { transform: transformString },
    ],
    {
      duration,
      easing,
      delay,
      fill: fillMode,
    }
  );

  // Clean up will-change after animation
  animation.addEventListener('finish', () => {
    element.style.willChange = 'auto';
  });

  return animation;
};

// Opacity animations (also GPU-accelerated)
export const createOpacityAnimation = (
  element: HTMLElement,
  fromOpacity: number,
  toOpacity: number,
  config: AnimationConfig = {}
): Animation => {
  const {
    duration = 300,
    easing = 'ease-out',
    delay = 0,
    fillMode = 'forwards',
  } = config;

  element.style.willChange = 'opacity';

  const animation = element.animate(
    [
      { opacity: fromOpacity },
      { opacity: toOpacity },
    ],
    {
      duration,
      easing,
      delay,
      fill: fillMode,
    }
  );

  animation.addEventListener('finish', () => {
    element.style.willChange = 'auto';
  });

  return animation;
};

// Composite animations (transform + opacity)
export const createCompositeAnimation = (
  element: HTMLElement,
  keyframes: {
    transform?: string;
    opacity?: number;
    offset?: number;
  }[],
  config: AnimationConfig = {}
): Animation => {
  const {
    duration = 300,
    easing = 'ease-out',
    delay = 0,
    fillMode = 'forwards',
  } = config;

  element.style.willChange = 'transform, opacity';

  const animation = element.animate(keyframes, {
    duration,
    easing,
    delay,
    fill: fillMode,
  });

  animation.addEventListener('finish', () => {
    element.style.willChange = 'auto';
  });

  return animation;
};

// Animation manager for batching and performance
export class AnimationManager {
  private animations = new Map<string, Animation>();
  private rafId: number | null = null;
  private pendingAnimations: (() => void)[] = [];

  // Batch animations to run in the same frame
  batchAnimate(animations: (() => Animation)[]): void {
    this.pendingAnimations.push(...animations);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.pendingAnimations.forEach(animationFn => animationFn());
        this.pendingAnimations = [];
        this.rafId = null;
      });
    }
  }

  // Add named animation for management
  addAnimation(name: string, animation: Animation): void {
    // Cancel existing animation with same name
    this.cancelAnimation(name);
    this.animations.set(name, animation);
    
    // Auto-remove when finished
    animation.addEventListener('finish', () => {
      this.animations.delete(name);
    });
  }

  // Cancel specific animation
  cancelAnimation(name: string): void {
    const animation = this.animations.get(name);
    if (animation) {
      animation.cancel();
      this.animations.delete(name);
    }
  }

  // Cancel all animations
  cancelAllAnimations(): void {
    this.animations.forEach(animation => animation.cancel());
    this.animations.clear();
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Get animation status
  getAnimationStatus(name: string): 'idle' | 'running' | 'paused' | 'finished' {
    const animation = this.animations.get(name);
    return animation?.playState || 'idle';
  }
}

// Global animation manager instance
export const globalAnimationManager = new AnimationManager();

// Predefined animation presets
export const animationPresets = {
  // Entrance animations
  fadeIn: (element: HTMLElement, config?: AnimationConfig) =>
    createOpacityAnimation(element, 0, 1, config),
  
  slideInUp: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: `translateY(${distance}px)`, opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ], config),
  
  slideInDown: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: `translateY(-${distance}px)`, opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ], config),
  
  slideInLeft: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: `translateX(-${distance}px)`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ], config),
  
  slideInRight: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: `translateX(${distance}px)`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ], config),
  
  scaleIn: (element: HTMLElement, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: 'scale(0.8)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ], config),
  
  // Exit animations
  fadeOut: (element: HTMLElement, config?: AnimationConfig) =>
    createOpacityAnimation(element, 1, 0, config),
  
  slideOutUp: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: `translateY(-${distance}px)`, opacity: 0 },
    ], config),
  
  slideOutDown: (element: HTMLElement, distance = 50, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: `translateY(${distance}px)`, opacity: 0 },
    ], config),
  
  scaleOut: (element: HTMLElement, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.8)', opacity: 0 },
    ], config),
  
  // Attention animations
  bounce: (element: HTMLElement, config?: AnimationConfig) =>
    createTransformAnimation(element, { translateY: -10 }, {
      ...config,
      duration: 600,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }),
  
  pulse: (element: HTMLElement, config?: AnimationConfig) =>
    createTransformAnimation(element, { scale: 1.05 }, {
      ...config,
      duration: 400,
      easing: 'ease-in-out',
    }),
  
  shake: (element: HTMLElement, config?: AnimationConfig) =>
    createCompositeAnimation(element, [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)', offset: 0.1 },
      { transform: 'translateX(10px)', offset: 0.2 },
      { transform: 'translateX(-10px)', offset: 0.3 },
      { transform: 'translateX(10px)', offset: 0.4 },
      { transform: 'translateX(-10px)', offset: 0.5 },
      { transform: 'translateX(10px)', offset: 0.6 },
      { transform: 'translateX(-10px)', offset: 0.7 },
      { transform: 'translateX(10px)', offset: 0.8 },
      { transform: 'translateX(-10px)', offset: 0.9 },
      { transform: 'translateX(0)', offset: 1 },
    ], { ...config, duration: 600 }),
};

// Intersection Observer animation trigger
export const createScrollAnimation = (
  element: HTMLElement,
  animationFn: (element: HTMLElement) => Animation,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animationFn(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    ...options,
  });

  observer.observe(element);
  return observer;
};

// Performance monitoring
export const measureAnimationPerformance = (
  animationFn: () => Animation,
  name: string
): Animation => {
  const startTime = performance.now();
  const animation = animationFn();
  
  animation.addEventListener('finish', () => {
    const duration = performance.now() - startTime;
    console.log(`Animation "${name}" completed in ${duration.toFixed(2)}ms`);
  });
  
  return animation;
};
