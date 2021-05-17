const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const package = require('../package.json')

const port = 8888;
const apiRoot = '/api';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/}));
app.options('*', cors());

// sample database
const db = {
    'Leo': {
        'user': 'Leo',
        'currency': 'USD',
        'balance': 100,
        'description': 'Sample account',
        'transactions': []
    }
}


const router = express.Router();
router.get('/', (req, res) => {
    res.send(`${package.description} - v${package.version}`);    
});

router.get('/accounts/:user', (req, res) => {
    const user = req.params.user;
    const account = db[user];

    if (!account) {
        return res
                .status(404);
    }
    return res.json(account);
});

// register routes
app.use(apiRoot, router);

app.listen(port, () => {
    console.log('Listening!');
});