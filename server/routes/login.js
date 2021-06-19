const express = require('express');
const router = express.Router();
const querystring = require('querystring');

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}    

var stateKey = 'spotify_auth_state';

router.get('/', (req, res) => {
    
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'user-read-playback-state user-modify-playback-state';
    console.log(process.env.client_id);
    // authorization
    res.redirect('https://accounts.spotify.com/authorize?' +     
    querystring.stringify({
        response_type: 'code',
        client_id: process.env.client_id,
        scope: scope,
        redirect_uri: process.env.redirect_uri,
        state: state
    }));
});

module.exports = router;
