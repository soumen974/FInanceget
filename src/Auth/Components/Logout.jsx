import React ,{useState} from 'react'
import { api } from "../../AxiosMeta/ApiAxios";
export default function Logout() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout = async () =>{
        try{
            const response = await api.post('/api/auth/logout');
            localStorage.removeItem('authData');
            localStorage.removeItem('rememberedEmail');
            window.location.href='/';
        }catch(err){
            localStorage.removeItem('authData');
            window.location.href='/';
        }
    }
  return { handleLogout , loading, error, message };
}
