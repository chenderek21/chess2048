import {GRID_SIZE, CELL_SIZE, Grid} from "./Grid.js";
import Piece from "./Piece.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
let moveCount = 0;
document.getElementById('move-count').innerHTML = moveCount;
//initialization of game board (2 starting pieces)
var pieceList = [];
for (let i = 0; i < 2; i++){
    spawnNewPiece(); 
}


//start of game 
handleInput();

// handle user input
function handleInput() {
    let startDragX;
    let startDragY; 
    let curMagnitude = 0;
    let dragVec = [0,0];
    var isMouseDown = false;
    let newGrid = {};
    let newLoc;
    //when mouse pressed, record starting position
    window.onmousedown = function(e) { e.preventDefault();
        isMouseDown = true;

        startDragX = e.pageX;
        startDragY = e.pageY;
    };
    //when mouse lets go, reset offsets of pieces and make move if drag was large enough

    window.onmouseup   = function(e) { e.preventDefault();
        isMouseDown = false;
        for (let curPiece of pieceList) {
            curPiece.offsetx = 0;
            curPiece.offsety = 0;
        }
        // if surpassed threshold (large drag), move pieces
        if (curMagnitude > window.innerWidth/4) {
            moveCount += 1;
            document.getElementById('move-count').innerHTML = moveCount;
            //adjust grid elements and move pieces
            newGrid = {};
            let newPieceList = [];
            for (let curPiece of pieceList) {
                let startPosition = [curPiece.x, curPiece.y];
                //find ending location of piece
                newLoc = movePiece(startPosition, dragVec, curPiece); 
               
                if (!(newLoc in newGrid)) {
                    newGrid[newLoc] = [];
                }
                //update new grid with moved pieces
                newGrid[newLoc].push(curPiece.piece);
                //clear original pieces
                let gridInd = startPosition[0] + GRID_SIZE*startPosition[1];
                
                grid.cells[gridInd].piece.remove();
                grid.cells[gridInd].piece = undefined;
                
            }
            //sort any stacked pieces
            newGrid = updateGrid(newGrid);

            let xloc;
            let yloc;
            let gridInd;
            let locArr;
            
            for (let loc in newGrid) {
                let curPiece = new Piece(gameBoard);
                locArr = loc.split(',');
                xloc = parseInt(locArr[0]);
                yloc = parseInt(locArr[1]);
                gridInd = xloc + GRID_SIZE*yloc;
                curPiece.x = xloc;
                curPiece.y = yloc;
                curPiece.piece = newGrid[loc][0];
                grid.cells[gridInd].piece = curPiece;   
                newPieceList.push(curPiece);             

            }
            pieceList = newPieceList;
            if (!grid.allCellsFilled()) {
                spawnNewPiece();
            }
            
        }
        curMagnitude = 0
        
    };
    window.onmousemove = function(e) { if(isMouseDown) { 
        dragVec = [e.pageX - startDragX, e.pageY - startDragY];
        curMagnitude = magnitude(dragVec[0], dragVec[1]);
        //nudge pieces in direction of drag
        if (curMagnitude === 0){
            return;
        }
        if (!isMouseDown){
            return;
        }
        for (let curPiece of pieceList){
            let startPosition = [curPiece.x, curPiece.y];
            newLoc = movePiece(startPosition, dragVec, curPiece); 
            let xVec = newLoc[0] - curPiece.x;
            let yVec = newLoc[1] - curPiece.y;
            curPiece.offsetx = nudgeDistance(xVec*Math.min(curMagnitude, window.innerWidth/4));
            curPiece.offsety = nudgeDistance(yVec*Math.min(curMagnitude, window.innerWidth/4));
        }
     } 
    };
}

function movePiece(startPos, dragVec, curPiece) {
    let pieceType = curPiece.piece;
    let dx = dragVec[0];
    let dy = dragVec[1]; // upward movement is negative dy
    let endPos;

    switch (pieceType) {
        case 'pawn':
            endPos = movePawn(dx, dy, startPos);
            break
        case 'knight':
            endPos = moveKnight(dx, dy, startPos);
            break
        case 'bishop':
            endPos = moveBishop(dx, dy, startPos);
            break
        case 'rook':
            endPos = moveRook(dx, dy, startPos);
            break
        case 'queen':
            endPos = moveQueen(dx, dy, startPos);
            break
    }
    
    return endPos;
}

