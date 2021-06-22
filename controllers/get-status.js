// $(document).ready(function(){
//     alert("amit")
//  });

rfce

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }    

var params = getHashParams();

// stores userstatus
var userstatus;
var listCount = 1;

// let testtimer1 = setInterval(() => {
//     document.getElementById("userstatus").innerHTML = JSON.stringify(userstatus);
// }, 1000);

// for debugging purposes
// document.getElementById('myRange').oninput = function(){
//     document.getElementById('sliderOutput').innerHTML = this.value;
// }

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    token_error = params.error;

if (token_error) {
    alert('There was an error during the authentication');
} else {
    if (access_token) {
        // render oauth info
    //     oauthPlaceholder.innerHTML = oauthTemplate({
    //         access_token: access_token,
    //         refresh_token: refresh_token
    // });

    // render loggedin screen
    // document.getElementById('sync-player').addEventListener('click', function() {

    // });
    
    $('#login').hide();
    $('#loggedin').show();
    // var timer = setInterval(myTimer, 10000)    
    myTimer();
    function myTimer(){      
        console.log('timer executed')
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                market: 'CA'
            },
            success: function(response){ 
                console.log(response)
                if(response && userstatus !== undefined){                    
                    if(response.item.name !== userstatus.item.name){
                        console.log('image-executed-1')
                        document.getElementById('userstatus').innerHTML = userstatus.item.duration_ms
                        document.getElementById('image').src = userstatus.item.album.images[1].url;
                        $( "#slider-range" ).slider({max: userstatus.item.duration_ms, values: [userstatus.item.duration_ms * 1 / 3, userstatus.item.duration_ms * 2 / 3]});
                        $( "#amount" ).val( msToTime($( "#slider-range" ).slider( "values", 0 )) +
                            " - " + msToTime($( "#slider-range" ).slider( "values", 1 )));     
                    }                   
                    
                            
                } 
                   
                else{ 
                    // if there is new data and nothing is stored, update data and update page                  
                    if(response && userstatus === undefined){
                        userstatus = response; 
                        console.log('image-executed-2')
                        document.getElementById('userstatus').innerHTML = userstatus.item.duration_ms
                        document.getElementById('image').src = userstatus.item.album.images[1].url;
                        $( "#slider-range" ).slider({max: userstatus.item.duration_ms, values: [userstatus.item.duration_ms * 1 / 3, userstatus.item.duration_ms * 2 / 3]});
                        $( "#amount" ).val( msToTime($( "#slider-range" ).slider( "values", 0 )) +
                            " - " + msToTime($( "#slider-range" ).slider( "values", 1 )));                       
                        
                    }
                }     
                       
                userstatus = response;                         
            },
            error: function(error){
                console.log(error)
                alert('Error: failed to get data from Spotify');            
                clearInterval(timer)
                
            }            
        });    
    }
    
                
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
        $.ajax({
            url: '/refresh_token',
            data: {
            'refresh_token': refresh_token
            }
        }).done(function(data) {
            access_token = data.access_token;               
        });
        }, false);
    
    // toggleplayback button functionality    
    document.getElementById('toggleplayback').addEventListener('click', function() {
        // query spotify endpoint for if user's track is playing
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                market: 'CA'
            },
            success: function(response){
                if(response){
                    // if playing, pause
                    if(response.is_playing){
                        $.ajax({
                            method: 'PUT',
                            url: 'https://api.spotify.com/v1/me/player/pause',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                                }
                            });
                    }
                    else{
                        $.ajax({
                            method: 'PUT',
                            url: 'https://api.spotify.com/v1/me/player/play',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            }
                        });
                    }  
                }
                else{
                    alert('Update your state by pressing pause/play once on Spotify')
                }
                           
            
            }
        });      
    });

    document.getElementById('save').addEventListener('click', function(){
        

        // query spotify for current details
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                market: 'CA'
            },
            success: function(response){
                if(response){
                    console.log(response)
                    // update bootstrap Scrollspy (list), two step process
                    let entry = document.createElement('a')
                    // entry.setAttribute('class', 'list-group-item list-group-item-action').setAttribute('href', `#list-item-${listCount}`).innerHTML = response.name;
                    entry.setAttribute('class', 'list-group-item list-group-item-action');
                    entry.setAttribute('href', `#list-item-${listCount}`);
                    entry.innerHTML = response.item.name;
                    document.getElementById('list-tracks-titles').appendChild(entry);
                    
                    entry = document.createElement('h4');
                    entry.innerHTML = response.item.name;
                    document.getElementById('list-tracks-full').appendChild(entry);
                    entry = document.createElement('p');
                    
                    entry.innerHTML = document.getElementById('notes').value;
                    document.getElementById('list-tracks-full').appendChild(entry);

                    listCount++;
                    
                }
            }        
        });

        
    })
}    


// setInterval(() => {
//     var options = {
        
//     }
//     request.get(options, function(error, response, body){
//         console.log(body)
//     })
// }, 2500)
