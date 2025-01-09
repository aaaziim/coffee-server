const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()

const port = process.env.PORT || 5000

//middleware

app.use(cors())
app.use(express.json())





const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9e8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("CoffeeShop");
    const coffeeCollection = database.collection("coffee");
    const usersCollection = database.collection("users");



    app.get("/allcoffee", async(req, res)=>{
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    })

    app.get("/coffee/:id", async(req, res)=>{
      const { id } = req.params;
      const result = await coffeeCollection.findOne({_id : new ObjectId(id)}) 
      res.send(result)
    })





    app.post("/addcoffee", async(req, res)=>{
      const result = await coffeeCollection.insertOne(req.body);
      res.send(result)
    })

 
    app.put("/coffee/:id", async(req, res)=>{
      const { id } = req.params; 
      const updatedCoffee = req.body;
      const result = await coffeeCollection.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedCoffee } 
      );
      res.send(result)
    })



    app.delete("/delete/:id", async(req, res)=>{
      const { id } = req.params;
      const result = await coffeeCollection.deleteOne({_id: new ObjectId(id)});
      res.send(result)

    })



    //USer Related Api's 
    app.post("/addusers", async(req, res)=>{
      const result = await usersCollection.insertOne(req.body);
      res.send(result)
    })














    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
  res.send('Welcome Coffee World!')
})

app.listen(port, () => {
  console.log(`Coffee Server listening on port ${port}`)
})