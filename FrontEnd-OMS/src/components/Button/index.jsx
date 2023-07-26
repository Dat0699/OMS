import React, { useState } from 'react';
import './style.css'


const Button = (props) => {
   const {label = 'button', className = '', onClick, style} = props;
   const [ state, setState ] = useState({
   });

   return (
        <div style={style} className={`button  ${className}`} onClick={() => onClick && onClick()}>
            {label}
        </div>
   )
}

export default Button;