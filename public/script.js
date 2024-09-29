const gridElement = document.getElementById("grid");
const resultElement = document.getElementById("result");
const resetButton = document.getElementById("reset");

// Récupérer la taille de la grille depuis le serveur
function getGridSize() {
  fetch("/grid-size")
    .then((response) => response.json())
    .then((data) => {
      height = data.height;
      width = data.width;
      createGrid(); // Créer la grille après avoir récupéré les dimensions
    });
}

// Générer la grille avec des dimensions dynamiques
function createGrid() {
  gridElement.innerHTML = ""; // Vider la grille
  for (let i = 0; i < height; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("td");
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.addEventListener("click", handleCellClick);
      row.appendChild(cell);
    }
    gridElement.appendChild(row);
  }
}

// Gérer le clic sur une case
function handleCellClick(event) {
  const x = event.target.dataset.x;
  const y = event.target.dataset.y;

  fetch(`/check?x=${x}&y=${y}`)
    .then((response) => response.json())
    .then((data) => {
      resultElement.textContent = data.message;

      if (data.success) {
        // Si le trésor est trouvé, afficher l'icône du trésor
        event.target.innerHTML = '<i class="fas fa-gem"></i>';
        // Désactiver la grille après la victoire
        disableGrid();
      } else {
        event.target.classList.add("clicked"); //Griser la cellule
      }
      // Si les essais sont épuisés, réinitialiser la grille
      if (data.message.includes("Désolé")) {
        resetGrid(); // Réinitialiser la grille quand l'utilisateur échoue
      }
    });
}

// Réinitialiser la grille en supprimant les classes et le contenu des cellules
function resetGrid() {
  const cells = document.querySelectorAll("#grid td");
  cells.forEach((cell) => {
    cell.classList.remove("clicked"); // Enlever la classe "clicked"
    cell.innerHTML = ""; // Vider le contenu de la cellule
    cell.addEventListener("click", handleCellClick); // Réactiver les clics
  });
}

// Désactiver la grille après la victoire

function disableGrid() {
  const cells = document.querySelectorAll("#grid td");
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick);
  });
}

// Réinitialiser le jeu
resetButton.addEventListener("click", () => {
  fetch("/reset")
    .then((response) => response.json())
    .then((data) => {
      resultElement.textContent = "Le jeu a été réinitialisé !";
      resetGrid(); // Réinitialiser la grille quand l'utilisateur clique sur "Réinitialiser"
      getGridSize(); // Recréer la grille après réinitialisation
    });
});

// Initialiser la grille au chargement de la page
getGridSize();
