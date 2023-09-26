import React, { useEffect, useRef, useState } from 'react'
import { auth } from '../services/auth'
import bars from '../assets/bars.svg'
import xmark from '../assets/xmark.svg'
import user from '../assets/user.svg'
import './nav.css'
import { DRONE_KEY, NAME_KEY, TOKEN_KEY } from '../services/apiService'
import { useNavigate } from 'react-router-dom'

export default function Nav() {
  const [isUser, setIsUser] = useState(false)
  const navRef = useRef();
  const nav = useNavigate();

  useEffect(()=>{
    authUser();
  },[])

  const authUser = async () => {
    try {
      const data = await auth();
      setIsUser(data);
    } catch (error) {
      setIsUser(false)
    }
  }

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

  const disconnect = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(DRONE_KEY);
    nav('/')
    window.location.reload();
  }

  return (
    <header>
      <div>
        <button
			  	className="nav-btn"
			  	onClick={showNavbar}>
			  	<img style={{width: '30px'}} src={bars} alt="" />
			  </button>
        <a style={{marginRight: '10px'}} href="/"><h3 className='gt' >drone club</h3></a>
      </div>
			<nav ref={navRef}>
				<a href="/addmarker">הוסף מיקום</a>
			{isUser &&	<a href="/user/markers">מקומות שהוספתי</a> }
				<a href="">מועדפים</a>
				{ isUser && <a onClick={disconnect} >התנתק</a>}
        {!isUser && <a href='/user/login-register/login' >התחבר / הרשם</a>}
				 <button
        		className="nav-btn nav-close-btn"
        		onClick={showNavbar}>
        		<img style={{ width: '30px'}} src={xmark} alt="" />
      		</button>
			</nav>
        <div style={{backgroundColor: 'lightgray', width: '40px', height: '40px',borderRadius: '50%', display: 'flex' , alignItems: 'center' , justifyContent: 'center'}}>
          {isUser && localStorage.getItem(NAME_KEY) ? <p style={{color: 'black', fontWeight: 'bolder', fontSize: '25px', marginBottom: '5px'}} >{localStorage.getItem(NAME_KEY).substring(0,1)}</p> : <img style={{width: '21px'}} src={user} alt="" />}
         </div>
		</header>
  );
}






