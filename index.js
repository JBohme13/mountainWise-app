const geoCodeApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
const elevationsApiUrl = 'https://maps.googleapis.com/maps/api/elevation/json';
const googleApiKey = 'AIzaSyD3Roxqxj05D5um1Or-TT1QoMRJ_U0VJVU'
const openElevstionUrl = 'https://api.open-elevation.com/api/v1/lookup';
const powderLinesUrl = 'http://api.powderlin.es/closest_stations';

function formatQueryString(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getResults() {
    const searchValue = $('#searchInput').val();
    const params = {
        address: searchValue,
        key: googleApiKey
    };
    queryString = formatQueryString(params);
    const url = geoCodeApiUrl + '?' + queryString;
    console.log(url);
    fetch(url)
      .then(response => { 
        if (response.ok) {
            return response.json();
        } throw new Error(response.statusText)})
      .then(responseJson => console.log(responseJson))
      .catch(error => {
            $('.errorMessage').text(`Something went wrong: ${error.message}`);
        });
    

}

function watchForm() {
    $('#searchForm').submit(event => {
        event.preventDefault();
        getResults();
    })
}

watchForm();