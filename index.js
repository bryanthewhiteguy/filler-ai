
const Gamesquares = document.getElementById("Gamesquares");
const colorSelector = document.getElementById("colorSelector");
const newBoardButton = document.getElementById("newBoard");
const scoreSpans = document.getElementsByClassName("ScoreSpan");
const playerScores = document.getElementsByClassName("playerScore");
const settingMenu = document.getElementById("SettingsMenu");

const optionsButton = document.getElementById("optionsButton");
const humanButtons = document.getElementsByClassName("HumanButton");
const aiButtons = document.getElementsByClassName("AIButton");
const aiSettings = document.getElementsByClassName("AISettings");
const depthInput = document.getElementsByClassName("AIDepth");

const popUpTime = 0.5;
const fadeTime = 2;
const whitePixelIncrease = 50;

const boardColors = ["230, 93, 109", "181, 216, 116", "249, 227, 90", "105, 176, 240", "113, 87, 161", "91, 91, 91"];
const playerConfig = [1, 2];
let currentBackground = 1;

let changing = false;
let colorChanging = false;
let turningWhite = false;
let finished = false;


settingMenu.style.display = "none";
optionsButton.addEventListener("click", () => {
    settingMenu.style.display = (settingMenu.style.display === "none" ? "" : "none");
})

window.addEventListener("click", (e) => {
    console.log("clicked")
    if (!settingMenu.contains(e.target) && !optionsButton.contains(e.target)) {
        settingMenu.style.display = "none";
    }
})

for (i = 0; i < humanButtons.length; i++) {

    const currentIndex = i;

    if (playerConfig[currentIndex] === 1) {
        humanButtons.item(currentIndex).style.backgroundColor = `rgb(206, 235, 232)`;
    }

    humanButtons.item(currentIndex).addEventListener("click", () => {
        playerConfig[currentIndex] = 1;
        humanButtons.item(currentIndex).style.backgroundColor = `rgb(206, 235, 232)`;
        aiButtons.item(currentIndex).style.backgroundColor = ``;
        updateOptions();
    })
}

for (i = 0; i < aiButtons.length; i++) {

    const currentIndex = i;

    if (playerConfig[currentIndex] === 2) {
        aiButtons.item(currentIndex).style.backgroundColor = `rgb(206, 235, 232)`;
    }

    depthInput.item(i).value = aiDepth[i];

    aiButtons.item(currentIndex).addEventListener("click", () => {
        playerConfig[currentIndex] = 2;
        aiButtons.item(currentIndex).style.backgroundColor = `rgb(206, 235, 232)`;
        humanButtons.item(currentIndex).style.backgroundColor = ``;
        updateOptions();
    })
}

for (i = 0; i < depthInput.length; i++) {

    const currentIndex = i;

    function changeDepth() {

        let value = depthInput.item(currentIndex).value;

        if (value !== "" && !isNaN(value)) {
            value = parseInt(value);
            if (value < 1) value = 1;

            aiDepth[currentIndex] = value;
            console.log(aiDepth )
        } else {
            depthInput.item(currentIndex).value = aiDepth[currentIndex];
        }
    }

    function pressEnter( event ) {
        if (event.key === "Enter") { 
            changeDepth();
        }
    }

    depthInput.item(currentIndex).addEventListener("focusout", changeDepth);

    depthInput.item(currentIndex).addEventListener("keyup", pressEnter);
}

function updateOptions() {
    console.log(playerConfig)
    for (i = 0; i < aiSettings.length; i++) {
        aiSettings.item(i).style.display = ( playerConfig[i] === 1 ? "none" : "" );

    }
    handleMoves();
}

updateOptions();


