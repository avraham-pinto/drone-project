import { API_URL, NAME_KEY, doApiGet } from './apiService'

export async function auth() {
    const url =  '/users/checkToken';
    try {
        const response = await doApiGet( API_URL + url );
        if (response.role){
           return true;
        }
        else{
           return false;
        }
    } catch (error) {
        return false
    }
}

export async function userData() {
    const url =  '/users/checkToken';
    try {
        const response = await doApiGet( API_URL + url );
        if (response.role){
           return response;
        }
        else{
           return null;
        }
    } catch (error) {
        throw error;
    }
}

export async function authAdmin() {
    const url =  '/users/checkToken';
    try {
        const response = await doApiGet( API_URL + url );
        if (response.role === 'admin' || response.role === 'superAdmin'){
           return true;
        }
        else{
           return false;
        }
    } catch (error) {
        throw error;
    }
}
