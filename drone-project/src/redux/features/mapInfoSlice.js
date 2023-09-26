import {createSlice} from '@reduxjs/toolkit'

const initialState = {empty : true};

const mapInfoSlice = createSlice({
    name: 'mapInfo',
    initialState,
    reducers:{
        setInfo:(state, action)=>{
            return action.payload;
        },
        clearInfo:(state , action)=>{
            return initialState;
        }
    }
})

export const {setInfo , clearInfo} = mapInfoSlice.actions;

export default mapInfoSlice.reducer;