newBoardButton.addEventListener("click", () => {

    finished = false;
    currentPlayer = 1;

    if (changing) {
        newBoardButton.style.transition = "box-shadow 0s";
        newBoardButton.style.boxShadow = ``;
        newBoardButton.style.transition = "box-shadow 1s"
        newBoardButton.style.boxShadow = `0px 0px 15px 3000px rgb(${currentBackground === boardColors.length ? boardColors[0] : boardColors[currentBackground]})`
        return
    }

    changing = true;

    replaceBoard(generateBoard(), true);

    newBoardButton.style.transition = "box-shadow 1s"
    newBoardButton.style.boxShadow = `0px 0px 15px 3000px rgb(${currentBackground === boardColors.length ? boardColors[0] : boardColors[currentBackground]})`

    setTimeout(() => {

        const body = document.querySelector("body");

        currentBackground === boardColors.length ? currentBackground = 1 : currentBackground++;
        body.style.transition = `background-color 0s`;
        body.style.backgroundColor = `rgb(${boardColors[currentBackground - 1]})`;
        body.style.transition = `background-color 0.025ss`;
        newBoardButton.style.transition = "box-shadow 0s";
        newBoardButton.style.boxShadow = ``;
        changing = false;
    }, 400);
})

newBoardButton.addEventListener("mousedown", () => {
    newBoardButton.style.backgroundColor = "rgb(152, 245, 235)";
    if (changing) return;
    newBoardButton.style.boxShadow = `0px 0px 15px 12px rgb(${currentBackground === boardColors.length ? boardColors[0] : boardColors[currentBackground]})`
})
newBoardButton.addEventListener("mouseup", () => {
    if (changing) return;
    newBoardButton.style.backgroundColor = "rgb(197, 235, 231)";
    newBoardButton.style.boxShadow = ""
})
newBoardButton.addEventListener("mouseenter", () => {
    if (changing) return;
    newBoardButton.style.transition = "box-shadow 1s"
    newBoardButton.style.backgroundColor = "rgb(197, 235, 231)";
    newBoardButton.style.boxShadow = `0px 0px 15px 10px rgb(${currentBackground === boardColors.length ? boardColors[0] : boardColors[currentBackground]})`
})
newBoardButton.addEventListener("mouseleave", () => {
    newBoardButton.style.backgroundColor = "white";
    if (changing) return;
    newBoardButton.style.boxShadow = ""
    newBoardButton.style.transition = "box-shadow 1s"
})



function randomBoardColor() {
    const random = Math.floor(Math.random() * boardColors.length);
    return `rgb(${boardColors[random]})`;
}

function createColorSelection() {

    colorSelector.style.gridTemplateColumns = `repeat(${boardColors.length}, 12.5%)`;

    for (i = 0; i < boardColors.length; i++) {
        const div = document.createElement("div");
        div.setAttribute("id", "select" + (i + 1));
        div.style.width = "100%";
        div.style.height = "83.3%"
        div.style.backgroundColor = `rgb(${boardColors[i]})`;
        div.style.boxShadow = "0px 10px 70px -20px";
        div.style.background = `linear-gradient( rgb(${boardColors[i]}) 60%, rgba(0, 0, 0, 1) 250%`;
        div.style.transition = `transform 0.5s`;

        const butttonNum = i + 1;

        div.addEventListener("click", () => {
            if (finished) return;
            handleMoves( butttonNum );
        })

        div.addEventListener("mouseenter", () => {
            div.style.width = "107%";
            div.style.height = "87.3%"
        })
        div.addEventListener("mouseleave", () => {
            div.style.width = "100%";
        div.style.height = "83.3%"
        })

        colorSelector.appendChild(div);
    }
}

createColorSelection()

const newBoard = generateBoard();
board = newBoard

newBoard.forEach((c, i) => {
    const child = document.createElement("div");
    child.setAttribute("id", "square" + (i + 1));
    child.setAttribute("class", "square")

    child.style.backgroundColor = `rgb(${boardColors[c - 1]})`;
    child.style.transition = `transform ${popUpTime}s, z-index ${popUpTime}s, background ${fadeTime}s`
    child.style.position = "relative"

    Gamesquares.appendChild(child);
    changeBannedColors();
})

