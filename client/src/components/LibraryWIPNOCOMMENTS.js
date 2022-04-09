// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, FormGroup, FormControl, Form, Tooltip, OverlayTrigger} from 'react-bootstrap';
// import '../styles/Library.css';
// import stockImage64x64 from '../assets/symbol_questionmark64x64.png';
// import Tag from './Tag.js';
// import Stack from 'react-bootstrap/Stack';
// import ReactDOM from 'react-dom';
// import { ReactComponent as TrackPlay } from "../assets/trackPlay.svg";
// import { ReactComponent as TrackPlaying } from "../assets/trackPlaying.svg";
// import { ReactComponent as TrackPause } from "../assets/trackPause.svg";

// function Library(props) {
//     // console.log(props.library.map(record => {
//     //     return record.trackUri.replace("spotify:track:", "");
//     // }))

//     // var arrayOfTrackIds = props.library.map(record => {
//     //     return record.trackUri.replace("spotify:track:", "");
//     // });

//     // var tracksInfo = props.getTracks(props.library.map(record => {
//     //     return record.trackUrl
//     // }))   
    
//     var [indexElement, set_index_element] = useState();
//     var indexElementType;
//     var prevButtonSelected = useRef(-1);
    
//     function handleImageSelection(images){        
//         if(images.length != 0 && images.at(-1).width == 64 && images.at(-1).height == 64){
//             return images.at(-1).url;
//         }
//         else{
//             return stockImage64x64;
//         }
//     }

//     function handleArtists(artists){
//         return artists.map(obj => {
//             return obj.name;
//         }).join(', ');

//     }

//     function handlePlayButtonClick(e, trackIndexContainer, index){
//         console.log("buttonclicked");
//         props.handleTrackClick(e, index);
//         console.log(trackIndexContainer);
//         console.log(trackIndexContainer.classList.contains("typePlay"));
//         if(trackIndexContainer.classList.contains("typePlay")){
//             trackIndexContainer.classList.replace("typePlay", "typePlayingHover");
//             if(prevButtonSelected.current != -1){
//                 var prevButtonElement = document.getElementById(`index-${prevButtonSelected.current}`);
//                 prevButtonElement.classList.replace("typePlayingNoHover", "typeNumber");
//                 ReactDOM.render(
//                     prevButtonSelected.current + 1
//                 , prevButtonElement)
//             }
//             prevButtonSelected.current = index;
//             ReactDOM.render(
//                 <TrackPause onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
//             , trackIndexContainer);
            
//         }
//         else if(trackIndexContainer.classList.contains("typePlayingHover")){
//             trackIndexContainer.classList.replace("typePlayingHover", "typePlay");
//             prevButtonSelected.current = -1;
//             ReactDOM.render(
//                 <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
//                 // <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
//             , trackIndexContainer);
            
//         }

        
        
//     }

//     function handleMouseOver(e, index){
        
//         if(e.target.classList.contains("tooltip")) {
//             handleMouseLeave(e, index);
//             console.log("here it is:");
//             console.log(e);
//         };
//     }

//     function handleMouseEnter(e, index){
//         var row = document.getElementById(`row-${index}`);
//         console.log("entered");
//         console.log(index);
//         // give a grey highlight
        
//         console.log("entered info:")
//         console.log(e);
//         console.log(e.relatedTarget);

//         row.style.background = "#2a2a2a";        
//         var nodes = row.querySelectorAll("div > div :not(.tag):not(.content)");        
//         for(var i=0; i < nodes.length; i++){
//             nodes[i].style.background = "#2a2a2a";
//         }

//         // change color of muted text
//         var nodes = row.querySelectorAll(".secondaryText");
//         for(var i=0; i < nodes.length; i++){
//             nodes[i].style.color = '#f9f9f9';                        
//         }    

//         // change index to a play button
//         var trackIndexContainer = row.querySelector(`#index-${index}`);
//         // row.innerHTML =
//         //     ``
//         if(trackIndexContainer.classList.contains("typeNumber")){
//             trackIndexContainer.classList.replace("typeNumber", "typePlay");
//             // trackIndexContainer.classList.replace("justify-content-end", "justify-content-center");
//             console.log('trackIndexContainer on hover: \n');
//             console.log(trackIndexContainer);
//             ReactDOM.render(
//                 <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
//             , trackIndexContainer);
//             console.log(trackIndexContainer);
//         }
//         else if(trackIndexContainer.classList.contains("typePlayingNoHover")){
//             trackIndexContainer.classList.replace("typePlayingNoHover", "typePlayingHover");
//             ReactDOM.render(
//                 <TrackPause onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
//             , trackIndexContainer);
//             console.log(trackIndexContainer);
//         }

        
//     }

//     function handleMouseLeave(e, index){
//         var row = document.getElementById(`row-${index}`);
//         console.log(index);
//         console.log("left");
//         console.log(e);
//         if(e.relatedTarget && (e.relatedTarget.tagName === 'svg' || e.relatedTarget.tagName === 'polygon' || e.relatedTarget.tagName === 'rect')) return
        
        
//         row.style.background = "";
//         var nodes = row.querySelectorAll("div > div, svg");        
//         for(var i=0; i < nodes.length; i++){
//             nodes[i].style.background = "";
//         }        
//         var nodes = row.querySelectorAll(".secondaryText"); 
//         for(var i=0; i < nodes.length; i++){
//             nodes[i].style.color = '#acacac';    
//         } 
//         // change index to a play button
//         var trackIndexContainer = row.querySelector(`#index-${index}`);
//         console.log(trackIndexContainer.children, trackIndexContainer.childNodes);
//         if(trackIndexContainer.classList.contains("typePlay")){
//             trackIndexContainer.classList.replace("typePlay", "typeNumber");
//             ReactDOM.render((index + 1), trackIndexContainer);    
//         }

