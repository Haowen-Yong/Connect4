import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    //console.log("reached here hehe");
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        //console.log("reached here haha");
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

/*
    render() {
        // board wide = 7, 7 columns; height = 6, 6 rows; 
        var renderContent = '';
        var gameboard = [];
        for(let i=0; i<6; i++) {
            renderContent += '<div class="board-Row">';
            var row = [];
            for(let j=0; j<7; j++) {
                //renderContent += '<button class="square" onClick={()=>this.props.onClick(i)}></button>';
                //this.renderSquare(j);
                renderContent += this.renderSquare(j);
                row.push(null);
            }
            renderContent += '</div>'
            gameboard.push(row);
        }
        return (
            <div dangerouslySetInnerHTML={{__html: renderContent}}></div>
        );
    }
  */  

    render() {
        return (
            <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
            </div>
            <div className="board-row">
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                {this.renderSquare(9)}
                {this.renderSquare(10)}
                {this.renderSquare(11)}
                {this.renderSquare(12)}
                {this.renderSquare(13)}
            </div>
            <div className="board-row">
                {this.renderSquare(14)}
                {this.renderSquare(15)}
                {this.renderSquare(16)}
                {this.renderSquare(17)}
                {this.renderSquare(18)}
                {this.renderSquare(19)}
                {this.renderSquare(20)}
            </div>
            <div className="board-row">
                {this.renderSquare(21)}
                {this.renderSquare(22)}
                {this.renderSquare(23)}
                {this.renderSquare(24)}
                {this.renderSquare(25)}
                {this.renderSquare(26)}
                {this.renderSquare(27)}
            </div>
            <div className="board-row">
                {this.renderSquare(28)}
                {this.renderSquare(29)}
                {this.renderSquare(30)}
                {this.renderSquare(31)}
                {this.renderSquare(32)}
                {this.renderSquare(33)}
                {this.renderSquare(34)}
            </div>
            <div className="board-row">
                {this.renderSquare(35)}
                {this.renderSquare(36)}
                {this.renderSquare(37)}
                {this.renderSquare(38)}
                {this.renderSquare(39)}
                {this.renderSquare(40)}
                {this.renderSquare(41)}
            </div>
            </div>
        );
   }
   
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        var wide = 7;
        var high = 6;
        var numOfSquares = wide * high;
        this.state = {
            history: [
            {
                squares: Array(numOfSquares).fill(null)
            }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    timeMachine() {
        
    }
  
    handleClick(i) {
        console.log("No. "+i+" was clicked.");
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)) {
            console.log("game finished. someone has won.")
            return;
        }

        var columnSelected = (i%7)+35;
        if(squares[columnSelected] == null)
            squares[columnSelected] = this.state.xIsNext ? "X" : "O";
        else {
            while(columnSelected>=0) {
                columnSelected -= 7;
                if(squares[columnSelected] == null) {
                    squares[columnSelected] = this.state.xIsNext ? "X" : "O";
                    break;
                }
            }
        }

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            row: i%6,
            col: i%7
        });
    }
  
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
  
    boldFont() {
        var currMove = document.getElementsById("move");
        currMove.classList.remove("bold-font");
        var element = document.getElementsById("move");
        element.classList.add("");
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
    
        let row = this.state.row;
        let col = this.state.col;
        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move + "(" + row + ", " + col + ")":
            'Go to game start';
            return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
            );
        });
  
        let status;
        if (winner) {
            if(winner === "Game tied.") {
                status = winner;
            } else {
                status = "Winner: " + winner;
            }
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
  
        return (
            <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <button onClick={() => this.timeMachine()}>Switch Order for Time Machine (Ascending/Descending)</button>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
ReactDOM.render(<Game />, document.getElementById("root"));

/*
1. 7 directions to check: 
左上      右上
左    i    右
左下  下  右下
2. if selectedColumn is less than 3, then check right, 左上，左，左下 don't need to be checked
3. if selectedColumn is greater than 3, then chekc left, 右下，右，右上 don't need to be checked
4. if i is >= 21, then 左下，下，右下 don't need to be checked
*/
function calculateWinner(squares) {
    var victory = false;
    var winner = false;
    var boardIsNotFilled = false;
    var victorySquares = [];

    for(var j = 41; j>=0; j--) {
        let firstSquare = squares[j];
        let selectedColumn = (j%7);

        if(firstSquare === null) {
            boardIsNotFilled = true;
        }

        if(selectedColumn>=3) {
            // left
            let secondSquare = squares[j-1];
            let thirdSquare = squares[j-2];
            let fourthSquare = squares[j-3];
            let topIsNull = false;
            if((secondSquare === null) || (thirdSquare) === null || (fourthSquare === null)) {
                topIsNull = true;
            }
            if((topIsNull === false) && (secondSquare === firstSquare) && (thirdSquare === firstSquare) && (fourthSquare === firstSquare)) {
                victory = true;
                winner = firstSquare;
                victorySquares.push(j, j-1, j-2, j-3);
            }
            console.log(squares);
        }

        if(j<21) {
            if(selectedColumn>=3) {
                // bottom left
                let secondSquare = squares[j+6];
                let thirdSquare = squares[j+12];
                let fourthSquare = squares[j+18];
                let topIsNull = false;
                if((secondSquare === null) || (thirdSquare) === null || (fourthSquare === null)) {
                    topIsNull = true;
                }
                if((topIsNull === false) && (secondSquare === firstSquare) && (thirdSquare === firstSquare) && (fourthSquare === firstSquare)) {
                    victory = true;
                    winner = firstSquare;
                    victorySquares.push(j, j+6, j+12, j+18);
                }
            }
        } else {
            // top
            let secondSquare = squares[j-7];
            let thirdSquare = squares[j-14];
            let fourthSquare = squares[j-21];
            let topIsNull = false;
            if((secondSquare === null) || (thirdSquare) === null || (fourthSquare === null)) {
                topIsNull = true;
            }
            if((topIsNull === false) && (secondSquare === firstSquare) && (thirdSquare === firstSquare) && (fourthSquare === firstSquare)) {
                victory = true;
                winner = firstSquare;
                victorySquares.push(j, j-7, j-14, j-21);
            }

            // top left
            if(selectedColumn>=3) {
                let secondSquare = squares[j-8];
                let thirdSquare = squares[j-16];
                let fourthSquare = squares[j-24];
                let topIsNull = false;
                if((secondSquare === null) || (thirdSquare) === null || (fourthSquare === null)) {
                    topIsNull = true;
                }
                if((topIsNull === false) && (secondSquare === firstSquare) && (thirdSquare === firstSquare) && (fourthSquare === firstSquare)) {
                    victory = true;
                    winner = firstSquare;
                    victorySquares.push(j, j-8, j-16, j-24);
                }
            }
        } // end of else

        /*
        if(victory === true) {
            console.log("Game finished. Player " + winner + " has won.");
            let squares = document.querySelectorAll("orderNumber");
            var squaresArray = [].slice.call(squares);
            for(let p=0; p<4; p++) {
                let indexNum = victorySquares[p];
                for(let m=0; m<squaresArray.length; m++) {
                    if(squaresArray[m].orderNumber === indexNum){
                        let element = squaresArray[m];
                    console.log("indexNum = "+indexNum);
                    console.log(element);
                    element.classList.add("victory-squares");
                    }
                }
            }
            return winner;
        }
        */

        if(victory === true) {
            console.log("Game finished. Player " + winner + " has won.");
            return winner;
        }

    } // end of for loop

    if(boardIsNotFilled !== true) {
        console.log("Game tied.");
        winner = "Game tied."
        return winner
    }

    return false;
}