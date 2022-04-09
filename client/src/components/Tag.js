import React from 'react'
import '../styles/tag.css'

function Tag(props) {
    // console.log(props.value);

    if(props.deletable == true){
        return (
            <div className="tagResponsive">  
                    <span className="buttonTag" onClick={(e) => {props.handleTagDelete(e, props.value);}}>
                    {/* <svg id="buttonCircle" width="1.75rem" height="1.75rem">
                        <circle cx="50%" cy="50%" r="50%" fill="green" />                
                    </svg> */}
                        <svg className='buttonX' width="1.5rem" height="1.5rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path 
                        fillRule="evenodd" fill="white"                                         
                        d=
                        "M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"/></svg>
                
                    </span>
                    <span className="content pr-1 pb-1">{props.value}</span>
                </div>
        )
    }
    else{
        return (
            <div className="tagDisplay">  
                <span className="content secondaryText">{props.value}</span>
            </div>
        )
    }
}

export default Tag
