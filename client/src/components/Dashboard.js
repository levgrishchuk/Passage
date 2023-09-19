import useAuth from "./useAuth";
import visualizer from "./Visualizer";
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/dashboard.css'
import Player from './Player';
import SpotifyWebApi from "spotify-web-api-node";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InputPanel from "./InputPanel";
import Library from "./Library";
import Swal from 'sweetalert2';

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
  var [selectedRow, set_selected_row] = useState(-1);
  const [activeRow, set_active_row] = useState(-1);  
  
  const [data, set_data] = useState();
  // const [sliderHandles, set_slider_handles] = useState([Math.round(defaultTimeDuration * 1/5), Math.round(defaultTimeDuration * 2/5)]);
  const [trackUri, set_track_uri] = useState();
  // const [prevHandle, set_prev_handle] = useState(0); 
  const [loopTrack, set_loop_track] = useState(true);
  var trackLoopRef = useRef(loopTrack);
  

  useEffect(() => {
    visualizer()
    window.addEventListener('resize', onResize)
    onResize()
    Swal.fire({
      html: AppInstructions,
      background: `linear-gradient(to bottom, #423081, #121212ff 12.5rem)`,      
      didOpen: () => {
        const c = Swal.getContainer()
        c.style.background = "transparent"
        c.style.justifyContent = "left"     
        // c.style.background = ``;   
        
      }
      

    }) 
  }, [])


  let dashboard =
  <div>
    <canvas id="dashboardVisualizer" class="webgl"></canvas>  
    <Container id='dashboard'>
          <div id='top' className='py-2'>
            <Container className="transparentContainer">
              <Row className="transparentContainer">
                <Col className="transparentContainer">
                  <a href="/" class="dashboardBackButton btn btn-outline-secondary btn-info" role="button">Homepage</a>
                </Col>
              </Row>
            </Container>
          {/* {libraryState.hoveredRow} */}
          
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
          currentTrack={data?.body?.item?.uri || null}
          isPlaying={data?.body?.is_playing || null}
          activeRow={activeRow} 
          selectedRow={selectedRow}
          handleSelectRow={handleSelectRow} /></div>
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
          loopTrack={loopTrack} 
          handleEdit={handleEdit}
          handleDelete={handleDelete} /></div>            
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
        // console.log(`LENGTH: ${arrayOfTrackIds.length}`)
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
          
          .catch((error) => {            
            alert("Error with retrieving library. The Passage library has likely exceeded 50 passages, including existing previews. Will be fixed in the next version.");
            console.error(error);
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
    if(data !== undefined && data.body != null && data.body.item != null) {


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

  function onResize(){
    const dashboard = document.getElementById("dashboard")
    // set_height_test(window.innerHeight)
    dashboard.style.height = `${window.innerHeight}px`
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

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  function handleOnMouseEnter(e, index){
    if (isMobile == false){
      console.log('entered');
      set_library_state({...libraryState, hoveredRow: index});
    }
  }

  function handleOnMouseLeave(e, index){
    if (isMobile == false){
      console.log('left');
      set_library_state({...libraryState, hoveredRow: -1});
    }
  }

  function handleMouseOver(e, index){
    if (isMobile == false){
      set_library_state({...libraryState, hoveredRow: index});
    }
    
  }

  function handleSelectRow(e, index){
    if(selectedRow == -1 || index != selectedRow){
      set_selected_row(index);
    }
    else {
      set_selected_row(-1);
    }
    
  }

  function handleTrackChange(e, direction){
    var current_index = activeRow;
    clearTimeout(trackLoopTimer.current);
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
        handleTrackClick(index, action);
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
    clearTimeout(trackLoopTimer.current);
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
          uri: library[index].trackInfo.uri
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
      error => alert("Please try again. Ensure you have a Spotify Premium account, or if your Spotify client has been inactive, play something new on it to wake it up."))
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
          spotifyApi.getMe().then(data => {
            user.current = data.body.display_name;
            fetchLibrary(data, ["50b3753a7ed653a553c26c8585fc5818(preview)", data.body.display_name])
            // fetchLibrary(data, data.body.display_name)      
          })
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

  function handleEdit(e){
    // console.log(library)
    if(selectedRow == -1){
      alert("Select something from the Passage library to edit") 
      return;
    }
    console.log(!notes, tagsTray.length == 0)
    var request = {
        _id: library[selectedRow]._id,
        user: user.current,
        start: previousValues.current[0],
        finish: previousValues.current[1],
        trackUri: library[selectedRow].trackUri,
        notes: notes,
        tags: tagsTray
    }
    if(library){
      console.log(request)
      axios.post('/api/items/update', request).then(res => {
          console.log(res);
          spotifyApi.getMe().then(data => {
            user.current = data.body.display_name;
            fetchLibrary(data, ["50b3753a7ed653a553c26c8585fc5818(preview)", data.body.display_name])
            // fetchLibrary(data, data.body.display_name)      
          })
          clearDashboard();          
        })
        .catch((e) => {   
            console.log(e)         
            alert("error with editing (server error)");
        })
    }
    else{
      alert("error with editing (client error)");
    }
  }

  function handleDelete(e){
    if(selectedRow == -1){
      alert("Select something from the Passage library to edit");
      return;
    }
     
    if(library){ 
      if(library[selectedRow].user === "50b3753a7ed653a553c26c8585fc5818(preview)"){        
        alert("Previews cannot be deleted for now. On the TODO list");
      }
      else{
        axios.delete(`/api/items/${library[selectedRow]._id}`).then(res => {
          console.log(res);
          spotifyApi.getMe().then(data => {
            user.current = data.body.display_name;
            fetchLibrary(data, ["50b3753a7ed653a553c26c8585fc5818(preview)", data.body.display_name])
            set_selected_row(-1);
            // fetchLibrary(data, data.body.display_name)      
          })
          clearDashboard();          
        })
        .catch((e) => {   
            console.log(e)         
            alert("error with deleting (server error)");
        })
      }      
    }
    else{
      alert("error with deleting (client error)");
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
    clearTimeout(trackLoopTimer.current);
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      console.log(data);
      if(data.body !== null){
        var tempData = data;
        if(data.body.is_playing){
          
          spotifyApi.pause().then((res) => {
            
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
  
  const AppInstructions = `<div class="sweetAlertItems">
  <p class="sweetAlertItems">Welcome to Passage.</p>     
  <br class="sweetAlertItems">       
  <p class="sweetAlertItems">How to use:</p>
  <p class="sweetAlertItems">Step 1. Open Spotify on one of your devices (desktop app / mobile app / web player)</p>
  <p class="sweetAlertItems">Step 2. Browse and listen to songs as you normally would until you have found an interesting passage/section/riff/chorus/motif/etc... you'd like to save</p>
  <p class="sweetAlertItems">Step 3. Come back to this site, adjust the slider at the bottom of the screen to capture your passage.</p>
  <p class="sweetAlertItems">Step 4. If necessary, add a note and some tags to your entry, then press save.</p>
  <br class="sweetAlertItems">      
  <p class="sweetAlertItems">Button legend:</p>      
  <p class="sweetAlertItems">NOTE: you can select a passage from the database by clicking on it</p>      
  <p class="sweetAlertItems"><svg version="1.1" class="playerButtons playerMobileIcons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25rem" height="1.25rem" x="0px" y="0px"
  viewBox="0 0 443 443" style="enable-background:new 0 0 443 443;" xml:space="preserve">
<g>
 <path d="M321.785,38h-83.384V0H125.169v38H41.785v60h280V38z M155.169,30h53.232v8h-53.232V30z"/>
 <path d="M295.142,214.31l5.66-86.31H62.769l19.016,290h114.172c-14.861-21.067-23.602-46.746-23.602-74.43
   C172.355,274.43,226.849,217.779,295.142,214.31z"/>
 <path d="M301.785,244.141c-54.826,0-99.43,44.604-99.43,99.429S246.959,443,301.785,443s99.43-44.604,99.43-99.43
   S356.611,244.141,301.785,244.141z M355.961,376.533l-21.213,21.213l-32.963-32.963l-32.963,32.963l-21.213-21.213l32.963-32.963
   l-32.963-32.963l21.213-21.213l32.963,32.963l32.963-32.963l21.213,21.213l-32.963,32.963L355.961,376.533z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg> - Deletes the selected passage</p>
  <p class="sweetAlertItems"><svg class="playerButtons playerMobileIcons" width="1.25rem" height="1.25rem" viewBox="2 3 20 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

  <title>loop</title>
  <desc>Created with sketchtool.</desc>
  <g id="media-player" stroke="none" stroke-width="1" fill-rule="evenodd">
      <g id="loop">
          <path d="M6.8762659,15.1237341 C7.93014755,16.8486822 9.83062143,18 12,18 C14.6124377,18 16.8349158,16.3303847 17.6585886,14 L19.747965,14 C18.8598794,17.4504544 15.7276789,20 12,20 C9.28005374,20 6.87714422,18.6426044 5.43172915,16.5682708 L3,19 L3,13 L9,13 L6.8762659,15.1237341 Z M17.1245693,8.87543068 C16.0703077,7.15094618 14.1695981,6 12,6 C9.3868762,6 7.16381436,7.66961525 6.33992521,10 L4.25,10 C5.13831884,6.54954557 8.27134208,4 12,4 C14.7202162,4 17.123416,5.35695218 18.5692874,7.43071264 L21,5 L21,11 L15,11 L17.1245693,8.87543068 Z" id="Shape"></path>
      </g>
  </g>
</svg> - Loops back to the start of the passage after reaching the end of the passage instead of continuing to the end of the song</p>
  <p class="sweetAlertItems"><svg version="1.1" class="playerButtons playerMobileIcons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25rem" height="1.25rem" x="0px" y="0px"
  viewBox="0 0 49 49" style="enable-background:new 0 0 49 49;" xml:space="preserve">
<g>
 <rect x="27.5" y="5" width="6" height="10"/>
 <path d="M39.914,0H0.5v49h48V8.586L39.914,0z M10.5,2h26v16h-26V2z M39.5,47h-31V26h31V47z"/>
 <path d="M13.5,32h7c0.553,0,1-0.447,1-1s-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1S12.947,32,13.5,32z"/>
 <path d="M13.5,36h10c0.553,0,1-0.447,1-1s-0.447-1-1-1h-10c-0.553,0-1,0.447-1,1S12.947,36,13.5,36z"/>
 <path d="M26.5,36c0.27,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71s-0.11-0.521-0.29-0.71c-0.37-0.37-1.04-0.37-1.41,0
   c-0.19,0.189-0.3,0.439-0.3,0.71c0,0.27,0.109,0.52,0.29,0.71C25.979,35.89,26.229,36,26.5,36z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg> - Saves a new passage, can add notes/tags</p>
  <p class="sweetAlertItems"><svg version="1.1" class="playerButtons playerMobileIcons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.25rem" height="1.25rem" x="0px" y="0px"
  viewBox="0 0 490.273 490.273" style="enable-background:new 0 0 490.273 490.273;" xml:space="preserve">
<g>
 <g>
   <g>
     <path d="M313.548,152.387l-230.8,230.9c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l230.8-230.8
       c6.7-6.7,6.7-17.6,0-24.3C331.148,145.687,320.248,145.687,313.548,152.387z"/>
     <path d="M431.148,191.887c4.4,0,8.8-1.7,12.1-5l25.2-25.2c29.1-29.1,29.1-76.4,0-105.4l-34.4-34.4
       c-14.1-14.1-32.8-21.8-52.7-21.8c-19.9,0-38.6,7.8-52.7,21.8l-25.2,25.2c-6.7,6.7-6.7,17.6,0,24.3l115.6,115.6
       C422.348,190.187,426.748,191.887,431.148,191.887z M352.948,45.987c7.6-7.6,17.7-11.8,28.5-11.8c10.7,0,20.9,4.2,28.5,11.8
       l34.4,34.4c15.7,15.7,15.7,41.2,0,56.9l-13.2,13.2l-91.4-91.4L352.948,45.987z"/>
     <path d="M162.848,467.187l243.5-243.5c6.7-6.7,6.7-17.6,0-24.3s-17.6-6.7-24.3,0l-239.3,239.5l-105.6,14.2l14.2-105.6
       l228.6-228.6c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0l-232.6,232.8c-2.7,2.7-4.4,6.1-4.9,9.8l-18,133.6
       c-0.7,5.3,1.1,10.6,4.9,14.4c3.2,3.2,7.6,5,12.1,5c0.8,0,1.5-0.1,2.3-0.2l133.6-18
       C156.748,471.587,160.248,469.887,162.848,467.187z"/>
   </g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg> - Updates the selected passage (timing/notes/tags), will not overwrite notes or tags if new inputs are empty</p>













</div>`

  // console.log(data);
  return (
    dashboard
  )
}
export default Dashboard;
