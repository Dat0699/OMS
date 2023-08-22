import React from "react"
import ListPeopleIcon from "../../assets/picture/login-bg.png";
import {logout} from '../../pages/Doctor/funciton'


import "./style.css"


const Header = () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));

    const onLogOut = async () => {
        await logout()
    }

    return (
        <div className="header !z-0">
            <div className="logo-header">OMS SYSTEM</div>
            <div className="flex" style={{gap: "10px", alignItems: "center", fontWeight: "bold", color: "white"}}>
                <span>Welcome</span>
                <span className="cursor-pointer">{userInfo?.fullName}</span>
                <img src={ListPeopleIcon} alt="" style={{borderRadius: "100px", height: "30px", width: "30px", cursor: "pointer"}}/>
                <span className="cursor-pointer hover:underline text-sm" onClick={onLogOut}>Đăng xuất</span>
            </div>

        </div>
    )

}


export default Header;