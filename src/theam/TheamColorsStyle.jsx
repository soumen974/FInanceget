import React, {useEffect,useState} from 'react'

export default function TheamColorsStyle() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
      });
      
      
      useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);
      }, [isDarkMode]);
    
      useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          if (!localStorage.getItem('theme')) {
            setIsDarkMode(e.matches);
          }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }, []);

      const baseStyles = {
        heading: `text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`
      };
  return {baseStyles, isDarkMode, setIsDarkMode};
}
