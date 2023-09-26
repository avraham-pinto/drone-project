import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {doApiMethod , API_URL} from '../services/apiService'
import exifr from 'exifr';
import Resizer from 'react-image-file-resizer';
import {helpTextStyle,labelStyle,inputStyle,sapnErrorStyle,loadingOverlay,loadingText,modal,textError, divStyle} from './formStyle'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';



const AddMarker = () => {
  const { register, formState: { errors }, handleSubmit, resetField, reset } = useForm()
  const [imagePreview, setImagePreview] = useState(null);
  const [processError , setProcessErorr] = useState(null);
  const [loading , setLoading] = useState(false);
  const [success , setSuccess] = useState(false);
  const [isUser , setIsUser] = useState(false);

  const nav = useNavigate();

  useEffect(()=>{
    const authUser = async ()=> {
      try {
        const response =  await auth()
        setIsUser(response);
      } catch (error) {
        return false;
      }
    }
    authUser();
  },[])
  
 async function getCoordinatesFromImage(image) {
   const img = new Image();
   img.src = URL.createObjectURL(image);
   return new Promise((resolve, reject) => {
     img.onload = async () => {
       try {
         const exifData = await exifr.parse(img);
 
         if (!exifData || !exifData.GPSLatitude || !exifData.GPSLongitude) {
           throw new Error('לא נמצאו קורדינצות בתמונה זו, אנא השתמש בתמונה מקורית מהרחפן');
         }
 
         const lat = exifData.GPSLatitude;
         const lon = exifData.GPSLongitude;
         const latRef = exifData.GPSLatitudeRef || 'N';
         const lonRef = exifData.GPSLongitudeRef || 'E';
 
         const latDecimal = convertToDecimal(lat);
         const lonDecimal = convertToDecimal(lon);
 
         resolve({
           lat: latRef === 'S' ? -latDecimal : latDecimal,
           lng: lonRef === 'W' ? -lonDecimal : lonDecimal
         });
       } catch (error) {
         reject(error);
       }
     };
     img.onerror = () => {
       reject(new Error('שגיאה בטעינת התמונה, וודא שהקובץ תקין ונסה שוב'));
     };
   });
 }
 
 function convertToDecimal(coord) {return coord[0] + coord[1] / 60 + coord[2] / 3600;}
   
  const resizeImage = (file) => {
    return new Promise((resolve , reject) =>{
         Resizer.imageFileResizer(
       file,
       500,
       500,
       'JPEG',
       100,
       0,
       (resizedImage) => {
        resolve(resizedImage);
       },
       'blob',
       500,
       500,
       
       (error) => {
         reject(error);
       }
     );
    })
 };
 
  const handleImageChange = (e) => {
    setProcessErorr(null)
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
     reader.readAsDataURL(file);
    }
  };
 
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const coordinates = await getCoordinatesFromImage(data.image[0]);
      data.coordinates = coordinates;
    } catch (error) {
      setProcessErorr(error.message);
      return;
    }
    try {
      try {
        const img = await resizeImage(data.image[0]);
        if (img) {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = async () => {
            try {
              const imgResponse = await doApiMethod(API_URL + "/uploads/no_temp", "POST", { myFile: reader.result, });
              if (imgResponse) {
                data.img_url = imgResponse.secure_url
                delete data.image;
                try {
                  const response = await doApiMethod(API_URL + "/marker" , "POST" , data);
                  if(response){
                    setSuccess(true)
                  }
                } catch (error) {
                  setProcessErorr('אירעה שגיאה כללית, נסה שוב')
                }
              } else{
                setProcessErorr('שגיאה בהעלאת תמונה, נסה שוב')
                return
              }
            } catch (error) {
              setProcessErorr(error.message);
              return
            }
          };
        }else {
          setProcessErorr("שגיאת בreize תמונה, נסה שוב");
          return
        }
       } catch (error) {
          setProcessErorr(error.message);
          return
       }
     } catch (error) {
        setProcessErorr(error.message);
        return
     }
   };
   
   
 
  return (
      <div dir='rtl'>
      { isUser ? <>  <div><h2 style={{fontWeight : '500' , fontSize : '25px' , textAlign: 'center' , marginTop: '5px' , marginBottom: '5px'}} >הוספת מקום עניין במפה</h2></div>
      <div style={divStyle} >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label style={labelStyle} htmlFor="name">שם המקום</label>
            <input style={inputStyle} type="text" id="name" placeholder='שם המקום (חובה)' maxLength={20} {...register('name',{required:{value:true,message:"חובה למלא שם"},minLength:{value:3,message:"מינימום 3 תווים"},maxLength:{value:20,message:"מקסימום 20 תווים"}})} />
            {errors.name && <span style={sapnErrorStyle}>{errors.name.message}</span>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="routs">דרכי הגעה</label>
            <input style={inputStyle} type="text" id="routs" placeholder='דרכי הגעה(אופציונלי)' maxLength={75} {...register('routs',{minLength:{value:5,message:"מינימום 5 תווים"},maxLength:{value:75,message:"מקסימום 75 תווים"}})} />
            {errors.routs && <span style={sapnErrorStyle}>{errors.routs.message}</span>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="info">מידע נוסף</label>
            <textarea style={inputStyle} type="text" id="info" placeholder='מידע נוסף (אופציונלי)' rows={3} maxLength={150} {...register('info',{minLength:{value:5,message:"מינימום 5 תווים"},maxLength:{value:150,message:"מקסימום 150 תווים"}})} />
            {errors.info && <span style={sapnErrorStyle}>{errors.info.message}</span>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="image">בחר תמונה</label>
            <input style={inputStyle} aria-describedby="file_input_help" id="image" type="file" accept='image/*' multiple={false}  {...register('image',{required:{value:true,message:"חובה להעלות תמונה"}})} onChange={handleImageChange}/>
            {errors.image && <span style={sapnErrorStyle}>{errors.image.message}</span>}
            <p style={helpTextStyle} id="file_input_help">התמונה תשמש גם לקביעת המיקום</p>
          </div>
          {imagePreview && <img style={{width:"16rem" , marginBottom:'1rem' , marginRight: 'calc(50% - 8rem)'}} src={imagePreview} alt="Preview" />}
          <br /><button className='button' style={{width:'14rem',marginRight:'calc(50% - 7rem)'}} type="submit" onClick={()=>{const focusedElement=document.activeElement;if(focusedElement){focusedElement.blur();}}} >אישור</button>
        </form>
      </div></> : <div>
        <h2 style={{textAlign: 'center', fontWeight: '500', fontSize: '20px', margin: '8px'}} >עליך להיות משתמש מחובר להוספת נקודה במפה</h2>
        <button ref={(button) => {
                    if (button) {
                      const buttonWidth = button.offsetWidth;
                      button.style.marginRight = `calc(50% - ${buttonWidth / 2}px)`;
                    }
                  }}
                  className='button' onClick={()=>{nav('/user/login-register/login')}} >עבור למסך התחברות/ הרשמה</button>
      </div> }
      {loading && (
        <div style={loadingOverlay}>
          <div style={modal}>
            {!processError && !success && <>
            <div className='loader'></div>
            <div style={loadingText}>טוען....</div>
            </> }
            {success && <>
            <h5 style={{marginBottom:'1rem'}}>נוצר בהצלחה</h5>
            <button className='button' onClick={() => {setLoading(false), nav('/'), window.location.reload()}} >חזור לדף הבית</button>
            </>}
            {processError && <>
              <h4 >שגיאה</h4>
              <p style={textError}>{processError}</p>
              <button className='button' onClick={() => {setLoading(false) , setProcessErorr(null)}} >חזור אחורה</button>
              </> }
          </div>
        </div>
      )}
    </div>
   );
};

export default AddMarker;