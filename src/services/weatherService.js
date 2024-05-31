import { DateTime } from "luxon";

const API_KEY = "6bb49c76155087f1b11a54c314f302a2";
//const API_KEY = "e21a0e1ac947344f526c6e0abfabc094";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const LANG = "pt_br";

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType)
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY, lang: LANG })

    return fetch(url).then((res) => res.json())
}

const iconUrlFromCode = (icon) => `src/assets/icons/${icon}.png`

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export const capitalizeAllWords = (str) => {
    return str.split(' ').map(capitalizeFirstLetter).join(' ');
};

const formatToLocalTime = (
    secs,
    offset,
    format = "cccc, dd 'de' LLLL 'de' yyyy' | Horario Local: 'HH:mm",
    locale = "pt-BR"
) => {
    const formattedString = DateTime.fromSeconds(secs + offset, { zone: 'utc' }).setLocale(locale).toFormat(format);
    return capitalizeFirstLetter(formattedString);
};


const formatCurrent = (data) => {
    const { coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        timezone
    } = data

    const { main: details, icon, description } = weather[0]
    const formattedLocalTime = formatToLocalTime(dt, timezone)

    return {
        temp,
        description: capitalizeAllWords(description),
        feels_like,
        temp_min,
        temp_max,
        humidity,
        name,
        country,
        sunrise: formatToLocalTime(sunrise, timezone, 'HH:mm'),
        sunset: formatToLocalTime(sunset, timezone, 'HH:mm'),
        speed,
        details,
        icon: iconUrlFromCode(icon),
        formattedLocalTime,
        dt,
        timezone,
        lat,
        lon
    }
}
//teste
const groupByDay = (data) => {
    return data.reduce((acc, curr) => {
        const date = curr.dt_txt.split(" ")[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});
};

const formatForecastWeather = (secs, offset, data) => {
    const groupedByDay = groupByDay(data);
    // hourly
    const hourly = data.filter((f) => f.dt > secs)
        .map(f => ({
            temp: Math.round(f.main.temp),
            title: formatToLocalTime(f.dt, offset, 'HH:mm'),
            icon: iconUrlFromCode(f.weather[0].icon),
            date: f.dt_txt
        })).slice(0, 5)
    //daily
    const daily = Object.keys(groupedByDay).map((date) => {
        const dayData = groupedByDay[date];
        const temps = dayData.map(d => d.main.temp);
        const temp_max = Math.round(Math.max(...temps));
        const temp_min = Math.round(Math.min(...temps));
        return {
            temp_max,
            temp_min,
            title: formatToLocalTime(DateTime.fromISO(date).toSeconds(), offset, 'cccc'),
            icon: iconUrlFromCode(dayData[0].weather[0].icon),
            date
        };
    });


    return { hourly, daily }
}

const getFormattedWeatherDate = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        'weather',
        searchParams).then(formatCurrent)

    const { dt, lat, lon, timezone } = formattedCurrentWeather
    const formattedForecastWeather = await getWeatherData('forecast', {
        lat,
        lon,
        units: searchParams.units
    }).then((d) => formatForecastWeather(dt, timezone, d.list))

    return { ...formattedCurrentWeather, ...formattedForecastWeather }
}

export default getFormattedWeatherDate