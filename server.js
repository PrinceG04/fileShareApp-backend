const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const user = require('./models/user');
const path = require('path');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
const connectDB = require('./config/db');
const { application } = require('express');
// const { route } = require('./routes/files');

connectDB();
// console.log({user});

// app.use(bodyParser.urlencoded({ extended: true }));


// add cors to middleware

app.use(cors());

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    }));

app.use(express.static("public"));



// middlewares

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');


//Routes 
app.use('/api/files',require('./routes/files'));

app.use('/files',require('./routes/show'));

app.use('/files/download',require('./routes/download'))

app.get('/',(req,res)=>{
    res.send('deployed first time.');
})

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
});
