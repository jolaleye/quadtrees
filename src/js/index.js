import _ from 'lodash';

import '../style/main.scss';
import Quadtree from './Quadtree';
import Particle from './Particle';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// nodes' positions are at their center and dimensions are from the center to the edge (half)
const qtree = new Quadtree({ x: 400, y: 300, width: 400, height: 300 });

const drawTree = node => {
  const { x, y, width, height } = node.bounds;
  c.beginPath();
  c.rect(x - width, y - height, width * 2, height * 2);
  c.strokeStyle = '#CBCBCB';
  c.stroke();
  c.closePath();

  node.nodes.forEach(childNode => drawTree(childNode));
};

const particles = [];

const drawParticles = () => {
  particles.forEach(particle => {
    c.beginPath();
    c.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    c.fillStyle = particle.color;
    c.fill();
    c.closePath();
  });
};

const insertParticles = count => {
  _.times(count, () => particles.push(new Particle()));
};

insertParticles(200);

const mouse = { x: 0, y: 0, radius: 10 };

canvas.addEventListener('mousemove', event => {
  let mouseX;
  let mouseY;

  if (event.offsetX) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else if (event.layerX) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  if (!(mouseX && mouseY)) return;

  mouse.x = mouseX;
  mouse.y = mouseY;
});

const drawCursor = () => {
  c.beginPath();
  c.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
  c.fillStyle = 'rgba(246, 79, 89, 0.3)';
  c.fill();
  c.closePath();
};

const particleStat = document.getElementById('particle-count');
const candidateStat = document.getElementById('candidate-count');

const updateStats = candidates => {
  particleStat.innerHTML = particles.length;
  candidateStat.innerHTML = candidates;
};

const loop = () => {
  // clear the tree
  qtree.clear();

  // move the particles and re-build the tree
  particles.forEach((particle, i) => {
    particle.color = '#FF0099';
    particle.move();

    // if the particle has moved outside the bounds of the tree
    if (!qtree.contains(particle)) {
      particles.splice(i, 1);
      insertParticles(1);
    } else {
      qtree.insert(particle);
    }
  });

  // find collision candidates for the cursor
  const candidates = qtree.retrieve(mouse);
  candidates.forEach(candidate => {
    candidate.color = '#12c2e9';
  });

  updateStats(candidates.length);

  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);
  drawTree(qtree);
  drawParticles();
  drawCursor();

  requestAnimationFrame(loop);
};

loop();

/* eslint no-param-reassign: off */
