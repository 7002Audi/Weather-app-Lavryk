document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '33ab6ffb3ca27aa8fe9f6943dee0a755';
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const cityElement = document.getElementById('city');
    const dateElement = document.getElementById('date');
    const tempElement = document.getElementById('temp');
    const weatherIcon = document.getElementById('weather-icon');
    const descriptionElement = document.getElementById('description');
    const windElement = document.getElementById('wind');
    const humidityElement = document.getElementById('humidity');
    const pressureElement = document.getElementById('pressure');
    const forecastContainer = document.getElementById('forecast');

    // Функція для отримання поточної дати
    function getCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString('uk-UA', options);
    }

    // Функція для отримання погоди
    async function getWeather(city) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=ua`
            );
            const data = await response.json();

            if (data.cod === '404') {
                alert('Місто не знайдено');
                return;
            }

            updateWeatherUI(data);
            getForecast(city);
        } catch (error) {
            console.error('Помилка отримання погоди:', error);
            alert('Помилка отримання погоди');
        }
    }

    // Функція для отримання прогнозу
    async function getForecast(city) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=ua`
            );
            const data = await response.json();
            updateForecastUI(data);
        } catch (error) {
            console.error('Помилка отримання прогнозу:', error);
        }
    }

    // Функція для оновлення UI з поточною погодою
    function updateWeatherUI(data) {
        cityElement.textContent = data.name;
        dateElement.textContent = getCurrentDate();
        tempElement.textContent = Math.round(data.main.temp);
        descriptionElement.textContent = data.weather[0].description;
        windElement.textContent = `${Math.round(data.wind.speed)} км/год`;
        humidityElement.textContent = `${data.main.humidity}%`;
        pressureElement.textContent = `${data.main.pressure} гПа`;

        // Оновлення іконки погоди
        const iconCode = data.weather[0].icon;
        weatherIcon.className = getWeatherIcon(iconCode);
    }

    // Функція для оновлення UI з прогнозом
    function updateForecastUI(data) {
        forecastContainer.innerHTML = '';
        const dailyForecasts = {};

        // Групуємо прогнози по днях
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('uk-UA', { weekday: 'short' });
            
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = {
                    temp: forecast.main.temp,
                    icon: forecast.weather[0].icon,
                    description: forecast.weather[0].description
                };
            }
        });

        // Створюємо елементи прогнозу
        Object.entries(dailyForecasts).forEach(([day, forecast]) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="day">${day}</div>
                <i class="${getWeatherIcon(forecast.icon)}"></i>
                <div class="temp">${Math.round(forecast.temp)}°C</div>
                <div class="description">${forecast.description}</div>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    }

    // Функція для отримання відповідної іконки погоди
    function getWeatherIcon(iconCode) {
        const icons = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-showers-heavy',
            '09n': 'fas fa-cloud-showers-heavy',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        return icons[iconCode] || 'fas fa-cloud';
    }

    // Обробник подій
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        }
    });

    // Завантаження погоди для Києва при запуску
    getWeather('Kyiv');
});
