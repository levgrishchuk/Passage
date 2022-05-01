import useAuth from "./useAuth";
import visualizer from "./Visualizer";
import { Container, Row } from 'react-bootstrap';
import '../styles/dashboard.css'
import Player from './Player';
import SpotifyWebApi from "spotify-web-api-node";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InputPanel from "./InputPanel";
import Library from "./Library";

const spotifyApi = new SpotifyWebApi({
    clientId: "a51237d57ccc4dbf9f1162c378934b9c"
  })

function Dashboard({ code }) {
  const accessToken = useAuth(code);  
  const defaultTimeDuration = 10000;
  var timeout;
  var sliderTimeOutFlag = false;
  var previousValues = useRef([Math.round(defaultTimeDuration * 1/5), Math.round(defaultTimeDuration * 2/5)]);
  var prevHandle = useRef(0);
  var timeDuration = useRef();
  var dataUpdateTimer = useRef();
  var dataUpdateRetryTimer = useRef();
  var trackLoopTimer = useRef();
  var testCount = useRef(0);
  var user = useRef();
  var indexOfSelectedTrack = useRef(-1);
  var librarySize = useRef(-1);
  
  

  // state variables for InputPanel
  var [customTag, set_custom_tag] = useState("");
  var [selectedTag, set_tag] = useState("DEFAULT");
  var [notes, set_notes] = useState();
  var [tagsTray, set_tags_tray] = useState([]);
  var [tagList, set_tagList] = useState(["epic", "ethereal", "sad", "ambient", "vocals", "drum pattern", "guitar solo", "sound design", "bass"]);
  var [library, set_library] = useState([]);
  var [trackDetails, set_track_details] = useState([]);
  var [libraryState, set_library_state] = useState({hoveredRow: -1});
  const [activeRow, set_active_row] = useState(-1);
  
  const [data, set_data] = useState();
  // const [sliderHandles, set_slider_handles] = useState([Math.round(defaultTimeDuration * 1/5), Math.round(defaultTimeDuration * 2/5)]);
  const [trackUri, set_track_uri] = useState();
  // const [prevHandle, set_prev_handle] = useState(0); 
  const [loopTrack, set_loop_track] = useState(true);
  var trackLoopRef = useRef(loopTrack);
  

  useEffect(() => {
    visualizer()
  }, [])


  let dashboard =
  <div>
    <canvas id="dashboardVisualizer" class="webgl"></canvas>  
    <Container id='dashboard'>
          <div id='top' className='py-2'>
          {/* {libraryState.hoveredRow} */}
          <a href="/" class="dashboardBackButton btn btn-outline-secondary btn-info" role="button">Homepage</a>
          </div>            
          <div id='library' className='my-2'><Library 
          library={library}
          libraryState={libraryState}
          handleTrackClick={handleTrackClick}
          handleTagDelete={handleTagDelete}
          handleOnMouseEnter={handleOnMouseEnter}
          handleOnMouseLeave={handleOnMouseLeave}
          handleMouseOver={handleMouseOver}
          handleIndexType={handleIndexType}
          currentTrack={data ? data.body.item.uri : null}
          isPlaying={data ? data.body.is_playing : null}
          activeRow={activeRow} /></div>
          <div id='inputPanel' className='my-2'><InputPanel 
          handleTags={handleTags}
          handleNotes={handleNotes}
          handleCustomTags={handleCustomTags}          
          handleAddingCustomTag={handleAddingCustomTag}
          handleAddingTag={handleAddingTag}
          notes={notes}
          customTag={customTag}
          selectedTag={selectedTag}
          tagList={tagList}
          tagsTray={tagsTray}
          handleTagDelete={handleTagDelete} /></div>
          <div id='player'><Player trackDuration={timeDuration.current !== undefined ? timeDuration.current : defaultTimeDuration} 
          handleTogglePlayback={handleTogglePlayback}     
          isPlaying={data ? data.body.is_playing : null}               
          handleSliderChange={handleSliderChange}
          handleSave={handleSave}          
          sliderHandles={previousValues.current}
          handleLoopTrack={handleLoopTrack}
          handleTrackChange={handleTrackChange}
          loopTrack={loopTrack} /></div>            
    </Container>
  </div>

  

  // update access token
  useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

  function fetchLibrary(data, username){
    console.log(username)
    axios.get('/api/items', {
      params:{
        user: username
        }
      }).then(res => {
        console.log('library: \n');
        console.log(res.data);
        
        // make array of track id's
        var arrayOfTrackIds = res.data.map(record => {
          return record.trackUri.replace("spotify:track:", "");
        });
        // console.log(arrayOfTrackIds);

        // query all track id's for info
        spotifyApi.getTracks(arrayOfTrackIds).then(tracksRes => {
          // to avoid an index out of bounds error
          if(res.data.length != tracksRes.body.tracks.length) return alert('error with fetching library, please try again');
          // create new property containing track info
          res.data.map((record, index) => {
            record.trackInfo = tracksRes.body.tracks[index];
                 
          })
          // store result
          // var tempArray = library
          // tempArray.push()
          set_library(res.data)
          librarySize.current = res.data.length;
          // console.log(res.data);
          // for debugging
          spotifyApi.getMyCurrentPlaybackState().then(data => {
              console.log(data);
              if(data.body !== null){
                set_data(data);        
              }              
            })
          // clearDataTimers();
          // updateCurrentUserState();
          })
          
          .catch(() => {            
            alert("error with retrieving library");
            // for debugging
            spotifyApi.getMyCurrentPlaybackState().then(data => {
              console.log(data);
              if(data.body !== null){
                set_data(data);        
              }              
            }) 
          })
                   
      })
      
      .catch(() => {            
          alert("error with retrieving library");
          // for debugging
          spotifyApi.getMyCurrentPlaybackState().then(data => {
            console.log(data);
            if(data.body !== null){
              set_data(data);        
            }              
          }) 
      })
  }

  // update user data
  useEffect(() => {
    if (!accessToken) return
    if (!spotifyApi) return
    spotifyApi.getMe().then(data => {
      user.current = data.body.display_name;
      fetchLibrary(data, ["50b3753a7ed653a553c26c8585fc5818(preview)", data.body.display_name])
      // fetchLibrary(data, data.body.display_name)      
    })
    // const fetchInterval = setInterval(() => {
    //   spotifyApi.getMyCurrentPlaybackState().then(data => {
    //     console.log(data);
    //     set_data(data);
    //   })
    // }, 10000);

    

    return () => clearDataTimers();
  }, [accessToken])

  useEffect(() => {    
    console.log("data updated!");
    if(data !== undefined && data.body != null) {

      


      // if no previous tracks, update handles to be in spots 1/5 and 2/5
      if(trackUri === undefined){
        previousValues.current = [Math.round(data.body.item.duration_ms * 1/5), Math.round(data.body.item.duration_ms * 2/5)];
        timeDuration.current = data.body.item.duration_ms;
        set_track_uri(data.body.item.uri);
      }
      
      // if there was a previous track, update handles to same relative position
      // condition checks that there are values in prevValues and timeDuration
      else if(trackUri !== data.body.item.uri && previousValues.current && timeDuration){
        previousValues.current = [Math.round(data.body.item.duration_ms * (previousValues.current[0] / timeDuration.current)),
         Math.round(data.body.item.duration_ms * (previousValues.current[1] / timeDuration.current))];
        timeDuration.current = data.body.item.duration_ms;
        set_track_uri(data.body.item.uri); 
      } 
    }

  }, [data]) 
  
  // function updateLibraryActiveRows(data){
  //   // guard against accessing properties on null
  //   if(!data) return;
    
  //   // determine state of 'active' rows
  //   var track = data.body.item.uri;
  //   var isPlaying = data.body.is_playing;
  //   var trackIndex = indexOfPlayingTrackInLibrary(track);
  //   var isPlayingTrackInLibrary = trackIndex != -1 && isPlaying ? 1 : 0;
  //   var isTrackRowHovered = isTrackRowHoveredFunct(trackIndex);

  //   if(!isPlayingTrackInLibrary && isTrackRowHovered){
  //     set_library_state({...libraryState, activeRow:{index:trackIndex, type:"play"}})
  //   }
  //   else if(isPlayingTrackInLibrary && isTrackRowHovered){
  //     set_library_state({...libraryState, activeRow:{index:trackIndex, type:"pause"}})
  //   }
  //   else if(isPlayingTrackInLibrary && !isTrackRowHovered){
  //     set_library_state({...libraryState, activeRow:{index:trackIndex, type:"equalizer"}})
  //   }
  //   else if(!isPlayingTrackInLibrary && !isTrackRowHovered){
  //     set_library_state({...libraryState, activeRow:{index:-1, type:"number"}})
  //   }
  // }

  useEffect(() => { 
    console.log("library:")   
    console.log(library)    
  }, [library]) 
  
  // useEffect(() => {   
  //   var index = libraryState.hoveredRow; 
  //   if(index == -1) return    
  //   var row = document.getElementById(`row-${index}`);  
  //   row.style.background = "#2a2a2a";
  // }, [libraryState.hoveredRow]) 
  

  function handleIndexType(track, index){    
    // var isPlaying = 0;
    // var trackIndex = -1;
    // if(data){
    //   isPlaying = data.body.is_playing;

    //   trackIndex = indexOfPlayingTrackInLibrary(data.body.item.uri);
    // } 
    // var isPlayingTrackInLibrary = trackIndex !== -1 && isPlaying ? 1 : 0;
    // var isTrackRowHovered = isTrackRowHoveredFunct(trackIndex);
    // if(!isPlayingTrackInLibrary && isTrackRowHovered){
    //   return "play";
    // }
    // else if(isPlayingTrackInLibrary && isTrackRowHovered){
    //   return "pause";
    // }
    // else if(isPlayingTrackInLibrary && !isTrackRowHovered){
    //   return "equalizer";
    // }
    // else if(!isPlayingTrackInLibrary && !isTrackRowHovered){
    //   return "number";
    // }
  }

  function indexOfPlayingTrackInLibrary(track){    
    var libraryTrackUris = library.map((record, index) => {return record.trackUri});
    var index = libraryTrackUris.indexOf(track);
    
    // console.log(libraryTrackUris, index);
    return index;  
  }

  function isTrackRowHoveredFunct(index){
    if(index == -1) return 0;
    return libraryState.hoveredRow == index ? 1 : 0;
  }

  function handleOnMouseEnter(e, index){
    console.log('entered');
    set_library_state({...libraryState, hoveredRow: index});
    
  }

  function handleOnMouseLeave(e, index){
    console.log('left');
    set_library_state({...libraryState, hoveredRow: -1});
    
  }

  function handleMouseOver(e, index){
    set_library_state({...libraryState, hoveredRow: index});
  }

  function handleTrackChange(e, direction){
    var current_index = activeRow;
    // determine if this is a call for next or prev track
    if(direction === "next"){
      // increment index of active row, call trackClick for new index and wrap around library size if need be      
      if(current_index + 1 < librarySize.current){ 
        console.log(current_index + 1)       
        handleTrackClick(current_index + 1, "play")
      }
      else{
        handleTrackClick(0, "play")
      }
    }
    else if(direction === "prev"){
      if(current_index - 1 < 0){
        handleTrackClick(librarySize.current - 1, "play")
      }
      else{
        handleTrackClick(current_index - 1, "play")
      }
    }

  }

  // function retryUpdateCurrentUserState(){

  // }

  function clearDataTimers(){
    clearTimeout(dataUpdateTimer.current);
    clearTimeout(dataUpdateRetryTimer.current);
  }

  // toggle the loopTrack value
  function handleLoopTrack(){
    if(loopTrack == true){
      set_loop_track(false)
      trackLoopRef.current = false
    }
    else{
      set_loop_track(true)
      trackLoopRef.current = true
    }
  }

  function startTrackSegmentLoop(e, index, action, duration) {
    trackLoopTimer.current = setTimeout(() => {
      if(trackLoopRef.current == true){
        handleTrackClick(e, index, action);
      }
      else{
        clearTimeout(trackLoopTimer.current)
      }
      
    }, duration)       
       
  }

  function updateCurrentUserState(delay=0, index=-1){   
    // return; 
    var tries = 0;
    function retryFetchUntilUpdate(){      
      if(delay > 0 && tries == 0){
        setTimeout(() => {
          spotifyApi.getMyCurrentPlaybackState().then(res => {            
            console.log(`pipeline data: `);
            console.log(res);
            if(res.body){
              // if two or more spotify requests are made too close to each other
              if(res.body.item){                
                set_data(res);
                if(index != -1) set_active_row(index); 
                console.log("main1");              
                dataUpdateTimer.current = setTimeout(updateCurrentUserState, 4000);
              }
              else{
                if(tries < 5){
                  console.log("retry1");
                  dataUpdateRetryTimer.current = setTimeout(retryFetchUntilUpdate, 250);
                }
                else{
                  dataUpdateTimer.current = setTimeout(updateCurrentUserState, 10000);
                }
                
              }
            }
            else{
              dataUpdateTimer.current = setTimeout(updateCurrentUserState, 10000);
            }

            tries++;
               
          }, error => console.log(error))
        }, delay)
      }
      else{
        spotifyApi.getMyCurrentPlaybackState().then(res => {          
          console.log(`pipeline data: `);
          console.log(res);
          if(res.body){
            // if two or more spotify requests are made too close to each other
            if(res.body.item){
              set_data(res);              
              if(index != -1) set_active_row(index);  
              console.log("main2");            
              dataUpdateTimer.current = setTimeout(updateCurrentUserState, 10000);
            }
            else{
              if(tries < 5){
                console.log("retry2");
                dataUpdateRetryTimer.current = setTimeout(retryFetchUntilUpdate, 250);
              }
              else{
                dataUpdateTimer.current = setTimeout(updateCurrentUserState, 10000);
              }
              
            }
          }
          else{
            dataUpdateTimer.current = setTimeout(updateCurrentUserState, 10000);
          }
             
        }, error => console.log(error))
      }      
    }
    retryFetchUntilUpdate();     
  }
  
  function handleTrackClick(index, action, e=null){
    indexOfSelectedTrack.current = index;
    // var elementClassList = document.getElementById(`index-${index}`).classList;
    console.log("track clicked");

    
    if(action === "play"){
      // console.log(library[index].trackInfo.album.uri)
      // console.log(library[index].trackInfo.track_number)

    //   spotifyApi.getMyCurrentPlaybackState().then(datat => {
    //     console.log("track click data: ");
    //     console.log(datat);
    //     console.log(data);
    //     if(datat && datat.body.item != null) set_data(datat);
        
    //     spotifyApi.play({
    //       context_uri: library[index].trackInfo.album.uri,
    //       offset: {
    //         position: library[index].trackInfo.track_number - 1
    //       },
    //       position_ms: library[index].start
    //     }).then(res => res, error => alert("No active device found"));
    //   }
    // )
    // updateCurrentUserState()

      spotifyApi.play({
        context_uri: library[index].trackInfo.album.uri,
        offset: {
          position: library[index].trackInfo.track_number - 1
        },
        position_ms: library[index].start
      }).then(() => {      
        timeDuration.current = library[index].trackInfo.duration_ms;
        previousValues.current = [library[index].start, library[index].finish];  

        clearTimeout(trackLoopTimer.current);        
        startTrackSegmentLoop(e, index, action, library[index].finish - library[index].start);

        clearDataTimers();        
        updateCurrentUserState(500, index);              
      },        
      error => alert("No active device found"))
      }
    else if(action === "pause"){
      set_active_row(-1);  
      handleTogglePlayback();
      clearDataTimers();
      updateCurrentUserState(500);
    }
    
  }  

  function handleAddingTag(e){
    if(selectedTag == "DEFAULT") return
    var curr_array = tagsTray.slice();
    const found = curr_array.find(element => element === selectedTag);
    if(found == undefined){
      curr_array.push(selectedTag);
      // console.log(curr_array);
      // console.log("tagList= " + tagList)
      set_tags_tray(curr_array);   
    }
    else{
      alert("tag already exists");
    }
    e.preventDefault();    
     
  }
  
  function handleAddingCustomTag(e){
    if(customTag == "") return
    var curr_array = tagsTray.slice();
    const found = curr_array.find(element => element === customTag);
    if(found == undefined){
      curr_array.push(customTag);
      console.log(curr_array);
      set_tags_tray(curr_array);   
    }
    else{
      alert("tag already exists");
    }
  } 

  function handleNotes(e){
    set_notes(e.target.value);    
  }

  function handleTags(e){
    set_tag(e.target.value);
    console.log(e.target.value);    
  }

  function handleCustomTags(e){
    set_custom_tag(e.target.value);
    console.log(e.target.value);
  }

  function updateHandles(values){    
    let result;
    // console.log(values, sliderHandles);  
    // find which handle was moved
    if(values[0] === previousValues.current[0]){
      prevHandle.current = 2;
    }
    else if(values[1] === previousValues.current[1]){
      prevHandle.current = 1;
    }

    // update state of moved handle
    if(prevHandle.current === 1){
      result = [previousValues.current[0], previousValues.current[1]];
      if(result !== undefined){
        result[0] = values[0];
        previousValues.current = result;
      }      
       // move place in song via api
       spotifyApi.seek(values[0]).then(error => {},
        e => {console.log("No active device found");});
      // return dashboard;   
    }
    else if(prevHandle.current === 2){
      // update previous values
      result = [previousValues.current[0], previousValues.current[1]];
      if(result !== undefined){
        result[1] = values[1];
        previousValues.current = result;
      }     
      // move place in song via api
      spotifyApi.seek(values[1]).then(() => {},
       e => {console.log("No active device found");});   
    } 
    // set_prev_handle(localPrevHandle);   
    console.log("seeked");
  }  

  function handleSliderChange(values){
    if(!sliderTimeOutFlag){
      sliderTimeOutFlag = true;      
      updateHandles(values);
      timeout = setTimeout(() => {
        sliderTimeOutFlag = false}, 1000);
      console.log("slider updated");
    }
    previousValues.current = values;    
  }

  function handleSave(e){
    let values = previousValues.current;
    if(data !== undefined && data.body !== null && user.current && previousValues.current && trackUri){
      axios.post('/api/items', {
        user: user.current,
        start: previousValues.current[0],
        finish: previousValues.current[1],
        trackUri: trackUri,        
        notes: notes,
        tags: tagsTray
        }).then(res => {
          console.log(res);
          clearDashboard();          
        })
        .catch(() => {            
            alert("error with saving (server error)");
        })
    }
    else{
      alert("error with saving (client error)");
    }
  }

  function handleTagDelete(e, value){
    // console.log("before " + tagsTray);
    if(value === "Sample tag") return
    var index = tagsTray.indexOf(value)
      if(index != -1){        
        var currArray = tagsTray.slice(); 
        // console.log(currArray, index);
        currArray.splice(index, 1);
        // console.log(currArray, index);
        set_tags_tray(currArray);
        // console.log("after " + tagsTray);
      }
    
  }

  function clearDashboard(){
    set_notes("");
    set_tags_tray([]);
    set_tag("DEFAULT");
    set_custom_tag("");
  }
    
  
  // // OLD APPROACH: STATE RE-RENDERS STOPPED ONCHANGE FROM FIRING
  // function handleAfterChange(values){
  //   // clearTimeout(timeout);
  // }

  // function handleBeforeChange(values){
  //   // // clear timer if one exists
  //   // console.log(timeout ? 1 : 0);
  //   // timeout && clearTimeout(timeout);
  //   // updateHandles(values);
  //   // timeout = setTimeout(() => {
  //   //   updateHandles(values);
  //   // }, 1000);  
  // }

  // // function handleSeeker(values){  
  // //   timeout && clearTimeout(timeout);
  // //   timeout = setTimeout(() => {
  // //     let localPrevHandle = 0;
  // //     let result;
  // //     console.log(values, sliderHandles);  
  // //     // find which handle was moved
  // //     if(values[0] === sliderHandles[0]){
  // //       localPrevHandle = 2;
  // //     }
  // //     else if(values[1] === sliderHandles[1]){
  // //       localPrevHandle = 1;
  // //     }
  
  // //     // update state of moved handle
  // //     if(localPrevHandle === 1){
  // //       result = [sliderHandles[0], sliderHandles[1]];
  // //       if(result !== undefined){
  // //         result[0] = values[0];
  // //         set_slider_handles(result);
  // //       }      
  // //       // return dashboard;   
  // //     }
  // //     else if(localPrevHandle === 2){
  // //       result = [sliderHandles[0], sliderHandles[1]];
  // //       if(result !== undefined){
  // //         result[1] = values[1];
  // //         set_slider_handles(result);
  // //       }      
  // //       // return dashboard;   
  // //     } 
  // //     // set_prev_handle(localPrevHandle);   
  // //   }, 1000);       
  // // }
  
  function handleTogglePlayback(e=null){
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      console.log(data);
      if(data.body !== null){
        var tempData = data;
        if(data.body.is_playing){
          spotifyApi.pause().then((res) => {
            clearTimeout(trackLoopTimer.current);
            console.log("Paused");
            tempData.body.is_playing = !tempData.body.is_playing;
            set_data(tempData);  
          }, (err) => { 
            console.log(err.statusCode);       
            alert("Please try again. Make sure you have a premium account");
          });      
          }
        else if(!data.body.is_playing) {
          spotifyApi.play().then(() => {
            console.log("Resumed");
            tempData.body.is_playing = !tempData.body.is_playing;
            set_data(tempData);
          }, (err) => {
            console.log(err.statusCode); 
            alert("Please try again. Make sure you have a premium account");
          });
        }  
      }      
      else {
        alert("No active device found, play something on a device")
      }               
    })    
  }
  

  // console.log(data);
  return (
    dashboard
  )
}
export default Dashboard;
