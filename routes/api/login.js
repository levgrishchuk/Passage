// router dependencies
const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

router.post('/', (req, res) => {
    const code = req.body.code;
    var spotifyApi = new SpotifyWebApi({
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
        redirectUri: process.env.redirect_uri
      });
    spotifyApi.authorizationCodeGrant(code).then((data) => {
        res.json({
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token,
            expires_in: data.body.expires_in
        });
    }).catch((err) => {
        res.sendStatus(err);
    });
});

module.exports = router;


