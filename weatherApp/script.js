const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const API_NINJA_KEY = {
    method: 'GET',
    headers: { 'x-api-key': 'VfHixGlsVk/CCxbPQzM5Fw==pE0X6VDLul1SrCFI' }
}

const defaultCoordinate = { latitude: 29.94906, longitude: 76.817254 };
const defaultWeather = {
    "coord": { "lon": 76.8173, "lat": 29.9491 },
    "weather": [{ "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04d" }],
    "base": "stations",
    "main": { "temp": 30.05, "feels_like": 31.48, "temp_min": 30.05, "temp_max": 30.05, "pressure": 1006, "humidity": 70, "sea_level": 1006, "grnd_level": 978 },
    "visibility": 10000,
    "wind": { "speed": 5.7, "deg": 130, "gust": 6.14 },
    "clouds": { "all": 99 }, "dt": 1725257683,
    "sys": { "country": "IN", "sunrise": 1725237032, "sunset": 1725282881 },
    "timezone": 19800, "id": 1254657, "name": "Thānesar", "cod": 200
}

let coordinates=undefined;
const yourWeatherTab=document.querySelector("#yourWeatherTab");
const searchWeatherTab=document.querySelector("#searchWeatherTab");
let currentWeatherTab=yourWeatherTab;
const searchBar=document.querySelector(".searchBar");
const citySearchBar=document.querySelector("#citySearchBar");
const citySearchButton=document.querySelector("#citySearchButton")
const weatherCard=document.querySelector(".weatherCard");
const grantAccessCard=document.querySelector(".grantAccessCard");
const loadingCard=document.querySelector(".loadingCard");
const notFoundCard=document.querySelector(".notFoundCard");
const messageBox=document.querySelector(".messageBox");

yourWeatherTab.addEventListener("click",()=>{
    console.log("your weather tab clicked");
    if(currentWeatherTab!=yourWeatherTab){
        currentWeatherTab=yourWeatherTab;
        searchWeatherTab.classList.remove("currentWeatherTab");
        yourWeatherTab.classList.add("currentWeatherTab");
        displayLocalWeather();
    }
})

searchWeatherTab.addEventListener("click",()=>{
    console.log("search weather tab clicked");
    if(currentWeatherTab!=searchWeatherTab){
        currentWeatherTab=searchWeatherTab;
        yourWeatherTab.classList.remove("currentWeatherTab");
        searchWeatherTab.classList.add("currentWeatherTab");
        displaySearchWeather();
    }
})

async function displaySearchWeather(){
    removeAllSubTab();
    searchBar.classList.remove("invisible"); 
}

citySearchButton.addEventListener('click',async function(){
    weatherCard.classList.add("invisible");
    loadingCard.classList.remove('invisible');
    let cityCoords=await getCityCoordinate(citySearchBar.value);
        let weatherInfo= await fetchWeather(cityCoords.latitude,cityCoords.longitude,API_KEY);
        await displayWeather(weatherInfo);

})

async function displayLocalWeather(){
    searchBar.classList.add("invisible");
    if(coordinates==undefined){
        removeAllSubTab();
        grantAccessCard.classList.remove('invisible');
    }
    else{
        removeAllSubTab();
        loadingCard.classList.remove('invisible');
        let weatherInfo= await fetchWeather(coordinates.latitude,coordinates.longitude,API_KEY);
        await displayWeather(weatherInfo);
    }
}

function removeAllSubTab(){
    console.log("making all tab invisible")
    let list=document.querySelectorAll(".subCard");
    list.forEach(item => {
        item.classList.add('invisible');
    });
}


async function fetchWeather(latitude, longitude, API_KEY) {
    console.log("Fetching weather");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log("Weather data:", data);
        return data;
    }
    catch (err) {
        console.error("error in fetching. Returning default weather ");
        return defaultWeather;
    }
};

async function getCityCoordinate(city) {
    try {
        let response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=`, API_NINJA_KEY);
        const data = await response.json();
        console.log("City coordinates:", data);
        return { latitude: data[0].latitude, longitude: data[0].longitude };
    }
    catch (err) {
        console.error("error in getting coordinates of city,returning default value");
        return defaultCoordinate;
    }
}

async function getGeoLocation() {
    //Locatiion is not working currentluy in my device so
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (error) => {
                        console.log("error in geolocation");
                        reject(error);
                    }
                )
            });
            return { latitude: position.coords.latitude, longitude: position.coords.longitude }
        }
        catch (err) {
            console.error("Some issues while get geoloctaion returning default location");
            return defaultCoordinate;
        }
    }
    else {
        return defaultCoordinate;
    }
}

//showWeather(29.94906,76.817254 )
// console.log(getCityCoordinate("kurukshetra"));

console.log("terminating");


async function displayWeather(weatherInfo) {
    const cityName = document.querySelector("[cityname]");
    const countryFlag = document.querySelector("[countryFlag]");
    const weatherType = document.querySelector("[weatherType]");
    const weatherTypeImg = document.querySelector("[weatherTypeImg]");
    const temperature = document.querySelector("[temperature]");
    const windSpeed = document.querySelector("[windSpeed]");
    const humidity = document.querySelector("[Humidity]");
    const clouds = document.querySelector("[clouds]");
    const cityDate = document.querySelector("[cityDate]");
    const cityTime = document.querySelector("[cityTime]");
    
    console.log("Rendering weather info");
    console.log(weatherInfo);
    cityName.innerHTML = weatherInfo?.name;
    try {
        countryFlag.src = await `https://flagsapi.com/${weatherInfo?.sys?.country}/flat/64.png`;
        // Handle what happens if the image fails to load
        countryFlag.onerror = () => {
            console.log("Flag not fetched");
            countryFlag.alt = `${weatherInfo?.sys?.country}`;
            // countryFlag.src = ''; // Optionally clear the src if the flag doesn't load
        };
    } catch (err) {
        console.error("Unexpected error:", err);
    }
    try {
        weatherTypeImg.src =await `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        weatherTypeImg.onerror = () => {
            console.log("weather Image not fetched");
            weatherTypeImg.alt = ``;
        };
    } catch (err) {
        console.error("Unexpected error:", err);
    }
    weatherType.innerHTML = weatherInfo?.weather?.[0]?.description;
    temperature.innerHTML = `${weatherInfo?.main?.temp}°C`;
    windSpeed.innerHTML = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerHTML = `${weatherInfo?.main?.humidity}%`;
    clouds.innerHTML = `${weatherInfo?.clouds?.all}%`;
    
    const utcTime = new Date(defaultWeather.dt * 1000);
    const localTime = new Date(utcTime.getTime() + (defaultWeather.timezone * 1000));
    cityDate.innerHTML = localTime.toLocaleDateString(); 
    cityTime.innerHTML = localTime.toLocaleTimeString(); 
    console.log(localTime.toLocaleDateString() );
    console.log(localTime.toLocaleTimeString() );
    
    removeAllSubTab();
    weatherCard.classList.remove('invisible');
}

grantAccessButton.addEventListener('click',async function(){
    try{
        coordinates=await getGeoLocation();
    }
    catch(error){
        messageBox.firstChild.innerHTML="Location Can Not be Accessed"
        messageBox.lastChild.innerHTML="using Default value";
        coordinates=defaultCoordinate
    }
    console.log(coordinates);
    displayLocalWeather();
})



async function test() {
    let data = await getCityCoordinate("delhi")
    console.log(data);
    let weather = await fetchWeather(data.latitude, data.longitude, API_KEY);
    console.log(weather);
    displayWeather(weather);
}


displayLocalWeather();
// displayWeather(defaultWeather);