function movePawn(dx, dy, startPos) {
    let curTan = dy/dx;
    let moveX = 0;
    let moveY = 0;
    if ((dy > 0 && dx === 0) || (curTan > 1 && dx > 0) || (curTan < -1 && dx < 0)) {
        moveY += 1
    }
    else if ((dy < 0 && dx === 0) || (curTan > 1 && dx < 0 ) || (curTan < -1 && dx > 0)) {
        moveY -= 1
    }
    else if ((curTan >= -1 && curTan <= 1 && dx < 0)) {
        moveX -= 1
    }
    else { 
        moveX += 1
    }
    let curPos = [startPos[0] + moveX, startPos[1] + moveY];
    if (inBounds(curPos)){
        return curPos;
    }
    return startPos

}

function moveKnight(dx, dy, startPos) {
    let curTan = dy/dx;
    let moveX = 0;
    let moveY = 0;
    if (curTan >= 1 && dx >= 0) {
        moveX += 1;
        moveY += 2;
    }
    else if (curTan >= 1 && dx < 0) {
        moveX -= 1;
        moveY -= 2;
    }
    else if ((dx === 0 && dy > 0) || (curTan <= -1 && dx >= 0)) {
        moveX += 1;
        moveY -= 2;
    }
    else if ((dx === 0 && dy < 0) || (curTan <= -1 && dx < 0)) {
        moveX -= 1;
        moveY += 2;
    }
    else if (curTan > -1 && curTan <= 0 && dx > 0) {
        moveX += 2;
        moveY -= 1;
    }
    else if (curTan > -1 && curTan <= 0 && dx < 0) {
        moveX -= 2;
        moveY += 1;
    }
    else if (curTan > 0 && curTan < 1 && dx > 0) {
        moveX += 2;
        moveY += 1;
    }
    else if (curTan > 0 && curTan < 1 && dx < 0) {
        moveX -= 2;
        moveY -= 1;
    }
    let curPos = [startPos[0] + moveX, startPos[1] + moveY];
    
    if (inBounds(curPos)){
        return curPos;
    }
    return startPos
}

function moveBishop(dx, dy, startPos) {
    let curTan = dy/dx;
    let moveX = 0;
    let moveY = 0;
    if ((dx === 0 && dy >= 0) || (curTan > 0 && dx > 0)) {
        moveX += 1;
        moveY += 1;
    }    
    else if ((dx === 0 && dy <= 0) || (curTan > 0 && dx < 0)) {
        moveX -= 1;
        moveY -= 1;
    }
    else if (curTan <= 0 && dx >= 0) {
        moveX += 1;
        moveY -= 1;
    }
    else if (curTan <= 0 && dx <= 0) {
        moveX -= 1;
        moveY += 1;
    }
    let curPos = [startPos[0], startPos[1]];
    while (inBounds(curPos)){
        curPos[0] += moveX;
        curPos[1] += moveY;
    }
    curPos[0] -= moveX;
    curPos[1] -= moveY;
    return curPos;

}

function moveRook(dx, dy, startPos) {
    let curTan = dy/dx;
    let moveX = 0;
    let moveY = 0;
    if ((dx === 0 && dy <= 0) || (curTan < -1 && dx > 0) || (curTan > 1 && dx < 0)) {
        moveY -= 1;
    }    
    else if ((dx === 0 && dy >= 0) || (curTan < -1 && dx < 0) || (curTan > 1 && dx > 0)) {
        moveY += 1;
    }
    else if (curTan <= 1 && curTan >= -1 && dx >= 0) {
        moveX += 1
    }
    else if (curTan <= 1 && curTan >= -1 && dx <= 0) {
        moveX -= 1
    }

    let curPos = [startPos[0], startPos[1]];
    while (inBounds(curPos)){
        curPos[0] += moveX;
        curPos[1] += moveY;
    }
    curPos[0] -= moveX;
    curPos[1] -= moveY;
    return curPos;
}

