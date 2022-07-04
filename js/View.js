class GameView{
    #board;

    constructor() {
        this.buttons = null;
    }    

    setGameController(gameController){
        this.gameController = gameController;
        this.#board = gameController.board;
    }

    displayBoard(){
        document.getElementById("winText").innerHTML = "";
        const gameDiv = document.getElementById("gameDiv")
        this.buttons = new Array();
        this.#clearElement(gameDiv);

        const boardSize = this.#board.size;
        for (let y = 0; y < boardSize; y++) {
            const div = document.createElement("div");
            for (let x = 0; x < boardSize; x++) {
                const button = this.#createButton(x, y);
                div.appendChild(button);      
                this.buttons.push(button);   
            }
            gameDiv.appendChild(div);
        }

        this.#resetLevelButton();
    }

    #clearElement(element){
        while (element.firstChild) {
            element.removeChild(element.lastChild);
        }
    }

    #createButton(x, y){
        const button = document.createElement("button");
        button.id = "gameButton";
        button.innerHTML = this.#board.board[x][y].number === this.#board.emptyTile ? "&nbsp;" : this.#board.board[x][y].number;
        button.addEventListener("click", () => this.onTileClick(x, y));
        return button;
    }

    updateBoard(){
        const boardSize = this.#board.size;
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                const button = this.buttons[y * boardSize + x];
                button.innerHTML = this.#board.board[x][y].number === this.#board.emptyTile ? "&nbsp;" : this.#board.board[x][y].number; 
            }
        }
    }

    winScreen(){
        this.#disableButtons();
        this.#displayWinMessage();
        this.#nextLevelButton();
    }

    onTileClick(x, y){
        this.gameController.attemptSwitchTile(x, y);
    }

    displayTimer(ticks){
        const timer = document.getElementById("timer");
        if (ticks) {
            let seconds = ticks % 60; 
            let minutes = Math.floor((ticks /  60)) % 60; 
            let hours = Math.floor(((ticks /  60) / 60)) % 24;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            hours = hours < 10 ? "0" + hours : hours;
            timer.innerHTML = hours + ":" + minutes + ":" + seconds;
        } 
    }

    #displayWinMessage(){      
        document.getElementById("winText").innerHTML = "Congratulations! You have won!";
    }

    #disableButtons(){
        this.buttons.forEach(button => {
            button.disabled = true;
        });
    }

    #resetLevelButton(){
        const button = document.createElement("button");
        button.id = "menuButton";
        button.innerHTML = "Reset";
        button.addEventListener("click", () => this.gameController.startGame(this.#board.size));
        document.getElementById("gameDiv").appendChild(button);
    }  

    #nextLevelButton(){
        const button = document.createElement("button");
        button.id = "menuButton";
        button.innerHTML = "Next";
        button.addEventListener("click", () => this.gameController.startGame(this.#board.size + 1));
        document.getElementById("gameDiv").appendChild(button);
    }      
}

const gameView = new GameView();

const boardFactory = new BoardFactory(gameView);
const timer = new Timer(1000, gameView);
const gameController = new GameController(boardFactory, gameView, timer);

gameController.startGame();