import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import { authAdmin, userData } from '../services/auth';
import { GoogleMap, LoadScript, MarkerF, } from '@react-google-maps/api';
import { isMobile, loadingOverlay, loadingText, modal } from './formStyle';

const containerStyle = {
    width: isMobile? '100%' : '500px',
    height: isMobile? '250px' : '500px',
  };

export default function SingelMarker() {
  const [marker, setMarker] = useState({});
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, SetIsAdmin] = useState(false);
  const [toDelete ,  setToDelete] = useState(false)
  const [ask , setAsk] = useState(false)
  const [succes , setSucces] = useState(false)
  const { id } = useParams();
  const nav = useNavigate();


  useEffect(()=>{
    fetchData();
    isAuth();
  },[])

  const isAuth = async ()=> {
    try {const user = await userData();
        console.log(user)
        if (data.user_id === user._id){setIsUser(false);}}
        catch (error) {setIsUser(false);};
    try {SetIsAdmin(await authAdmin())}
    catch (error) {SetIsAdmin(false)}
  }

  const deletemarker = async () => {
    try {
      const data = await doApiMethod(API_URL + '/marker/' + marker._id , "DELETE", null );
      console.log(data)
      setSucces(true);
    } catch (error) {
      console.log(error);
    }
    
  }

  const fetchData = async ()=> {
    try {
        const data = await doApiGet( API_URL + '/marker/single/' + id);
        setMarker(data);
        console.log(data)
    } catch (error) {
        setMarker({});
    }
    
  }

  return ( <div dir='rtl' > 
  {marker && <div style={{textAlign: 'center' , marginLeft: '10px' , marginRight: '10px'}} >
    <h2 style={{textAlign: 'center', fontWeight: '500', fontSize: '1.8rem', marginBottom: '2rem'}} >מיקום במפה</h2>
    <p style={{fontWeight: '600'}} >שם המקום: {marker.name}</p>
    {marker.routs && <p style={{fontWeight: '600'}} >דרכי הגעה: {marker.routs}</p>}
    {marker.info && <p style={{fontWeight: '600'}}>מידע נוסף: {marker.info}</p>}
    { (isUser || isAdmin) && <p style={{marginTop: '5px'}} ><button className='button' ref={(button) => {if (button){ const buttonWidth = button.offsetWidth;button.style.marginRight = `calc(50% px)`;}}} onClick={()=>{setToDelete(true)}} >מחק</button>
    </p>}
    <div style={{display: 'flex' , justifyContent: 'center', flexDirection: isMobile? 'column' : 'row' , marginTop: '15px'}}>{marker.img_url && <img style={{maxHeight: '500px',  height: 'auto', objectFit: 'contain', width: isMobile ?'100%' : '', marginLeft: isMobile? '0': '15px' }} src={marker.img_url} alt="" /> }
    {marker.coordinates && <div>
        <LoadScript 
         googleMapsApiKey="*****************"
         loadingElement= {<div style={{direction : "rtl" , textAlign:"center" , paddingTop:"50%"}}>אנא המתן <br /> טוען מפה....</div>}  >
          <GoogleMap
           mapContainerStyle={containerStyle} center={marker.coordinates} zoom={13} onDrag={false}
           options={{mapTypeControl : false , gestureHandling : 'greedy' , fullscreenControl: false , streetViewControl: false , zoomControl : true , draggable: false, clickableIcons: false }}>
          <MarkerF position={marker.coordinates} />
          </GoogleMap>
        </LoadScript>
    </div>}
    </div>
  </div>}
  {toDelete && (
        <div tabIndex={-1} style={loadingOverlay}>
          <div style={modal}>
            {!ask && <>
               <h4>האם למחוק?</h4>
               <div style={{display: 'flex', justifyContent: 'center' }} >
               <button style={{marginLeft: '15px'}} className='button' onClick={()=>{setAsk(true), deletemarker()}} >אישור</button>
               <button className='button' onClick={()=>{setToDelete(false)}} >ביטול</button>
               </div>
            </>
            }
            {ask && !succes &&  <>
            <div className='loader'></div>
            <div style={loadingText}>מוחק...</div>
            </> }
            {succes && <>
            <h5 style={{marginBottom:'1rem',fontWeight: '500', fontSize: '20px'}}>נמחק בהצלחה</h5>
            <button className='button' onClick={() => {  setToDelete(false) ,setAsk(false), setSucces(false), nav('/'), window.location.reload()}} >חזור לדף הבית</button>
            </>}
            {/* {processError && <>
              <h4 >שגיאה</h4>
              <p style={textError}>{processError}</p>
              <button className='button' onClick={() => {setLoading(false) , setProcessErorr(null) }} >חזור אחורה</button>
              </> }
            {isUser && <div><p>הנך מחובר כבר</p>
            <button style={{marginTop: '1rem'}} className='button' onClick={() =>{nav("/")}} >חזור לדף הבית</button>
            </div>} */}
          </div>
        </div>
      )}
   </div>
  )
}