function editColor( colorArray, amount, increase ) {
    if (!increase) amount = -amount;
    return `rgb(${colorArray[0] + whitePixelIncrease}, ${colorArray[1] + whitePixelIncrease}, ${colorArray[2] + whitePixelIncrease})`;
}

function whiteFade() {

    if (colorChanging || finished) return;

    const currentColor = getPlayerColor( board, currentPlayer );

    squaresArray = [];

    for (let i = 1; i <= count; i++) {
        if (board[i - 1] === currentColor) {
            const isPlayerColor = checkForColor(board, i, currentColor, currentPlayer)
            if (isPlayerColor) {
                document.getElementById("square" + i).style.transition = `transform ${popUpTime}s, z-index ${popUpTime}s, background ${fadeTime}s`
                squaresArray.push(document.getElementById("square" + i));
            }
        }
    }

    squaresArray.forEach((c, i) => {
        c.style.background = "white";
    })

    setTimeout(() => {
        if (colorChanging || finished) return;
        squaresArray.forEach((c, i) => {
            c.style.background = `rgba(${boardColors[currentColor - 1]}, 1)`;
        })

        setTimeout(() => {
            if (colorChanging || finished) return;
            whiteFade();
        }, fadeTime * 1000 / 2);
    }, fadeTime * 1000 / 4);
}

changeScore()

function changeBannedColors() {
    const bannedColors = aiMoving || finished ? [...Array(boardColors.length + 1).keys()] : getBannedColors( board );

    for (i = 1; i <= boardColors.length; i++) {
        if (bannedColors.includes(i)) {
            document.getElementById("select" + i).style.transform = "scale(0.5)"
        } else {
            document.getElementById("select" + i).style.transform = ""
        }
    }
}

function changeScore() {
    for (i = 0; i < scoreSpans.length; i++) {
        playerScores.item(i).textContent = getPlayerScoores(board)[i + 1]
        const playerColor = getPlayerColor( board, i + 1);
        scoreSpans.item(i).style.background = `linear-gradient(rgb(${boardColors[playerColor - 1]}) 10%, rgba(0, 0, 0, 1) 450%)`;
    }
}

async function replaceBoard( newBoard, newGame ) {
    board = newBoard
    newBoard.forEach(async (c, i) => {
        const square = document.getElementById("square" + (i + 1));
        square.style.transition = `transform ${popUpTime}s, z-index ${popUpTime}s`
        colorChanging = true
        square.style.backgroundColor = `rgb(${boardColors[c - 1]})`;
    });


    changeBannedColors();
    changeScore();

    const player = currentPlayer;

    if (newGame) handleMoves();

    setTimeout(() => {
        if (currentPlayer === player && !newGame) return;
        colorChanging = false;
        whiteFade()
    }, 1000);
}

async function popUp( playerColor ) {

    const squaresArray = [];

    Gamesquares.style.backgroundColor = `rgb(${boardColors[playerColor-1]})`;

    for (let i = 1; i <= count; i++) {
        if (board[i - 1] === playerColor) {
            const isPlayerColor = checkForColor(board, i, playerColor)
            if (isPlayerColor) {
                squaresArray.push(document.getElementById("square" + i));
            }
        }
    }

    squaresArray.forEach((c, i) => {
        c.style.zIndex = i + 5;
        c.style.transform = `scale(1.4, 1.4)`;
    })

    setTimeout(() => {
        squaresArray.forEach((c, i) => {
            c.style.transform = ``;
            c.style.zIndex = 1;
        })
    }, popUpTime * 300);
}

function onUpload() {
    const file = document.getElementById("file_button").files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(e) {
        const myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function(ev) {
            const photoBoard = loadImage( myImage, myImage.width, myImage.height );
            finished = false;
            replaceBoard( photoBoard, true );
        }
        myImage.remove();
    }
}

setTimeout(() => {
    whiteFade()
}, 50);