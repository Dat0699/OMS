import React from "react";

import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from "../../components/Input";
import LogoHostpital from '../../assets/icon/hostpital.svg'




import './styles.css'

const Login = () => {


    return (
        <div className="login-page flex flex-col" style={{justifyContent: "space-around", alignItems: "center"}}>
            <div className="flex flex-col">
                <span className="big-label flex" style={{justifyContent: "center"}}>
                    OUTPATIENTS
                </span>
                <span className="big-label">
                    MANGEMENT SYSTEM
                </span>
            </div>
            <Modal 
                visible={true}
                content={(
                    <div className="form-login section-col" style={{justifyContent: 'space-evenly'}}>
                      
                        <div className="flex flex-row" style={{gap: "45px"}}>
                            <div className="flex flex-col" style={{gap: "12px"}}>
                                <div className="section-row">
                                    <Input className="input-valid" style={{width: "300px"}} placeHolder="Username"/>
                                </div>
                                <div className="section-row">
                                    <Input className="input-valid"  type='password' style={{width: "300px"}} placeHolder="Password"/>
                                </div>
                            </div>
                            <div className="section-col" style={{alignSelf: 'end', marginTop: '20px', }}>
                                <Button label='Sign In' style={{width: "280px", color: "white", height: "60px", fontSize: "22px"}} />
                                <span style={{color: "white"}} className="label-type-1 link">Forgot password ?</span>
                            </div>

                        </div>

                       
                    </div>
                )}
            />
        </div>
    )
}

export default Login;