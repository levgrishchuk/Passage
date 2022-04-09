import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuthClientCredientials() {    
    // create states for our variables
    const [ access_token, set_access_token ] = useState();    
    const [ expires_in, set_expires_in ] = useState();

    function fetchAccessToken(){
        // make POST request to server for spotify api data
        axios.get('/api/login').then(res => {
            // store response data in state variables
            set_access_token(res.data.access_token);            
            set_expires_in(res.data.expires_in);
            // clear code from url
            window.history.pushState({}, null, '/');
        })
        .catch(() => {            
            alert("error with setting up preview")
        })
    }

    // update state variables everytime url code from spotify changes
    useEffect(() => {
        fetchAccessToken()
    }, [])

    // function fetchAccessToken(){
    //     var temp
    //     axios.get('api/login').then(res => {
    //       console.log("access token")
    //       console.log(res)
    //       temp = res.data.access_token  
    //       console.log(temp)  
    //     })
    //     return temp
    //   }

    // if refreshtoken / expiresin updated (ex. user logged in again?)
    // create interval which continously sends api calls to server to update accesstoken and expiresin 60 seconds before token expires
    useEffect(() => {
        // do nothing if no refresh token / expiresin
        if(!expires_in) return
        // interval to update accesstoken / expiresin every expiresin - 60 seconds
        const refreshInterval = setInterval(() => {
            fetchAccessToken()
        }, (expires_in - 60) * 1000);

        return () => clearInterval(refreshInterval);
        
    }, [access_token]);

    return access_token;
}


