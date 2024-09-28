import { useState, useEffect } from "react";
import "../style/viewWeather.css";

export const ViewWeather = ()=>{
    const [ loading, setLoading ] = useState(true);
    const [ forecastInfo, setForecastInfo ] = useState();

    const forecastRequest = async(location)=>{
        try{
            if( typeof location == "string"){
                let request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=54d8970079254ab8a9b111701242809&q=${location}&days=1&aqi=no&alerts=yes&lang=es`);
                let finalAnswer = await request.json();
                setLoading(false);
                setForecastInfo(finalAnswer);
            }
            else{
                let request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=54d8970079254ab8a9b111701242809&q=${location[0]},${location[1]}&days=1&aqi=no&alerts=yes`);
                let finalAnswer = await request.json();
                setLoading(false);
                setForecastInfo(finalAnswer);
            }
        } catch(e){
            setLoading(false);
        }
    }

    useEffect(()=>{
        let location;
        navigator.geolocation ? location = navigator.geolocation : location = false;

        const getUserLocation = (position)=>{
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            forecastRequest([latitude,longitude]);
        }

        try{
            location.getCurrentPosition(getUserLocation);
        } catch(e){
            console.log("Tu navegador no es capaz de acceder a tu ubicación, ingrese su ubicación manualmente");
        }
    },[]);
    
    return(
        <div className="view-weather__container">
            <h1> Vea el clima de su ubicación </h1>
            <form action="" onSubmit={(e)=>{
                e.preventDefault();
                setLoading(true);
                forecastRequest(e.target.children[0].value);
                }} id="form">
                <input type="text" placeholder="Escriba aquí la ubicación que desee"/>
                <input type="submit" value="Buscar" />
            </form>
            {
                loading ? <span style={{
                    textAlign: "center",
                    padding: "64px 0"
                }}> Obteniendo información...</span> : (
                    <div className="view-weather__info">
                        <h2 className="location-name"> { forecastInfo.location.name }</h2>
                        <h3 className="location-region"> { forecastInfo.location.region }, { forecastInfo.location.country }</h3>
                        <div className="view-weather__temp">
                            <h3> Temperatura Actual </h3>
                            <h6> { forecastInfo.location.localtime }</h6>
                            <div className="view-weather__temp-flex">
                                <div className="temp-c">
                                    { forecastInfo.current.temp_c }°C
                                </div>
                                <div className="temp-f">
                                    { forecastInfo.current.temp_f }°F
                                </div>
                            </div>
                            <div className="view-weather__minmax-temp">
                                <div className="view-weather__min-temp">
                                    <h6> Temperatura mínima </h6>
                                    <span> { forecastInfo.forecast.forecastday[0].day.mintemp_c }°C</span><br />
                                    <span> { forecastInfo.forecast.forecastday[0].day.mintemp_f }°F</span>
                                </div>
                                <div className="view-weather__max-temp">
                                    <h6> Temperatura máxima </h6>
                                    <span> { forecastInfo.forecast.forecastday[0].day.maxtemp_c }°C</span><br />
                                    <span> { forecastInfo.forecast.forecastday[0].day.maxtemp_f }°F</span>
                                </div>
                            </div>
                        </div>
                        <div className="view-chances">
                            <div className="view-chances__rain">
                                <h3> Probabilidad de lluvia </h3>
                                <span> { forecastInfo.forecast.forecastday[0].day.daily_chance_of_rain }%</span>
                            </div>
                            <div className="view-chances__snow">
                                <h3> Probabilidad de nevada </h3>
                                <span> { forecastInfo.forecast.forecastday[0].day.daily_chance_of_snow }%</span>
                            </div>
                        </div>
                        <div className="view-wind">
                            <h3> Información sobre el viento </h3>
                            <div className="view-wind__vel">
                                <h4> Velocidad </h4>
                                <div className="view-wind__vel-container">
                                    <span> { forecastInfo.current.wind_kph }Km/h </span>
                                    <span> { forecastInfo.current.wind_mph }M/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}