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

app.get("/api/attendees", (req, res) => {
  (async function() {
    let client;
    try {
      client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const result = await db.collection('attendees').find({}).toArray();
      res.json(result);
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