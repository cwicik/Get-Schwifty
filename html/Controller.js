class Tile{
    constructor(number){
        this.number = number;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Board{
    constructor(size){
        this.size = size;
        do {
            this.generateBoard();
            console.log(this.board);
            console.log(this.validBoard());
        }while(!this.validBoard() || this.solvedBoard());
        console.log(this.board[0]);
        console.log(this.board[1]);
    }

    generateBoard(){
        const numbers = [...Array(this.size * this.size).keys()];
        numbers.forEach(num => numbers[num]++);

        this.board = new Array();

        for (let y = 0; y < this.size; y++) {
            const row = new Array();
            for (let x = 0; x < this.size; x++) {
                const number = numbers[getRandomInt(numbers.length)];
                row.push(new Tile(number));

                const index = numbers.indexOf(number);
                numbers.splice(index, 1);
            }
            this.board.push(row);
        } 
    }

    validBoard(){
        const seen = new Array(); 
        let count = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const currentNum = this.board[y][x].number;
                if(currentNum === this.size * this.size) {
                    if ((this.size + 1) % 2) {
                        count += y + 1;
                    }
                }
                else{
                    seen.push(currentNum);
                    count += currentNum - seen.filter(num => num <= currentNum).length;
                }    
            }
        }
        return !Boolean(count % 2);
    }

    solvedBoard(){
        let lastNumber = null;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
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
}

const board = new Board(2);