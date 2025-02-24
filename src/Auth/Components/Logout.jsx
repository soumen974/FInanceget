import React ,{useState} from 'react'
import { api } from "../../AxiosMeta/ApiAxios";
export default function Logout() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout = async () =>{
        try{
            const response = await api.post('/api/auth/logout');
            // console.log(response.data);
            window.location.href='/';
            localStorage.removeItem('rememberedEmail');
        }catch(err){
            // console.log(err.response?.data || err.message || 'Something went wrong');
        }
    }
  return { handleLogout , loading, error, message, loading };
}
