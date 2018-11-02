import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
// import queryString from 'query-string'


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>CCinder</h1>
          </header>
          <main className="App-main">
          <Route exact path="/" component={AdminView} />
          </main>
          <footer>
          </footer>
        </div>
      </Router>
    );
  }
}

class AdminView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfUsers:30,
      pairings: [],
      rounds: 6
    };
  }
  
  componentDidMount() {
    var userNames = Array.from(Array(this.state.numberOfUsers), (e,i)=>i+1);
    this.setState({
      userNames: userNames
    });
  }

  updateNumberOfUsers(evt) {
    var value = evt.target.value;
    var number = Number.parseInt(value, 10);
    var userNames = [];
    if (Number.isInteger(number) && number > 0) {
      userNames = Array.from(Array(number), (e,i)=>i+1);
    };
    this.setState({
      numberOfUsers: value,
      userNames: userNames
    });
    console.log("updated users", value, userNames);
  }
  
  updateRounds(evt) {
    var value = evt.target.value;
    this.setState({
      rounds: value
    });
    console.log("updated rounds", value);
  }
  
  generatePairings(rounds) {
    var self = this;
    let pairings = {};
    let pairingsHTML = [];
    const attendees = this.state.userNames;
    var possiblePairs = getPairs(attendees);

    for (let j=0; j<attendees.length; j++) {
      pairings[attendees[j]] = [];
    }
    console.log("Rounds", rounds);
    for (let i=0; i<rounds; i++) {
      var pairsThisRound = possiblePairs;
      for (let j=0; j<attendees.length; j++) {
        let pairsWithAttendee = pairsThisRound.filter((e) => { return e.indexOf(attendees[j]) !== -1 });
        if (pairsWithAttendee.length === 0) {continue;};
        const pick = getRandomInt(pairsWithAttendee.length);
        const partner = pairsWithAttendee[pick].filter((e) => { return e !== attendees[j] })[0];
        pairings[attendees[j]].push(partner);
        pairings[partner].push(attendees[j]);
        possiblePairs = possiblePairs.filter((e) => { return !(e.indexOf(attendees[j]) !== -1 && e.indexOf(partner) !== -1) });
        pairsThisRound = pairsThisRound.filter((e) => { return e.indexOf(attendees[j]) === -1 && e.indexOf(partner) === -1  });
      }
    }
    let rows = [];
    let headerRow = [];
    headerRow.push(<th key="0"></th>)
    for (let j=0; j<attendees.length; j++) {
      headerRow.push(<th key={j+1}>{attendees[j]}</th>);
    }
    rows.push(<thead key="0"><tr key="0">{headerRow}</tr></thead>);
    let bodyRows = [];
    for (let i=0; i<rounds; i++) {
      let pairs = [];
      pairs.push(<td key="0">Round {i+1}</td>);
      for (let j=0; j<attendees.length; j++) {
        pairs.push(<td key={j+1}>{pairings[attendees[j]][i]}</td>);
      }
      bodyRows.push(<tr key={i}>{pairs}</tr>);
    }
    rows.push(<tbody key="1">{bodyRows}</tbody>);
    pairingsHTML.push(<table key="0" className="pairingsTable">{rows}</table>)
    self.setState({
      pairings: pairingsHTML
    });
    
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div>
          Attendees <input type="text" value={this.state.numberOfUsers} size="2" name="rounds" onChange={evt => this.updateNumberOfUsers(evt)}></input>
          Rounds <input type="text" value={this.state.rounds} size="2" name="rounds" onChange={evt => this.updateRounds(evt)}></input>
          <button type="button" name="generatePairings" onClick={() => this.generatePairings(this.state.rounds)}>Generate Pairings</button>
        </div>
        <div>
          {this.state.pairings}
        </div>
      </div>
    );
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPairs(list) {
  let pairs= [];
  for (var i = 0; i < list.length - 1; i++) {
      for (var j = i; j < list.length - 1; j++) {
          pairs.push([list[i], list[j+1]]);
      }
  }
  return pairs;
}

export default App;
