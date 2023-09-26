import axios from "axios";

export const API_URL = "***********";

export const TOKEN_KEY = "t_k";

export const DRONE_KEY = "d_k"

export const NAME_KEY = "n_k"


export const doApiGet = async(_url) => {
  try{
    const {data} = await axios({
      url:_url,
      method:"GET",
      headers:{
        "x-api-key":localStorage[TOKEN_KEY]
      }
    })
    return data;
  }
  catch(err){
    console.log(err);
    throw err;
  }
}
export const doApiMethod = async(_url, _method,_bodyData) => {
  try{
    const {data} = await axios({
      url:_url,
      method:_method,
      data:_bodyData,
      headers:{
        "x-api-key":localStorage[TOKEN_KEY]
      }
    })
    
    return data;
  }
  catch(err){
    console.log(err)
    throw err;
  }
}