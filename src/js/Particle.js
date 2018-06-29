import _ from 'lodash';

class Particle {
  constructor() {
    this.x = _.random(800);
    this.y = _.random(600);
    this.radius = 3;
    this.vx = _.random(-0.5, 0.5, true);
    this.vy = _.random(-0.5, 0.5, true);
    this.color = '#FF0099';
  }

  move = () => {
    this.x += this.vx;
    this.y += this.vy;
  }
}

export default Particle;
