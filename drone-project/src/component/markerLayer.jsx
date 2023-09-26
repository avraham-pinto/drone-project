import { MarkerF , } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import {doApiGet , API_URL } from '../services/apiService';
import { useDispatch } from 'react-redux';
import {clearInfo, setInfo} from '../redux/features/mapInfoSlice';
import { setLatitude, setLongitude } from '../redux/features/weatherSlice';
import markerSvg from '../assets/map-marker.svg'

export default function MarkerLayer() {

    const [markers , setMarkers] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        doApi();
      }, []);

    const doApi = async () => {
        const data = await doApiGet(API_URL + "/marker");
        setMarkers(data);
    }

  return (
    <>
    {markers.map((obj , i) => {
        return <MarkerF
        key={i}
        position={obj.coordinates}
        icon={{url : markerSvg }}
        onClick={(event) => {
            dispatch(clearInfo());
            dispatch(setInfo(obj));
            dispatch(setLatitude(event.latLng.lat()));
            dispatch(setLongitude(event.latLng.lng()));
        }}
        />
    })}
    </>
  )
}
