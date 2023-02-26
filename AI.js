

let aiMoving = false;
let currentPlayer = 1;
let aiDepth = [10, 10];

function getRow(i) {
    for (let r = 1; r <= boardHeight; r++) {
        if (r * boardWidth + 1 > i) return r;
    }
}

function printBoard(board) {
    let printArray = "";

    for (let i = 0; i < board.length; i++) {
        if ((i) % boardWidth == 0) printArray += "\n";

        printArray += " " + board[i] + " ";
    }

    console.log(printArray)
}

function decodeBoard(board) {
    return board.join("");
}

function addToTable(board, score, transTable) {
    transTable[decodeBoard(board)] = score;
}

function checkTable(board, transTable) {
    return transTable[decodeBoard(board)];
}

function generateBoard() {

    const board = [];

    function randNum(bannedColors) {
        let num = Math.floor(Math.random() * numOfColors + 1);

        if (bannedColors.includes(num)) {
            return randNum(bannedColors);
        }
        return num;
    }

    for (let i = 1; i <= count; i++) {

        const bannedColors = [];
        const row = getRow(i)

        if (!((i - 1) % boardWidth == 0) || i === 1) bannedColors.push(board[i - 2]);
        if (row !== 1) bannedColors.push(board[i - boardWidth - 1]);
        if (i === count - (boardWidth - 1)) bannedColors.push(board[boardWidth - 1]);

        const rand = randNum(bannedColors);

        board[i - 1] = rand;
    }

    return board;
}

function getPlayerColor(board, player) {
    const playerColors = [board[count - boardWidth], board[boardWidth - 1]];
    return playerColors[player - 1];
}

function getPlayerColors(board) {
    return [board[count - boardWidth], board[boardWidth - 1]];
}

function getPlayerScore(board, player) {

    let score = 0;

    const playerColor = getPlayerColor(board, player);

    for (let i = 1; i <= count; i++) {
        if (board[i - 1] === playerColor) {
            if (checkForColor(board, i, playerColor, player)) {
                score++;
            }
        }
    }

    return score;
}

function getPlayerScoores(board) {

    const scores = {
        1: getPlayerScore( board, 1 ),
        2: getPlayerScore( board, 2 )
    }

    return scores;
}

function checkForColor(board, i, playerColor, player) {

    const row = getRow(i);

    let nearPlayerColor = false;

    if (row !== 1 && playerColor === board[i - boardWidth - 1]) nearPlayerColor = true;
    if (row !== boardHeight && playerColor === board[i + boardWidth - 1]) nearPlayerColor = true;
    if (i !== (row - 1) * boardWidth + 1 && playerColor === board[i - 2]) nearPlayerColor = true;
    if (i !== row * boardWidth && playerColor === board[i]) nearPlayerColor = true;
    if ((!player ? true : player === 2) && (i === boardWidth && board[boardWidth - 1] === playerColor)) nearPlayerColor = true;
    if ((!player ? true : player === 1) && (i === count - boardWidth + 1 && board[count - boardWidth] === playerColor)) nearPlayerColor = true;


    return nearPlayerColor;

}

function numOfNearbyBoxes(board, i) {

    const row = getRow(i);

    let count = 0;

    if (row !== 1) count++;
    if (row !== boardHeight) count++;
    if (i !== (row - 1) * boardWidth + 1) count++;
    if (i !== row * boardWidth) count++;

    return count;
}

function checkAllSides(board, i, color) {

    const row = getRow(i);

    let count = 0;

    if (row !== 1 && color === board[i - boardWidth - 1]) count++;
    if (row !== boardHeight && color === board[i + boardWidth - 1]) count++;
    if (i !== (row - 1) * boardWidth + 1 && color === board[i - 2]) count++;
    if (i !== row * boardWidth && color === board[i]) count++;


    return count === numOfNearbyBoxes(board, i);

}

function makeMove(board, player, color) {

    const playerColor = getPlayerColor(board, player);
    const squaresArray = [];

    for (let i = 1; i <= count; i++) {

        if (board[i - 1] === playerColor) {
            const changeColor = checkForColor(board, i, playerColor, player)
            if (changeColor) {
                squaresArray.push(i - 1);
            }
        }
    }

    squaresArray.forEach((s) => {
        board[s] = color;
    });

    return board;

}

function checkStrayColors(board) {

    let strayColors = false;

    const playerColors = getPlayerColors(board);

    for (let i = 1; i <= count; i++) {

        const oppositeColor = board[i - 1] === playerColors[0] ? playerColors[1] : playerColors[0];
        const strayColor = checkAllSides(board, i, oppositeColor);

        if (strayColor) strayColors = true;
    }

    return strayColors;
}

function isGameFinished(board) {

    let count = 0;

    for (let i = 1; i <= numOfColors; i++) {
        if (board.includes(i)) count++;
    }

    if (count === 2) {
        if (checkStrayColors(board)) count++;
    }

    return count <= 2;

}

function getBorderColors(board, player, amount) {

    const borderColors = [];

    const playerColor = getPlayerColor(board, player);
    const bannedColors = getBannedColors(board);

    for (let i = 1; i <= count; i++) {
        if (board[i - 1] === playerColor) {
            const isPlayerColor = checkForColor(board, i, playerColor)
            if (isPlayerColor) {
                for (let c = 1; c <= colorArray.length; c++) {
                    if (!bannedColors.includes(c)) {
                        if (checkForColor(board, i, c) && (!amount && !borderColors.includes(c))) {
                            borderColors.push(c);
                        }
                    }
                }
            }
        }
    }

    return borderColors;
}

