const geoCodeApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
const geoCodeApiKey = 'a79f57d2a77e4fd7a5022bc1023ba585'
const elevationsApiUrl = 'https://maps.googleapis.com/maps/api/elevation/json';
const openElevstionUrl = 'https://api.open-elevation.com/api/v1/lookup';
const powderLinesUrl = 'http://api.powderlin.es/closest_stations';

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
        jsonp
    };
    queryString = geoCodeQueryString(params);
    const url = geoCodeApiUrl + '?' + queryString;
    console.log(url);
    fetch(url)
    .then(response => { 
        if (response.ok) {
            return response.json();
        } throw new Error(response.statusText)})
    .then(responseJson => {
        console.log(responseJson);
        const latitude = responseJson.results[0].geometry.lat;
        const longitude = responseJson.results[0].geometry.lng;
        getPowderLinesResults(latitude, longitude);
        getElevationResults(latitude, longitude);})
    .catch(error => {
        $('.errorMessage').text(`Something went wrong: ${error.message}`);
        });
}

function elevationsQueryString(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function getElevationResults(latitude, longitude) {
    const params = {
        locations: latitude + ',' + longitude,
    };
    queryString = elevationsQueryString(params);
    const url = openElevationUrl + '?' + queryString;
    console.log(url);
    fetch(url)
    .then(response => {
        if(response.ok) {
            return response.json();
        } throw new Error(response.statusText)})
    .then(responseJson => {
        console.log(responseJson);
        displayElevationsResults(responseJson);})
    .catch(error => {
        $('.errorMessage').text(`Something went wrong: ${error.message}`);
    })
}

function powderLinesQueryString(params){
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getPowderLinesResults(latitude, longitude) {
    const params= {
        lat: latitude,
        lng: longitude,
        data: true
    };
    queryString = powderLinesQueryString(params);
    const url = powderLinesUrl + '?' + queryString;
    console.log(url);
    fetch(url, {mode: 'no-cors'})
    .then(response => {
        if(response.ok) {
            return response.json();
        } throw new Error(response.statusText)})
    .then(responseJson => {
        console.log(responseJson);
        displayPowderLinesResults(responseJson);})
    .catch(error => {
        $('.errorMessage').text(`Something went wrong: ${error.message}`)
    })
}

function displayPowderLinesResults(responseJson) {
    //display results from PowderLines in new page to be selected by user
}

function displayElevationsResults(responseJson) {
    //
}

function watchForm() {
    $('#searchForm').submit(event => {
        event.preventDefault();
        getGeoCodeResults();
    })
}

watchForm();
