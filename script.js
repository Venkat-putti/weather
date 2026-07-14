const API_URL = "https://api.weatherapi.com/v1/forecast.json?key=be2239b855464b6a94a55011262105&days=3&aqi=no&alerts=no&q=";

const searchInput = document.getElementById("search");
const fetchWeatherBtn = document.getElementById("fetch-weather");
const cityNameElem = document.getElementById("cityname");
const weatherIconElem = document.getElementById("weather-icon");
const temperatureElem = document.getElementById("temperature");
const forecastGridElem = document.querySelector(".forecast-grid");

async function fetchWeather(city) {
    try {
        const response = await fetch(API_URL + encodeURIComponent(city));
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        updateCurrentWeather(data);
        updateForecast(data);
    } catch (error) {
        alert("Error fetching weather data: " + error.message);
    }
}

function updateCurrentWeather(data) {
    cityNameElem.textContent = data.location.name;
    // Prepend 'https:' to fix the relative protocol URL bug
    weatherIconElem.src = "https:" + data.current.condition.icon;
    temperatureElem.textContent = Math.round(data.current.temp_c) + "°C";
}

function updateForecast(data) {
    forecastGridElem.innerHTML = '';
    
    data.forecast.forecastday.forEach(day => {
        const forecastItem = document.createElement("div");
        // FIXED: Changed to 'forecast-card' to match your premium CSS classes!
        forecastItem.classList.add("forecast-card");
        
        // Let's format the date to look cleaner (e.g., getting the day name)
        const dateObj = new Date(day.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

        forecastItem.innerHTML = `
            <h4>${dayName}</h4>
            <img src="https:${day.day.condition.icon}" alt="weather icon">
            <p>${Math.round(day.day.avgtemp_c)}°C</p>
        `;
        forecastGridElem.appendChild(forecastItem);
    });
}

fetchWeatherBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city === "") return;
    fetchWeather(city);
});

// Pre-load a gorgeous default city so your glassmorphism card looks amazing immediately!
fetchWeather("Bangalore");