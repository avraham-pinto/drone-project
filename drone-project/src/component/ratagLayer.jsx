import { PolygonF } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'
import { doApiGet , API_URL} from '../services/apiService'
import { useDispatch } from 'react-redux';
import { clearInfo, setInfo } from '../redux/features/mapInfoSlice';
import { setLatitude, setLongitude } from '../redux/features/weatherSlice';

export default function RatagLayer() {

const [poligons , setPoligons] = useState([]);

const dispatch = useDispatch()

useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    const data = await doApiGet(API_URL + "/ratag");
    setPoligons(data);
  }

  return (
    <>
    {poligons.map((Obj, i) => {
      return <PolygonF
      key={i}
      path={Obj.coordinates} 
      options={{
        strokeColor: '#9941c8',
        strokeOpacity: 0.9,
        strokeWeight: 0.9,
        fillColor: '#9941c8',
        fillOpacity: 0.3,
      }}
      onClick={(event)=>{
        dispatch(clearInfo())
        const newObj = {...Obj};
        newObj.origin = `רט"ג`;
        dispatch(setInfo(newObj))
        dispatch(setLatitude(event.latLng.lat()));
        dispatch(setLongitude(event.latLng.lng()));
      }}
      ></PolygonF>
    })}
    </>
  )
}
