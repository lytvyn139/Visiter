const clientId = 'I_WISH_YOU_HAD_YOUR_API_KEY';
const clientSecret = 'I_WISH_YOU_HAD_YOUR_API_KEY';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const openWeatherKey = 'I_WISH_YOU_HAD_YOUR_API_KEY';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6"), $("#venue7"), $("#venue8")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const getVenues = async () => {
    const city = $input.val();
    const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200406`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
            console.log(`Spots: ${venues}`);
            return venues;
        }
        throw new Error('Request failed!');
    } catch (error) {
        console.log(error);
    }
}

const getForecast = async () => {
    const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(`Weather info: ${jsonResponse}`);
            return jsonResponse;
            
        }
        throw new Error('Request failed!')
    } catch (error) {
        console.log(error);
    }
}

const renderVenues = (venues) => {
    $venueDivs.forEach(($venue, index) => {
        const venue = venues[index];
        const venueIcon = venue.categories[0].icon;
        const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
        let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
        $venue.append(venueContent);
    });
    $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const createWeatherHTML = (currentDay) => {
    console.log(currentDay)
    return `<h2>${weekDays[(new Date()).getDay()]}</h2>
            <h2>Temperature: ${kelToCel(currentDay.main.temp)}&deg;C</h2>
            <h2>Condition: ${currentDay.weather[0].description}</h2>
            <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`;
}
const kelToCel = k => ((k - 273.15)).toFixed(0);


const createVenueHTML = (name, location, iconSource) => {
    return `<h2>${name}</h2>
            <img class="venueimage" src="${iconSource}"/>
            <h3>Address:</h3>
            <p>${location.address}</p>
            <p>${location.city}</p>
            <p>${location.country}</p>`;
}

const renderForecast = (day) => {
    const weatherContent = createWeatherHTML(day);
    $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDiv.empty();
    $destination.empty();
    $container.css("visibility", "visible");
    getVenues().then(venues => renderVenues(venues));
    getForecast().then(forecast => renderForecast(forecast));
    return false;
}

$submit.click(executeSearch)
