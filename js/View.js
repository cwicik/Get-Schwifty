class BoardDisplayer{
    constructor() {
        this.board = null;
        this.buttons = new Array();
    }    

    setBoard(board){
        this.board = board;
    }

    displayBoard(){
        document.getElementById("winText").innerHTML = "";

        for (let y = 0; y < this.board.size; y++) {
            const div = document.createElement("div");
            for (let x = 0; x < this.board.size; x++) {
                const button = document.createElement("button");
                button.id = "gameButton";
                button.innerHTML = this.board.board[x][y].number === this.board.emptyTile ? "&nbsp;" : this.board.board[x][y].number;
                button.addEventListener("click", () => this.onClick(x, y));
                div.appendChild(button);      
                this.buttons.push(button);   
            }
            document.getElementById("gameDiv").appendChild(div);
        }
    }

    updateBoard(){
        for (let y = 0; y < this.board.size; y++) {
            for (let x = 0; x < this.board.size; x++) {
                const button = this.buttons[y * this.board.size + x];
                button.innerHTML = this.board.board[x][y].number === this.board.emptyTile ? "&nbsp;" : this.board.board[x][y].number; 
            }
        }
    }

    onClick(x, y){
        if (this.board.attemptSwitchTile(x, y)) {
            if (this.board.isSolved()) {
                this.wonGame();
            }
        }
    }

    wonGame(){      
        document.getElementById("winText").innerHTML = "Congratulations! You have won!";
        this.buttons.forEach(button => {
            button.disabled = true;
        });
    }
}

const boardDisplayer = new BoardDisplayer();

const boardFactory = new BoardFactory(boardDisplayer);
const gameOrchestrator = new GameOrchestrator(boardFactory, boardDisplayer);

gameOrchestrator.startGame();