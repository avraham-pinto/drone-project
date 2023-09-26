import React, { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, StandaloneSearchBox } from '@react-google-maps/api';
import userLocationBlueSvg from '../assets/user-location-blue.svg';
import locationSvg from '../assets/location.svg'
import RataLayers from './rataLayers';
import RatagLayer from './ratagLayer';
import Info from './mapInfo';
import { useDispatch } from 'react-redux';
import { clearInfo } from '../redux/features/mapInfoSlice';
import { setLatitude, setLongitude } from '../redux/features/weatherSlice';
import MarkerLayer from './markerLayer';
import { isMobile } from './formStyle';


const containerStyle = {
  width: '100%',
  height: '65vh',
};

const libraries = ['places'];

function Map() {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 32, lng: 35 });
  const [userLocation, setUserLocation] = useState(null);

  const dispatch = useDispatch();

  const onLoad = (map) => {
    setMap(map);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          dispatch(setLatitude(latitude));
          dispatch(setLongitude(longitude));
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  const onPlacesChanged = () => {
    if (searchBox && searchBox.getPlaces) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const { geometry } = places[0];
        const { lat, lng } = geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        dispatch(setLatitude(lat()));
        dispatch(setLongitude(lng()));
        const bounds = new window.google.maps.LatLngBounds();
        places[0].geometry.viewport ? bounds.union(places[0].geometry.viewport) : bounds.extend(places[0].geometry.location);
        map.fitBounds(bounds);
      }
    }
  };
  const onSearchBoxLoad = (ref) => {
    setSearchBox(ref);
  };

  const handleMapClick = (e) => {
    dispatch(clearInfo());
    dispatch(setLatitude(e.latLng.lat()));
    dispatch(setLongitude(e.latLng.lng()));
  };

  return (
    <div>
      <div style={{height : "65vh"}}>
      <img src={locationSvg} alt='location' onClick={fetchLocation} style={{ position: "absolute", top: "7.5vh", left: "0.5vh", zIndex: "999" , backgroundColor: "white" , border: "0.12rem solid black" , borderRadius: "0.38rem" }}/>
        <LoadScript 
         googleMapsApiKey="*****************"
         libraries={libraries}
         loadingElement= {<div style={{direction : "rtl" , textAlign:"center" , paddingTop:"50%"}}>אנא המתן <br /> טוען מפה....</div>}  >
          <GoogleMap
           mapContainerStyle={containerStyle} center={center} zoom={10}
           onClick={handleMapClick} onLoad={onLoad}
           options={{mapTypeControl : false , gestureHandling : 'greedy' , fullscreenControl: false , streetViewControl: false , zoomControl : false}}>
            <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
              <input type="text" dir='rtl' placeholder="חפש...." style={{ boxSizing: 'border-box', border: '1px solid transparent', width: isMobile? '50%' : '26%', height: isMobile? '8%' : '10%', padding: '0 12px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses', position: 'absolute', left: '50%', marginLeft: isMobile? '-25%': '-13%' }} />
            </StandaloneSearchBox>
            {userLocation && <MarkerF position={userLocation} icon={{url: userLocationBlueSvg}}/>}
            <RataLayers/>
            <RatagLayer/>
            <MarkerLayer/>
          </GoogleMap>
        </LoadScript>
      </div>
      <Info/>
    </div>
  );
}

export default Map;
