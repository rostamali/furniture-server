const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

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
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');

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

        // get the order from ui
        app.post('/order', async (req, res)=>{
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        })

        // get specific user order
        app.get('/order/:userEmail', async (req, res)=>{
            const userEmail = req.params.userEmail;
            const query = { email: userEmail };
            const orders = orderCollection.find(query);
            const result = await orders.toArray();
            res.send(result)
        })

        // get the review from ui
        app.post('/reviews', async (req, res)=>{
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        })

        // get the new product from ui
        app.post('/product', async (req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        // delete my order
        // delete my orders
        app.delete('/order/:productId', async (req, res)=>{
            const id = req.params.productId;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        // get the new product from ui
        app.post('/users', async (req, res)=>{
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        // get the new product from ui
        app.get('/user/:userEmail', async (req, res)=>{
            const userEmail = req.params.userEmail;
            const query = { email: userEmail };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // update user
        app.put('/user/:userEmail', async (req, res)=>{
            const updateEmail = req.params.userEmail;
            const updateRole = req.body.role;
            const query = {email: updateEmail};
            const result = userCollection.findOne(query);
            if(result.role !== "admin"){
                const result = await userCollection.updateOne(
                    query, 
                    {$set:
                      {
                        role : updateRole
                      }
                    }
                );
                res.send(result);
            }
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