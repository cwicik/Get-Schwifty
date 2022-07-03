class Tile{
    constructor(number){
        this.number = number;
    }
}

class Board{
    constructor(size){
        this.size = size;
        this.board = new Array();

        for (let i = 0; i < size; i++) {
            const row = new Array();
            for (let j = 0; j < size; j++) {
                row.push(new Tile(i * size + j + 1));
            }
            this.board.push(row);
        }
    }

    validBoard(){
        let seen = new Array();
        // this.board = [
        //     [6, NaN, 7],
        //     [3, 2, 8],
        //     [4, 5, 1]
        // ];  
        // this.size = 4;
        // this.board = [
        //     [1, 2, 3, 4],
        //     [5, 6, 7, 8],
        //     [9, 10, NaN, 15],
        //     [13, 14, 12, 11]
        // ];  
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let currentNum = this.board[i][j]; //.number
                if ((this.size + 1 % 2)){
                    if(!currentNum){
                        count += j + 1;
                    }
                }
                if (currentNum){
                    count += currentNum - seen.filter(num => num <= currentNum).length;
                }       
            }
        }
        return !Boolean(count % 2);
    }
}

const board = new Board(4);
console.log(board.board);
console.log(board.validBoard());