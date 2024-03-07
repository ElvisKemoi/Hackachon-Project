const express = require('express');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
    const session_id = req.body.sessionId;
    const service_code = req.body.serviceCode;
    const phone_number = req.body.phoneNumber;
    let text = req.body.text.trim();

    let response = '';

    if (text === '') {
        response = "CON Welcome to Farmers Weather Forecast\n";
        response += "Please enter your location (e.g., city or zip code):";
    } else {
        try {
            const location = text;
            const weatherData = await getWeatherForecast(location);

            if (weatherData) {
                response = "END Weather Forecast for " + location + ":\n";
                response += "Date: " + weatherData.date + "\n";
                response += "Temperature: " + weatherData.temperature + "°C\n";
                response += "Conditions: " + weatherData.conditions + "\n";
                response += "Wind Speed: " + weatherData.windSpeed + " m/s\n";
                response += "Humidity: " + weatherData.humidity + "%";
            } else {
                response = "END Error fetching weather data. Please try again later.";
            }
        } catch (error) {
            console.error('Error:', error);
            response = "END Error fetching weather data. Please try again later.";
        }
    }

    res.send(response);
});

async function getWeatherForecast(location) {
    const apiKey = '0a532f8f8349abfdd297a93ccc5e8c10';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '200') {
            // Extract weather forecast for the next day
            const forecast = data.list.find(entry => {
                const forecastDate = new Date(entry.dt * 1000); // Convert timestamp to milliseconds
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1); // Get date for tomorrow
                return forecastDate.getDate() === tomorrow.getDate(); // Check if forecast is for tomorrow
            });

            if (forecast) {
                return {
                    date: new Date(forecast.dt * 1000), // Convert timestamp to milliseconds
                    temperature: forecast.main.temp,
                    conditions: forecast.weather[0].description,
                    windSpeed: forecast.wind.speed,
                    humidity: forecast.main.humidity
                };
            } else {
                console.error('Error: No forecast available for tomorrow.');
                return null;
            }
        } else {
            console.error('Error:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
