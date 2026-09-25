'use strict';
const clues = [
  ['🐱', 'No es para gastártelo en cualquier cosa… tiene una misión.'],
  ['🕺', 'Tiene que ver con un cantante que seguro reconoces por un “hee-hee” y un guante brillante.'],
  ['👀', 'Lo quieres llevar en la piel… ¿ya sabes para qué es?']
];
const next = document.querySelector('#next-clue');
const panel = document.querySelector('#clues');
const gift = document.querySelector('#gift');
let current = -1;
let confettiTimer;
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.querySelector('#confetti');
  clearTimeout(confettiTimer);
  container.replaceChildren();
  for (let i = 0; i < 45; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = ['#c59be6', '#efe899', '#8d50b5', '#faf5ff'][i % 4];
    piece.style.animationDelay = `${Math.random() * .7}s`;
    container.append(piece);
  }
  confettiTimer = setTimeout(() => container.replaceChildren(), 4000);
}
next.addEventListener('click', () => {
  current++;
  if (current < clues.length) {
    panel.hidden = false;
    document.querySelector('#clue-icon').textContent = clues[current][0];
    document.querySelector('#clue-text').textContent = clues[current][1];
    document.querySelectorAll('.progress li').forEach((item, index) => {
      item.classList.toggle('active', index <= current);
      if (index === current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    next.textContent = current === 2 ? 'Descubrir mi regalo 🎁' : 'Otra pista, por favor ↗';
  } else {
    panel.hidden = true;
    next.hidden = true;
    gift.hidden = false;
    document.querySelector('#gift-title').focus({ preventScroll: true });
    gift.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    celebrate();
  }
});
document.querySelector('#restart').addEventListener('click', () => {
  current = -1;
  gift.hidden = true;
  panel.hidden = true;
  next.hidden = false;
  next.textContent = 'A ver esa primera pista ↗';
  next.focus();
});
