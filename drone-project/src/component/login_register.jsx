import React, { useEffect, useState } from 'react';
import {helpTextStyle,divStyle,labelStyle,inputStyle,sapnErrorStyle,loadingOverlay,loadingText,modal,textError} from './formStyle'
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { API_URL, DRONE_KEY, NAME_KEY, TOKEN_KEY, doApiMethod } from '../services/apiService';
import './ButtonGroup.css';
import { auth } from '../services/auth';

const Login_register = () => {
  const { register, formState: { errors }, handleSubmit, watch, resetField, reset } = useForm()
  const [isLogin , setIsLogin] = useState(null);
  const [processError , setProcessErorr] = useState(null);
  const [loading , setLoading] = useState(false);
  const [success , setSuccess] = useState(false);
  const [isUser , setIsUser] = useState(false);
  const { method } = useParams();
  const nav  = useNavigate()

  useEffect(()=>{
    getParam();
  },[])

  useEffect(()=>{
    const authUser = async ()=> {
      try {
        const response =  await auth()
        setIsUser(response)
      } catch (error) {
        return false;
      }
    }
    authUser();
  },[])

  const getParam = ()=> {
    if(method === 'register' ){
      setIsLogin(false);
    }
    else{
      setIsLogin(true);
    }
  }
  

  const handleButtonClick = (buttontype) => {
    setIsLogin(buttontype)
    reset({password: '' , confirmPassword : ''});
    buttontype ? nav("/user/login-register/login") : nav("/user/login-register/register")
  };

  const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  async function onSub(bodyData){
    console.log(bodyData);
    setLoading(true);
    delete bodyData.confirmPassword;
    isLogin? (delete bodyData.nickName, delete bodyData.drone)  : null;
    
    try {
      const url = isLogin? '/users/login' : '/users';
      const response = await doApiMethod(API_URL +  url, "POST", bodyData);
      if (response.token){
        localStorage.setItem(TOKEN_KEY , response.token)
        localStorage.setItem(DRONE_KEY ,response.drone )
        localStorage.setItem(NAME_KEY, response.nickName)
        setSuccess(true)
      }
      if (response.role){
        setSuccess(true)
      }

    } catch (error) {
      console.log(error)
      if (error.response.data.code === 11000){
        if('nickName' in error.response.data.value){
          setProcessErorr('שם משתמש בשימוש כבר, בחר שם אחר')
        }
        else if('email' in error.response.data.value){
          setProcessErorr('מייל קיים במערכת, עבור להתחברות')
        }
        else{
          setProcessErorr('שגיאה, בדוק שהפרטים שהוזנו תקינים')
        }
      }
      else if(error.response.data.err == "Email & password dont match"){
        setProcessErorr('מייל וסיסמה לא תואמים')
      }
      else{
        setProcessErorr( 'שגיאה כללית:' + error.response.data.err)
      }
      
    }
    reset();
  }
  


  return (
    <div style={{height:'100svh' ,direction:'rtl', marginTop: '' }} >
      <h2 style={{fontWeight : '500' , fontSize : '25px' , textAlign: 'center' , marginTop: '5px' , marginBottom: '5px'}} >מסך התחברות/הרשמה</h2>
        <div style={divStyle} >
          <div className="button-group" style={{width:'11.6rem' , marginRight:'calc(50% - (11.6rem /2))' }}  >
              <button className={`buttons ${isLogin === true ? 'active' : ''}`}
                  onClick={() => handleButtonClick(true)}>
                  התחבר
              </button>
              <button className={`buttons ${isLogin === false ? 'active' : ''}`}
                  onClick={() => handleButtonClick(false)}>
                  הרשם
              </button>
          </div>
          <div>
              <form onSubmit={handleSubmit(onSub)}>
                {!isLogin && <div>
                  <label style={labelStyle} htmlFor="nickName">בחר כינוי/ שם משתמש</label>
                  <input style={inputStyle} type="text" id="nickName" placeholder='כינוי/ שם משתמש' maxLength={25} {...register('nickName',{required:{value:true,message:"חובה לבחור שם משתמש"},minLength:{value:3,message:"בחר שם משתמש באורך 3 תווים לפחות"},maxLength:{value:25,message:"בחר שם משתמש באורך 25 תווים מקסימום"}})} />
                  {errors.nickName && <span style={sapnErrorStyle}>{errors.nickName.message}</span>}
                </div>}
                <div>
                  <label style={labelStyle} htmlFor="email">כתובת מייל</label>
                  <input style={inputStyle} type="email" id="email" placeholder='מייל' maxLength={1000} {...register('email',{required:{value:true,message:"חובה להזין מייל"},pattern: { value: emailReg, message:"מייל לא תקין"}})} />
                  {errors.email && <span style={sapnErrorStyle}>{errors.email.message}</span>}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="password">סיסמה</label>
                  <input style={inputStyle} type="password" id="password" placeholder='סיסמה' maxLength={10000} {...register('password',{required:{value:true,message:"חובה להזין סיסמה"} /*,minLength:{value:6,message:"סיסמה חייבת להיות באורך 6 תווים לפחות"},maxLength:{value:1000,message:"סיסמה ארוכה מדי"}*/, pattern:{value: passwordPattern , message: 'סיסמה חייבת להיות באורך 6 תווים לפחות ולכלול אות גדולה אות קטנה וספרה אחת לפחות'}})} />
                  {errors.password && <span style={sapnErrorStyle}>{errors.password.message}</span>}
                </div>
                {!isLogin && <div>
                  <label style={labelStyle} htmlFor="confirmPassword">אימות סיסמה</label>
                  <input style={inputStyle} type="password" id="confirmPassword"
                    placeholder='אמות סיסמה' maxLength={10000} {...register('confirmPassword', {required: { value: true, message: "חובה לאמת סיסמה" },
                      validate: (value) =>
                        value === watch('password')
                          ? true
                          : 'הסיסמאות אינן תואמות',
                    })}
                  />
                  {errors.confirmPassword && <span style={sapnErrorStyle}>{errors.confirmPassword.message}</span>}
                </div>}
                {!isLogin && <div>
                  <label style={labelStyle} htmlFor="drone">בחר רחפן</label>
                  <select {...register('drone')} style={inputStyle} name="drone" id="drone" defaultValue=''>
                    <option value="">בחר רחפן</option>
                    <option value="mavic 3 pro">mavic 3 pro</option>
                    <option value="mavic 3">mavic 3</option>
                    <option value="mavic 3 clasic">mavic 3 clasic</option>
                    <option value="mavic pro">mavic pro</option>
                    <option value="mini 3 pro">mini 3 pro</option>
                    <option value="mini 2se">mini 2se</option>
                    <option value="mini se">mini se</option>
                    <option value="mini 2">mini 2</option>
                    <option value="mavic mini">mavic mini</option>
                    <option value="air 2">air 2</option>
                    <option value="air 2s">air 2s</option>
                    <option value="mavic air">mavic air</option>
                    <option value="mavic 2">mavic 2</option>
                    <option value="avata">avata</option>
                    <option value="fpv">fpv</option>
                  </select>
                </div>}
                <div>
                  <button ref={(button) => {
                    if (button) {
                      const buttonWidth = button.offsetWidth;
                      button.style.marginRight = `calc(50% - ${buttonWidth / 2}px)`;
                    }
                  }}
                  onClick={()=>{const focusedElement=document.activeElement;if(focusedElement){focusedElement.blur();}}}
                  className='button' style={{marginTop:'0.9rem'}}>{isLogin?'התחבר' : 'הרשם'}</button>
                </div>
              </form>
          </div>
        </div>
        {(loading || isUser) && (
        <div tabIndex={-1} style={loadingOverlay}>
          <div style={modal}>
            {!processError && !success && !isUser && <>
            <div className='loader'></div>
            <div style={loadingText}>טוען....</div>
            </> }
            {success && <>
            <h5 style={{marginBottom:'1rem'}}>{isLogin? 'התחברת בהצלחה':'חשבון נוצר בהצלחה'}</h5>
            <button className='button' onClick={() => {setLoading(false), isLogin?  (nav('/'), window.location.reload()) :  (nav('/user/login-register/login') ,  window.location.reload())}} >{isLogin ? 'עבור למסך הבית' : 'עבור למסך התחברות'}</button>
            </>}
            {processError && <>
              <h4 >שגיאה</h4>
              <p style={textError}>{processError}</p>
              <button className='button' onClick={() => {setLoading(false) , setProcessErorr(null) }} >חזור אחורה</button>
              </> }
            {isUser && <div><p>הנך מחובר כבר</p>
            <button style={{marginTop: '1rem'}} className='button' onClick={() =>{nav("/")}} >חזור לדף הבית</button>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login_register;