function moveQueen(dx, dy, startPos) {
    let curTan = dy/dx;
    let moveX = 0;
    let moveY = 0;
    if ((dx === 0 && dy < 0) || (curTan < (-1 - Math.sqrt(2)) && dx > 0) || (curTan > (1+Math.sqrt(2)) && dx < 0)) {
        moveY -= 1;
    }
    else if ((dx === 0 && dy > 0) || (curTan < (-1 - Math.sqrt(2)) && dx < 0) || (curTan > (1+Math.sqrt(2)) && dx > 0)) {
        moveY += 1;
    }
    else if ((curTan < (-1 + Math.sqrt(2)) && curTan > (1 - Math.sqrt(2)) && dx > 0)) {
        moveX += 1
    }
    else if ((curTan < (-1 + Math.sqrt(2)) && curTan > (1 - Math.sqrt(2)) && dx < 0)) {
        moveX -= 1
    }
    else if ((curTan >= (-1 + Math.sqrt(2)) && curTan <= (1 + Math.sqrt(2)) && dx > 0)) {
        moveX += 1;
        moveY += 1;
    }
    else if ((curTan >= (-1 + Math.sqrt(2)) && curTan <= (1 + Math.sqrt(2)) && dx < 0)) {
        moveX -= 1;
        moveY -= 1;
    }
    else if ((curTan >= (-1 - Math.sqrt(2)) && curTan <= (1 - Math.sqrt(2)) && dx > 0)) {
        moveX += 1;
        moveY -= 1;
    }
    else if ((curTan >= (-1 - Math.sqrt(2)) && curTan <= (1 - Math.sqrt(2)) && dx < 0)) {
        moveX -= 1;
        moveY += 1;
    }
    let curPos = [startPos[0], startPos[1]];
    
    while (inBounds(curPos)){
        
        curPos[0] += moveX;
        curPos[1] += moveY;
    }
    curPos[0] -= moveX;
    curPos[1] -= moveY;
    return curPos;
}

function inBounds(endLoc) {
    let endx = endLoc[0];
    let endy = endLoc[1];
    return endx >= 0 && endx < GRID_SIZE && endy >= 0 && endy < GRID_SIZE;
}

function nudgeDistance(dragDistance) {
    if (dragDistance >= 0){
        return Math.sqrt(dragDistance)/130;

    }
    return -Math.sqrt(-dragDistance)/130;
}

function magnitude(x,y){
    return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}

function spawnNewPiece(){
    let curEmptyCell = grid.randomEmptyCell();
    let curSpawnPiece = Math.random() > 0.1 ? 'pawn' : 'knight';
    console.log(curEmptyCell.x, curEmptyCell.y);
    curEmptyCell.piece = new Piece(gameBoard, curSpawnPiece);
    pieceList.push(curEmptyCell.piece);
}

function updateGrid(newGrid) { 
    //sorts piece stacks within grid elements and calculates resulting piece
    let sortOrder = ['pawn', 'knight', 'bishop', 'rook', 'queen'];
    let newPiece;
    for (let loc in newGrid){   
        if (newGrid[loc].length <= 1) {
            continue
        }
        sortByPieceRank(newGrid[loc], sortOrder);
        newPiece = calculateNewPiece(newGrid[loc]);
        newGrid[loc] = [newPiece];
    }
    return newGrid;
}

//sorts stacked pieces according to piece rank
const sortByPieceRank = (arr, desiredOrder) => {
    const orderForIndexVals = desiredOrder.slice(0).reverse();
    arr.sort((a, b) => {
      const aIndex = -orderForIndexVals.indexOf(a);
      const bIndex = -orderForIndexVals.indexOf(b);
      return aIndex - bIndex;
    });
}

function calculateNewPiece(sortedPieces) {

    if (sortedPieces.length === 1) {
        return sortedPieces[0];
    }
    const pieceValueArr = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    const pieceValueDict = {'pawn': 0, 'knight': 1, 'bishop': 2, 'rook': 3, 'queen': 4, 'king': 5};
    let r;
    let curPiece;
    let curPieceRank;
    let numPiecesNextRank;
    // sift pieces upwards and combine/remove until only one element remains
    //Ex. pawn, pawn, pawn, knight, bishop 
    //1: knight, knight, bishop
    //2: bishop, bishop
    //3: rook (return)
    while (sortedPieces.length > 1){
        
        r = 1;
        curPiece = sortedPieces[0];
        curPieceRank = pieceValueDict[curPiece];
        while (r < sortedPieces.length && sortedPieces[0] === sortedPieces[r]) {
            r += 1;
        }
        numPiecesNextRank = Math.floor(r/2);
        const tmp1 = Array(numPiecesNextRank).fill(pieceValueArr[curPieceRank+1]);
        const tmp2 = sortedPieces.splice(r);
        sortedPieces = tmp1.concat(tmp2);
    }
    return sortedPieces[0];
}

