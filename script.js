
let numSelected = null;
let tileSelected = null;
let errors = 5;
let gameOver = false;
let timer; /* variabel for å holde styr på tiden*/
let time = 0; /* variabel for å holde styr på brukt tid*/


window.onload = function () {
    document.getElementById("error-count").innerText = errors;
    setGame();
    startTimer();
}

/* Setter opp sudukoen gjennom å lage tallene og brettet */
function setGame() {
    /* Tall fra 1-9 (tastaturet) */
    for (let i = 1; i <= 9; i++) {
        /*<div id="1" class="number">1</div>*/
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    /* Lager 9x9 spillebrettet
    TODO: Alle steder man bruker getElement og createElement kan man godt bruke const  */
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start"); /* Tallene som er på brettet førs spillet starter */
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line"); /* Legger til horisontale linjer for å dele opp brettet i 3x3 ruter */
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line"); /* Legger til vertikale linjer */
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

/* Velger et tall fra talltastaturet*/
function selectNumber() {
    if (gameOver) return;
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

/* Velger en rute på brettet */
function selectTile() {
    if (gameOver || !numSelected) {
        return;
    } /* Sjekker om spillet er over eller om ingen ruter er valgt, og hvis sant, stopp funksjonen. */
    if (this.innerText != "") {
        return;
    } /*Sjekker om ruten allerede er tatt, og dersom det, stopp funksjonen. */

    /*Henter koordinatene til den valgte ruten */
    let coords = this.id.split("-"); /* Deler opp "0(rad)-0(kolonne)" "0-1"... "3-1"*  osv. */
    let r = parseInt(coords[0]); /*Gjør første koordinat (r) om til et tall*/
    let c = parseInt(coords[1]); /**Gjør om andre koordinat (c) til tall/

/* Sjekker om valgt tall er riktig */
    if (solution[r][c] == numSelected.id) {
        this.innerText = numSelected.id;
        checkWin(); /* Sjekker om spilleren har vunnet */
    } else {
        errors -= 1;
        document.getElementById("error-count").innerText = errors;
        if (errors == 0) {
            gameOver = true;
            document.getElementById("errors").innerText = "Antall feil igjen: 0 - Du tapte!";
            disableGame(); /* Deaktiverer spillet */
        }
    }
}

/* Starter timeren */
function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

/* Oppdaterer tidstelleren hvert sekund */
function updateTimer() {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}

/* Stopper tiden når spillet er avslutta*/
function disableGame() {
    clearInterval(timer);
}

/* Legger til "prøv på nytt" knapp */
let retryButton = document.createElement("button");
retryButton.innerText = "Prøv igjen";
retryButton.classList.add("retry-button");
retryButton.addEventListener("click", function () {
    location.reload();
});
document.body.appendChild(retryButton);

/* Sjekker om spilleren har vunnet ved å sammenligne hele brettet med løsningen */
function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.innerText != solution[r][c]) {
                return; /* Hvis et tall er feil, avsluttes sjekken */
            }
        }
    }
    gameOver = true;
    document.getElementById("errors").innerText = "Du vant!";
    disableGame();
}
