import React, { useState } from "react";
import ListIcon from "../../assets/icon/list.svg";
import ListPeopleIcon from "../../assets/icon/list-people.svg";
import SettingIcon from "../../assets/icon/setting.svg";

import "./style.css"

const option = [
    { label: "Quản lý nhân viên", path: "/doctor", icon: ListPeopleIcon},
    { label: "Quản lý bệnh nhân", path: "/patient", icon: ListIcon},
    { label: "Cài Đăt", path: "/setting", icon: SettingIcon},
]
const Dashboard = () => {
    const onChangePage = (url) => {
        window.location.href = url
    }
    
    return (
        <div className="flex dashboard-page" style={{height: "100vh", justifyContent: "center", alignItems: "center"}}>
            <div className="flex sub-page " style={{justifyContent: "center", alignItems: "center", gap: "80px", flexWrap: "wrap", margin: "auto"}}>
                {option.map((item) => {
                    return (
                        <div className="item-label flex flex-col" onClick={() => onChangePage(item.path)} style={{alignItems: "center", gap: "20px", cursor: "pointer"}}>
                            <img src={item.icon} alt="" style={{width: "80px", height: "80px" , }}/>
                            <span className="" style={{fontSize: "28px"}}>
                                {item.label}
                            </span>
                        </div>
                    )
                })}
            
            </div>
        </div>
    )

}



export default Dashboard;