const scopes = 'user-read-playback-state user-modify-playback-state';
const authUrl = 'https://accounts.spotify.com/authorize' +
'?response_type=code' +
'&client_id=' + process.env.REACT_APP_client_id +
(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
'&redirect_uri=' + encodeURIComponent(process.env.REACT_APP_redirect_uri);

export { authUrl };