//         else if(trackIndexContainer.classList.contains("typePlayingHover")){
//             trackIndexContainer.classList.replace("typePlayingHover", "typePlayingNoHover");
//             ReactDOM.render(
//                 <TrackPlaying />
//                 , trackIndexContainer);    
//         }
//         // if(row.classList.contains("typePlaying")){

//         // }
        
//     }
    
//     return (
//         <Container style={{margin:"1rem", background:"#121212"}}>
//             {props.library.map((record, index) => {
//                 var test = 1;
//                 return (
//                     <Row id={'row-' + index} className="align-items-center rowContent" style={{marginTop:"1rem"}}
//                     onMouseEnter={e => handleMouseEnter(e, index)}
//                     onMouseLeave={e => handleMouseLeave(e, index)}
//                     onMouseOver={e => handleMouseOver(e, index)}
//                     >
//                         <Col md="auto" className="rowContent" style={{marginRight:"0.25rem"}}>
//                             <div className="d-flex align-items-end justify-content-end genericTextContent secondaryText rowContent typeNumber indexRow" id={`index-${index}`} style={{marginLeft:"1rem", paddingRight:"1rem", marginRight:'-1rem', width:"2rem", textAlign:"right"}}>
//                                 {index + 1}  
//                             </div>
                            
//                         </Col>
//                         <Col md="auto" className="rowContent">
//                             <img src={handleImageSelection(record.trackInfo.album.images)} style={{height:"40px", width:"40px"}}/>
//                         </Col>
//                         <Col md="3" className="rowContent" style={{marginLeft:"-0.5rem"}}>
//                             <div className="genericTextContent rowContent" style={{marginBottom:"-0.25rem"}}>
//                                 {record.trackInfo.name}
//                             </div>
//                             <div className="secondaryText genericTextContent rowContent" style={{marginTop:"-0.25rem"}} >
//                                 {handleArtists(record.trackInfo.artists)}
//                             </div>                            
//                         </Col>
//                         <Col md="3" className="rowContent">
//                             <div className="secondaryText genericTextContent rowContent">
//                                 {record.trackInfo.album.name}
//                             </div>
//                         </Col>
//                         <Col md="2" className="rowContent">
//                         {/* only add tooltip if there is overflow. Implementation is rudimentary until better workaround can be found */}
//                         {record.notes.length > 37
//                         ? (
//                             <OverlayTrigger  
//                             onMouseLeave={e => handleMouseLeave(e, index)}                                  
//                                 key={index}
//                                 placement='bottom'
//                                 overlay={
//                                     <Tooltip id={`notes-${index}`}
//                                     >
//                                         {record.notes}
//                                     </Tooltip>
//                                 }>
//                                 <div className="genericTextContent rowContent">{record.notes}</div>
//                             </OverlayTrigger>        
//                         )
//                         : (
//                             <div className="genericTextContent rowContent">{record.notes}</div> 
//                         )}                                                  
                                                       
//                         </Col>
//                         <Col md="2" className="rowContent">
//                             <div className="rowContent">
//                             <OverlayTrigger                                    
//                                 key={index}
//                                 placement='bottom'
//                                 overlay={
//                                     <Tooltip id={`tags-${index}`}>
//                                         <Stack className="tagTrayLibrary" direction="horizontal" gap={3}>
//                                 {record.tags.map((tag, index) => {
//                                         return (<Tag className="tagTrayLibraryContent" key={index} value={tag} deletable={false} />)
//                                     })}
//                             </Stack>
//                                     </Tooltip>
//                                 }>
//                                 <Stack className="tagTray tagTrayLibrary" direction="horizontal" gap={3}>
//                                 {record.tags.map((tag, index) => {
//                                         return (<Tag className="tagTrayLibraryContent" key={index} value={tag} deletable={false} />)
//                                     })}
//                             </Stack>
//                             </OverlayTrigger> 
                            
                                
//                             </div>
                            
//                         </Col>
                        
//                     </Row>
//                     // <div className="d-flex align-items-center">
//                     //     <div style={{width:"2rem", textAlign:"right", margin:"1rem"}}>                            
//                     //         {index + 1}  
//                     //     </div>
//                     //     <img src={record.images.length == 3 ? record.images[2].url : "nothing"} style={{height:"64px", width:"64px", margin:"1rem"}}/>
//                     //     <div style={{margin:"1rem"}}>
//                     //         <div >
//                     //             {record.notes}
//                     //         </div>
//                     //         <div className="text-muted" >
//                     //             {record.notes}
//                     //         </div>
//                     //     </div>
//                     //     <div style={{marginLeft:"10rem", a}}>
//                     //         {record.notes}
//                     //     </div>
                        
//                     // </div>                
//                 )
//             })}
//             <TrackPlaying />
            
//         </Container>    
//     )
// }

// export default Library
