import React from 'react'
import whatsappicon from '../assets/whatsapp-icon.svg'
import googleGmail from '../assets/googleGmail.svg'
import { Link } from 'react-router-dom'
import { isMobile } from '../component/formStyle'

export default function Footer() {
  return (
    <footer style={{height: "3vh" , fontSize : "0.75rem" , backgroundColor : "grey" , position : "fixed", bottom : "0" , width: "100%" , display: 'flex' , alignItems: 'center', justifyContent: 'center'}}>
        <span style={{marginRight: '6px'}} >developed by avraham pinto{isMobile? "" : ', fullstack developer'}. all rights saved.{isMobile? '' : " contact me :"}</span>
        
        <a href="https://wa.me/972547314669" target='_blank'><img src={whatsappicon} alt="whatsappicon" style={{height: '1rem' , marginRight: '8px' }} /></a>
        <a href={"mailto:ap46412245@gmail.com"} target='_blank'><img src={googleGmail} alt='email icon' style={{height: '1rem'}} ></img></a>
        </footer>
  )
}
