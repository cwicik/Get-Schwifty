class Tile{
    constructor(number){
        this.number = number;
    }
}

class Board{
    constructor(size, boardDisplayer){
        this.size = size;
        this.emptyTile = size * size;
        this.board = null;
        this.boardDisplayer = boardDisplayer;
        do {
            this.generateBoard();
        }while(!this.isValid() || this.isSolved());
    }

    generateBoard(){
        this.board = new Array();

        const numbers = [...Array(this.size * this.size).keys()];
        numbers.forEach(num => numbers[num]++);

        for (let x = 0; x < this.size; x++) {
            const column = new Array();
            for (let y = 0; y < this.size; y++) {
                const number = numbers[this.#getRandomInt(numbers.length)];
                column.push(new Tile(number));

                const index = numbers.indexOf(number);
                numbers.splice(index, 1);
            }
            this.board.push(column);
        } 
    }

    isValid(){
        const seen = new Array(); 
        let count = 0;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if(this.isEmptyTile(y,x)) {
                    if ((this.size + 1) % 2) {
                        count += x + 1;
                    }
                }
                else{
                    const currentNum = this.board[y][x].number;
                    seen.push(currentNum);
                    count += currentNum - seen.filter(num => num <= currentNum).length;
                }    
            }
        }
        return !Boolean(count % 2);
    }

    isSolved(){
        let lastNumber = null;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const currentNum = this.board[y][x].number;
                if (lastNumber) {
                    if (lastNumber + 1 !== currentNum) {
                        return false;
                    }
                }
                lastNumber = currentNum;
            }
        }
        return true;
    }

    isEmptyTile(x,y){
        return this.board[x][y].number === this.emptyTile;
    }

    switchTiles(x1,y1, x2,y2){
            [this.board[x1][y1], this.board[x2][y2]] = [this.board[x2][y2], this.board[x1][y1]];
            this.boardDisplayer.updateBoard();
            return true;
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

class BoardFactory{
    constructor(boardDisplayer) {
        this.boardDisplayer = boardDisplayer;
        this.SMALLEST_BOARD_SIZE = 2;
    }

    createBoard(boardSize){
        if (boardSize) {
            return new Board(boardSize, this.boardDisplayer);
        }
        do {
            boardSize = Number.parseInt(prompt("Please enter board size (>=2)", this.SMALLEST_BOARD_SIZE));
        } while (!boardSize || boardSize < this.SMALLEST_BOARD_SIZE);
        return new Board(boardSize, this.boardDisplayer);
    }
}

class GameController{
    constructor(boardFacory, gameView) {
        this.boardFacory = boardFacory;
        this.gameView = gameView;
    }

    startGame(size = 0){
        this.board = boardFactory.createBoard(size);
        this.gameView.setGameController(this);
        gameView.displayBoard(this.board);
    }

    attemptSwitchTile(x, y){
        for (let shift = -1; shift < 2; shift+=2) {
            if (this.#inBorder(x + shift)) {
                if (this.board.isEmptyTile(x + shift, y)) {
                    this.board.switchTiles(x,y, x+shift,y);
                    this.checkWin();
                    return;
                }
            }  

            if (this.#inBorder(y + shift)) {
                if (this.board.isEmptyTile(x, y + shift)) {
                    this.board.switchTiles(x,y, x,y+shift);
                    this.checkWin();
                    return;
                }
            }
        }
    }

    checkWin(){
        if (this.board.isSolved()) {
            this.gameView.winScreen();
        }
    }


    #inBorder(index){
        return index < this.board.size && index >= 0;
    }
}