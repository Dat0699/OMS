import React, { useState } from 'react';
import './style.css'


const Input = (props) => {
   const {className = '', onChangeValue, type ='text', style, placeHolder=""} = props;
   const [ state, setState ] = useState({
   });


   const onChange = (e) => {
     if(typeof onChangeValue === 'function') {
          onChangeValue(e.target.value);
     }
   }

   return (
        <input style={style}className={`input ${className}`} onChange={onChange} type={type} placeholder={placeHolder}/>
   )
}

export default Input;