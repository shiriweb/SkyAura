import React, { useRef, useState, useEffect } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import { FaSun, FaMoon, FaTrash } from "react-icons/fa";

const Weather = () => {
  const [darkMode, setDarkMode] = useState(false);
  const inputReference = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const allIcons = {
    "01d": "https://openweathermap.org/img/wn/01d@2x.png",
    "01n": "https://openweathermap.org/img/wn/01n@2x.png",
    "02d": "https://openweathermap.org/img/wn/02d@2x.png",
    "02n": "https://openweathermap.org/img/wn/02n@2x.png",
    "03d": "https://openweathermap.org/img/wn/03d@2x.png",
    "03n": "https://openweathermap.org/img/wn/03n@2x.png",
    "04d": "https://openweathermap.org/img/wn/04d@2x.png",
    "04n": "https://openweathermap.org/img/wn/04n@2x.png",
    "09d": "https://openweathermap.org/img/wn/09d@2x.png",
    "09n": "https://openweathermap.org/img/wn/09n@2x.png",
    "10d": "https://openweathermap.org/img/wn/10d@2x.png",
    "10n": "https://openweathermap.org/img/wn/10n@2x.png",
    "11n": "https://openweathermap.org/img/wn/11n@2x.png",
    "11d": "https://openweathermap.org/img/wn/11d@2x.png",
    "13d": "https://openweathermap.org/img/wn/13d@2x.png",
    "13n": "https://openweathermap.org/img/wn/13n@2x.png",
    "50d": "https://openweathermap.org/img/wn/50d@2x.png",
    "50n": "https://openweathermap.org/img/wn/50n@2x.png",
  };

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setSearchHistory(savedHistory);
    searchWeather("Pokhara");
  }, []);


  // Saving the searched history to the local storage
  const savedToHistory = (cityName, icon, temp) => {
    const updatedHistory = [
      { city: cityName, icon, temperature: temp },
      ...searchHistory.filter((item) => item.city !== cityName),
    ].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
  };


  // searching the weather data from the api
  const searchWeather = async (city) => {
    if (!city) {
      alert("Enter the city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_API_KEY
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: allIcons[data.weather[0].icon],
      });

      savedToHistory(
        data.name,
        allIcons[data.weather[0].icon],
        Math.floor(data.main.temp)
      );
    } catch (error) {
      setWeatherData(false);
    }
  };

  // Delete function for specific city
  const deleteFromHistory = (cityName) => {
    const updatedHistory = searchHistory.filter(
      (item) => item.city !== cityName
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
  };

  return (
    <div className="main-container">
      <div className={`weather ${darkMode ? "dark" : "light"}`}>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="search-bar">
          <input
            ref={inputReference}
            type="text"
            placeholder="Search"
            className={darkMode ? "input-dark" : "input-light"}
          />
          <img
            src={search_icon}
            alt="Search"
            onClick={() => searchWeather(inputReference.current.value)}
          />
        </div>

{/* Displaying the weather data  */}
        {weatherData && (
          <>
            <img
              src={weatherData.icon}
              alt="Weather Icon"
              className="weather-icon"
            />
            <p
              className={`temperature ${darkMode ? "text-light" : "text-dark"}`}
            >
              {weatherData.temperature}°C
            </p>
            <p className={`location ${darkMode ? "text-light" : "text-dark"}`}>
              {weatherData.location}
            </p>
            <div className="weather-data">
              <div className="weather-column">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p className={darkMode ? "text-light" : "text-dark"}>
                    {weatherData.humidity}%
                  </p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="weather-column">
                <img src={wind_icon} alt="Wind" />
                <div>
                  <p className={darkMode ? "text-light" : "text-dark"}>
                    {weatherData.windSpeed} Km/h
                  </p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>


{/* Added the search history display */}
      <div
        className={`recent-searches-container ${darkMode ? "dark" : "light"}`}
      >
        {searchHistory.length > 0 ? (
          <div className="recent-searches">
            <h3 className={darkMode ? "text-light" : "text-dark"}>
              Recent Searches
            </h3>
            <ul>
              {searchHistory.map((item, index) => (
                <li className="list" key={index}>
                  <div
                    className="search-city"
                    onClick={() => searchWeather(item.city)}
                  >
                    {item.city}
                    <img src={item.icon} alt="icon" style={{ width: "30px" }} />
                    {item.temperature}°C
                  </div>
                  <FaTrash
                    className="delete-button"
                    onClick={() => deleteFromHistory(item.city)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={darkMode ? "text-light" : "text-dark"}>
            No recent search
          </p>
        )}
      </div>
    </div>
  );
};

export default Weather;
