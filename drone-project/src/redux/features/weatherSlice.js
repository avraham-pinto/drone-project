import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async ({ latitude, longitude }) => {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,cloudcover_low,visibility,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,windgusts_10m&daily=sunrise,sunset&forecast_days=5&timezone=auto`
    );
    return response.data;
    
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    latitude: 0,
    longitude: 0,
    data: null,
    status: 'idle',
    error: null,
    isFirstRender: true,
  },
  reducers: {
    setLatitude: (state, action) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload;
    },
    setIsFirstRender: (state) => {
        state.isFirstRender = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setLatitude, setLongitude, setIsFirstRender } = weatherSlice.actions;

export default weatherSlice.reducer;
