import React, { useState, useEffect, useRef } from 'react';
import visualizer from "./Visualizer";
import '../styles/login.css';
import SpotifyLogo from "../assets/Spotify_Logo_CMYK_Green.png"
import { authUrl } from './spotify';
import { Container, Row, Col } from 'react-bootstrap';

function Login() {   
    
    useEffect(() => {
        visualizer()
      }, [])
    
    return (
        <Container id="loginContainer">
            {/* Visualizer */}
            <canvas class="webgl" id="loginVisualizer"></canvas>
            <div className='login'>
                <img alt='Spotify logo' src={SpotifyLogo}></img>
                <div id="projectName">PASSAGE</div> 
                <div className='loginButtonContainer transparentContainer'>
                    <div className='transparentContainer leftSection'>                        
                        <a id='loginClickLeft' className='transparentContainer' href={ authUrl }>
                            <div className="loginButtonSpanWrapper loginButtonContainerItems d-flex justify-content-center">
                                <span className="loginButtonSpan2">LOGIN WITH SPOTIFY</span>
                            </div>
                        </a>
                        <div className="loginButtonContainerItems d-flex justify-content-center">
                            <span className="loginButtonSpan">playback requires a <span className='loginUnderlines'>PREMIUM SPOTIFY ACCOUNT</span></span>
                        </div> 
                    </div>
                    <div className='transparentContainer rightSection'>
                        <a id='loginClickRight' className='transparentContainer' href='/?code=preview'>
                            <div className="loginButtonSpanWrapper loginButtonContainerItems d-flex justify-content-center">
                                <span className="loginButtonSpan2">VISIT PREVIEW</span>
                            </div>
                        </a>
                        <div className="loginButtonContainerItems d-flex justify-content-center">
                            <span className="loginButtonSpan">Explore the UI without Spotify functionality</span>
                        </div> 
                    </div>
                </div>
                
                {/* <Container id="loginButtonContainer" className="loginButtonContainerItems">
                    <Row className="loginButtonContainerItems gx-5">
                        <Col className="loginButtonContainerItems">
                            <Row className="loginButtonContainerItems">
                                <Col className="loginButtonContainerItems">
                                    
                                </Col>
                            </Row>
                            <Row className="loginButtonContainerItems pb-5">
                                <Col className="loginButtonContainerItems">
                                    
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col className="loginButtonContainerItems">
                            <Row className="loginButtonContainerItems">
                                <Col className="loginButtonContainerItems">
                                    
                                </Col>
                            </Row>
                            <Row className="loginButtonContainerItems">
                                <Col className="loginButtonContainerItems">
                                    
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                    
                    
                
                </Container>                */}
                
            </div>
        </Container>        
    )

    
}

export default Login
