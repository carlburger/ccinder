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
      </div>
    );
  }
}

class AttendeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      rounds: 4,
      filter: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    var self = this;
    fetch(`api/users`, {
      accept: "application/json"
    }).then(res => res.json()).then(json => {
      console.log(json);
      let users = [];
      json.forEach((attendee,i) => {
        users.push(<li key={i}>{attendee["E-Mail-Adresse"]}</li>);
      });
      self.setState({
        users: users,
        filteredUsers: users
      });
    });      
  }

  updateInputValue(evt) {
    this.setState({
      rounds: evt.target.value
    });
  }
  
  generatePairings(rounds) {
    var self = this;
    fetch(`api/generatepairings?rounds=`+rounds, {
      accept: "application/json"
    }).then(res => res.json()).then(json => {
      console.log(json);
      let users = [];
      Object.keys(json).forEach((key, i) => {
        let partners = [];
        json[key].forEach((e,i) => {partners.push(<li>Runde {i+1}: {e}</li>)})
        users.push(<li key={i}>{key}: <ul><li>{partners}</li></ul></li>);
      });
      self.setState({
        users: users,
        filteredUsers: users
      });
    });      
  }
  
  randomizeAttendance() {
    fetch(`api/randomizeattendance`, {
      accept: "application/json"
    }).then(res => res.json()).then(json => {
      console.log("Randomized: ", json);
      this.componentDidMount();
    });   
  }

  handleChange(event) {
    let filter = event.target.value;
    this.setState((state) => {
      return {
        filter: filter,
        filteredUsers: state.users.filter((e,i) => {
          console.log(e.props.children);
          if (typeof e.props.children == "string") {
            if (e.props.children.toLowerCase().indexOf(filter) !== -1) {return 1}
          } else {
            if (e.props.children[0].toLowerCase().indexOf(filter) !== -1) {return 1}
          }
          return 0;
        })
      }
    });
  }

  render() {
    console.log(this.state);
    return (
      <form>
        <div>
          <button type="button" name="randomizeAttendance" onClick={() => this.randomizeAttendance()}>Randomize Attendance</button>
          <button type="button" name="generatePairings" onClick={() => this.generatePairings(this.state.rounds)}>Generate Pairings</button>
          <input type="text" value={this.state.rounds} size="2" name="rounds" onChange={evt => this.updateInputValue(evt)}></input>
        </div>
        <div>
          Filter: <input type="text" size="20" value={this.state.filter} onChange={this.handleChange}></input>
        </div>
        <ul>
          {this.state.filteredUsers}
        </ul>
      </form>
    );
  }
}

export default App;
