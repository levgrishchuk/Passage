const express = require('express');
const request = require('request')
const router = express.Router();

router.get('/', (req, res) => {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.client_id + ':' + process.env.client_secret).toString('base64')) },
        form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
            'access_token': access_token
            });
        }
    });
});

module.exports = router;