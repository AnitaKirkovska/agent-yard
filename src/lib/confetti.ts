import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Subtle confetti burst from bottom center
  const defaults = {
    spread: 60,
    ticks: 100,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#e84a5f', '#ff847c', '#f9a825', '#4db6ac', '#7c4dff'],
  };

  // Left burst
  confetti({
    ...defaults,
    particleCount: 25,
    origin: { x: 0.3, y: 0.7 },
    angle: 60,
  });

  // Right burst
  confetti({
    ...defaults,
    particleCount: 25,
    origin: { x: 0.7, y: 0.7 },
    angle: 120,
  });

  // Delayed center sparkle
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 15,
      origin: { x: 0.5, y: 0.6 },
      spread: 90,
      startVelocity: 25,
      scalar: 0.8,
    });
  }, 150);
};

export const triggerSubtleSparkle = () => {
  // Very subtle sparkle effect
  confetti({
    particleCount: 12,
    spread: 50,
    origin: { x: 0.5, y: 0.4 },
    colors: ['#e84a5f', '#f9a825'],
    ticks: 80,
    gravity: 1.5,
    scalar: 0.7,
    startVelocity: 20,
  });
};