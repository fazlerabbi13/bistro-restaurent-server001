const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nruv7rx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const menuCollection = client.db('Bistro_Restaurent').collection('Menu');
        const cartCollection = client.db('Bistro_Restaurent').collection('Carts');

        app.get('/menu', async(req, res) =>{
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        // carts related api

        app.post('/carts', async(req,res) =>{
            const cartElements = req.body;
            const result = await cartCollection.insertOne(cartElements);
            res.send(result);
        })

        app.get('/carts', async(req,res) =>{
            const result = await cartCollection.find().toArray();
            res.send(result);
        })

        app.get('/', (req, res) => {
            res.send('Hello Bistro Restaurent')
        })

        app.listen(port, () => {
            console.log(`Bistro Restaurent running  on port ${port}`)
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
