import React, { Component } from 'react';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>CCinder</h1>
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
      attendees: []
    };
  }

  componentDidMount() {
    var self = this;
    fetch(`api/attendees`, {
      accept: "application/json"
    }).then(res => res.json()).then(json => {
      console.log(json);
      let attendees = [];
      json.forEach((attendee,i) => {
        attendees.push(<li key={i}>{attendee.Vorname} {attendee.Nachname}, {attendee.Team}</li>);
      });
      self.setState({
        attendees: attendees
      });
    });      
  }

  render() {
    console.log(this.state);
    return (
      <ul>
        {this.state.attendees}
      </ul>
    );
  }
}
export default App;
