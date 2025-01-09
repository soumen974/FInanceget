import React ,{ useEffect,useState} from 'react'
import { api } from "../../AxiosMeta/ApiAxios";
export  function authCheck() {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [name , setName] =useState('Soumen Bhunia');
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        try{
           const response = await api.get('/api/auth/protected');
            setMessage(response.data);
            setName(response.data.name);
            setAuth(true);
            // console.log('Response Data:', response.data);
        }    
        catch(err){
            setError(err.response?.data || err.message || 'Something went wrong');
            console.log(error);
        }
    }
    
  return { auth ,loading, error, message ,name };
};
