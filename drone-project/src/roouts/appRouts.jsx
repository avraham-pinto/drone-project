import React from 'react'
import {BrowserRouter as  Router , Routes , Route} from 'react-router-dom'
import Layout from '../shared/layout'
import Map from '../component/map'
import AddMarker from '../component/addMarker'
import NotFound404 from '../component/notFound404'
import Login_register from '../component/login_register'
import OwnMarkers from '../component/ownMarkers'
import SingelMarker from '../component/singelMarker'

export default function () {
  return (
    <div>
            <Router>
                <Routes>
                    <Route path='/'  element = {<Layout/>} >
                        <Route path='/' element = {<Map/> }/>
                        <Route path='/addmarker' element ={<AddMarker/>} />
                        <Route path='/user/login-register/:method' element={<Login_register/>} />
                        <Route path='*' element = {<NotFound404/>} />
                        <Route path='/user/markers' element = {<OwnMarkers/>} />
                        <Route path='/user/markers/single/:id' element = {<SingelMarker/>} />
                    </Route>
                </Routes>
            </Router>
        
    </div>
  )
}
