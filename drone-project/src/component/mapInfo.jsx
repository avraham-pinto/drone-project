import React from 'react'
import WeatherInfo from './weatherInfo'
import LayersInfo from './layerInfo'

export default function Info() {
  return (
    <div style={{direction : "rtl" ,height: "25vh" , display: "flex"}}>
        <LayersInfo/>
        <WeatherInfo/>
    </div>
  )
}
