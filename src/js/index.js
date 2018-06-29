import '../style/main.scss';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);
