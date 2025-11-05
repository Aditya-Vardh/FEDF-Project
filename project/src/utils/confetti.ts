export const triggerConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const createConfettiPiece = () => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(confetti);

    const angle = randomInRange(0, 360);
    const velocity = randomInRange(20, 40);
    const rotationSpeed = randomInRange(-10, 10);
    let rotation = 0;
    let x = parseFloat(confetti.style.left);
    let y = -10;
    let vx = velocity * Math.cos(angle * Math.PI / 180);
    let vy = velocity * Math.sin(angle * Math.PI / 180);

    const animate = () => {
      if (Date.now() > animationEnd || y > window.innerHeight) {
        confetti.remove();
        return;
      }

      x += vx;
      y += vy;
      vy += 0.5;
      rotation += rotationSpeed;

      confetti.style.left = x + 'px';
      confetti.style.top = y + 'px';
      confetti.style.transform = `rotate(${rotation}deg)`;
      confetti.style.opacity = String(Math.max(0, 1 - (y / window.innerHeight)));

      requestAnimationFrame(animate);
    };

    animate();
  };

  const interval = setInterval(() => {
    if (Date.now() > animationEnd) {
      clearInterval(interval);
      return;
    }

    for (let i = 0; i < 5; i++) {
      createConfettiPiece();
    }
  }, 50);
};
