import React, { useLayoutEffect, useState } from "react";
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from "../../components/Input";
import { login } from './function'

import './styles.css'

const Login = () => {

    const [ state, setState ] = useState({
        username: '',
        password: ''
    });

    const checkIsLogin = localStorage.getItem('user-token');

    const onChangeValue = (value, type) => {
        state[type] = value;
        setState({...state});
    }

    const onSubmitLogin = async () => {
        if(!(state.password && state.username)) {
            alert('Please Fill Up Value');
            return;
        }
        const res = await login(state);
        if(res?.data?.status === 200) { 
            console.log('res', res.data);
            const token = res?.data?.data?.token;
            const user = res.data.data;
            onSetToken({token, user});
            window.location.pathname = '/dashboard'
            alert(res?.data?.message);
        } else {
            alert(res?.data?.message);
        }
    }

    const onSetToken = (data) => {
        const { token, user } = data;
        if(!token) return;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user-info", JSON.stringify(user));
    }

    useLayoutEffect(() => {
        if(checkIsLogin) {
            window.location.pathname = '/dashboard';
        }
    }, [checkIsLogin])


    return (
        <div className="login-page flex flex-col" style={{justifyContent: "space-around", alignItems: "center"}}>
            <div className="flex flex-col absolute top-[10%]">
                <span className="big-label flex" style={{justifyContent: "center"}}>
                    OUTPATIENTS
                </span>
                <span className="big-label">
                    MANGEMENT SYSTEM
                </span>
            </div>
            <Modal
                className='absolute !top-[60%] left-[25%]' 
                visible={true}
                content={(
                    <div className="form-login section-col" style={{justifyContent: 'space-evenly'}}>
                      
                        <div className="flex flex-row" style={{gap: "45px"}}>
                            <div className="flex flex-col" style={{gap: "12px"}}>
                                <div className="section-row">
                                    <Input className="input-valid bg-white rounded-full !h-12" style={{width: "300px"}} placeHolder="Username" onChangeValue={(value) => onChangeValue(value, "username")}/>
                                </div>
                                <div className="section-row">
                                    <Input className="input-valid bg-white rounded-full !h-12"  type='password' style={{width: "300px"}} placeHolder="Password" onChangeValue={(value) => onChangeValue(value, "password")}/>
                                </div>
                            </div>
                            <div className="section-col" style={{alignSelf: 'end', marginTop: '20px', }}>
                                <Button label='Sign In' style={{width: "280px", color: "white", height: "60px", fontSize: "22px"}} onClick={() => onSubmitLogin()}/>
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