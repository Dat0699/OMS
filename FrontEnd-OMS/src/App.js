import React, {useEffect} from 'react';
import { RenderingPage } from './Router/index'
import Header from "./components/Header"


import './App.css'

function App() {
  const token = localStorage.getItem('user-token');
  if(window.location.pathname === '/') {
    window.location.pathname ='/dashboard'

  }
  useEffect(() => {
    if(!token) {
        if(window.location.pathname !== '/login') {
          window.location.pathname ='/login'
        }
    }
  }, [token])
  return (
      <div>
        {window.location.pathname !== "/login" && (<Header/>)}
        {RenderingPage()}
      </div>
  );
}

export default App;
