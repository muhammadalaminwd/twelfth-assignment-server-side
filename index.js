const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require("express");
const res = require("express/lib/response");



// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjkoe.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }
      req.decoded = decoded;
      next();
      console.log(decoded);
    });
  }

async function run(){
    try{
        await client.connect();
        const mongoData = client.db('twelfth-assignment_portal')
        const partsCollection =  mongoData.collection('parts')
        const userCollection = mongoData.collection('user')
        const commentCollection = mongodb.collection("comments");
        ;

        app.get('/parts', async(req, res) => {
        const query = {};
        const cursor = partsCollection.find(query);
        const parts = await cursor.toArray();
        res.send(parts);
        })

        app.get("/comments", async (req, res) => {
          const query = {};
          const cursor = commentCollection.find(query);
          const comments = await cursor.toArray();
          res.json(comments);
        });



        app.get('/parts/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const buy = await partsCollection.findOne(query);
          console.log(id, buy);
          res.send(buy);
        });

        app.post("/comments", async (req, res) => {
          const getComments = req.body;
          const result = await commentCollection.insertOne(getComments);
          res.json(result);
        });


        app.put('/user/:email', async (req, res) => {
          const email = req.params.email;
          const user = req.body;
          const filter = { email: email };
          const options = { upsert: true };
          const updateDoc = {
            $set: user,
          };
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send({ result});
        });





  
    }
    finally{

    }

}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Assalamu Alaikum!')
})

app.listen(port, () => {
  console.log(`Twelfth Assignment app listening on port ${port}`)
})

