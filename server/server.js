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
        db.collection('users').updateOne({_id: doc._id}, {$set: {
          Anwesend: getRandomInt(6),
          "E-Mail-Adresse": doc["E-Mail-Adresse"].replace("COMPUTACENTER.COM", "computacenter.com")
        }});
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
      const attendees = await db.collection('users').find({Anwesend: 1}).toArray();
      // console.log("attendees:",attendees);
      const possiblePairs = getPairs(attendees);
      // console.log("possible pairs:",possiblePairs);
      let pairings = {}
      for (var j=0; j<attendees.length; j++) {
        pairings[attendees[j]["E-Mail-Adresse"]] = [];
      }
      for (var i=0; i<rounds; i++) {
        var pairsThisRound = Object.assign({}, possiblePairs);
        // console.log("Begin round "+i, pairsThisRound);
        for (var j=0; j<attendees.length; j++) {
          let pairsWithAttendee = Object.keys(pairsThisRound).filter(function(key) {
            return key.indexOf(attendees[j]["E-Mail-Adresse"]) !== -1
          });
          if (pairsWithAttendee.length === 0) {continue;};
          // console.log("Possible pairs for "+attendees[j]["E-Mail-Adresse"]+" in round "+i+": ", pairsThisRound);
          const pick = getRandomInt(pairsWithAttendee.length);
          // console.log("Pick ", pick, "from", pairsWithAttendee.length);
          const partner = await db.collection('users').findOne({"E-Mail-Adresse": pairsWithAttendee[pick].replace(attendees[j]["E-Mail-Adresse"], '')});
          // console.log("round " + i + ": " + attendees[j]["Vorname"] + " " + attendees[j]["Nachname"] + " + " + partner["Vorname"] + " " + partner["Nachname"]);
          pairings[attendees[j]["E-Mail-Adresse"]].push(partner["E-Mail-Adresse"]);
          pairings[partner["E-Mail-Adresse"]].push(attendees[j]["E-Mail-Adresse"]);
          // console.log("deleting ", pairsWithAttendee[pick], Object.keys(possiblePairs).length);
          delete possiblePairs[pairsWithAttendee[pick]];
          Object.keys(pairsThisRound).forEach((key) => {
            if (key.indexOf(attendees[j]["E-Mail-Adresse"]) !== -1 || key.indexOf(partner["E-Mail-Adresse"]) !== -1) {
              delete pairsThisRound[key];
              // console.log("possiblePairs:", Object.keys(pairsThisRound).length, Object.keys(possiblePairs).length);
            }
          });
        }
      }
      console.log(pairings);
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
  var pairings = {};
  for (var i=0; i<list.length; i++) {
    for (var j=0; j<list.length; j++) {
      if (i !== j) {
        pairings[combineSorted(list[i]["E-Mail-Adresse"], list[j]["E-Mail-Adresse"])] = 1;
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