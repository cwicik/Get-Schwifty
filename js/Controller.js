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
    constructor(boardFactory, gameView, timer, scoreboard, username) {
        this.boardFactory = boardFactory;
        this.gameView = gameView;
        this.startTime = null;
        this.timer = timer;
        this.username = username;
        this.scoreboard = scoreboard;
    }

    startGame(size = 0){
        this.board = this.boardFactory.createBoard(size);
        this.gameView.setGameController(this);
        this.gameView.displayBoard(this.board);
        this.startTime = new Date();
        this.timer.reset();
        this.timer.start();
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
            this.timer.stop();
            if (this.scoreboard.tryAdd(this.username, this.startTime, this.timer.seconds, this.board.size)) {
                this.gameView.updateScoreboard();
            }
            this.gameView.winScreen();
        }
    }


    #inBorder(index){
        return index < this.board.size && index >= 0;
    }
}

class Timer{
    constructor(interval, gameView) {
        this.interval = interval;
        this.gameView = gameView;
        this.seconds = 0;
        this.SECONDS_IN_DAY = 86400;
    }

    tick(){
        this.seconds++;
        if (this.seconds >= this.SECONDS_IN_DAY) {
            this.seconds = this.SECONDS_IN_DAY - 1;
            this.stop();
        }
        this.gameView.displayTimer(this.seconds);
    }

    start(){
        this.timer = setInterval(() => this.tick(), this.interval);
    }

    stop(){
        clearTimeout(this.timer);
    }

    reset(){
        this.seconds = 0;
        this.gameView.displayTimer("");
        this.stop();
    }
}