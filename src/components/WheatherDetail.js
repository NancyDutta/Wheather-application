import { faSearch, faCloud, faSun, faCloudRain, faSnowflake, faSmog, faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import backgroundImage from '../images/img.jpg';
import back from '../images/blur.jpg';
import cloud from '../images/cloud2.jpg';
import clear from '../images/clear.jpg';
import mist from '../images/mist2.jpg';
import rain from '../images/rain2.avif';
import haze from '../images/haze.jpg';
import snow from '../images/snow.jpg';
import axios from 'axios';

const WeatherDetail = () => {
  const [input, setInput] = useState({ 
    celcius: 20,
    name: '',
    humidity: 20,
    wind: 10,
    visibility: 20,
    description: "Haze",
    icon: faSun , // Default icon
    country: "",
    backgroundImage:backgroundImage
  });
  const [city, setCity] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [error, seterror]=useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weatherIcons = {
    'Clear': faSun,
    'Clouds': faCloud,
    'Rain': faCloudRain,
    'Snow': faSnowflake,
    'Mist': faSmog,
    'Haze': faCloudSun
    // Add more weather conditions and corresponding icons as needed
  };

  const weatherBackground = {
'Clear': clear,
'Clouds': cloud,
'Rain': rain,
'Snow': snow,
'Mist':mist,
'Haze':haze
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoords(latitude, longitude);
      }, (error) => {
        console.error("Error fetching geolocation:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  },[]);

  const fetchWeatherDataByCoords = (lat, lon) => {
    const apiKey = "d4e581c945820b3df4a00b537fcde304";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl)
      .then(response => {
        const weatherMain = response.data.weather[0].main;
        setInput({
          celcius: response.data.main.temp,
          name: response.data.name,
          humidity: response.data.main.humidity,
          wind: response.data.wind.speed,
          visibility: response.data.visibility,
          country: response.data.sys.country,
          description: weatherMain,
          icon: weatherIcons[weatherMain] || faSun,// Default to faSun if no matching icon found
          backgroundImage: weatherBackground[weatherMain] || backgroundImage
        });
        seterror("");
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (city !== "") {
      const apiKey = "d4e581c945820b3df4a00b537fcde304";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      axios.get(apiUrl)
        .then(response => {
          const weatherMain = response.data.weather[0].main;
          setInput({
            celcius: response.data.main.temp,
            name: response.data.name,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed,
            visibility: response.data.visibility,
            country : response.data.sys.country,
            description: weatherMain,
            icon: weatherIcons[weatherMain] || faSun ,// Default to faSun if no matching icon found
            backgroundImage: weatherBackground[weatherMain] || backgroundImage
          });
          seterror("");
          console.log(response.data);
        })
        .catch(error => {
          seterror("Enter a valid city");
          console.error('Error fetching data:', error);
        });
    }
  }

  return (
    <>
      <body style={{
         backgroundImage: `url(${back})`
       }}>
        <div className='container'>
          <div className='column1' style={{ backgroundImage: `url(${input.backgroundImage})` }}>
            <div className='col-location'><h2>{input.name} , {input.country}</h2></div>
            <div className='display'>
              <div className='time-day'>
                <div className='time'>{currentDateTime.toLocaleTimeString()}</div>
                <div className='day'>{`${currentDateTime.toLocaleDateString('en-US', { weekday: 'long' })}, ${currentDateTime.getDate()} ${currentDateTime.toLocaleDateString('en-US', { month: 'long' })} ${currentDateTime.getFullYear()}`}</div>
              </div>
              <div className='celcius'>{Math.round(input.celcius)}°C</div>
            </div>
          </div>
          <div className='column2'>
            <div className='dyn-img'>
              <FontAwesomeIcon icon={input.icon} size="3x" style={{color: "white", height: '100px'}} />
            </div>
            <div className='weather-name'><h1>{input.description}</h1></div>
            <div className="search-bar">
              <input
                type="text"
                className='search-input'
                placeholder="Search any city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }}
              />
              <FontAwesomeIcon icon={faSearch} onClick={handleSearch} className="search-icon" />
            </div>
            {error && <div className='error-message'>{error}</div>}
            <div className='location'><h3>{input.name} , {input.country}</h3></div>
            <div className='wheather-details'>
              <div className='wheather-detail'>Temperature : {Math.round(input.celcius)}°C </div>
              <div className='wheather-detail'>Humidity : {Math.round(input.humidity)}% </div>
              <div className='wheather-detail'>Visibility : {Math.round(input.visibility)} ml</div>
              <div className='wheather-detail'>Wind Speed : {Math.round(input.wind)} km/h </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default WeatherDetail;
