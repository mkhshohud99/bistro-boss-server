const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



//midlewere
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9y2qe6z.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("bistroDb").collection("users");
        const menuCollection = client.db("bistroDb").collection("menu");
        const reviewCollection = client.db("bistroDb").collection("reviews");
        const cartCollection = client.db("bistroDb").collection("carts");

        //user related api
        app.get('/users', async(req,res)=>{
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.post('/users', async(req,res) => {
            const user = req.body;
            const quary = {email : user.email};
            const existingUser = await usersCollection.findOne(quary);
            if(existingUser){
                return res.send({message : 'User Already Exist'})
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        //menu related apis
        app.get('/menu', async(req,res)=>{
            const result = await menuCollection.find().toArray();
            res.send(result)
        })

        //review related apis
        app.get('/review', async(req,res)=>{
            const result = await reviewCollection.find().toArray();
            res.send(result)
        })

        //cart collections api
        app.get('/carts', async(req,res)=>{
            const email = req.query.email;
            if(!email){
                res.send([]);
            }
            const quary = {email : email};
            const result = await cartCollection.find(quary).toArray();
            res.send(result);
        });
        app.post('/carts', async(req,res)=>{
            const item= req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        });

        app.delete('/carts/:id', async(req, res)=>{
            const id = req.params.id;
            const quary = {_id : new ObjectId(id)};
            const result = await cartCollection.deleteOne(quary);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Boss is SHOUTING')
})

app.listen(port, () => {
    console.log(`Boss is SHOUTING on port ${port}`)
})