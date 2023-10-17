import React,{ useState,useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_KEY='b004619e53ef49cdb0695122231610'

function App() {
    const [query, setQuery] = useState('');
    const [weatherData, setData] = useState([]);
    const [loaded,setLoaded] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === "granted") {
            console.log('granted');
          } else if (result.state === "prompt") {
            requestUserLocation();
            console.log('prompt');
          } else if (result.state === "denied") {
            console.log('error');
          }
        });
      } else {
        console.log('errorooo');
      }
    }, [])

    const requestUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let cord=`${position.coords.latitude},${position.coords.longitude}`
          await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}%20&q=${cord}&days=7`)
          .then(res=>{
            setData(res)
            setLoaded(true)
          })
          .catch(err=>{
            console.log(err);
          })
        },
        (error) => {
          setError(error.message)
        }
      );
    };

    const handleSearch=(e)=>{
      setQuery(e.target.value)
    } 
    
    const handleEnterKeyPress =async (e) => {
      if (e.key === 'Enter') {
        await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}%20&q=${query}&days=7`)
        .then(res=>{
          setData(res)
          setLoaded(true)
          setError('')
        })
        .catch(err=>{
          console.log('dddd',err);
          setError(err.response.data.error.message)
        })
      }
    }

    return (
    <div className='main-container'>
    <input type='text' className='search' placeholder='Enter Place' onChange={handleSearch} value={query} onKeyPress={handleEnterKeyPress}/>
    <h2 style={{color:'red'}}>{error}</h2>
      <div className='city'>
        <div>
          <h2><span>{loaded ? weatherData.data.location.name : ''}</span></h2>
          <span>{loaded ? weatherData.data.location.region : ''}</span><br/>
          <span>{loaded ? weatherData.data.location.country : ''}</span>
          <div className="city-temp">
          {loaded ? weatherData.data.current.temp_c:''}
          <sup>&deg;C</sup>
        </div>
        <div>Humidity <label style={{fontWeight:'bold'}}>: {loaded && weatherData.data.current.humidity}</label></div>
        <div>Wind Speed <label style={{fontWeight:'bold'}}>: {loaded && weatherData.data.current.wind_kph} kmph</label></div>
        <div>Lat / Long <label style={{fontWeight:'bold'}}>: {loaded && weatherData.data.location.lat} / {loaded && weatherData.data.location.lon}</label></div>
        </div>
        <div>
          <h3 style={{textAlign:'center'}}>7 days forecast</h3>
          {loaded && weatherData.data.forecast.forecastday.map((x,i)=>{
          return(
          <div style={{display:'flex'}} key={i}>
              <div style={{padding:'20px 10px 0px 0px',width:'100px'}}>{new Date(x.date).toLocaleString('en-US', { weekday: 'long' })}</div>
              <div style={{padding:'20px 10px 0px 0px',width:'80px'}}>{x.day.condition.text}</div>
              <img src={x.day.condition.icon}/>
              <div style={{padding:'20px 10px 0px 0px',width:'100px'}}>{x.day.maxtemp_c}&deg; / {x.day.mintemp_c}&deg;</div>
              <div style={{padding:'20px 10px 0px 0px',width:'150px'}}>{x.astro.sunrise} / {x.astro.sunset}</div>
          </div>
          )})}
        </div>
      </div>

    </div>
  )
}

export default App