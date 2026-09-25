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
let escaped = false;
const playground = document.querySelector('#button-playground');
const gatekeeper = document.querySelector('#gatekeeper');
const tease = document.querySelector('#tease');
const taunts = ['No tan rápido, cumpleañera 🤨. Ahora sí, atrápame arriba.', '¿Otra pista? Qué afán JAJAJA. Me fui para arriba 🏃', 'Primero atrapa el botón, detective 🐈. Está arribita.', 'El regalo no se iba a revelar tan fácil 😭. Un toquecito más.'];
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
  if (!escaped) {
    escaped = true;
    gatekeeper.hidden = false;
    tease.textContent = taunts[current + 1];
    playground.classList.add('escaped');
    next.textContent = 'Bueno, ahora sí 😂';
    next.scrollIntoView({block: 'nearest', behavior: 'instant'});
    return;
  }
  escaped = false;
  playground.classList.remove('escaped');
  gatekeeper.hidden = true;
  tease.textContent = '';
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
    playground.hidden = true;
    gift.hidden = false;
    document.querySelector('#gift-title').focus({ preventScroll: true });
    gift.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    celebrate();
  }
});
document.querySelector('#restart').addEventListener('click', () => {
  current = -1;
  escaped = false;
  playground.hidden = false;
  playground.classList.remove('escaped');
  gatekeeper.hidden = true;
  tease.textContent = '';
  gift.hidden = true;
  panel.hidden = true;
  next.hidden = false;
  next.textContent = 'A ver esa primera pista ↗';
  next.focus();
});

const reaction = document.querySelector('#cat-reaction');
let reactionTimer;
document.querySelectorAll('.cat-touch').forEach(button => {
  button.addEventListener('click', () => {
    clearTimeout(reactionTimer);
    reaction.textContent = button.dataset.reaction;
    reaction.classList.add('visible');
    button.classList.remove('wiggle');
    void button.offsetWidth;
    button.classList.add('wiggle');
    reactionTimer = setTimeout(() => reaction.classList.remove('visible'), 3200);
  });
});
const catChoices = [
  ['gato-torta.png', 'Gato con la cara untada de comida', 'yo probando la torta antes de que lleguen 🍰', 'Yo solo vine por la torta, gracias 🍰'],
  ['gato-bye.png', 'Gato en patineta con el texto Bye', 'yo cuando dicen que hay que madrugar: bye 🛹', 'Se fue. No dejó ni para el taxi 🛹'],
  ['gato-ceja.png', 'Gato con una ceja de papel levantada', 'yo cuando dices “te cuento algo, pero no me juzgues” 🤨', 'No te juzgo, solo estoy procesando 🤨'],
  ['gato-risa.png', 'Gato riéndose y señalando', 'yo intentando tomarme la vida en serio 😭', 'JAJAJA no puedo, perdón 😭'],
  ['gatos-corazon.png', 'Dos gatos con las colas formando un corazón', 'un poquito de cariño entre tanto desorden 💜', 'Abrazo desbloqueado 💜'],
  ['gato-lenguita.gif', 'Gato blanco y negro sacando la lengua', 'yo cuando escucho que ya van a partir la torta 😋', '¿Dijeron torta? Ya estoy lista 😋'],
  ['gato-siesta.gif', 'Gato acomodándose mientras duerme', 'yo recuperándome de una semana de chocoaventuras 💤', 'No molestar. Estoy actualizando el sistema 💤']
];
let catIndex = 5;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let gifPaused = motionPreference.matches;
const toggleGif = document.querySelector('#toggle-gif');
function renderCat(announce = true) {
  const [file, alt, caption, response] = catChoices[catIndex];
  const isGif = file.endsWith('.gif');
  const img = document.querySelector('#random-cat');
  img.src = `assets/${isGif && gifPaused ? file.replace('.gif', '.png') : file}`;
  img.alt = alt;
  img.parentElement.setAttribute('aria-label', `Tocar: ${alt}`);
  img.parentElement.dataset.reaction = response;
  document.querySelector('#random-caption').textContent = caption;
  toggleGif.hidden = !isGif;
  toggleGif.textContent = gifPaused ? 'Reproducir GIF ▶' : 'Pausar GIF ⏸';
  if (announce) document.querySelector('#cat-announcement').textContent = `Gato invocado: ${caption}`;
}
// Un mazo mezclado permite descubrir todos los gatos sin repetirlos enseguida.
let catDeck = [];
document.querySelector('#shuffle-cat').addEventListener('click', () => {
  if (!catDeck.length) {
    catDeck = catChoices.map((_, index) => index).filter(index => index !== catIndex);
    for (let i = catDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [catDeck[i], catDeck[j]] = [catDeck[j], catDeck[i]];
    }
  }
  catIndex = catDeck.pop();
  renderCat();
});
toggleGif.addEventListener('click', () => { gifPaused = !gifPaused; renderCat(false); });
motionPreference.addEventListener('change', event => { gifPaused = event.matches; renderCat(false); });
renderCat(false);
