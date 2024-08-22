const weekday = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function kmhToMs(kmh) {
    return kmh / 3.6;
}
async function updateWeatherData(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Fetch unit settings
    chrome.storage.sync.get(['temperatureUnit', 'windSpeedUnit'], async function (result) {
        const tempUnit = result.temperatureUnit || 'celsius'; // Default to 'celsius'
        const windSpeedUnit = result.windSpeedUnit || 'km/hr'; // Default to 'km/hr'

        // API calls
        const geolocation = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        await fetch(geolocation)
            .then(res => res.json())
            .then(data => {
                const city = data.locality;
                document.getElementById("status").innerHTML = city;
            });

        const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current_weather=true`;
        await fetch(weather)
            .then(res => res.json())
            .then(data => {
                const code = data.current_weather.weathercode;
                const d = new Date(data.current_weather.time);
                let hour = d.getHours();
                const popupContainer = document.querySelector('.popup-container');

                // Update icons and background based on weather code
                switch (code) {
                    case 0:
                    case 1:
                        document.getElementById("myImg").src = hour < 5 || hour > 20 ? "/icons/1night.png" : "/icons/1day.png";
                        popupContainer.style.backgroundImage = "url('/gifs/clear3.gif')";
                        break;
                    case 2:
                        document.getElementById("myImg").src = hour < 5 || hour > 20 ? "/icons/2night.png" : "/icons/2day.png";
                        popupContainer.style.backgroundImage = "url('/gifs/cloudy.gif')";
                        break;
                    case 3:
                        document.getElementById("myImg").src = "/icons/3.png";
                        popupContainer.style.backgroundImage = "url('/gifs/cloudy.gif')";
                        break;
                    case 45:
                    case 48:
                        document.getElementById("myImg").src = "/icons/45.png";
                        popupContainer.style.backgroundImage = "url('/gifs/fog.gif')";
                        break;
                    case 56:
                    case 57:
                        document.getElementById("myImg").src = "/icons/56.png";
                        popupContainer.style.backgroundImage = "url('/gifs/drizzle.gif')";
                        break;
                    case 61:
                    case 63:
                    case 80:
                    case 81:
                        document.getElementById("myImg").src = "/icons/61.png";
                        popupContainer.style.backgroundImage = "url('/gifs/lightrain.gif')";
                        break;
                    case 65:
                    case 82:
                        document.getElementById("myImg").src = "/icons/65.png";
                        popupContainer.style.backgroundImage = "url('/gifs/rain.gif')";
                        break;
                    case 95:
                    case 96:
                    case 99:
                        document.getElementById("myImg").src = "/icons/95.png";
                        popupContainer.style.backgroundImage = "url('/gifs/stormy.gif')";
                        break;
                    case 71:
                    case 73:
                    case 75:
                    case 85:
                    case 86:
                        document.getElementById("myImg").src = "/icons/71.png";
                        popupContainer.style.backgroundImage = "url('/gifs/snow.gif')";
                        break;
                    case 77:
                        document.getElementById("myImg").src = "/icons/77.png";
                        popupContainer.style.backgroundImage = "url('/gifs/snow.gif')";
                        break;
                    default:
                        document.getElementById("myImg").src = "/icons/default.png";
                        popupContainer.style.backgroundImage = "url('/gifs/default.gif')";
                        break;
                }

                // Display temperature and wind speed
                let temperature = data.current_weather.temperature;
                let windSpeed = data.current_weather.windspeed;

                if (tempUnit === 'fahrenheit') {
                    temperature = celsiusToFahrenheit(temperature);
                }

                if (windSpeedUnit === 'm/s') {
                    windSpeed = kmhToMs(windSpeed);
                }

                document.getElementById("temp").innerHTML = `Temperature - ${temperature.toFixed(1)} °${tempUnit === 'celsius' ? 'C' : 'F'}`;
                document.getElementById("wind").innerHTML = `Wind Speed - ${windSpeed.toFixed(1)} ${windSpeedUnit}`;

                // Update styles based on weather code
                const paras = document.getElementsByTagName("p");
                const next2 = document.getElementsByClassName("NFChild");

                if (code == 0 || code == 1) {
                    Array.from(paras).forEach(p => {
                        if (p.style) p.style.color = "#3e3939";
                    });
                    Array.from(next2).forEach(n => {
                        if (n.style) n.style.backgroundColor = "rgba(255, 255, 255, 0.30)";
                    });
                }
            });

        const sevenDays = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=GMT`;
        await fetch(sevenDays)
            .then(res => res.json())
            .then(data => {
                const next = document.getElementsByClassName("NFChild");
                const tMax = data.daily.temperature_2m_max;
                const tMin = data.daily.temperature_2m_min;
                const WCodes = data.daily.weathercode;
                const times = data.daily.time;
                const d = new Date();
                const hours = d.getHours();
                const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                Array.from(next).forEach((n, i) => {
                    const dayDate = new Date(times[i]);
                    let day = weekday[dayDate.getDay()];
                    if (n.firstChild) {
                        const avgTemp = (tMax[i] + tMin[i]) / 2;
                        const displayTemp = tempUnit === 'fahrenheit' ? celsiusToFahrenheit(avgTemp) : avgTemp;

                        n.firstChild.nextSibling.nextSibling.nextElementSibling.nextElementSibling.innerHTML = day;
                        n.firstChild.nextSibling.nextSibling.nextElementSibling.innerHTML = `${displayTemp.toFixed(1)} °${tempUnit === 'celsius' ? 'C' : 'F'}`;
                        setIcon(WCodes[i], n.firstChild.nextSibling, hours);
                    }
                });
                const loadingDiv = document.getElementById('loading-div');
                const contentDiv = document.getElementById('content-div');
                loadingDiv.classList.add('hide');
                contentDiv.classList.remove('hide');


            });
    });
}


