import React, { useEffect } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Collapse,
  Typography,
  Avatar,
  Select,
  Option
} from "@material-tailwind/react";
import SelectFalcuty from '../../components/SelectFalcuty'
import SelectGender from '../../components/SelectGender'
import SelectRole from '../../components/SelectRole'
import { createNewAccount } from '../Doctor/funciton'
import { uploadFile } from '../../Request/axios'

const DoctorModal = (props) => {
  const { reloadListPatient, detailDoctor, onCloseModal, disabled, reloadlistDoctor } = props;

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
  });

  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const createNewAccountDoctor = async () => {
    if(!state?.fullName || !state?.age || !state?.phoneNumber || !state?.username || !state?.password) {
        alert("Vui lòng điền đầy đủ thông tin")
        return;
    }

    const data = {
      ...state,
      faculty: userInfo?.faculty === 'ALL' ? state?.faculty : userInfo?.faculty,
      role: userInfo?.isAdmin ? state?.role : 'BS',
    }
    const rs = await createNewAccount(data);
    if(rs?.status === 200) {
        alert('Tạo tài khoản thành công');
        await reloadlistDoctor()
        setTimeout(() => {
          setOpen(false);
        }, 50) 
    }
  }

  const onPickFile = async (e) => {
    const selectedFile = e.target.files;
    for (let i = 0; i < selectedFile.length; i++) {
        const curItem = selectedFile[i]
        const rs = await uploadFile(curItem);
        if(rs) {
            const pathFile = `http://ggvh.myddns.me:5702/api/file/${curItem?.name}`
            console.log('pathFile', pathFile);
            state.avatar = (pathFile);
            setState({...state});
        }
    }
}

  
  const titleModal = detailDoctor?._id ? 'Cập nhật thông tin bác sĩ' : 'Tạo tài khoản'
  return (
    <>
      <Button className='' onClick={() => setOpen(true)} variant="gradient">
        Tạo tài khoản
      </Button>
      <Dialog open={(open || detailDoctor?._id)} className="min-h-[800px]">
        <DialogHeader className="flex gap-3">
          <span>
            {titleModal}
          </span>
        </DialogHeader>
        <div className="w-full p-4 flex flex-col gap-5">
          <div className="flex gap-2 items-center">
              <img src={state.avatar} alt="12" className="relative inline-block h-32 w-32 rounded-full object-cover object-center"/>
              <input type="file" className="w-[100px] h-8" onChange={onPickFile}/>
  
          </div>
          <div className="flex gap-2">
            <Input label="Tên tài khoản" type='text' onChange={(e) => setState({...state, username: e.target.value})}/> 
            <Input label="Mật khẩu" type='password' onChange={(e) => setState({...state, password: e.target.value})}/> 
            <Input label="Email" type='text' onChange={(e) => setState({...state, email: e.target.value})}/> 
          </div>

          <Input label="Họ và tên" type='text' onChange={(e) => setState({...state, fullName: e.target.value})}/>   
          <Input label="Địa chỉ" type='text' onChange={(e) => setState({...state, address: e.target.value})}/>   
          <Input label="Ngày tháng năm" type='date' onChange={(e) => setState({...state, age: e.target.value})}/> 
          <Input label="Số điện thoại" type='text' onChange={(e) => setState({...state, phoneNumber: e.target.value})}/>
           
          <SelectGender onSelectGender={(value) => setState({...state, gender: value})}/>
          {(userInfo?.faculty === 'ALL' && userInfo?.role == 'TK' || userInfo?.isAdmin) && (
            <SelectFalcuty onChange={(value) => setState({...state, faculty: value})}/>
          )}

          {(userInfo?.isAdmin) && (
            <SelectRole onChange={(value) => setState({...state, role: value})}/>
          )}

        </div>
        
        <DialogFooter className="absolute bottom-3 right-1">
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Huỷ</span>
          </Button>
          <Button variant="gradient" color="green" onClick={createNewAccountDoctor}>
            <span>Tạo</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DoctorModal;