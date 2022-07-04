class UserInfo{
    constructor(username, startingTime, score, boardSize) {
        this.username = username ? username : "Guest";
        this.startingTime = startingTime;
        this.score = score;
        this.boardSize = boardSize;
    }
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

class Scoreboard{
    constructor(maxSize = 5) {
        this.maxSize = maxSize;
        this.scoreboard = new Array();
    }

    tryAdd(username, startingTime, score, boardSize) {
        const user = new UserInfo(username, startingTime, score, boardSize);
        if (this.scoreboard.length < this.maxSize) {
            this.scoreboard.push(user);
            this.scoreboard.sort(this.sortBy);
            return true;
        }        
        if(this.sortBy(user, this.scoreboard[this.maxSize - 1]) === -1) {
            this.scoreboard.pop();
            this.scoreboard.push(user);
           this.scoreboard.sort(this.sortBy);
            return true;
        }
        return false;
    }

    sortBy(user1, user2) {          
        if (user1.boardSize === user2.boardSize) {
            return user1.score > user2.score ? 1 : -1;
        }
        return user2.boardSize - user1.boardSize;
    }
}