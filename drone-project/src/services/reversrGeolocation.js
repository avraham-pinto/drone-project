import axios from 'axios';

export const reverseGeolocation = async (lat, lng) => {
  const apiKey = 'AIzaSyCgh59qIOj0Os7TsSfFf0x25AcqLwzMCCE';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=he&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length > 0) {
      let city = '';
      let region = '';
      let country = '';

      for (let i = 0; i < results.length; i++) {
        const addressComponents = results[i].address_components;
        const componentTypes = addressComponents.map(component => component.types[0]);

        if (componentTypes.includes('locality')) {
          city = addressComponents.find(component => component.types.includes('locality')).long_name;
        }

        if (componentTypes.includes('administrative_area_level_1')) {
          region = addressComponents.find(component => component.types.includes('administrative_area_level_1')).long_name;
        }

        if (componentTypes.includes('country')) {
          country = addressComponents.find(component => component.types.includes('country')).long_name;
        }

        if (city && region && country) {
          break;
        }
      }

      if(!country){
        if(isWithinIsrael(lat, lng) || isWithinWestBank(lat, lng)){
            country = 'ישראל'
        }
      }

      if(!region && isWithinWestBank(lat,lng) ){
        region = 'יהודה ושומרון';
      }

      let formattedAddress = '';

      if (city) {
        formattedAddress += `${city}, `;
      }

      if (region) {
        formattedAddress += `${region}, `;
      }

      formattedAddress += country;

      if(!formattedAddress){
         if(isWithinWestBank(lat , lng)){
            formattedAddress = 'יהודה ושומרון, ישראל'
         }
         else{
            formattedAddress = recognizeIsraelLocation(lat,lng)
         }
      }

      return {formattedAddress, country , region , city};
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    throw new Error('Failed to fetch address');
  }

  return '';
};





const israelBoundingBox = {
      north: 33.333,
      south: 29.45,
      west: 34.267,
      east: 35.894
    };

const isWithinIsrael = ( (lat , lng)=> {
    const isWithinIsrael = lat >= israelBoundingBox.south && lat <= israelBoundingBox.north &&
  lng >= israelBoundingBox.west && lng <= israelBoundingBox.east;
  return isWithinIsrael;
})

export const recognizeIsraelLocation = (lat, lng) => {
    if (isWithinIsrael(lat , lng)) {
      if (lat < 31.25) {
        return 'מחוז הדרום, ישראל';
      } else if (lat > 32.7) {
        return 'מחוז הצפון, ישראל';
      } else {
        return 'מחוז המרכז, ישראל';
      }
    }
  
    return 'לא ידוע';
  };

  export const isWithinWestBank = (lat, lng) => {

    const westBankBoundingBox = {
      north: 32.555,
      south: 31.211,
      west: 34.994,
      east: 35.575
    };
  
    const isWithinWestBank = lat >= westBankBoundingBox.south && lat <= westBankBoundingBox.north &&
      lng >= westBankBoundingBox.west && lng <= westBankBoundingBox.east;
  
    return isWithinWestBank;
  };
  
  