async function findLocation() {

    const success = async(position) => {
        await updateWeatherData(position);
    }

    const error = (err) => {
        console.log(err);
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

function handleTemperatureChange(event) {
    const selectedTempUnit = event.target.checked ? 'fahrenheit' : 'celsius';
    console.log("Selected Temperature Unit:", selectedTempUnit);
}

// Function to handle wind speed unit change
function handleWindSpeedChange(event) {
    const selectedWindSpeedUnit = event.target.checked ? 'm/s' : 'km/hr';
    console.log("Selected Wind Speed Unit:", selectedWindSpeedUnit);
}


// Attach event listeners to radio buttons after DOM is loaded
function saveSettings() {
    const tempSwitch = document.getElementById('tempSwitch');
    const windspeedSwitch = document.getElementById('windspeedSwitch');

    const selectedTempUnit = tempSwitch.checked ? 'fahrenheit' : 'celsius';
    const selectedWindSpeedUnit = windspeedSwitch.checked ? 'm/s' : 'km/hr';

    chrome.storage.sync.set({
        temperatureUnit: selectedTempUnit,
        windSpeedUnit: selectedWindSpeedUnit
    }, function () {
        console.log('Settings saved:', {
            temperatureUnit: selectedTempUnit,
            windSpeedUnit: selectedWindSpeedUnit
        });
    });
    findLocation();
    hideSettings();
}

function loadSettings() {
    chrome.storage.sync.get(['temperatureUnit', 'windSpeedUnit'], function (result) {
        const tempUnit = result.temperatureUnit || 'celsius';
        const windSpeedUnit = result.windSpeedUnit || 'km/hr';

        // Set checkboxes based on saved settings
        document.getElementById('tempSwitch').checked = (tempUnit === 'fahrenheit');
        document.getElementById('windspeedSwitch').checked = (windSpeedUnit === 'm/s');
    });
}

function showSettings() {
    const settings = document.getElementById('settings');
    const contentDiv = document.getElementById('content-div');
    contentDiv.classList.add('hide');
    settings.classList.remove('hide');
}

function hideSettings() {
    const settings = document.getElementById('settings');
    const contentDiv = document.getElementById('content-div');
    settings.classList.add('hide');
    contentDiv.classList.remove('hide');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadSettings(); // Load settings when the DOM is ready

    // Add event listeners to checkboxes
    const tempSwitch = document.getElementById('tempSwitch');
    const windspeedSwitch = document.getElementById('windspeedSwitch');
    const settingsBtn = document.getElementById('settingsBtn');

    tempSwitch.addEventListener('change', saveSettings);
    windspeedSwitch.addEventListener('change', saveSettings);
    settingsBtn.addEventListener('click', showSettings);

    document.getElementById("closeSettings").addEventListener("click", hideSettings);
});


async function handleInitial() {
    await findLocation()
    
}

document.getElementById("btn").addEventListener("click", handleInitial());

const setIcon = (code, toChange, hour) => {
    if (code == 0 || code == 1) {
        if (hour > 3 && hour < 8) {
            toChange.src = "/icons/1night.png";
        }
        else {
            toChange.src = "/icons/1day.png";
        }
    }
    else if (code == 2) {
        if (hour > 3 && hour < 8) {
            toChange.src = "/icons/2night.png";
        }
        else {
            toChange.src = "/icons/2day.png";
        }
    }
    else if (code == 3) {
        toChange.src = "/icons/3.png";
    }
    else if (code == 45 || code == 48) {
        toChange.src = "/icons/45.png";
    }
    else if (code == 56 || code == 57) {
        toChange.src = "/icons/56.png";
    }
    else if (code == 61 || code == 63 || code == 80 || code == 81) {
        toChange.src = "/icons/61.png";
    }
    else if (code == 65 || code == 82) {
        toChange.src = "/icons/65.png";
    }
    else if (code == 95 || code == 96 || code == 99) {
        toChange.src = "/icons/95.png";
    }
    else if (code == 71 || code == 73 || code == 75 || code == 85 || code == 86) {
        toChange.src = "/icons/71.png";
    }
    else if (code == 77) {
        toChange.src = "/icons/77.png";
    }
}