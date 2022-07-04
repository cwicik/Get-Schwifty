class BoardDisplayer{
    constructor() {
        this.buttons = new Array();
    }    

    displayBoard(){
        const gameDiv = document.createElement("div");
        gameDiv.className = "grid";
        document.body.appendChild(gameDiv);

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const button = document.createElement("button");
                button.innerHTML = board.board[x][y].number === board.emptyTile ? "&nbsp;" : board.board[x][y].number;
                button.addEventListener("click", () => {
                    board.attemptSwitchTile(x, y);
                    this.updateBoard();
                    board.isSolved() ? alert("won pog") : null;
                }
                );
                gameDiv.appendChild(button);
                this.buttons.push(button);   
            }
        }
    }

    updateBoard(){
        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const button = this.buttons[y * board.size + x];
                button.innerHTML = board.board[x][y].number === board.emptyTile ? "&nbsp;" : board.board[x][y].number; 
            }
        }
    }
}

class BoardBootstrapper{
    createBoard(){
        do {
            var boardSize = Number.parseInt(prompt("Please enter board size", 3));
        } while (!boardSize || boardSize < 2);
        return new Board(boardSize);
    }
}


const boardBootstrapper = new BoardBootstrapper();
const board = boardBootstrapper.createBoard();

const boardDisplayer = new BoardDisplayer();
boardDisplayer.displayBoard();