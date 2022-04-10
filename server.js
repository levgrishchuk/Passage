// dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// load .env variables into process.env
const dotenv = require('dotenv');
dotenv.config();

// start express app
var app = express();

// use cors
app.use(cors());

// bodyParser middleware
app.use(express.json());

// connect to mongodb database
db = process.env.mongoURI;
mongoose.connect(db)
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch((err) => {
        console.log(err);
    });

// use routes
// app.use('/', express.static(path.join(__dirname, '/routes')));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/refresh', require('./routes/api/refresh'));
app.use('/api/items', require('./routes/api/items'));

// if(process.env.NODE_ENV === "development"){
//     app.use("", path.join(__dirname, "routes")).use(cookieParser()).use(cors());
// }

// if(process.env.NODE_ENV === "production"){
//     app.use(path.join(__dirname, ''))
// }

// const root = path.resolve(__dirname, './client/build')

if (process.env.NODE_ENV === 'production') {
    // app.use(express.static("build"));
    //   app.get("*", (req, res) => {
    //     res.sendFile(path.resolve(__dirname,  "build", "index.html"));
    //   });
    app.use(express.static("client/build"))
  } 

// assign port number
const PORT = process.env.PORT || 8888;

// connects to port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})