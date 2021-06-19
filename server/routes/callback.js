const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');

router.get('/', (req, res) => {
    
    // variables from request
    var stateKey = 'spotify_auth_state';
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log(req.cookies)
    console.log(state, storedState)
    console.log(state === null)
    console.log(state !== storedState)    

    if (state === null || state !== storedState) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {
        res.clearCookie(stateKey);
        var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: process.env.redirect_uri,
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
          },
          json: true
        };
    
        request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
    
            var access_token = body.access_token,
                refresh_token = body.refresh_token;
    
            var options = {
              url: 'https://api.spotify.com/v1/me',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            };
    
            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
              console.log(body);
            });
    
            // we can also pass the token to the browser to make requests from there
            res.redirect('/#' +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
              }));
          } else {
            res.redirect('/#' +
              querystring.stringify({
                error: 'invalid_token'
              }));
          }
        });
      }
});

module.exports = router;
