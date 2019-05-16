const geoCodeApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
const geoCodeApiKey = 'a79f57d2a77e4fd7a5022bc1023ba585'
const mountainProjectUrl = 'https://www.mountainproject.com/data/get-routes-for-lat-lon';
const mountainProjectsKey = '200466049-f8c171f382cea89355d4df08f9176c10';

function geoCodeQueryString(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getGeoCodeResults() {
    // get coordinates for search address provided and feeds it to the Data API
    const searchValue = $('#searchInput').val();
    const params = {
        q: searchValue,
        key: geoCodeApiKey,
    };
    queryString = geoCodeQueryString(params);
    const url = geoCodeApiUrl + '?' + queryString;
    $.ajax({
        url: url,
        type: 'Get',
        cors: true,
        dataType: 'jsonp',
        'success': function(data) {
            const latitude = data.results[0].geometry.lat;
            const longitude = data.results[0].geometry.lng;
            getMountainProjectResults(latitude, longitude);},
        'error': (error => {
            $('.errorMessage').text(`Something went wrong: ${error.message}`);
        })
    });
}

function mountainProjectQueryString(params){
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getMountainProjectResults(latitude, longitude) {
    // Takes coordinates and returns relevant results
    const params= {
        key: mountainProjectsKey,
        lat: latitude,
        lon: longitude,
        maxDistance: `${$('#maxDistance').val()}`,
        minDiff: `${$('#minDiff').val()}`,
        maxDiff: `${$('#maxDiff').val()}`
    };
    queryString = mountainProjectQueryString(params);
    const url = mountainProjectUrl + '?' + queryString;
    $.ajax({
        url: url,
        'success': function(data) {
            displayMountainProjectResults(data);},
        'error': (error => {
            $('#errorMessage').text(`Something went wrong: ${error.message}`)
        })
    });
}

function displayMountainProjectResults(data) {
    // Takes resulting array and displayes relevant information.
    $('form').slideUp();
    $('button').addClass('newSearchButton');
    $('.newSearchButton').slideDown();
    $('body').addClass('resultsBody');
    if (data.routes.length <= 0) {
        $('#errorMessage').addClass('display');
        $('#errorMessage').append('No results found, try again.')
    } else if (data.routes.length > 0) {
      for (let i = 0; i < data.routes.length; i++) {
        $('#results').append(
        `<div class='results'>
         <h2 id='name'>${data.routes[i].name}</h2><br>
         <img id='img' src=${data.routes[i].imgSmallMed} alt='Photo of climbing route.'>
         <ul id='resultsData'>
           <li class='resultsList'>Area: ${data.routes[i].location[2]}</li>
           <li class='resultsList'>Route Type: ${data.routes[i].type}</li>
           <li class='resultsList'>Difficulty Rating: ${data.routes[i].rating}</li>
           <li class='resultsList'>Number of Pitches: ${data.routes[i].pitches}</li>
           <li class='resultsList'>number of stars: ${data.routes[i].stars}</li>
           <li class='resultsList'><a href='${data.routes[i].url}'>Link to route description</a></li>
         </ul>
        </div>`
        )};
    }
}

function watchMinMax() {
    // With the Mountain Project API, when a user sets a min difficulty
    // with no max difficulty, no results are returned.
    // This function watches for user inputs in min difficulty and requires 
    //  Max difficulty if a value is provided for min difficulty.
    $('#submitButton').click(function() {
        if (document.getElementById('minDiff').value !== '') {
            $('#maxDiff').attr('required', '');
        }
    });
}

function watchNewSearchButton() {
    // full search reset so a user making a second search has the same experience
    // as a user making their first search.
    $('button').click(function() {
        $('.newsearchButton').slideUp();
        $('form').slideDown();
        $('button').removeClass('newSearchButton');
        $('body').removeClass('resultsBody');
        $('#errorMessage').removeClass('display');
        $('#maxDiff').removeAttr('required');
        $('#results').empty();
        $('#errorMessage').empty();
    });
}

function watchForm() {
    $('#searchForm').submit(event => {
        event.preventDefault();
        getGeoCodeResults();
    })
}

watchForm();
watchNewSearchButton();
watchMinMax();