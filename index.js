const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectID = require('mongodb').ObjectID;

// cors setup
const cors = require('cors');
app.use(cors());
app.use(express.json());

// mongoDB connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urhyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('furniture');
        const productCollection = database.collection('products');

        // send data to the UI
        app.get('/products', async (req, res)=>{
            const products = productCollection.find({}).limit(6);
            const result = await products.toArray();
            res.send(result);
        });
        // send data to the UI
        app.get('/shop', async (req, res)=>{
            const products = productCollection.find({});
            const result = await products.toArray();
            res.send(result);
        });

        // send specific data to the UI
        app.get('/purchase/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(uri);
})