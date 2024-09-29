const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Variables de jeu
const height = 10; //Dynamique
const width = 10; //Dynamique
let treasure = placeTreasure(height, width);
let tries = 0;
const maxTries = 10; //Dynamique

// Middleware pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Envoyer la valeur de maxTries
app.get("/max-tries", (req, res) => {
  res.send({ maxTries });
});

app.get("/grid-size", (req, res) => {
  res.send({ height, width });
});

// Route principale pour réinitialiser le jeu et envoyer la position du trésor
app.get("/reset", (req, res) => {
  treasure = placeTreasure(height, width);
  tries = 0;
  res.send({ message: "Jeu réinitialisé", treasure });
});

// Route pour vérifier la case sélectionnée
app.get("/check", (req, res) => {
  const { x, y } = req.query;
  const selectedCell = { x: parseInt(x, 10), y: parseInt(y, 10) };

  if (tries >= maxTries) {
    return res.send({
      message: "Désolé, vous avez épuisé tous vos essais.",
      success: false,
    });
  }

  tries++;

  if (selectedCell.x === treasure.x && selectedCell.y === treasure.y) {
    return res.send({
      message: `Félicitations ! Vous avez trouvé le trésor en ${tries} essais.`,
      success: true,
    });
  } else {
    const distance = calculateDistance(selectedCell, treasure);
    return res.send({
      message: `Distance au trésor : ${distance} cases.`,
      success: false,
    });
  }
});

// Fonction pour placer le trésor aléatoirement
function placeTreasure(height, width) {
  const x = Math.floor(Math.random() * height);
  const y = Math.floor(Math.random() * width);
  return { x, y };
}

// Calcul de la distance de Manhattan
function calculateDistance(selectedCell, treasureCell) {
  const distanceX = Math.abs(selectedCell.x - treasureCell.x);
  const distanceY = Math.abs(selectedCell.y - treasureCell.y);
  return distanceX + distanceY;
}

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
