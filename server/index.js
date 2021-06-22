const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

// routing for static files
// why use cookieParser?
app.use('/', express.static(path.join(__dirname, '../public'))).use(cookieParser());
// app.use('/favicon.ico', path.join(__dirname, '../assets/favicon.ico'));


// routes
// tab icon route
// app.get('/favicon.ico', (req, res) => {
//     console.log('accessed');
//     res.sendFile(path.join(__dirname, '../assets/favicon.ico'));
// })
// main route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// })
// compared to express.static()
// app.get('/assets/styles.css', (req, res) => {
//     console.log('styles accessed')
//     res.sendFile(path.join(__dirname, '../assets/styles.css'))
// })

// can I include controllers in static method up top?
app.set('view engine', 'ejs')
app.use('/login', require('./routes/login'));
app.use('/refresh_token', require('./routes/refresh_token'));
app.use('/callback', require('./routes/callback'));
app.use('/controllers', express.static(path.join(__dirname, '../controllers')));



// connects to port
app.listen(8888, () => {
    console.log('Listening on 8888');
})