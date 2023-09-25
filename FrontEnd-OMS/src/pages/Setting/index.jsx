import React, { useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import SelecFalcuty from '../../components/SelectFalcuty'
import SelectGender from '../../components/SelectGender'
import SelectRole from '../../components/SelectRole'
import { updateUser, getDetailUser } from '../../pages/Doctor/funciton';
import { uploadFile } from '../../Request/axios'

import "./style.css";

const SettingPage = () => {
    const userDefault = JSON.parse(localStorage.getItem('user-info'));
    const disaledEdit = (userDefault.role !== 'TK' && !userDefault?.isAdmin)
    const [state, setState] = useState({
        ...userDefault,
        avatar: userDefault?.avatar,
        setting: {
            pageLength: userDefault?.setting?.pageLength || 5
        }
    })
    let debounce = null;
    const onSaveInfo = async () => {
        if(debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(async () => {
            const data ={ 
                ...state,
            }
            const rs = await updateUser(data, userDefault?._id);
            if(rs?.status === 200) {
                const rs2 = await getDetailUser(userDefault?._id);
                if(rs2?.status == 200) {
                    localStorage.setItem('user-info', JSON.stringify(rs2?.data))
                    setState(prev => ({...prev, ...rs2?.data}));
                    alert('Cập nhật thành công')
                }
            }
        }, 300)
    }

    const onPickFile = async (e) => {
        const selectedFile = e.target.files;
        for (let i = 0; i < selectedFile.length; i++) {
          const curItem = selectedFile[i]
          const rs = await uploadFile(curItem);
          if (rs) {
            const pathFile = `http://ggvh.myddns.me:5702/api/file/${curItem?.name}`
            console.log('pathFile', pathFile);
            setState(prev => ({...prev, avatar: pathFile}))
          }
        }
      }

    return (
            <div className="setting-page flex justify-between !rounded h-full w-full">
                <div className="relative w-full flex justify-center items-center gap-10 overflow-auto h-full  bg-gray-100 mr-1">
                    <div className="absolute left-[40%] top-[10px] flex gap-2 items-center">
                        <img src={state?.avatar} alt="12" className="relative inline-block h-32 w-32 rounded-full object-cover object-center"/>
                        <input type="file" className="w-[100px] h-8" onChange={onPickFile}/>
            
                    </div>
                    <div className="w-full pl-2 flex flex-col items-center justify-around gap-14 mt-24">
                        <Input label="Họ tên" className="" defaultValue={state?.fullName} onChange={(e) => setState(prev => ({...prev, fullName: e.target.value}))}/>
                        <Input label="Tài khoản" defaultValue={state?.username}  onChange={(e) => setState(prev => ({...prev, username: e.target.value}))} disabled={disaledEdit}/>
                        <Input label="Mật khẩu" type="password" defaultValue={state?.password}  onChange={(e) => setState(prev => ({...prev, password: e.target.value}))}/>
                        <Input label="Email" defaultValue={state?.email}  onChange={(e) => setState(prev => ({...prev, email: e.target.value}))}/>
                        <Input label="Địa chỉ" defaultValue={state?.address}  onChange={(e) => setState(prev => ({...prev, address: e.target.value}))}/>
                        <Input type="number" label="Số trang hiển thị" defaultValue={state?.setting?.pageLength}  onChange={(e) => setState(prev => ({...prev, setting: {pageLength: e.target.value}}))}/>
                    </div>
                    <div className="w-full pr-2 flex flex-col items-center justify-around gap-14">
                        <Input label="Số điện thoại" defaultValue={state?.phoneNumber}  onChange={(e) => setState(prev => ({...prev, phoneNumber: e.target.value}))}/>
                        <SelectGender value={state?.gender} onChange={(e) => setState(prev => ({...prev, gender: e}))}/>
                        <Input label="Ngày sinh" type="date" defaultValue={new Date(state?.age).toISOString().substr(0, 10)}/>
                        <SelecFalcuty value={state?.falcuty} disabled={disaledEdit} onChange={(e) => setState(prev => ({...prev, falcuty: e}))}/>
                        <SelectRole value={state?.role} disabled={disaledEdit} onChange={(e) => setState(prev => ({...prev, role: e}))}/>
                    </div>
                      
                </div>
                <Button variant="gradient" color="green" className='' onClick={() => onSaveInfo()}>
                    <span>Lưu</span>
                </Button>
                <div className="w-full rightSettingSide"></div>

            </div>
    )
}

export default SettingPage;