import React, { Component } from 'react';
import './App.css';

function Hole(props){
  return <div className="Hole"><div className={props.value}><button className="piece" /></div></div>
}

//create array of holes for each column
function Column(props){
    return <div onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

// check if player connects 4 vertically or horizontally
function checkLine(a,b,c,d) {
  return ((a !== null) && (a === b) && (a === c) && (a === d));
}

// check winner
function checkWinner(bs) {
console.log(bs);
  for (let c = 0; c < 7; c++)
      for (let r = 0; r < 4; r++)
          if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
              return bs[c][r] + ' wins!'
  for (let r = 0; r < 6; r++)
       for (let c = 0; c < 4; c++)
           if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
               return bs[c][r] + ' wins!'
  return "";
}

class Grid extends Component {
  // constructor
  constructor() {
    super();
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      playerTurn: 'Red',
      gameSelected: false,
      winner: '',
      remainingSquares: 42,
    }
  }

  //board setup
  selectedGame(){
    this.setState({
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null)),
       remainingSquares: 42,
    })
  }

  //change columns when move
  makeMove(cID){
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if (boardCopy[cID].indexOf(null) !== -1) {
      //change colour
      let newColumn = boardCopy[cID].reverse()
      newColumn[newColumn.indexOf(null)] = this.state.playerTurn
      newColumn.reverse()
      const newRemaining = this.state.remainingSquares - 1;
      //create new board
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        remainingSquares: newRemaining,
      })
      console.log(this.state.remainingSquares)
    }
  }

  //continue if no winner
  handleClick(cID) {
    if(this.state.winner === ''){
      this.makeMove(cID)
    }
  }
  
  // check for winner
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if (this.state.remainingSquares === 0) {
      alert("All holes are full");
      this.selectedGame();
    }
    if(this.state.winner !== winner){
      this.setState({winner: winner})
    }
  }

  render(){
    // put rows together
    let columns = [...Array(this.state.boardState.length)].map((x, i) => 
      <Column 
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Column>
    )

    // display winner message
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    } else {
      winnerMessageStyle = "winnerMessage"
    }

    //Play game button
    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {columns}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '') &&
          <div>
            <button className="playButton" onClick={() => this.selectedGame()}>Play Game</button>
          </div>
        }
      </div>
    )
  }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Game">
          <Grid />
        </div>
      </div>
    );
  }
}

export default App;