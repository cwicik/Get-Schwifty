function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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
                const number = numbers[getRandomInt(numbers.length)];
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

    attemptSwitchTile(x, y){
        if (x + 1 < this.size) {
            if (this.isEmptyTile(x + 1, y)) {
                return this.switchTiles(x,y, x+1,y);
            }
        }
        if (x - 1 >= 0) {
            if (this.isEmptyTile(x - 1, y)) {
                return this.switchTiles(x,y, x-1,y);
            }
        }
        if (y + 1 < this.size) {
            if (this.isEmptyTile(x, y + 1)) {
                return this.switchTiles(x,y, x,y+1);
            }
        }
        if (y - 1 >= 0) {
            if (this.isEmptyTile(x, y - 1)) {
                return this.switchTiles(x,y, x,y-1);
            }
        }
        return false;
    }

    switchTiles(x1,y1, x2,y2){
            [this.board[x1][y1], this.board[x2][y2]] = [this.board[x2][y2], this.board[x1][y1]];
            this.boardDisplayer.updateBoard();
            return true;
    }
}

class BoardFactory{
    constructor(boardDisplayer) {
        this.boardDisplayer = boardDisplayer;
    }

    createBoard(boardSize = 0){
        if (boardSize) {
            return new Board(boardSize, this.boardDisplayer);
        }
        do {
            boardSize = Number.parseInt(prompt("Please enter board size", 3));
        } while (!boardSize || boardSize < 2);
        return new Board(boardSize, this.boardDisplayer);
    }
}

class GameOrchestrator{
    constructor(boardFacory, boardDisplayer) {
        this.boardFacory = boardFacory;
        this.boardDisplayer = boardDisplayer;
        this.board = null;
    }

    startGame(){
        this.board = boardFactory.createBoard();
        this.boardDisplayer.setBoard(this.board);
        boardDisplayer.displayBoard(this.board);
    }
}