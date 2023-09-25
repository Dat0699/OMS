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
import SelectDoctors from '../../components/SelectDoctor'
import SelectGender from '../../components/SelectGender'
import ModalConsultation from './ModalConsultation'
import { newPatient, updatePatient, getListConsultation, getDetailConsultation } from './function'

const PatientModal = (props) => {
  const { reloadListPatient, detailPatient, onCloseModal, disabled, mode } = props;

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    falcuty: '',
    doctor: '',
    detailPatient,
    collapseInfo: true,
    collapseHealthInfo: false,
    listConsultation: [],
    isOpenOutSideConsultation: false
  });

  useEffect(() => {
    state.falcuty = detailPatient?.facultyRef;
    state.doctor = detailPatient?.userId;
    state.fullName = detailPatient?.fullName;
    state.birthDate = detailPatient?.birthDate;
    state.gender = detailPatient?.gender;
    state.address = detailPatient?.address;
    state.diagnose = detailPatient?.diagnose;
    state.phoneNumber = detailPatient?.phoneNumber
    setState({ ...state });
  }, [JSON.stringify(detailPatient)]);

  const userInfo = JSON.parse(localStorage.getItem('user-info'));


  const onChangeFalcuty = (value) => {
    state.falcuty = value;
    setState({ ...state });
  }

  const onChangeDoctor = (value) => {
    console.log('value', value);
    state.doctor = value;
    setState({ ...state });
  }

  const onValueStateChange = (type, value) => {
    console.log('value', value);
    state[type] = value;
    setState({ ...state });
  }

  const handleOpen = () => setOpen(!open);
  const handleClose = () => {
    state.falcuty = '';
    state.doctor = '';
    state.fullName = '';
    state.birthDate = '';
    state.gender = '';
    state.address = '';
    state.diagnose = '';
    state.phoneNumber = ''
    setOpen(false);
    setState({ ...state });
    if (onCloseModal) {
      onCloseModal()
    }
  }

  const handleNewPatient = async () => {
    if (!state?.fullName || !state?.birthDate || !state?.gender || !state?.address) {
      alert('Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }
    const data = {
      ...state,
      facultyRef: state.falcuty,
      userId: state.doctor, /// userID is doctor
      id: detailPatient?._id
    }
    const func = detailPatient?._id ? updatePatient : newPatient;
    const rs = await func(data);
    let msg = detailPatient?._id ? 'Cập nhật thành công' : 'Thêm Thành Công';
    if (rs?.status == 200) {
      await reloadListPatient();
      alert(msg);
      handleClose()
    } else {
      alert("Lỗi hệ thống");
    }
  }

  const onCollapseInfo = (type, value) => {
    if (type === "collapseInfo" && value) {
      state.collapseInfo = true;
      state.collapseHealthInfo = false;
      setState({ ...state });
      return;
    }

    if (type === "collapseHealthInfo" && value) {
      state.collapseInfo = false;
      state.collapseHealthInfo = true;
      setState({ ...state });
      return;
    }

    state[type] = value;
    setState({ ...state })
  }

  const handleGetListConsultation = async () => {
    console.log('reloadListConsultation');
    if (!detailPatient?._id) return;
    console.log('reloadListConsultation', detailPatient?._id);
    const rs = await getListConsultation(detailPatient?._id);
    console.log('rs', rs);
    if (rs?.status == 200) {
      setState({ ...state, listConsultation: rs?.data });
    }
  }

  useEffect(() => {
    handleGetListConsultation()
  }, [detailPatient?._id]);

  const TABLE_HEAD = ['Mã bệnh án', 'Ngày'];

  const titleModal = detailPatient?._id ? "Thông tin bệnh nhân" : 'Thêm bệnh nhân';
  const titleBtn = detailPatient?._id ? "Cập nhật" : 'Thêm bệnh nhân';

  const onSelectDetailConsultation = async (id) => {
    if (!id) return;
    const rs = await getDetailConsultation(id);
    if (rs?.status === 200) {
      setState({ ...state, detailConsultation: rs?.data, isOpenOutSideConsultation: true });
    }
  }

  return (
    <>
      {(["TN", "TK"].indexOf(userInfo?.role) >= 0 || userInfo.isAdmin) && (
        <Button className='' onClick={handleOpen} variant="gradient">
          Thêm bệnh nhân
        </Button>
      )}
      <Dialog open={(open || detailPatient?._id)} className="min-h-[800px]">
        <DialogHeader className="flex gap-3">
          <span>
            {titleModal}
          </span>
          {((detailPatient?._id && (userInfo?.role !== "TN" || userInfo.isAdmin)) && mode !== 'detail') && (
            <ModalConsultation detailPatient={detailPatient} reloadListConsultation={handleGetListConsultation} detailConsultation={state?.detailConsultation} onCloseDataOutSide={() => setState({ ...state, detailConsultation: {} })} reloadListPatient={reloadListPatient} />
          )}
        </DialogHeader>
        {detailPatient?._id && (
          <div className="cursor-pointer pl-3 hover:underline" onClick={() => onCollapseInfo('collapseInfo', !state.collapseInfo)}>{state?.collapseInfo ? 'Ẩn thông tin cá nhân' : "Hiện thông tin cá nhân"}</div>
        )}
        <Collapse open={state.collapseInfo}>
          <DialogBody className="flex flex-col gap-6 min-h-[500px]">
            <Input label="Họ và tên" onChange={(e) => onValueStateChange('fullName', e.target.value)} value={state?.fullName} disabled={disabled} />
            <Input label="Địa chỉ" onChange={(e) => onValueStateChange('address', e.target.value)} value={state?.address} disabled={disabled} />
            <Input label="Số điện thoại" onChange={(e) => onValueStateChange('phoneNumber', e.target.value)} value={state?.phoneNumber} disabled={disabled} />
            <Input label="Ngày tháng năm" type="date" onChange={(e) => onValueStateChange('birthDate', e.target.value)} value={state?.birthDate} disabled={disabled} />
            <SelectGender onChange={(value) => onValueStateChange('gender', value)} value={state?.gender} disabled={disabled} />
            <Textarea label="Chẩn đoán" onChange={(e) => onValueStateChange('diagnose', e.target.value)} value={state?.diagnose} disabled={disabled} />
            <SelectFalcuty onChange={onChangeFalcuty} value={state?.falcuty} disabled={disabled} />
            <SelectDoctors falcuty={state.falcuty} value={state?.doctor} onSeclect={onChangeDoctor} disabled={disabled} listData={state?.listData} />
          </DialogBody>
        </Collapse>

        {(detailPatient?._id && userInfo.role !== "TN") && (
          <>
            <div className="cursor-pointer pl-3 hover:underline" onClick={() => onCollapseInfo('collapseHealthInfo', !state.collapseHealthInfo)}>{state?.collapseInfo ? 'Ẩn danh sách bệnh án' : "Hiên danh sách bệnh án"}</div>
            <Collapse open={state.collapseHealthInfo} className='!max-h-[500px] !overflow-auto'>
              <DialogBody className="flex flex-col gap-6 h-full">
                <table className="mt-4 w-full min-w-max table-auto text-left overflow-auto">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.listConsultation.map(
                      ({ _id, createdAt }, index) => {
                        const isLast = index === state.listConsultation.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";
                        createdAt = createdAt.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || "";

                        return (
                          <tr key={_id} className="cursor-pointer" onClick={() => onSelectDetailConsultation(_id)}>
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {_id}
                                  </Typography>
                                </div>
                              </div>
                            </td>

                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  {createdAt}
                                </Typography>
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </DialogBody>
            </Collapse>
          </>
        )}
        <DialogFooter className="absolute bottom-3 right-1">
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Huỷ</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleNewPatient} disabled={disabled}>
            <span>{titleBtn}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default PatientModal;