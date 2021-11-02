const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = './media/floppy-bird-set.png';

// general settings
let gamePlaying = false;
const gravity = .75;
const speed = 8;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;

// Ici on choisit une valeur aléatoire pour la disposition des tuyaux
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) -
    pipeWidth)) + pipeWidth;

let index = 0,
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;

// Replace l'oiseau au centre et remet le score à 0 à chaque début de partie
const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    // Création des tuyaux 
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)),
    pipeLoc()]);
    console.log(pipes);
}

//le rendu
const render = () => {
    index++;

    //background + son défilement
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) %
        canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) %
        canvas.width), 0, canvas.width, canvas.height);

    //Affichage en jeu
    if (gamePlaying) {

        // Affichage et animation de l'oiseau en jeu, position 1/10 du bord de l'écran (cTenth)
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth,
            flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

        //Affichage écrand de démarrage
    } else {
        // Affichage de l'oiseau + battement d'aile
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);

        // Affichage du meilleur score et du 'Press Start'
        ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
        ctx.fillText(`Cliquez pour jouer`, 48, 535);
        ctx.font = "bold 30px courier";
    }

    // Affichage des tuyaux

    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed;

            // Tuyaux du haut
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0,
                pipeWidth, pipe[1]);
            // Tuyaux du bas
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] +
                pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] +
            pipeGap);

            // Le défilement des tuyaux
            if (pipe[0] <= -pipeWidth) {
                // Quand un tuyau quitte l'affichage, le compteur de score s'incrémente.
                currentScore++
                bestScore = Math.max(bestScore, currentScore);

                // Efface le tuyau + en crée un nouveau
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth,
                pipeLoc()]];
            }
            // En cas de collision avec un tuyau, la partie s'arrête
            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                setup();
            }
        })
    }

    // L'affichage de la valeur de score
    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    //Permet de relancer l'animation une fois celle-ci terminée
    window.requestAnimationFrame(render);
}
// Permet de recharger les éléments de la page à chaque démarrage
setup();

img.onload = render;

// La variable qui permet de débuter une partie en cliquant sur l'ecran d'accueil
document.addEventListener('click', () => gamePlaying = true);

// Le saut à chaque clic
window.onclick = () => flight = jump;
