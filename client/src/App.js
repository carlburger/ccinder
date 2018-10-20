import React, { Component } from 'react';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>CCinder</h1>
          <button type="button" name="randomizeAttendance" onClick={() => RandomizeAttendance()}>Randomize Attendance</button>
          <button type="button" name="generatePairings" onClick={() => GeneratePairings()}>Generate Pairings</button>
        </header>
        <main className="App-main">
          <AttendeeList />
        </main>
        <footer className="App-footer">
          <p>footer</p>
        </footer>
      </div>
    );
  }
}

class AttendeeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    var self = this;
    fetch(`api/users`, {
      accept: "application/json"
    }).then(res => res.json()).then(json => {
      console.log(json);
      let users = [];
      json.forEach((attendee,i) => {
        users.push(<li key={i}>{attendee.Vorname} {attendee.Nachname}, {attendee.Anwesend}</li>);
      });
      self.setState({
        users: users
      });
    });      
  }

  render() {
    console.log(this.state);
    return (
      <ul>
        {this.state.users}
      </ul>
    );
  }
}

function RandomizeAttendance() {
  fetch(`api/randomizeattendance`, {
    accept: "application/json"
  }).then(res => res.json()).then(json => {
    console.log("Randomized: ", json);
  });   
}

function GeneratePairings() {
  fetch(`api/generatepairings?rounds=3`, {
    accept: "application/json"
  }).then(res => res.json()).then(json => {
    console.log("Pairings: ",json);
  });   
}

export default App;
