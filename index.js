const express = require('express');
const { MongoClient } = require('mongodb');

const app = new express();
app.set('view engine', 'ejs');
const url = 'mongodb+srv://seif:mydatabasepassword@cluster0.s7gamqu.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
main();

// app.post('/signup', async (req,res) => {
//   console.log(req.body);
//   const users = client.db().collection('User');
//   users.insertOne({
//     name
//   })
//   res.status(200).send('hello world');
// });

// app.get('/', async(req,res) => {
//   res.render('./views/home.ejs');
// })

app.listen(3000, () => {
  console.log('server is running on port 3000');
});

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
}