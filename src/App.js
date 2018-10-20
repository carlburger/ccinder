import React, { Component } from 'react';
import './App.css';
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'ccinder';
const client = new MongoClient(url);

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

  renderList(items) {
    let list = [];
    for (var i = 0; i++; items.length) {
      list.push(<li>items[i].Name</li>);
    }
    return list;
  }

  render() {
    const db = client.connect(url);
    const Collection = db.collection('attendees');
    const result = Collection.find({}).toArray();
    return (
      
      <ul>
        {this.renderList(result)}
      </ul>
    );
  }
}
export default App;
