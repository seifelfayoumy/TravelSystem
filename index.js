const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = new express();
app.use(session({
  secret: 'my-secret-for-this-networks-project',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')))

const dbUrl = 'mongodb+srv://seif:mydatabasepassword@cluster0.s7gamqu.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(dbUrl);
main();

app.post('/registration', async (req, res) => {
  try {
    const users = client.db().collection('users');

    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      throw new Error('username is required');
    }
    if (!password) {
      throw new Error('password is required');
    }

    const userExists = await users.countDocuments({ username });

    if (userExists != 0) {
      throw new Error('username already exists')
    }

    await users.insertOne({
      username,
      password,
      wanttogo: []
    })

    res.render('login', {
      message: "registration was successful."
    });
  } catch (e) {
    res.render('registration', {
      message: e.message
    });
  }

});




app.post('/login', async (req, res) => {
  try {
    const users = client.db().collection('users');

    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      throw new Error('username is required');
    }
    if (!password) {
      throw new Error('password is required');
    }

    const userExists = await users.countDocuments({ username, password });

    if (userExists != 1) {
      throw new Error('wrong credentials')
    }

    req.session.username = username;
    res.redirect('/home');
  } catch (e) {
    res.render('login', {
      message: e.message
    });
  }
})

app.post('/wanttogo/:destname', async (req, res) => {
  const destName = req.params.destname;
  try {
    const users = client.db().collection('users');
    const user = await users.findOne({ username: req.session.username });

    if (!user) {
      throw new Error('please login first');
    }

    if (user.wanttogo.includes(destName)) {
      throw new Error('destination is already in your list')
    }

    await users.updateOne({ username: req.session.username }, {
      $push: { wanttogo: destName }
    })

    res.render(destName, {
      message: destName + ' was added to your want to go list successfully'
    })

  } catch (e) {
    res.render(destName, {
      message: e.message
    })
  }
})

app.post('/search', async(req,res) => {
  const search = req.body.Search;
  const desinations = ['annapurna', 'bali', 'inca', 'paris', 'rome', 'santorini'];

  const newDestinations = desinations.filter(d => d.includes(search));

  res.render('searchresults',{
    desinations: newDestinations
  })
})

app.post('/logout', async(req,res) => {
  try{
    req.session.username = null;
    res.redirect('/');
  }catch(e){
    res.redirect('/');
  }
})

app.get('/registration', async (req, res) => {
  res.render('registration', {
    message: ""
  });
})

app.get('/login', (req,res) =>{
  res.render('login', {
    message: ""
  })
})

app.get('/home', (req,res) =>{
  if(req.session.username){
    res.render('home', {
      username: req.session.username
    })
  }else{
    res.redirect('/registration')
  }

})

app.get('/', (req, res) => {
  if(req.session.username){
    res.redirect('/home');
  }else{
    res.redirect('/registration');
  }
})

app.get('/hiking', (req, res) => {
  if(req.session.username){
    res.render('hiking');
  }else{
    res.redirect('/registration');
  }
})
app.get('/cities', (req, res) => {
  if(req.session.username){
    res.render('cities');
  }else{
    res.redirect('/registration');
  }
})
app.get('/islands', (req, res) => {
  if(req.session.username){
    res.render('islands');
  }else{
    res.redirect('/registration');
  }
})
app.get('/inca', (req, res) => {
  if(req.session.username){
    res.render('inca', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/annapurna', (req, res) => {
  if(req.session.username){
    res.render('annapurna', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/paris', (req, res) => {
  if(req.session.username){
    res.render('paris', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/rome', (req, res) => {
  if(req.session.username){
    res.render('rome', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/bali', (req, res) => {
  if(req.session.username){
    res.render('bali', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/santorini', (req, res) => {
  if(req.session.username){
    res.render('santorini', {
      message: ""
    });
  }else{
    res.redirect('/registration');
  }
})
app.get('/wanttogo', async (req, res) => {
  try{
    const users = client.db().collection('users');
    const user = await users.findOne({username: req.session.username});
    res.render('wanttogo', {
      desinations: user.wanttogo
    });
  }catch(e){
    res.redirect('/');
  }
})

app.listen(3000, () => {
  console.log('server is running on port 3000');
});

async function main() {
  await client.connect();
  console.log('Connected successfully to database');
}