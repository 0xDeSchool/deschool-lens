import confetti from 'canvas-confetti'

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export const randomConfetti = () => {
  confetti({
    angle: randomInRange(90, 90),
    spread: randomInRange(100, 1000),
    particleCount: randomInRange(300, 800),
    origin: { x: 0.6, y: 0.3 },
  })
  confetti({
    angle: randomInRange(90, 90),
    spread: randomInRange(100, 1000),
    particleCount: randomInRange(300, 800),
    origin: { x: 0.4, y: 0.3 },
  })
}
