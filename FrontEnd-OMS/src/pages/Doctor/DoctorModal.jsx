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
import { createNewAccount, updateUser } from '../Doctor/funciton'
import { uploadFile } from '../../Request/axios'
const DoctorModal = (props) => {
  const { reloadListPatient, detailDoctor, onCloseModal, disabled, reloadlistDoctor } = props;

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
  });




  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const createNewAccountDoctor = async () => {
    if (!state?.fullName || !state?.age || !state?.phoneNumber || !state?.username || !state?.password) {
      alert("Vui lòng điền đầy đủ thông tin")
      return;
    }

    const data = {
      ...state,
      faculty: userInfo?.faculty === 'ALL' ? state?.faculty : userInfo?.faculty,
      role: userInfo?.isAdmin ? state?.role : 'BS',
    }
    const func = detailDoctor?._id ? updateUser : createNewAccount
    const rs = await func(data);
    if (rs?.status === 200) {
      alert('Thành Công');
      await reloadlistDoctor();
      setTimeout(() => {
        setOpen(false);
      }, 50)
    } else {
      alert('Thất bại! Vui lòng thử lại');
    }
  }

  const onCloseModalDoctor = () => {
    setOpen(false);
    setState({});
    onCloseModal && onCloseModal();
  }

  const onPickFile = async (e) => {
    const selectedFile = e.target.files;
    for (let i = 0; i < selectedFile.length; i++) {
      const curItem = selectedFile[i]
      const rs = await uploadFile(curItem);
      if (rs) {
        const pathFile = `http://ggvh.myddns.me:5702/api/file/${curItem?.name}`
        console.log('pathFile', pathFile);
        state.avatar = (pathFile);
        setState({ ...state });
      }
    }
  }
  useEffect(() => {
    if(detailDoctor?._id) {
      setState({...detailDoctor});
    }
   
  }, [detailDoctor?._id])

  const onRenderDate = (date) => {
    console.log('date', date);
    console.log('123123123', date?.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || "");
    return date?.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || ""
  }

  const titleModal = detailDoctor?._id ? 'Cập nhật thông tin bác sĩ' : 'Tạo tài khoản'
  return (
    <>
      <Button className='' onClick={() => setOpen(true)} variant="gradient">
        Tạo tài khoản
      </Button>
      <Dialog open={(open || state?._id)} className="min-h-[800px]">
        <DialogHeader className="flex gap-3">
          <span>
            {titleModal}
          </span>
        </DialogHeader>
        <div className="w-full p-4 flex flex-col gap-5">
          <div className="flex gap-2 items-center">
            <img src={state.avatar} alt="12" className="relative inline-block h-32 w-32 rounded-full object-cover object-center" />
            <input type="file" className="w-[100px] h-8" onChange={onPickFile} />

          </div>
          <div className="flex gap-2">
            <Input label="Tên tài khoản" type='text' onChange={(e) => setState({ ...state, username: e.target.value })} defaultValue={state?.username}/>
            <Input label="Mật khẩu" type='password' onChange={(e) => setState({ ...state, password: e.target.value })} defaultValue={state?.password}/>
            <Input label="Email" type='text' onChange={(e) => setState({ ...state, email: e.target.value })} defaultValue={state?.email}/>
          </div>

          <Input label="Họ và tên" type='text' onChange={(e) => setState({ ...state, fullName: e.target.value })} defaultValue={state?.fullName}/>
          <Input label="Địa chỉ" type='text' onChange={(e) => setState({ ...state, address: e.target.value })} defaultValue={state?.address}/>
          <Input label="Ngày tháng năm" type='date' onChange={(e) => setState({ ...state, age: e.target.value })} defaultValue={onRenderDate(state?.age)}/>
          <Input label="Số điện thoại" type='text' onChange={(e) => setState({ ...state, phoneNumber: e.target.value })} defaultValue={state?.phoneNumber}/>

          <SelectGender onChange={(value) => setState({ ...state, gender: value })} value={state?.gender}/>
          {(userInfo?.faculty === 'ALL' && userInfo?.role == 'TK' || userInfo?.isAdmin) && (
            <SelectFalcuty onChange={(value) => setState({ ...state, faculty: value })} listData={state?.listData || []} value={state?.faculty}/>
          )}

          {(userInfo?.isAdmin) && (
            <SelectRole onChange={(value) => setState({ ...state, role: value })} value={state?.role}/>
          )}

        </div>

        <DialogFooter className="absolute bottom-3 right-1">
          <Button
            variant="text"
            color="red"
            onClick={onCloseModalDoctor}
            className="mr-1"
          >
            <span>Huỷ</span>
          </Button>
          <Button variant="gradient" color="green" onClick={createNewAccountDoctor}>
            <span>{detailDoctor?._id ?  "Lưu" : "Tạo"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DoctorModal;