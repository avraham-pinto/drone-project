import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchWeatherData, setIsFirstRender, setLatitude, setLongitude } from '../redux/features/weatherSlice';
import {reverseGeolocation} from '../services/reversrGeolocation'
import { isMobile } from './formStyle'; 
import { DRONE_KEY } from '../services/apiService';

export default function WeatherInfo() {

  const dispatch = useDispatch();
  const { latitude, longitude, data, status, error , isFirstRender } = useSelector((state) => state.weather);
  const [selectedHour, setSelectedHour] = useState(0);
  const [currectHour , setCurrectHour] = useState(0)
  const [address , setaddress] = useState('');
  const [Mwind, setMwind] = useState(Infinity)
  const [mobile , setMobile] = useState (isMobile)

  useEffect(()=>{
    setMobile(isMobile)
  },[isMobile])
  useEffect(() => {
      const now = new Date();
      const hours = now.getHours();
      setCurrectHour(hours);
      setSelectedHour(hours);
      GetMwind();
  },[])

  const GetMwind= () => {
    const drone = localStorage.getItem(DRONE_KEY);
    switch (drone) {
      case "mavic 3 pro" :
        setMwind(43.2)
        break;
      case 'mavic 3' :
        setMwind(43.2)
        break;
      case 'mavic 3 clasic' :
        setMwind(43.2)
        break;
      case 'mavic pro' :
        setMwind(38)
        break;
      case "mini 3 pro" :
        setMwind(38)
        break;
      case 'mini 2se' :
        setMwind(38)
        break;
      case 'mini se' :
        setMwind(37.8)
        break;
      case 'mini 2' :
        setMwind(37.8)
        break;
      case 'mavic mini' :
        setMwind(28.8)
        break;
      case 'air 2' :
        setMwind(38)
        break;
      case 'air 2s' :
        setMwind(38)
        break;
      case 'mavic air' :
        setMwind(38)
        break;
      case 'mavic 2' :
        setMwind(38)
        break;
      case 'avata' :
        setMwind(38)
        break;
      case 'fpv' :
        setMwind(49)
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    getAddress(latitude ,longitude);
  },[latitude,longitude])

  const getAddress = (async(latitude , longitude) => {
     try{
     const address = await reverseGeolocation(latitude, longitude)
     setaddress(address)
   }
   catch (err){
     throw err;
   }})

  const divStyle = {
    borderRadius: " 12px",
    background: "rgba(118, 141, 254, 0.4)",
    width : "10%",
    height: "100%",
    margin: "1px",
    textAlign: 'center',
    fontWeight: '500'
  }

  const divStyleRed = {
    borderRadius: " 12px",
    background: "rgba(217, 82, 82)",
    width : "10%",
    height: "100%",
    margin: "1px",
    textAlign: 'center',
    fontWeight: '500'
  }

  const divStyleMobile = {
    borderRadius: " 12px",
    background: "rgba(118, 141, 254, 0.4)",
    width : "33%",
    minHeight: "100%",
    margin: "1px",
    textAlign: 'center',
    fontWeight: '500'
  }

  const divStyleMobileRed = {
    borderRadius: " 12px",
    background: "rgba(217, 82, 82)",
    width : "33%",
    minHeight: "100%",
    margin: "1px",
    textAlign: 'center',
    fontWeight: '500'
  }

  useEffect(() => {
    if (isFirstRender){
      dispatch(setIsFirstRender());
      return;
    }
    dispatch(fetchWeatherData({ latitude, longitude }));
  }, [latitude, longitude]);

  

  const handleSliderChange = (value) => {
    setSelectedHour(value);
  };

  const slyderMarks =!mobile ? {6:'06:00', 12:'12:00', 18:'18:00', 24:'00:00', 30:'06:00', 36:'12:00', 42:'18:00', 48:'00:00', 54:'06:00', 60:'12:00', 66:'18:00', 72:'00:00', 78:'06:00', 84:'12:00', 90:'18:00', 96:'00:00', 102:'06:00', 108:'12:00', 114:'18:00'}:
  {12:'12:00', 24:'00:00', 36:'12:00', 48:'00:00', 60:'12:00', 72:'00:00', 84:'12:00', 96:'00:00', 108:'12:00'}

  return (
    <div style={{width: "70vw" ,minHeight: "25vh", backgroundColor : "rgba(143, 219, 255, 0.5)"}} >
      {status === 'loading' && <p>טוען נתונים....</p>}
      {status === 'failed' && <p>Error: { "error! error details:" + error}</p>}
      {status === 'idle' && <p>הקש על כל מקום במפה להצגת מזג אויר</p> }
      {status === 'succeeded' && data && (
        <>
           {address && <h5 style={!mobile?{fontWeight:'600', marginTop: '0.15rem', marginBottom: '1rem', fontSize: '1.3rem'}:{fontWeight:'400', fontSize: '0.7rem'}} >{address.formattedAddress} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  { data.hourly.time[selectedHour].substring(11) + " " + data.hourly.time[selectedHour].substring(0,10) }</h5> }
          {!mobile && <div style={{display : "flex" , height:"50%"}}>
            <div style={divStyle}>טמפרטורה: <br/> {data.hourly.temperature_2m[selectedHour]}°C</div>
            <div style={ data.hourly.precipitation_probability[selectedHour] > 10 ? divStyleRed :  divStyle}>סיכוי למשקעים: <br/> {data.hourly.precipitation_probability[selectedHour]}%</div>
            <div style={ data.hourly.precipitation[selectedHour] > 5 ? divStyleRed : divStyle}>משקעים: <br/> {data.hourly.precipitation[selectedHour]} מ"מ</div>
            <div style={ divStyle}>עננות: <br/> {data.hourly.cloudcover_low[selectedHour]}%</div>
            <div style={ data.hourly.visibility[selectedHour] < 200 ? divStyleRed : divStyle}>ראות: <br/> {data.hourly.visibility[selectedHour]} מ'</div>
            <div style={ data.hourly.windspeed_10m[selectedHour] > Mwind? divStyleRed : divStyle}>רוחות בגובה 10 מ': <br/> {data.hourly.windspeed_10m[selectedHour]} קמ"ש</div>
            <div style={ data.hourly.windspeed_80m[selectedHour] >Mwind ? divStyleRed : divStyle}>רוחות בגובה 80 מ': <br/> {data.hourly.windspeed_80m[selectedHour]} קמ"ש</div>
            <div style={ data.hourly.windspeed_120m[selectedHour] > Mwind ? divStyleRed : divStyle}>רוחות בגובה 120 מ': <br/> {data.hourly.windspeed_120m[selectedHour]} קמ"ש</div>
            <div style={ data.hourly.windspeed_180m[selectedHour] > Mwind ? divStyleRed : divStyle}>רוחות בגובה 180 מ': <br/> {data.hourly.windspeed_180m[selectedHour]} קמ"ש</div>
            <div style={ data.hourly.windgusts_10m[selectedHour] > Mwind ? divStyleRed : divStyle} >משבים: <br/> {data.hourly.windgusts_10m[selectedHour]} קמ"ש</div>
          </div>}
          {mobile &&  <><div style={{display : "flex" , minHeight:"40%"}}>
            <div style={divStyleMobile}>טמפרטורה: <br/> {data.hourly.temperature_2m[selectedHour]}°C</div>
            <div style={ data.hourly.precipitation_probability[selectedHour] > 10 || data.hourly.precipitation[selectedHour] >5 ? divStyleMobileRed : divStyleMobile}>משקעים: <br/> {data.hourly.precipitation_probability[selectedHour]}% <br/> {data.hourly.precipitation[selectedHour]} מ"מ</div>
            {/* <div style={divStyle}>משקעים: <br/> {data.hourly.precipitation[selectedHour]} מ"מ</div> */}
            <div style={divStyleMobile} > <span style={{borderBottom: '1px solid grey'}} >עננות: {data.hourly.cloudcover_low[selectedHour]}%</span> <br/> ראות: <br/> {data.hourly.visibility[selectedHour]} מ'</div>
            </div>
            <div style={{display : "flex" , minHeight:"40%"}}>
              {/* <div style={divStyleMobile}>ראות: <br/> {data.hourly.visibility[selectedHour]} מ'</div> */}
              <div style={ data.hourly.windspeed_10m[selectedHour] > Mwind ? divStyleMobileRed : divStyleMobile}>רוחות בגובה 10 מ': <br/> {data.hourly.windspeed_10m[selectedHour]} קמ"ש</div>
              {/* <div style={divStyle}>רוחות בגובה 80 מ': <br/> {data.hourly.windspeed_80m[selectedHour]} קמ"ש</div> */}
              <div style={ data.hourly.windspeed_120m[selectedHour] > Mwind ? divStyleMobileRed : divStyleMobile}>רוחות בגובה 120 מ': <br/> {data.hourly.windspeed_120m[selectedHour]} קמ"ש</div>
              {/* <div style={divStyle}>רוחות בגובה 180 מ': <br/> {data.hourly.windspeed_180m[selectedHour]} קמ"ש</div> */}
              <div style={ data.hourly.windgusts_10m[selectedHour] > Mwind ? divStyleMobileRed : divStyleMobile}>משבים: <br/> {data.hourly.windgusts_10m[selectedHour]} קמ"ש</div>
            </div></> }
          <Slider
            min={currectHour}
            max={data.hourly.temperature_2m.length - 1}
            value={selectedHour}
            onChange={handleSliderChange}
            marks={slyderMarks}
            style={{paddingBottom: '50px'}}
          />
        </>
      )}
      </div>
  )
}
