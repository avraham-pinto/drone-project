import React from 'react'
import { useSelector } from 'react-redux'
import { isMobile } from './formStyle';

export default function LayersInfo() {

  const mapInfo = useSelector((state) => state.mapInfo);

  return (
    <div style={{width: "30vw" , backgroundColor : "#cdacf2" ,display : 'flex' , justifyContent: 'space-between', flexDirection: isMobile? 'column': 'row'}} >
      <div  >
        {mapInfo.empty && <p style={{fontWeight: "500" , fontSize : "1.4rem" , padding : "" , textAlign: "center"}} >הקש על איזור צבוע במפה לפרטים</p>}
        {mapInfo.origin && <p style={{ fontWeight: '500' }} >אזור סגור ע"י {mapInfo.origin}</p>}
        {mapInfo.code && <p>קוד רת"א: {mapInfo.code}</p>}
        {mapInfo.name && <p>שם: {mapInfo.name}</p>}
        {mapInfo.minalt && <p>סגור מגובה {mapInfo.minalt === "GND" ? "הקרקע": mapInfo.minalt === "MSL" ? "פני הים" : mapInfo.minalt === "MSL/GND" ? "פני הים/קרקע" : mapInfo.minalt} {mapInfo.maxalt === "UNL" ? "בכל גובה" : `ועד גובה ${mapInfo.maxalt} רגל`}</p>}
        {mapInfo.minAlt && <p>סגור מגובה {mapInfo.minAlt === "0" ? "הקרקע":mapInfo.minalt} ועד גובה {mapInfo.maxAlt} רגל</p>}
        {mapInfo.reason && <p>סיבת סגירה: {mapInfo.reason}</p>}
        {mapInfo.type === "שמורות טבע" || mapInfo.type === "גובה מינימום 500" || !mapInfo.type ? null : <p>סוג: {mapInfo.type}</p>}
        {mapInfo.permit && <p>{mapInfo.permit}</p>}
        {mapInfo.routs && <p>דרכי הגעה: {mapInfo.routs}</p>}
        {mapInfo.info && <p>מידע נוסף: {mapInfo.info}</p>}
        {mapInfo.nickName && <p>מידע נוסף: {mapInfo.nickName}</p>}
      </div>
      {mapInfo.img_url && <img style={{pointerEvents:"none"}} src={mapInfo.img_url} />}
    </div>
  )
}
