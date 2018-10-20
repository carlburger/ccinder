const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/ccinder';
const dbName = 'ccinder';
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/users", (req, res) => {
  (async function() {
    let client;
    try {
      client = await MongoClient.connect(url, {useNewUrlParser: true});
      const db = client.db(dbName);
      const result = await db.collection('users').find({Anwesend: 1}).toArray();
      res.json(result);
    } catch (err) {
      console.log(err.stack);
    }
  
    if (client) {
      client.close();
    }
  })();
});

app.get("/api/randomizeattendance", (req,res) => {
  (async function() {
    let client;
    try {
      client = await MongoClient.connect(url, {useNewUrlParser: true});
      const db = client.db(dbName);
      const result = await db.collection('users').find({}).forEach((doc) => {
        db.collection('users').updateOne({_id: doc._id}, {$set: {Anwesend: getRandomInt(6)}});
      });
      res.json(result);
    } catch (err) {
      console.log(err.stack);
    }
  
    if (client) {
      client.close();
    }
  })();
});

app.get("/api/generatepairings", (req,res) => {
  const rounds = req.query.rounds || 6;
  (async function() {
    let client;
    try {
      client = await MongoClient.connect(url, {useNewUrlParser: true});
      const db = client.db(dbName);
      const attendees = await db.collection('users').find({Anwesend: 1}).toArray;
      let possiblePairs = getPairs(attendees);
      console.log("possible pairs:",possiblePairs);
      let pairings = {}
      for (j=0; j++; j<attendees.length) {
        const pairsWithAttendee = Object.keys(possiblePairs).filter(function(key) {
          return key.indexOf(attendees[j]) !== -1
        });
        for (i=0; i++; i<rounds) {
          const pick = getRandomInt(pairsWithAttendee.length);
          const partner = await db.collection('users').findOne({"E-Mail-Adresse": pairsWithAttendee[pick].replace(attendees[j], '')})._id;
          pairings[attendees[j]][i] = partner;
          delete possiblePairs[pairsWithAttendee[pick]];
        }
      }
      res.json(pairings);
    } catch (err) {
      console.log(err.stack);
    }
  
    if (client) {
      client.close();
    }
  })();
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPairs(list) {
  pairings = {};
  for (var i=0; i++; i<list.length) {
    for (var j=0; j++; j<list.length) {
      if (i !== j) {
        pairings[combineSorted([list[i]["E-Mail-Adresse"], list[j]["E-Mail-Adresse"]])] = 1;
      }
    }
  }
  return pairings;
}

function combineSorted(a, b) {
  if(a < b) return a+b;
  if(a > b) return b+a;
  return 0;        
}