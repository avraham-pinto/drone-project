import {configureStore} from '@reduxjs/toolkit'
import mapInfoReducer from './features/mapInfoSlice'
import weatherReducer from './features/weatherSlice'

const myStore = configureStore({
    reducer:{
       mapInfo: mapInfoReducer,
       weather: weatherReducer
    }
});

export default myStore;