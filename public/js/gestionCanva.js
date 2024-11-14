var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let drawing = false;

// Fonction pour obtenir les coordonnées de la souris par rapport au canevas
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

// Démarre le dessin lorsque l'utilisateur appuie sur le bouton de la souris
canvas.addEventListener('mousedown', (event) => {
  drawing = true;
  const pos = getMousePos(event);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

// Continue le dessin lorsque l'utilisateur bouge la souris
canvas.addEventListener('mousemove', (event) => {
  if (drawing) {
    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
});

// Arrête le dessin lorsque l'utilisateur relâche le bouton de la souris
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.closePath();
});

// Arrête également le dessin si la souris sort du canevas
canvas.addEventListener('mouseleave', () => {
  drawing = false;
});