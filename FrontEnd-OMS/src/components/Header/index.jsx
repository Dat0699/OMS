import React from "react"
import ListPeopleIcon from "../../assets/picture/login-bg.png";


import "./style.css"


const Header = () => {
    return (
        <div className="header">
            <div className="logo-header">OMS SYSTEM</div>
            <div className="flex" style={{gap: "10px", alignItems: "center", fontWeight: "bold", color: "white"}}>
                <span>Xin Chao:</span>
                <span>Nguyen Van A</span>
                <img src={ListPeopleIcon} alt="" style={{borderRadius: "100px", height: "30px", width: "30px", cursor: "pointer"}}/>
            </div>

        </div>
    )

}


export default Header;