function getBannedColors(board, player) {

    const colors = [board[boardWidth - 1], board[count - boardWidth]];

    if (player) {
        const borderColors = getBorderColors(board, player);

        if (borderColors.length !== 0) {
            for (let i = 1; i <= colorArray.length; i++) {
                if (!colors.includes(i) && !borderColors.includes(i)) {
                    colors.push(i);
                }
            }
        }
    }

    return colors;
}

function bestMove(board, player) {

    const transTable = {};

    let bestScore = -Infinity;
    let move;

    const bannedColors = getBannedColors(board, player);

    for (let i = 1; i <= numOfColors; i++) {
        if (!bannedColors.includes(i)) {

            let tempBoard = board.map(b => b);

            tempBoard = makeMove(tempBoard, player, i);

            let score = miniMax(tempBoard, player, -Infinity, Infinity, false, 0, transTable, false);

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    console.log(Object.entries(transTable).length)

    console.log("finished")

    console.log(move)

    return move;
}


function miniMax(board, player, alpha, beta, isMaximizing, depth, transTable, huh) {

    if (checkTable(board, transTable) !== undefined) {
        return checkTable(board, transTable);
    }

    if (isGameFinished(board) || depth === aiDepth[player - 1]) {

        const scores = getPlayerScoores(board);

        const score1 = scores[player];
        const score2 = scores[player === 1 ? 2 : 1];

        return (score1 - score2) - depth / 100;

    }

    if (isMaximizing) {

        let bestScore = -Infinity;

        const bannedColors = getBannedColors(board, player);

        for (let i = 1; i <= colorArray.length; i++) {
            if (!bannedColors.includes(i)) {

                let tempBoard = board.map(b => b);

                tempBoard = makeMove(tempBoard, player, i);

                let score = miniMax(tempBoard, player, alpha, beta, false, depth + 1, transTable, huh);

                bestScore = Math.max(score, bestScore);

                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }

        addToTable(board, bestScore, transTable);

        return bestScore;
    } else {

        let bestScore = Infinity;

        const bannedColors = getBannedColors(board, player === 1 ? 2 : 1);

        for (let i = 1; i <= colorArray.length; i++) {
            if (!bannedColors.includes(i)) {

                let tempBoard = board.map(b => b);

                tempBoard = makeMove(tempBoard, player === 1 ? 2 : 1, i);

                let score = miniMax(tempBoard, player, alpha, beta, true, depth + 1, transTable, huh);

                bestScore = Math.min(score, bestScore);

                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }

        addToTable(board, bestScore, transTable);

        return bestScore;
    }
}

function moveAI(board, player) {

    const tempBoard = board.map(b => b);

    const color = bestMove(tempBoard, player);
    console.log("HHHHHHHHHHHHHHHHHHH")
    console.log(color)

    printBoard(board);

    const newMove = makeMove(board, player, color);

    return newMove;
}

let board = [];


async function handleMoves(color) {

    if (aiMoving || finished) return;

    const bannedColors = getBannedColors(board);
    let tempBoard = board.map(b => b);

    for (i = 0; i < playerConfig.length; i++) {
        if (currentPlayer === i + 1) {
            if (playerConfig[i] === 1 && color) {
                if (color !== NaN && color <= colorArray.length && color > 0
                    && !bannedColors.includes(color)) {
                    await replaceBoard(await makeMove(board, currentPlayer, color));
                    await popUp(getPlayerColor(board, currentPlayer));

                    currentPlayer = currentPlayer === 1 ? 2 : 1;

                    changeBannedColors();

                    if (isGameFinished(board)) {
                        finished = true;
                        changeBannedColors();
                        return;
                    }

                    handleMoves(color);
                }
            } else if (playerConfig[i] === 2) {

                aiMoving = true;

                changeBannedColors();

                setTimeout(async () => {
                    await replaceBoard(await moveAI(board, currentPlayer));
                    await popUp(getPlayerColor(board, currentPlayer));
                    aiMoving = false;
                    currentPlayer = currentPlayer === 1 ? 2 : 1;

                    changeBannedColors();

                    if (isGameFinished(board)) {
                        finished = true;
                        changeBannedColors();
                        return;
                    }

                    console.log("yo")

                    handleMoves(color);
                }, 1000);
            }
        }
    }
}

// async function clickColor(color) {

//     if (aiMoving) return;
//     console.log(board)
//     const bannedColors = getBannedColors(board);

//     printBoard(board);

//     let tempBoard = board.map(b => b);

//     if (color !== NaN && color <= colorArray.length && color > 0
//         && !bannedColors.includes(color)) {
//         await replaceBoard(await makeMove(tempBoard, 1, color))
//         await popUp(getPlayerColor(board, 1));
//         aiMoving = true;
//         changeBannedColors()
//         setTimeout(async () => {
//             aiMoving = false;
//             await replaceBoard(await moveAI(tempBoard, 2));
//             await popUp(getPlayerColor(board, 2));
//         }, 700);
//     }

//     if (isGameFinished(board)) {
//         const scores = getPlayerScoores(board);
//         console.log("Player 1: " + scores[1])
//         console.log("Player 2: " + scores[2])
//         return;
//     }
// }