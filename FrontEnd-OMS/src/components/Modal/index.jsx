import React, { useState } from 'react';
import './style.css'


const Modal = (props) => {
   const {visible = false, className = '', content, header, hasBackDrop} = props;
   const [ state, setState ] = useState({
        visible: visible
   });

   if(!visible || !state.visible) {
        return null
   }

   return (
        <div className={`modal  ${className}`}>
            {content}
        </div>

   )
}

export default Modal;