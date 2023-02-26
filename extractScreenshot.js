const pixelInterval = 32;
const colorDiff = 35;
const maxCount = 8;

const boardWidth = 8;
const boardHeight = 7;
const count = boardWidth * boardHeight;

const colors = {
    red: [ 249,81,106,255 ],
    green: [ 173,218,102,255 ],
    yellow: [ 255,226,44,255 ],
    blue: [ 78,180,245,255 ],
    purple: [ 117,87,167,255 ],
    black: [91, 91, 91, 255],
}

const colorValues = Object.values(colors);

const colorArray = ["red", "green", "yellow", "blue", "purple", "black"];
const numOfColors = colorArray.length;

function createDataArray(data) {

    const array = [];
    let tempArray = [];

    for (i = 0; i < data.length; i++) {
        tempArray.push(data[i]);

        if (tempArray.length == 4) {
            array.push(tempArray);

            tempArray = [];
        }
    }

    return array;
}

function trimArray(data) {

    const array = [];

    for (i = 0; i < data.length; i += pixelInterval) {
        array.push(data[i]);
    }

    return array;
}

function validColor(currentPixel, currentColor) {
    if (((currentColor[0] - colorDiff) <= currentPixel[0] && currentPixel[0] <= (currentColor[0] + colorDiff))) {
        if (((currentColor[1] - colorDiff) <= currentPixel[1] && currentPixel[1] <= (currentColor[1] + colorDiff))) {
            if (((currentColor[2] - colorDiff) <= currentPixel[2] && currentPixel[2] <= (currentColor[2] + colorDiff))) {
                return true;
            }
        }
    }

    return false;
}

function getFirstColorPixel(pixel, currentColor, dataArray, reverse) {

    let OGPixel = pixel;
    const pixelPos = pixel * pixelInterval;

    for (p = 1; p <= pixelInterval; p++) {

        const currentPixel = dataArray[pixelPos - p];

        if (reverse) {

            let isValidColor = false;

            for (c = 0; c < colorValues.length; c++) {

                const color = colorValues[c];

                if (validColor(currentPixel, color)) isValidColor = true;
            }

            if (isValidColor) {
                OGPixel = pixelPos - (p);
                break;
            }
        } else {
            if (!validColor(currentPixel, currentColor)) {
                OGPixel = pixelPos - (p - 1);
                break;
            }
        }
    }


    return OGPixel
}


function loadImage( image, width, height ) {

    console.log(image)

    const canvas = document.getElementById("canvas");
    canvas.style.display = "none";

    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = imageData
    const data = imageData.data;

    const dataArray = createDataArray(data);
    const trimmedData = trimArray(dataArray)

    // console.log(trimmedData);
    // console.log(colorValues);

    let firstPoint;
    let lastPoint;
    let count = 0;

    for (i = 0; i < trimmedData.length; i++) {

        newImageData.data[i * pixelInterval * 4 + 0] = 255;
        newImageData.data[i * pixelInterval * 4 + 1] = 0;
        newImageData.data[i * pixelInterval * 4 + 2] = 0;
    }

    for (i = 0; i < trimmedData.length; i++) {

        const currentPixel = trimmedData[i];

        let isValidColor = false;

        for (c = 0; c < colorValues.length; c++) {

            const currentColor = colorValues[c];

            if (validColor(currentPixel, currentColor)) {
                if (!firstPoint) {
                    firstPoint = getFirstColorPixel(i, currentColor, dataArray);
                }
                isValidColor = true;
            }
        }

        count++;

        if (!isValidColor) {
            if (count >= maxCount) {
                
                lastPoint = getFirstColorPixel(i, null, dataArray, true);
                break;
            } else {
                firstPoint = undefined
                count = 0;
            }
        }
    }

    ctx.putImageData(newImageData, 0, 0);

    const photoBoardWidth = lastPoint - firstPoint;
    const photoBoardHeight = (photoBoardWidth / boardWidth) * boardHeight;
    const unitBoardWidth = photoBoardWidth / boardWidth;
    const unitBoardHeight = photoBoardHeight / boardHeight;

    const photoBoard = [];

    for (h = 0; h < boardHeight; h++) {
        for (w = 0; w <= boardWidth; w++) {

            const currentPixel = dataArray[Math.round(firstPoint + ((((h * Math.round(unitBoardHeight)) * width) + Math.round(((Math.round(unitBoardHeight) / 2))) * width)) + ((w * Math.round(unitBoardWidth)) + Math.round((Math.round(unitBoardWidth) / 2))))];

            for (c = 0; c < colorValues.length; c++) {

                const currentColor = colorValues[c];
    
                if (validColor(currentPixel, currentColor)) {
                    photoBoard.push(c + 1);
                }
            }
        }
    }

    return photoBoard;
}