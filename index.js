const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: axios } = require("axios");
require("dotenv").config();
const port = process.env.PORT || 3000;

//alzMZJ2tS0h6ZXvg

//middleware
app.use(cors());
app.use(express.json());

//mongoDb connection
const uri =
  "mongodb+srv://homeEaseA10:alzMZJ2tS0h6ZXvg@cluster0.bmjx0p1.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// test api
app.get("/", (req, res) => {
  res.send("HomeEase backend running");
});

// mongoDB
async function run() {
  try {
    await client.connect();

    // start-------------------------------------------------------------------------------
    // database
    const database = client.db("homeEaseDB");
    // collection
    const servicesCollection = database.collection("services");

    // post services
    app.post("/services", async (req, res) => {
      const serviceData = req.body;
      const date = new Date().toLocaleString();
      serviceData.createdAt = date;
      const result = await servicesCollection.insertOne(serviceData);
      res.send(result);
    });

    // get services
    app.get("/services", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get specific user services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // update
    app.patch("/services/:id", async (req, res) => {
      const id = req.params.id;
      const updatedService = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const updateDoc = {
        $set: {
          service_name: updatedService.service_name,
          price: updatedService.price,
          description: updatedService.description,
          category: updatedService.category,
          photoURL: updatedService.photoURL,
        },
      };
      const result = await servicesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    // end---------------------------------------------------------------------------------

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// listening port
app.listen(port, () => {
  console.log(`HomeEase listening from port: ${port}`);
});
