export const GRID_SIZE = 4;
export const CELL_SIZE = Math.floor(60/GRID_SIZE);
const CELL_GAP = CELL_SIZE/10;
export class Grid {
    #cells;

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE)
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement,
                index % GRID_SIZE, //x
                Math.floor(index / GRID_SIZE) //y
            );
        });
        //console.log(this.#cells)
    }
    get cells() {
        return this.#cells;
    }
    get #emptyCells() {
        return this.#cells.filter(cell => cell.piece == null);
    }

    cellsWithPieces() {
        return this.#cells.filter(cell => cell.piece != null);
    }

    allCellsFilled() {
        return this.#emptyCells.length === 0;
    }

    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random()*this.#emptyCells.length); 
        return this.#emptyCells[randomIndex]
    }
}

class Cell { 
    //variables can only be accessed and modified within class 
    #cellElement
    #x
    #y
    #piece
    constructor(cellElement, x, y){
        this.#cellElement = cellElement
        this.#x = x //column number
        this.#y = y //row number
    }
    get x(){
        return this.#x
    }

    get y(){
        return this.#y
    }

    get piece(){
        return this.#piece
    }

    set piece(piece){
        this.#piece = piece
        if (piece == null) {
            return 
        }
        this.#piece.x = this.#x
        this.#piece.y = this.#y
    }
}

function createCellElements(gridElement) {
    const cells = []
    for (let i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
        const curRow = Math.floor(i/GRID_SIZE)
        const curCol = i%GRID_SIZE
        const cell = document.createElement("div")
        //creates checkerboard pattern
        if ((curRow+curCol)%2 == 0){
            cell.classList.add("cellWhite")
        }
        else{
            cell.classList.add("cellBlack")
        }

        cells.push(cell)
        gridElement.append(cell)
    }
    return cells
}
