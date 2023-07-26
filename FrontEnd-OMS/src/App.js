import React, {useEffect} from 'react';
import { RenderingPage } from './Router/index'
import Header from "./components/Header"


import './App.css'

function App() {
 
  return (
      <div>
        {window.location.pathname !== "/login" && (<Header/>)}
        {RenderingPage()}
      </div>
  );
}

export default App;
