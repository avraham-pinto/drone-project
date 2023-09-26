import React, { useEffect, useState } from 'react'
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import { isMobile } from './formStyle';
import { useNavigate } from 'react-router-dom';

export default function OwnMarkers() {
    const [data, setData] = useState([]);
    const nav = useNavigate()

    useEffect(()=>{
        fetchData();
    },[])

    const gap = isMobile? '1fr' : '1fr 1fr 1fr 1fr'

    const fetchData = async () => {
        const ids = await doApiGet( API_URL + "/users/getOwn");
        const data = await doApiMethod( API_URL + '/marker/groupIds', "POST", {ids : ids});
        setData(data)
        console.log(data)
    }


    return (
        <div>
            <h2 style={{direction: 'rtl', textAlign: 'center', fontWeight: '500', fontSize: '2rem', marginBottom: '5px'}} >מקומות שהוספת במפה</h2>
            <div dir='rtl' style={{ display: 'grid', gridTemplateColumns: gap, gap: '30px' }}>
              {data.map((obj, i) => {
                return (
                  <div onClick={()=>{nav('/user/markers/single/' + obj._id) , window.location.reload()}} style={{ border: '1px solid gray', margin: '10px', padding: '5px', maxWidth: '350px', maxHeight: '100px', display: 'flex', flexDirection: 'row' ,justifyContent:'space-between' }} key={i}>
                    <div>
                        <p style={{fontWeight: '500'}} >{obj.name}</p>
                        <p>{obj.info.substring(0 , 25)}</p>
                    </div>
                    <img style={{ maxHeight: '90px', maxWidth: '100%', height: 'auto' }} src={obj.img_url} alt="" />
                  </div>
                );
              })}
            </div>
        </div>
        
      );
      
}
