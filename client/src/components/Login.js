import React from 'react';
import '../styles/login.css';
import { authUrl } from './spotify';
import { Container } from 'react-bootstrap';

function Login() {    
    return (
        <Container>
            <div className='login'>
                <img alt='Spotify logo' src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png'></img>
                <a href={ authUrl }>Click here to Login</a>
            </div>
        </Container>        
    )
}

export default Login
