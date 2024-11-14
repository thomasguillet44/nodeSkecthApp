let deleteButton = document.getElementById("delete-button");
let saveButton = document.getElementById("save-button");

if (deleteButton) {
    deleteButton.addEventListener("click", deleteCanvaContent);
}

if (saveButton) {
    saveButton.addEventListener("click", saveCanvaContent);
}

function deleteCanvaContent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvaContent() {
    console.log("test");
    const dataURL = canvas.toDataURL('image/png');
    // Envoi au serveur avec fetch
    fetch('/save-canvas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataURL })
    })
    .then(response => response.json())
    .then(data => console.log('Image enregistrée!', data))
    .catch(error => console.error('Erreur:', error));
}