import { Devvit } from '@devvit/public-api';

// Animation definitions for UI elements
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 500,
  },
  
  slideIn: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: 500,
  },
  
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
    duration: 1000,
    iterationCount: 'infinite',
  },
  
  bounce: {
    '0%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0)' },
    duration: 1000,
    iterationCount: 2,
  },
  
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    duration: 2000,
    iterationCount: 'infinite',
  },
};

// Apply an animation to a component
export function withAnimation(component: JSX.Element, animationType: keyof typeof animations) {
  const animation = animations[animationType];
  
  return Devvit.createComponent(() => {
    const style = {
      animation: `${animationType} ${animation.duration}ms ${animation.iterationCount || 1}`,
    };
    
    return (
      <div style={style}>
        {component}
      </div>
    );
  });
}

// For Devvit's animation system
export function getAnimationProps(animationType: keyof typeof animations) {
  const animation = animations[animationType];
  
  return {
    animation: animationType,
    animationDuration: animation.duration,
    animationIterationCount: animation.iterationCount,
  };
}