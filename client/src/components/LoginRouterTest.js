// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from "react-router-dom";
// import visualizer from "./Visualizer";
// import '../styles/login.css';
// import { authUrl } from './spotify';
// // import { Preview } from './Preview';
// import { Container, Row, Col } from 'react-bootstrap';

// function Login() {   
    
//     useEffect(() => {
//         visualizer()
//       }, [])
    
//     return (
//         <Container id="loginContainer">
//             <canvas class="webgl" id="loginVisualizer"></canvas>
//             <div className='login'>
//                 <img alt='Spotify logo' src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png'></img>
//                 <div id="projectName">PASSAGE</div> 
//                 <Container id="loginButtonContainer" className="loginButtonContainerItems">
//                     <Row className="loginButtonContainerItems gx-5">
//                         <Col className="loginButtonContainerItems">
//                             <Row className="loginButtonContainerItems pb-3">
//                                 <Col className="loginButtonContainerItems">
//                                     <a id='loginClickLeft' href={ authUrl }>
//                                         <div className="loginButtonContainerItems d-flex justify-content-center">
//                                             <span className="loginButtonSpan2">CLICK HERE TO LOGIN WITH SPOTIFY</span>
//                                         </div>
//                                     </a>
//                                 </Col>
//                             </Row>
//                             <Row className="loginButtonContainerItems">
//                                 <Col className="loginButtonContainerItems">
//                                     <div className="loginButtonContainerItems d-flex justify-content-center">
//                                         <span className="loginButtonSpan">website features (play/pause/seek/save etc.) functional only if you have a <u className='loginUnderlines'>PREMIUM SPOTIFY ACCOUNT</u></span>
//                                     </div> 
//                                 </Col>
//                             </Row>
                            
//                         </Col>
//                         <Col className="loginButtonContainerItems">
//                             <Row className="loginButtonContainerItems pb-3">
//                                 <Col className="loginButtonContainerItems">
//                                     <Link id='loginClickRight' to='/preview'>
//                                         <div className="loginButtonContainerItems d-flex justify-content-center">
//                                             <span className="loginButtonSpan2">CLICK HERE TO VISIT A PREVIEW</span>
//                                         </div>
//                                     </Link>
//                                 </Col>
//                             </Row>
//                             <Row className="loginButtonContainerItems">
//                                 <Col className="loginButtonContainerItems">
//                                     <div className="loginButtonContainerItems d-flex justify-content-center">
//                                         <span className="loginButtonSpan">this preview has track sections already saved to your library. This is for if you <u className='loginUnderlines'>do not have a PREMIUM SPOTIFY ACCOUNT</u></span>
//                                     </div> 
//                                 </Col>
//                             </Row>
                            
//                         </Col>
//                     </Row>
                    
                    
                
//                 </Container>               
                
//             </div>
//         </Container>        
//     )

    
// }

// export default Login
