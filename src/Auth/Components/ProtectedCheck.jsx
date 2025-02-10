import React ,{ useEffect,useState} from 'react'
import { api } from "../../AxiosMeta/ApiAxios";
export  function authCheck() {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [name , setName] =useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState(false);
    const[userType, setUserType] = useState('user');
    const [isAction,setIsAction]= useState('');
    useEffect(() => {
        checkAuth();
        userProfile();
    }, [isAction])
    // console.log(isAction);

    const checkAuth = async () => {
        try{
           const response = await api.get('/api/auth/protected');
            setMessage(response.data);
            // setName(response.data.name);
            setUserEmail(response.data.email);
            setAuth(true);
            // console.log('Response Data:', response.data);
        }    
        catch(err){
            setError(err.response?.data || err.message || 'Something went wrong');
            // console.log(error);
        }
    }

    const userProfile = async () => {
        try{
           const response = await api.get('/api/user');
            setMessage(response.data);
            setName(response.data.name);
            setUserEmail(response.data.email);
            setUserType(response.data.type);
            setAuth(true);
            // console.log('Response Data:', response.data);
        }    
        catch(err){
            setError(err.response?.data || err.message || 'Something went wrong');
            console.log(error);
        }
    }
    
  return { auth ,loading, error, message ,name ,userEmail,userType,setIsAction};
};
