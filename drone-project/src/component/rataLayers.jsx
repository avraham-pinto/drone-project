import { CircleF, PolygonF } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import {doApiGet , API_URL } from '../services/apiService';
import { useDispatch } from 'react-redux';
import {clearInfo, setInfo} from '../redux/features/mapInfoSlice';
import { setLatitude, setLongitude } from '../redux/features/weatherSlice';

export default function RataLayers() {

  const [circles , setCircles] = useState([]);
  const [poligons , setPoligons] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    const data = await doApiGet(API_URL + "/rata");
    setCircles(data.circles)
    setPoligons(data.poligons)
  }
    
  return (
  <>
    {circles.map((Obj, i) => {
      return <CircleF
      key={i}
      center={Obj.coordinat}
      radius={parseInt(Obj.radiusM)} 
      options={{
        strokeColor: '#FF0000',
        strokeOpacity: 0.9,
        strokeWeight: 0.9,
        fillColor: '#FF0000',
        fillOpacity: 0.3,
      }}
      onClick={(event)=>{
        dispatch(clearInfo())
        const newObj = {...Obj};
        newObj.origin = `רת"א`;
        dispatch(setInfo(newObj));
        dispatch(setLatitude(event.latLng.lat()));
        dispatch(setLongitude(event.latLng.lng()));

      }}
      ></CircleF>;
    })}

    {poligons.map((Obj, i) => {
      return <PolygonF
      key={i}
      path={Obj.coordinates} 
      options={{
        strokeColor: '#FF0000',
        strokeOpacity: 0.9,
        strokeWeight: 0.9,
        fillColor: '#FF0000',
        fillOpacity: 0.3,
      }}
      onClick={(event)=>{
        dispatch(clearInfo())
        const newObj = {...Obj};
        newObj.origin = `רת"א`;
        dispatch(setInfo(newObj));
        dispatch(setLatitude(event.latLng.lat()));
        dispatch(setLongitude(event.latLng.lng()));
      }}
      ></PolygonF>
    })}
  </>
    
  )
}