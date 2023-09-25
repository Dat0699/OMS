import React, { useLayoutEffect, useState } from "react";
import Modal from '../../components/Modal';
import Input from "../../components/Input";
import { login, checkAuth } from './function'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

import './styles.css'

const Login = () => {

    const [state, setState] = useState({
        username: '',
        password: '',
        isOpenModalCheck : false,
        emailCheck: '',
        codeCheck: ''
    });

    
    const checkIsLogin = localStorage.getItem('user-token');

    const onChangeValue = (value, type) => {
        state[type] = value;
        setState({ ...state });
    }

    const onSubmitLogin = async () => {
        if (!(state.password && state.username)) {
            alert('Please Fill Up Value');
            return;
        }
        const res = await login(state);
        // if(res?.data?.status === 200) { 
        if(res?.data.status === 200) {
            setState(prev => ({...prev, isOpenModalCheck: true, emailCheck: res?.data.data?.email}));
        } else {
            alert(res?.data?.message);
        }
    }

    const onCheckAuth = async () => {
        const rs = await checkAuth(state.codeCheck);
        if(rs?.data?.status === 200) {
            console.log('rs', rs);
            onSetToken({user:rs?.data?.data, token: rs?.data?.data?.token});
            window.location.pathname = '/dashboard';
            alert(rs?.data?.message);
        }
    }

    const onResendCode = async () => {
        await onSubmitLogin();
        alert('Your code was be resend')
    }

    const onSetToken = (data) => {
        const { token, user } = data;
        if (!token) return;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user-info", JSON.stringify(user));
    }

    useLayoutEffect(() => {
        if (checkIsLogin) {
            window.location.pathname = '/dashboard';
        }
    }, [checkIsLogin])


    return (
        <div className="login-page flex flex-col" style={{ justifyContent: "space-around", alignItems: "center" }}>
            <div className="flex flex-col absolute top-[10%]">
                <span className="big-label flex" style={{ justifyContent: "center" }}>
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
                    <div className="form-login section-col" style={{ justifyContent: 'space-evenly' }}>

                        <div className="flex flex-row" style={{ gap: "45px" }}>
                            <div className="flex flex-col" style={{ gap: "12px" }}>
                                <div className="section-row">
                                    <Input className="input-valid bg-white rounded-full !h-12" style={{ width: "300px" }} placeHolder="Username" onChangeValue={(value) => onChangeValue(value, "username")} />
                                </div>
                                <div className="section-row">
                                    <Input className="input-valid bg-white rounded-full !h-12" type='password' style={{ width: "300px" }} placeHolder="Password" onChangeValue={(value) => onChangeValue(value, "password")} />
                                </div>
                            </div>
                            <div className="section-col" style={{ alignSelf: 'end', marginTop: '20px', }}>
                                <Button onClick={onSubmitLogin} variant="gradient" className="!bg-blue-500 w-[280px] rounded-full" style={{background: "rgba(93,224,230,1)"}}>
                                    Đăng nhập
                                </Button>
                                <Dialog open={state.isOpenModalCheck} handler={onSubmitLogin}>
                                    <DialogHeader className="flex justify-center items-center">Mã xác nhận đã gửi về email {state?.emailCheck}</DialogHeader>
                                    <DialogBody divider>
                                      <Input className='!h-10 !border-1 !border-solid !border-black !w-full' onChangeValue={(value) => onChangeValue(value, "codeCheck")}/>
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="text"
                                            color="blue"
                                            onClick={onResendCode}
                                            className="mr-1"
                                        >
                                            <span>Gửi lại mã</span>
                                        </Button>
                                        <Button variant="gradient" color="green" onClick={onCheckAuth}>
                                            <span>Xác nhận</span>
                                        </Button>
                                    </DialogFooter>
                                </Dialog>
                                <span style={{ color: "white" }} className="label-type-1 link">Forgot password ?</span>
                            </div>

                        </div>


                    </div>
                )}
            />
        </div>
    )
}

export default Login;