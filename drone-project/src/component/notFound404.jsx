import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound404() {

  const nav = useNavigate();
  
  return (
    <div dir='rtl' style={{display:"flex" , flexDirection:"column"}} >
        <h2 style={{fontSize: "2rem" , fontWeight: "500" , textAlign :"center" ,marginTop : "2rem" }} >נראה שהדף שחיפשת לא קיים</h2>
        <p style={{textAlign:"center" , marginTop:"1rem"}} >שגיאה 404</p>
        <button onClick={()=>{nav(-1)}}
        ref={(button) => {
                    if (button) {
                      const buttonWidth = button.offsetWidth;
                      button.style.marginRight = `calc(50% - ${buttonWidth / 2}px)`;
                    }
                  }}
                  className='button'
        style={{width: '15rem'}}          
        > חזור אחורה </button>
    </div>
  )
}
