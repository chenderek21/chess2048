export default class Piece {
    #pieceElement;
    #x;
    #y;
    #piece;
    #offsetx;
    #offsety;

    constructor(pieceContainer, piece) {
        this.#pieceElement = document.createElement("div");
        this.#pieceElement.classList.add("piece");
        pieceContainer.append(this.#pieceElement);
        this.piece = piece;
        this.offsetx = 0;
        this.offsety = 0;
    }
    get piece() {
        return this.#piece;
    }
    set piece(pieceType) {
        this.#piece = pieceType;
        let pieceImgUrl = "piece_icons/" + pieceType +".png";
        this.#pieceElement.style.setProperty("--backgroundImg", "url(" + pieceImgUrl + ")");
    }
    
    get offsetx() {
        return this.#offsetx;
    }

    get offsety() {
        return this.#offsety;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    set offsetx(dx) {
        this.#offsetx = dx;
        this.#pieceElement.style.setProperty("--offsetx", dx);
    }

    set offsety(dy) {
        this.#offsety = dy;
        this.#pieceElement.style.setProperty("--offsety", dy);
    }

    set x(xPosition) {
        this.#x = xPosition;
        this.#pieceElement.style.setProperty("--x", xPosition);
    }

    set y(yPosition) {
        this.#y = yPosition;
        this.#pieceElement.style.setProperty("--y", yPosition);
    }

    remove() {
        this.#pieceElement.remove();
    }

}

