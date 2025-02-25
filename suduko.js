let numSelected = null;
let tileSelected = null;
let errors = 5;
let gameOver = false;
let timer; /* variabel for å holde styr på tiden*/
let time = 0; /* variabel for å holde styr på brukt tid*/

const board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

const solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

window.onload = function () {
    document.getElementById("error-count").innerText = errors;
    setGame();
    startTimer(); 
}

function setGame() {
    /*Tall fra 1-9*/
    for (let i = 1; i <= 9; i++) {
        /*<div id="1" class="number">1</div>*/
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    /*brett 9x9*/
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if (gameOver) return;
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (gameOver || !numSelected) return;
    if (this.innerText != "") return;

    /* "0-0" "0-1"... "3-1"*/
    let coords = this.id.split("-"); /* [™0™, ™0™] */
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == numSelected.id) {
        this.innerText = numSelected.id;
        checkWin(); 
    } else {
        errors -= 1;
        document.getElementById("error-count").innerText = errors;
        if (errors == 0) {
            gameOver = true;
            document.getElementById("errors").innerText = "Antall feil igjen: 0 - Du tapte!";
            disableGame();
        }
    }
}

/*fryser spillet*/ 
function disableGame() {
    document.querySelectorAll(".tile").forEach(tile => tile.removeEventListener("click", selectTile));
    document.querySelectorAll(".number").forEach(number => number.removeEventListener("click", selectNumber));
    clearInterval(timer); // stopper tiden når spillet er avslutta
}


function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

/*oppdaterer tiden*/
function updateTimer() {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}


function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.innerText != solution[r][c]) {
                return;
            }
        }
    }
    gameOver = true;
    document.getElementById("errors").innerText = "Du vant!";
    disableGame();
}
