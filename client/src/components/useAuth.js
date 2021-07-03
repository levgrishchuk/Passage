import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code) {    
    // create states for our variables
    const [ access_token, set_access_token ] = useState();
    const [ refresh_token, set_refresh_token ] = useState();
    const [ expires_in, set_expires_in ] = useState();

    // update state variables everytime url code from spotify changes
    useEffect(() => {
        // make POST request to server for spotify api data
        axios.post('/api/login', {
            code
        }).then(res => {
            // store response data in state variables
            set_access_token(res.data.access_token);
            set_refresh_token(res.data.refresh_token);
            set_expires_in(res.data.expires_in);
            // clear code from url
            window.history.pushState({}, null, '/');
        })
        .catch(() => {
            // if error, redirect to login page
            window.location = '/';
        })
    }, [code])

    // if refreshtoken / expiresin updated (ex. user logged in again?)
    // create interval which continously sends api calls to server to update accesstoken and expiresin 60 seconds before token expires
    useEffect(() => {
        // do nothing if no refresh token / expiresin
        if(!refresh_token || !expires_in) return
        // interval to update accesstoken / expiresin every expiresin - 60 seconds
        const interval = setInterval(() => {
            axios.post('/api/refresh', {
                refresh_token
            }).then(res => {
                // store response data in state variables
                set_access_token(res.data.access_token);            
                set_expires_in(res.data.expires_in);
            })
        }, (expires_in - 60) * 1000);

        return () => clearInterval(interval);
        
    }, [refresh_token, expires_in]);

    return access_token;
}


