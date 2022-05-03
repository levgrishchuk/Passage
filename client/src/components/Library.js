import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, FormGroup, FormControl, Form, Tooltip, OverlayTrigger, Table} from 'react-bootstrap';
import '../styles/Library.css';
import stockImage64x64 from '../assets/symbol_questionmark64x64.png';
import Tag from './Tag.js';
import Stack from 'react-bootstrap/Stack';
import ReactDOM, { render } from 'react-dom';
import { ReactComponent as TrackPlay } from "../assets/trackPlay.svg";
import { ReactComponent as TrackEqualizer } from "../assets/trackPlaying.svg";
import { ReactComponent as TrackPause } from "../assets/trackPause.svg";

function Library(props) {
    // console.log(props.library.map(record => {
    //     return record.trackUri.replace("spotify:track:", "");
    // }))

    // var arrayOfTrackIds = props.library.map(record => {
    //     return record.trackUri.replace("spotify:track:", "");
    // });

    // var tracksInfo = props.getTracks(props.library.map(record => {
    //     return record.trackUrl
    // }))   
    
    var [indexElement, set_index_element] = useState();
    var indexElementType;
    var prevButtonSelected = useRef(-1);
    // var activeElements = {"play": <TrackPlay onClick={e => props.handleTrackClick(e, index)}/>,
    //  "pause": <TrackPause onClick={e => props.handleTrackClick(e, index)}/>,
    //   "equalizer": <TrackEqualizer />};    
    var hoveredRow = props.libraryState.hoveredRow;

    function handleIndexColumn(track, index){
        // var type = props.handleIndexType(track, index);
        // console.log(track);

        // console.log(`playing: ${props.isPlaying}`);
        // console.log(`track = current track: ${props.currentTrack}`);
        // console.log(track)
        // console.log(`active row: ${props.activeRow}`);

        if(props.isPlaying){
            if(track === props.currentTrack){
                if(index == props.activeRow){
                    if(hoveredRow == index){
                        return <TrackPause id="pause" onClick={e => props.handleTrackClick(index, "pause", e)}/>;
                    }
                    else{
                        return <TrackEqualizer id="equalizer" />;
                    }
                }
                else{
                    if(hoveredRow == index){
                        return <TrackPlay id="play" onClick={e => props.handleTrackClick(index, "play", e)}/>;
                    }
                    else{
                        return(
                            <div className="indexValue genericTextContent secondaryText rowContent">
                                {index + 1}
                            </div>
                        )
                        
                        
                    }
                }
            }
            else{
                if(hoveredRow == index){
                    return <TrackPlay onClick={e => props.handleTrackClick(index, "play", e)}/>;
                }
                else{
                    return(
                        <div className="indexValue genericTextContent secondaryText rowContent">
                            {index + 1}
                        </div>
                    )
                }
            }
        }
        else{
            if(hoveredRow == index){
                return <TrackPlay onClick={e => props.handleTrackClick(index, "play", e)}/>;
            }
            else{
                return(
                    <div className="indexValue genericTextContent secondaryText rowContent">
                        {index + 1}
                    </div>
                )
            }
        }
        

        // if(index == activeRow.index){
        //     if(activeRow.type === "number") return index + 1;
        //     if(activeRow.type === "play") return <TrackPlay onClick={e => props.handleTrackClick(e, index, "play")}/>;
        //     if(activeRow.type === "pause") return <TrackPause onClick={e => props.handleTrackClick(e, index, "pause")}/>;
        //     if(activeRow.type === "equalizer") return <TrackEqualizer />;
        // }       
        // return index + 1;
    }
    

    function renderLibrary(hoveredRowIndex){
        return (
            <Table responsive>
                <thead>
                    <tr >
                        <th>
                            <div style={{width:"2rem", textAlign:"right"}}>
                                #
                            </div>
                        </th>
                        <th>
                            TITLE
                        </th>
                        <th>
                            ALBUM
                        </th>
                        <th>
                            NOTES (HOVERABLE)
                        </th>
                        <th>
                            TAGS (HOVERABLE)
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {props.library.map((record, index) => {
                        var test = 1;
                        // todo: use bootstrap table instead of bootstrap grid
                        return (
                            <tr id={'row-' + index} className={`rowContent flex-nowrap ${index == hoveredRowIndex ? "hovered" : ""}`} style={{marginTop:"0.75rem", marginBottom:"0.75rem"}}
                            onMouseEnter={e => props.handleOnMouseEnter(e, index)}
                            onMouseLeave={e => props.handleOnMouseLeave(e, index)}
                            // onMouseOver={e => props.handleMouseOver(e, index)}                        
                            >
                                <td id="rowtest">
                                    <div className="d-flex align-items-end justify-content-end rowContent typeNumber indexRow" id={`index-${index}`} style={{width:"2rem", textAlign:"right"}}>
                                        {handleIndexColumn(record.trackUri, index)} 
                                    </div>
                                    
                                </td>
                                
                                <td>
                                    <div className="rowContent titleColLeft">
                                        <img src={handleImageSelection(record.trackInfo.album.images)} style={{height:"40px", width:"40px"}}/>
                                    </div>

                                    <div className="rowContent titleColRight">
                                        <div className="genericTextContent rowContent" style={{marginBottom:"-0.25rem"}}>
                                            {record.trackInfo.name}
                                        </div>
                                        <div className="secondaryText genericTextContent rowContent" style={{marginTop:"-0.25rem"}} >
                                            {handleArtists(record.trackInfo.artists)}
                                        </div>   
                                    </div>

                                </td>
                                {/* <td md="auto" className="d-flex rowContent indexCol libraryCol align-items-center">
                                    <div className="d-flex align-items-end justify-content-end rowContent typeNumber indexRow" id={`index-${index}`} style={{width:"2rem", textAlign:"right"}}>
                                        {handleIndexColumn(record.trackUri, index)} 
                                    </div>
                                    
                                </td>
                                <td md="auto" className="rowContent imageCol">
                                    <img src={handleImageSelection(record.trackInfo.album.images)} style={{height:"40px", width:"40px"}}/>
                                </td>
                                <td md="3" className="rowContent libraryCol" >
                                    <div className="genericTextContent rowContent" style={{marginBottom:"-0.25rem"}}>
                                        {record.trackInfo.name}
                                    </div>
                                    <div className="secondaryText genericTextContent rowContent" style={{marginTop:"-0.25rem"}} >
                                        {handleArtists(record.trackInfo.artists)}
                                    </div>                            
                                </td> */}
                                <td>
                                    <div className="secondaryText genericTextContent rowContent">
                                        {record.trackInfo.album.name}
                                    </div>
                                </td>
                                <td>
                                {/* only add tooltip if there is overflow. Implementation is rudimentary until better workaround can be found */}
                                {record.notes.length > 37
                                ? (
                                    <OverlayTrigger  
                                        onMouseLeave={e => handleMouseLeave(e, index)}                                  
                                        key={index}
                                        placement='bottom'
                                        overlay={
                                            <Tooltip id={`notes-${index}`}
                                            >
                                                {record.notes}
                                            </Tooltip>
                                        }>
                                        <div className="genericTextContent secondaryText rowContent">{record.notes}</div>
                                    </OverlayTrigger>        
                                )
                                : (
                                    <div className="genericTextContent secondaryText rowContent">{record.notes}</div> 
                                )}                                                  
                                                            
                                </td>
                                <td id="tagTrayCol" style={{overflowX:"auto"}}>
                                    {/* <div className="rowContent"> */}
                                    <OverlayTrigger                                    
                                        key={index}
                                        placement='bottom'
                                        overlay={
                                            <Tooltip id={`tags-${index}`}>
                                                <Stack className="tagTrayLibrary" direction="horizontal" gap={3}>
                                        {record.tags.map((tag, index) => {
                                                return (<Tag className="tagTrayLibraryContent" key={index} value={tag} deletable={false} />)
                                            })}
                                    </Stack>
                                            </Tooltip>
                                        }>
                                        <Stack className="tagTray tagTrayLibrary" direction="horizontal" gap={3}>
                                        {record.tags.map((tag, index) => {
                                                return (<Tag className="tagTrayLibraryContent" key={index} value={tag} deletable={false} />)
                                            })}
                                    </Stack>
                                    </OverlayTrigger> 
                                    
                                        
                                    {/* </div> */}
                                    
                                </td>
                                
                            </tr>
                            // <div className="d-flex align-items-center">
                            //     <div style={{width:"2rem", textAlign:"right", margin:"1rem"}}>                            
                            //         {index + 1}  
                            //     </div>
                            //     <img src={record.images.length == 3 ? record.images[2].url : "nothing"} style={{height:"64px", width:"64px", margin:"1rem"}}/>
                            //     <div style={{margin:"1rem"}}>
                            //         <div >
                            //             {record.notes}
                            //         </div>
                            //         <div className="text-muted" >
                            //             {record.notes}
                            //         </div>
                            //     </div>
                            //     <div style={{marginLeft:"10rem", a}}>
                            //         {record.notes}
                            //     </div>
                                
                            // </div>                
                        )
                    })}
                </tbody>
                

                {/* make shift border that doesn't span the whole bottom width of row above */}
                {/* <tr className="d-flex justify-content-center">
                    <td className="align-self-center" style={{border:"1px solid white", marginRight:"-2rem", marginLeft:"-2rem"}}>
                    </td>
                </tr> */}

                {/* <div className="d-flex justify-content-center headerSeparator" style={{width:"100%"}}>
                    <div style={{borderTop:"1px solid #acacac", width:"100%"}}></div>
                </div> */}

                
                
                {/* <TrackEqualizer /> */}
                
            </Table>    
        )
    }

    
    function handleImageSelection(images){        
        if(images.length != 0 && images.at(-1).width == 64 && images.at(-1).height == 64){
            return images.at(-1).url;
        }
        else{
            return stockImage64x64;
        }
    }

    function handleArtists(artists){
        return artists.map(obj => {
            return obj.name;
        }).join(', ');

    }

    function handlePlayButtonClick(e, trackIndexContainer, index){
        console.log("buttonclicked");
        props.handleTrackClick(e, index);
        console.log(trackIndexContainer);
        console.log(trackIndexContainer.classList.contains("typePlay"));
        if(trackIndexContainer.classList.contains("typePlay")){
            trackIndexContainer.classList.replace("typePlay", "typePlayingHover");
            if(prevButtonSelected.current != -1){
                var prevButtonElement = document.getElementById(`index-${prevButtonSelected.current}`);
                prevButtonElement.classList.replace("typePlayingNoHover", "typeNumber");
                ReactDOM.render(
                    prevButtonSelected.current + 1
                , prevButtonElement)
            }
            prevButtonSelected.current = index;
            ReactDOM.render(
                <TrackPause onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
            , trackIndexContainer);
            
        }
        else if(trackIndexContainer.classList.contains("typePlayingHover")){
            trackIndexContainer.classList.replace("typePlayingHover", "typePlay");
            prevButtonSelected.current = -1;
            ReactDOM.render(
                <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                // <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
            , trackIndexContainer);
            
        }

        
        
    }

    

    function handleMouseEnter(e, index){
        var row = document.getElementById(`row-${index}`);
        console.log("entered");
        console.log(index);
        // give a grey highlight
        
        console.log("entered info:")
        console.log(e);
        console.log(e.relatedTarget);

        row.style.background = "#2a2a2a";        
        var nodes = row.querySelectorAll("div > div :not(.tag):not(.content)");        
        for(var i=0; i < nodes.length; i++){
            nodes[i].style.background = "#2a2a2a";
        }

        // change color of muted text
        var nodes = row.querySelectorAll(".secondaryText");
        for(var i=0; i < nodes.length; i++){
            nodes[i].style.color = '#f9f9f9';                        
        }    

        // change index to a play button
        var trackIndexContainer = row.querySelector(`#index-${index}`);
        // row.innerHTML =
        //     ``
        if(trackIndexContainer.classList.contains("typeNumber")){
            trackIndexContainer.classList.replace("typeNumber", "typePlay");
            // trackIndexContainer.classList.replace("justify-content-end", "justify-content-center");
            console.log('trackIndexContainer on hover: \n');
            console.log(trackIndexContainer);
            ReactDOM.render(
                <TrackPlay onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
            , trackIndexContainer);
            console.log(trackIndexContainer);
        }
        else if(trackIndexContainer.classList.contains("typePlayingNoHover")){
            trackIndexContainer.classList.replace("typePlayingNoHover", "typePlayingHover");
            ReactDOM.render(
                <TrackPause onClick={e => handlePlayButtonClick(e, trackIndexContainer, index)}/>
                
            , trackIndexContainer);
            console.log(trackIndexContainer);
        }

        
    }

    function handleMouseLeave(e, index){
        var row = document.getElementById(`row-${index}`);
        console.log(index);
        console.log("left");
        console.log(e);
        if(e.relatedTarget && (e.relatedTarget.tagName === 'svg' || e.relatedTarget.tagName === 'polygon' || e.relatedTarget.tagName === 'rect')) return
        
        
        row.style.background = "";
        var nodes = row.querySelectorAll("div > div, svg");        
        for(var i=0; i < nodes.length; i++){
            nodes[i].style.background = "";
        }        
        var nodes = row.querySelectorAll(".secondaryText"); 
        for(var i=0; i < nodes.length; i++){
            nodes[i].style.color = '#acacac';    
        } 
        // change index to a play button
        var trackIndexContainer = row.querySelector(`#index-${index}`);
        console.log(trackIndexContainer.children, trackIndexContainer.childNodes);
        if(trackIndexContainer.classList.contains("typePlay")){
            trackIndexContainer.classList.replace("typePlay", "typeNumber");
            ReactDOM.render((index + 1), trackIndexContainer);    
        }

        else if(trackIndexContainer.classList.contains("typePlayingHover")){
            trackIndexContainer.classList.replace("typePlayingHover", "typePlayingNoHover");
            ReactDOM.render(
                <TrackEqualizer />
                , trackIndexContainer);    
        }
        // if(row.classList.contains("typePlaying")){

        // }
        
    }
    
    return renderLibrary(hoveredRow);
    
}

export default Library
