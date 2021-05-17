const express = require('express');
const app = express();
const path = require('path')

// routing for static files
app.use('/', express.static(path.join(__dirname, '../public')));
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



// connects to port
app.listen(8888, () => {
    console.log('Listening on 8888');
})