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
    const searchValue = $('#searchInput').val();
    const params = {
        q: searchValue,
        key: geoCodeApiKey,
    };
    queryString = geoCodeQueryString(params);
    const url = geoCodeApiUrl + '?' + queryString;
    console.log(url);
    $.ajax({
        url: url,
        type: 'Get',
        cors: true,
        dataType: 'jsonp',
        'success': function(data) {
            console.log(data);
            const latitude = data.results[0].geometry.lat;
            const longitude = data.results[0].geometry.lng;
            getMountainProjectResults(latitude, longitude);},
        'error': (error => {
            $('.errorMessage').text(`Something went wrong: ${error.message}`);
            })});
}

function mountainProjectQueryString(params){
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getMountainProjectResults(latitude, longitude) {
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
    console.log(url);
    $.ajax({
        url: url,
        'success': function(data) {
            console.log(data);
            displayMountainProjectResults(data);},
        'error': (error => {
            $('.errorMessage').text(`Something went wrong: ${error.message}`)
        })
    })
}

function displayMountainProjectResults(data) {
   // $('#results').empty();
    $('form').addClass('searchForm');
    $('button').addClass('newSearchButton');
    for (let i = 0; i < data.routes.length; i++) {
    $('#results').append(
      `<div class='results'>
         <h2>${data.routes[i].name}</h2>
         <ul>
           <li>Area: ${data.routes[i].location[2]}</li>
           <li>Route Type: ${data.routes[i].type}</li>
           <li>Difficulty Rating: ${data.routes[i].rating}</li>
           <li>Number of Pitches: ${data.routes[i].pitches}</li>
           <li>number of stars: ${data.routes[i].stars}</li>
           <li><a href='${data.routes[i].url}'>Link to route description</a></li>
         </ul>
        </div>`
    )};
}

function watchNewSearchButton() {
    $('button').click(function() {
        $('form').removeClass('searchForm');
        $('button').removeClass('newSearchButton');
        $('#results').empty();
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