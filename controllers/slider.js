// $( function() {
//     console.log('slider exectued')
//     $( "#slider-range" ).slider({
//       range: true,
//       min: 0,
//       max: 1000,
//       values: [ 150, 600 ],
//       slide: function( event, ui ) {
//         $( "#sliderOutput" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
//       }
//     });
//     $( "#sliderOutput" ).val($( "#slider-range" ).slider( "values", 0 ) +
//       " - " + $( "#slider-range" ).slider( "values", 1 ) );
//   } );

// formating for time interval
function pad(v, p = 2){
    return String(v).padStart(p, '0');
};

// formatting start and end times
function msToTime(s){
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}
var sliderInputCount = 0;
var amountOfRequests = 0;
var seekTimer;
var seekValue;
var continueTimer;
var startFlag = false;
$( function() {
console.log('slider exectued')
$( "#slider-range" ).slider({        
    range: true,
    min: 0,
    max: 0,
    values: [ 0, 0 ],
    slide: function( event, ui ) {      
        // console.log('sliding!')
        // make an ajax request to change position on
        seekValue = ui.values[ ui.handleIndex ];
        
        if(startFlag){
            seekTimerF();
            function seekTimerF() {
                $.ajax({
                    method: 'PUT',
                    url: 'https://api.spotify.com/v1/me/player/seek' + '?' + `position_ms=${seekValue}`,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    }             
                    
                })
                seekTimer = setTimeout(seekTimerF, 1000);                  
            
            }
            startFlag = false;
        }
        

        // console.log(sliderInputCount)
        // console.log(ui.handle)
        // console.log(JSON.stringify(ui.handle))
        // sliderInputCount = (sliderInputCount + 1) % 100;

        
    $( "#amount" ).val( msToTime(ui.values[ 0 ]) + " - " + msToTime(ui.values[ 1 ]));
    },
    change: function(event, ui) {
        console.log('changed!')
    },
    start: function(event, ui){        
        console.log('start')
        startFlag = true;       
        

        
        
    },
    stop: function(event, ui){
        console.log('stop')
        startFlag = false;
        clearTimeout(seekTimer);        
    }
    
});
$( "#amount" ).val( msToTime($( "#slider-range" ).slider( "values", 0 )) +
    " - " + msToTime($( "#slider-range" ).slider( "values", 1 )));
} );