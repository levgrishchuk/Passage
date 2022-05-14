import React, { useState } from 'react';
import { Container, Row, Col, FormGroup, FormControl, Form} from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import '../styles/inputPanel.css'
import Tag from "./Tag";
import { ReactComponent as PlusSign } from "../assets/plusSign.svg";

function InputPanel(props) {  
    function handleButtonClicking(e){        
        var timeout = setTimeout(() => {
            e.target.blur();            
        }, 125);
    }         
    console.log("props.tagsTray \n");     
    console.log(props.tagsTray);

    var inputPanel = 
    <div className="inputPanelItems">
        <Container className="inputPanelItems">        
            <Row className="inputPanelItems align-items-start">            
                <Col className="inputPanelItems" md="6">   
                    <label className="inputPanelItems inputPanelLabels" for="textAreaInputPanel">Notes</label>               
                    <textarea className="form-control inputPanelInput" id="textAreaInputPanel" placeholder="Enter your notes here" rows="2" value={props.notes} onChange={props.handleNotes}></textarea>
                    
                </Col>

                <Col className="inputPanelItems">
                    <label className="inputPanelItems inputPanelLabels" for="inputState">Tag</label> 
                    <div className="inputPanelItems input-group mb-3">
                        <select id="inputState" value={props.selectedTag} className="form-select inputPanelInput" onChange={props.handleTags}>                            
                            <option key="" value="DEFAULT" disabled >Choose a tag...</option>
                            {props.tagList.map((value, index) => {
                                return (<option key={index} value={value}>{value}</option>)
                            })}
                                    
                        </select>
                        <button id="submitSelectedTag"className="btn btn-outline-secondary inputPanelButton d-flex align-items-center" onClick={function(e){props.handleAddingTag(e);handleButtonClicking(e)}} ><PlusSign/></button>
                    </div>
                </Col>

                <Col className="inputPanelItems">  
                        <label className="inputPanelItems inputPanelLabels" for="customTagInputPanel">Custom Tag</label>     
                        <div className="inputPanelItems input-group mb-3">                             
                            <input type="text" id="customTagInputPanel" className="form-control inputPanelInput" label="Test" placeholder="Make a custom tag" value={props.customTag} onChange={props.handleCustomTags}/>    
                            <button id="customSubmit" className="btn btn-outline-secondary inputPanelButton plusSignButton d-flex align-items-center" onClick={function(e){props.handleAddingCustomTag(e);handleButtonClicking(e)}} ><PlusSign/></button>
                        </div>                         
                            
                </Col>
            </Row> 
            <Row className="transparentContainer">
                <Col className="transparentContainer">
                    <div className="inputPanelItems transparentContainer">
                        {props.tagsTray.length > 0
                            ? 
                            <Stack className="tagTray tagTrayInputPanel" direction="horizontal" gap={3}>
                                {props.tagsTray.map(value => {
                                    return <Tag key={value} value={value} deletable={true} handleTagDelete={props.handleTagDelete} />
                                })} 
                            </Stack> 
                            : 
                            <Stack className="tagTray tagTrayInputPanel" direction="horizontal" gap={3}>
                                <Tag  value="Sample tag" deletable={true} handleTagDelete={props.handleTagDelete} />
                            </Stack>}            
                    </div>
                </Col>
            </Row>
            
                    
        </Container>
        
        
        
    </div>
    
    return (
        inputPanel
    )
}

export default InputPanel
