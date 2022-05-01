import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/player.css'
import { useState, useEffect } from 'react';
import { ReactComponent as PlayButton } from "../assets/playerPlay.svg";
import { ReactComponent as PauseButton } from "../assets/playerPause.svg";
import { ReactComponent as NextTrackButton } from "../assets/playerNextTrack.svg";
import { timestampFormat } from 'concurrently/src/defaults';
// import { ReactComponent as SaveButton } from "../assets/playerSave.svg";

function Player(props) {    
    // add tooltip to range
    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    console.log(props.loopTrack)
    console.log(props.isPlaying)
    

    var secondsToTime = function(duration) {
        var date = new Date(duration);

        const zeroPad = (num, places) => String(num).padStart(places, '0')
      
        return "%minutes:%seconds"
          .replace('%minutes', zeroPad(date.getMinutes(), 2))
          .replace('%seconds', zeroPad(date.getSeconds(), 2));
    }

    function handleToggleRender(){
        
        if(props.isPlaying){
            return <PauseButton onClick={props.handleTogglePlayback}/>
        }
        else if(!props.isPlaying){
            return <PlayButton onClick={props.handleTogglePlayback}/>
        }
    }
    
    return (
        <Container className='playerItems' id='controlsContainer'>                     
            <Row id='controlsRow' className="playerItems m-2">                
                <Col id='controls' className='playerItems d-flex align-items-center'>
                    <Col className='playerItems d-flex justify-content-end' md="5">
                        <button className={`playerSideButtons ${props.loopTrack == true ? "trackLooped" : ""} btn btn-outline-secondary`} onClick={props.handleLoopTrack}>Loop Segment</button>
                        {/* <h1>{props.trackDuration}</h1>  */}
                    </Col>
                    <Col className='playerItems d-flex align-items-center justify-content-center'>
                    <NextTrackButton id="playerNextTrackButtonLeft" onClick={e => props.handleTrackChange(e, "prev")}/>                        
                    {handleToggleRender()}
                    <NextTrackButton id="playerNextTrackButtonRight" onClick={e => props.handleTrackChange(e, "next")}/> 
                    </Col>
                    <Col className='playerItems d-flex justify-content-start' md="5">
                        <button className="playerSideButtons btn btn-outline-secondary" onClick={props.handleSave}>Save Segment</button>
                        {/* <h1>{props.trackDuration}</h1>  */}
                    </Col>
                    
                </Col>
                              
            </Row>
            <Row className="playerItems m-2">
                <Range className='playerItems' defaultValue={[props.sliderHandles[0], props.sliderHandles[1]]} 
                    max={props.trackDuration}
                    onChange={props.handleSliderChange}
                    tipFormatter={value => secondsToTime(value)}/>                 
            </Row>   
                             
        </Container>
        
    )
}

export default Player
