const express = require('express')
const app = express()
const port = process.env.PORT || 5012;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

//username: contentProtal
//password: 44EieRZqSo8K6VPF





//middilewere

// https://redux-assigment-server.vercel.app

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://contentProtal:44EieRZqSo8K6VPF@cluster0.5mwdkvx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const contentCategories = client.db('contentManagement').collection('content');
    const allnewCategories = client.db('contentManagement').collection('allnewdata');
    const userInfo = client.db('contentManagement').collection('userinfo');


    app.get('/', (req, res) => {
        res.send('news-Content! 85741')
    })

    app.get('/content', async (req, res) => {

        const query = {
            name: 'Sohel Rana'
        }

        const result = await contentCategories.insertOne(query);
        res.send(result);
    })

    app.get('/newCategories', async (req, res) => {

        const query = {};

        const result = await contentCategories.find(query).toArray();
        res.send(result);


    })

    app.get('/allnewCategories', async (req, res) => {

        const query = {}

        const result = await allnewCategories.find(query).toArray();
        res.send(result);
    })

    app.get('/findCategories/:id', async (req, res) => {

        const id = req.params.id;
        // console.log(id)
        const query = {

            category_id: id
        }
        const result = await allnewCategories.find(query).toArray();
        res.send(result)


    })

    //post content Data

    app.post('/addtoContent', async (req, res) => {

        const content = req.body;
        const result = await allnewCategories.insertOne(content);
        res.send(result);



    })

    app.get('/specificNews/:id', async (req, res) => {

        const id = req.params.id;

        console.log(id)

        const query = {
            _id: ObjectId(id)
        }

        const result = await allnewCategories.findOne(query);

        res.send(result);

    })

    app.put('/content/update/:id', async (req, res) => {

        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const contentData = req.body;
        const options = { upsert: true };

        //console.log(contentData);

        const contentUpdate = {

            $set: {

                others_info: {
                    is_todays_pick: false,
                    is_trending: true
                },
                category_id: contentData.category_id,
                rating: {
                    number: contentData.number,
                    badge: "Excellent"
                },
                total_view: contentData.view,
                title: contentData.title,
                author: {
                    name: contentData.name,
                    published_date: contentData.date,
                    img: contentData.img

                },
                thumbnail_url: contentData.thumbnail_url,
                image_url: contentData.image_url,
                details: contentData.content
            }
        }



        const result = await allnewCategories.updateOne(filter, contentUpdate, options);
        console.log(result);
        res.send(result);





    })

    app.post('/userInfo', async (req, res) => {

        const user = req.body;
        const result = await userInfo.insertOne(user);

        res.send(result);
    })

    app.get('/allUserInfo', async (req, res) => {

        const query = {};
        const result = await userInfo.find(query).toArray();
        res.send(result);
    })


    app.delete('/allcontent/:id', async (req, res) => {

        const id = req.params.id;

        const query = { _id: ObjectId(id) }
        const result = await allnewCategories.deleteOne(query);
        console.log(result);
        res.send(result);
    })


    // app.get('/addPrice', async (req, res) => {

    //     const filter = {};
    //     const options = { upsert: true };
    //     const updateDoc = {
    //         $set: {
    //             timeSec: 1675403690603
    //         }
    //     }

    //     const result = await allnewCategories.updateMany(filter, updateDoc, options);
    //     res.send(result);

    // })


    app.get('/users/admin/:email', async (req, res) => {

        const email = req.params.email
        //console.log(email);
        const query = { email }
        const result = await userInfo.findOne(query);
        res.send({ isAdmin: result?.role === 'admin' })
    })




    app.put('/users/admin/:id', async (req, res) => {

        const id = req.params.id;
        //console.log(id);
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {

            $set: {

                role: 'admin'
            }


        }

        const result = await userInfo.updateOne(filter, updatedDoc, options);
        res.send(result);




    })
}




run().catch((error) => {
    console.log(error.message)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})