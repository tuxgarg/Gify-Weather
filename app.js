const weekday = ["Mon","Tues","Wed","Thur","Fri","Sat","Sun"];

function findLocation() {

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const geolocation = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        fetch(geolocation)
        .then(res => res.json())
        .then(data => {
            const city = data.locality;
            document.getElementById("status").innerHTML = city;
        })
        const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current_weather=true`
        fetch(weather)
        .then(res => res.json())
        .then(data => {
            const code = data.current_weather.weathercode;
            const d = new Date(data.current_weather.time);
            let hour = d.getHours();
            if(code==0 || code ==1){
                if(hour<5 || hour>20){
                    document.getElementById("myImg").src = "/icons/1night.png";
                }
                else{
                    document.getElementById("myImg").src = "/icons/1day.png";
                }
                document.body.style.backgroundImage = "url('/gifs/clear3.gif')";
            }
            else if(code==2){
                if(hour<5 || hour>20){
                    document.getElementById("myImg").src = "/icons/2night.png";
                }
                else{
                    document.getElementById("myImg").src = "/icons/2day.png";
                }
                document.body.style.backgroundImage = "url('/gifs/cloudy.gif')"; 
            }
            else if(code==3){
                document.getElementById("myImg").src = "/icons/3.png";
                document.body.style.backgroundImage = "url('/gifs/cloudy.gif')"; 
            }
            else if(code==45 || code==48){
                document.getElementById("myImg").src = "/icons/45.png";
                document.body.style.backgroundImage = "url('/gifs/fog.gif')"; 
            }
            else if(code==56 || code==57){
                document.getElementById("myImg").src = "/icons/56.png";
                document.body.style.backgroundImage = "url('/gifs/drizzle.gif')"; 
            }
            else if(code==61 || code==63 || code==80 || code==81){
                document.getElementById("myImg").src = "/icons/61.png";
                document.body.style.backgroundImage = "url('/gifs/lightrain.gif')"; 
            }
            else if(code==65 || code == 82){
                document.getElementById("myImg").src = "/icons/65.png";
                document.body.style.backgroundImage = "url('/gifs/rain.gif')"; 
            }
            else if(code==95 || code==96 || code == 99){
                document.getElementById("myImg").src = "/icons/95.png";
                document.body.style.backgroundImage = "url('/gifs/stormy.gif')"; 
            }
            else if(code==71 || code==73 || code==75 || code==85 || code==86){
                document.getElementById("myImg").src = "/icons/71.png";
                document.body.style.backgroundImage = "url('/gifs/snow.gif')"; 
            }
            else if(code==77){
                document.getElementById("myImg").src = "/icons/77.png";
                document.body.style.backgroundImage = "url('/gifs/snow.gif')"; 
            }
            document.getElementById("temp").innerHTML = "Temperature - " + String(data.current_weather.temperature) + " °C";
            document.getElementById("wind").innerHTML = "Wind Speed - " + String(data.current_weather.windspeed) + " km/h";
            const paras = document.getElementsByTagName("p");
            const next2 = document.getElementsByClassName("NFChild");
            if (code == 0 || code == 1) {
                for (ele in paras) {
                    if (paras[ele].style) {
                        paras[ele].style.color = "#3e3939"
                    }
                }
                for (ele in next2) {
                    if (next2[ele].style) {
                        next2[ele].style.backgroundColor = "rgba(255, 255, 255, 0.30)"
                    }
                }
            }
        })
        const sevenDays = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=GMT`
        fetch(sevenDays)
            .then(res => res.json())
            .then(data => {
                const next = document.getElementsByClassName("NFChild");
                const i = 0;
                const tMax = data.daily.temperature_2m_max;
                const tMin = data.daily.temperature_2m_min;
                const WCodes = data.daily.weathercode;
                const times = data.daily.time;
                const d = new Date();
                let hours = d.getHours();
                for (ele in next) {
                    const d = new Date(times[ele]);
                    let day = weekday[d.getDay()];
                    if (next[ele].firstChild) {
                        next[ele].firstChild.nextSibling.nextSibling.nextElementSibling.nextElementSibling.innerHTML = day
                        next[ele].firstChild.nextSibling.nextSibling.nextElementSibling.innerHTML = String(((tMax[ele] + tMin[ele]) / 2).toFixed(1)) + "°C";
                        setIcon(WCodes[ele], next[ele].firstChild.nextSibling,hours)
                    }
                }
        })
    }

    const error = (err) => {
        console.log(err);
    }
    navigator.geolocation.getCurrentPosition(success , error);
}

document.getElementById("btn").addEventListener("click", findLocation()); 

const setIcon = (code,toChange,hour) => {
    if(code==0 || code ==1){
        if(hour>3 && hour<8){
            toChange.src = "/icons/1night.png";
        }
        else{
            toChange.src = "/icons/1day.png";
        } 
    }
    else if(code==2){
        if(hour>3 && hour<8){
            toChange.src = "/icons/2night.png";
        }
        else{
            toChange.src = "/icons/2day.png";
        }
    }
    else if(code==3){
        toChange.src = "/icons/3.png";
    }
    else if(code==45 || code==48){
        toChange.src = "/icons/45.png";
    }
    else if(code==56 || code==57){
        toChange.src = "/icons/56.png";
    }
    else if(code==61 || code==63 || code==80 || code==81){
        toChange.src = "/icons/61.png";
    }
    else if(code==65 || code == 82){
        toChange.src = "/icons/65.png"; 
    }
    else if(code==95 || code==96 || code == 99){
        toChange.src = "/icons/95.png";
    }
    else if(code==71 || code==73 || code==75 || code==85 || code==86){
        toChange.src = "/icons/71.png"; 
    }
    else if(code==77){
        toChange.src = "/icons/77.png";
    }
}