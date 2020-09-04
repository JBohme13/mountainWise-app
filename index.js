const geoCodeApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
const geoCodeApiKey = 'AIzaSyD3Roxqxj05D5um1Or-TT1QoMRJ_U0VJVU'
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
        address: searchValue,
        key: geoCodeApiKey,
    };
    const queryString = geoCodeQueryString(params);
    console.log(queryString);
    const url = geoCodeApiUrl + `?` + queryString;
    console.log(url);
    fetch(`${url}`, {
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.results.length <= 0) {
            $('form').slideUp();
            $('button').addClass('newSearchButton');
            $('.newSearchButton').slideDown();
            $('html').addClass('resultsBody');
            $('#errorMessage').addClass('display');
            $('#errorMessage').text('Something went wrong, please try again.')
        } else {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        getMountainProjectResults(latitude, longitude);
        }
    }).catch(error => {
        $('#errorMessage').addClass('display');
        $('#errorMessage').text(`Something went wrong: ${error.message}`);
    });
   /* $.ajax({
        url: url,
        type: 'Get',
        cors: true,
        dataType: 'jsonp',
        content-type: application/json
        'success': function(data) {
            if (data.results.length <= 0) {
                $('form').slideUp();
                $('button').addClass('newSearchButton');
                $('.newSearchButton').slideDown();
                $('html').addClass('resultsBody');
                $('#errorMessage').addClass('display');
                $('#errorMessage').text('Something went wrong, please try again.')
            } else {
            const latitude = data.results[0].geometry.lat;
            const longitude = data.results[0].geometry.lng;
            getMountainProjectResults(latitude, longitude);
            }
        },
        'error': (error => {
            $('#errorMessage').addClass('display');
            $('#errorMessage').text(`Something went wrong: ${error.message}`);
        })
    });*/
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
    $.ajax({
        url: url,
        'success': function(data) {
            console.log(data);
            displayMountainProjectResults(data);},
        'error': (error => {
            $('#errorMessage').addClass('display');
            $('#errorMessage').text(`Something went wrong: ${error.message}`)
        })
    });
}

function displayMountainProjectResults(data) {
    $('form').slideUp();
    $('button').addClass('newSearchButton');
    $('.newSearchButton').slideDown();
    $('html').addClass('resultsBody');
    if (data.routes.length <= 0) {
        $('#errorMessage').addClass('display');
        $('#errorMessage').append('No results found, try again.')
    } else if (data.routes.length > 0) {
      for (let i = 0; i < data.routes.length; i++) {
        if (data.routes[i].imgSmallMed !== "") {
            image = data.routes[i].imgSmallMed;
        } else if (data.routes[i].imgSmallMed === "") {
            image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8O73KMbh8PM_B2E_pRJjIhE9n7ng71l2F_DvZZ4oswQdpopiO';
        };
        $('#results').append(
        `<div class='results'>
         <h2 id='name'>${data.routes[i].name}</h2><br>
         <img id='img' src=${image} alt='Photo of climbing route.'>
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
    $('button').click(function() {
        $('.newsearchButton').slideUp();
        $('form').slideDown();
        $('button').removeClass('newSearchButton');
        $('html').removeClass('resultsBody');
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

function watchContinueButton() {
    $('#continueButton').click(event => {
        $('form').removeClass('hidden');
        $('form').slideDown();
        $('#landingPage').slideUp();
    })
}

watchForm();
watchNewSearchButton();
watchMinMax();
watchContinueButton();
$('form').addClass('hidden');