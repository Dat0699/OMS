import React, { useEffect, useState } from "react";
import {
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    ListItem,
    ListItemSuffix,
    Card,
    Carousel,
    Popover,
    PopoverHandler,
    PopoverContent,
    IconButton,
    Typography,
    List
} from "@material-tailwind/react";
import ModalAddMedicine from './ModalAddMedicine'
import { uploadFile } from '../../Request/axios'
import { newConsultation, updateConsultation } from './function'

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
        >
            <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
            />
        </svg>
    );
}

const ModalConsultation = (props) => {
    const { detailPatient, reloadListConsultation, detailConsultation, onCloseDataOutSide, reloadListPatient } = props;
    const [state, setState] = useState({
        isOpenModalReview: false,
        isOpen: false,
        medicines: [],
        isShowPopover: false,
        listAttachment: [],
        detailConsultation: detailConsultation,
        generalHealth: {
            bloodPressure: 0,
            sugarLevel: 0,
            heartRate: 0,
            temperature: 0,
            weight: 0,
            height: 0,
        },
    });

    const user = JSON.parse(localStorage.getItem('user-info'));

    const onOpenModalMedicine = () => {
        setState({ ...state, isShowPopover: !state.isShowPopover })
    }

    const onAddMedicine = (value) => {
        state.medicines = [...(state.medicines || [])];
        state.medicines.push(value);
        setState({ ...state })
    }

    const onRemoveMedicine = (value) => {
        const newArr = state.medicines?.filter((item, index) => index !== value);
        setState({ ...state, medicines: newArr });
    }

    const onPickFile = async (e) => {
        const selectedFile = e.target.files;
        for (let i = 0; i < selectedFile.length; i++) {
            const curItem = selectedFile[i]
            const rs = await uploadFile(curItem);
            if (rs) {
                const pathFile = `http://ggvh.myddns.me:5702/api/file/${curItem?.name}`
                console.log('pathFile', pathFile);
                state.listAttachment.push(pathFile);
                setState({ ...state });
            }
        }
    }

    const onChangeValue = (type, value) => {
        state[type] = value;
        setState({ ...state });
    }

    const onRemoveAttachment = (value) => {
        const newArr = state.listAttachment.filter((item, index) => item !== value);
        setState({ ...state, listAttachment: newArr });
    }

    const onToogleModalConsultation = () => {
        setState({ ...state, isOpen: !state.isOpen });
    }

    const onCloseModalConsultation = () => {
        setState({
            isOpen: false,
            medicines: [],
            isShowPopover: false,
            listAttachment: [],
            generalHealth: {
                bloodPressure: 0,
                sugarLevel: 0,
                heartRate: 0,
                temperature: 0,
                weight: 0,
                height: 0,
            },
            detailConsultation: {}
        });
        onCloseDataOutSide()
    }

    const onCreateNewConsultation = async () => {
        const data = {
            patientId: detailPatient?._id,
            medicines: state.medicines,
            description: state?.description,
            userId: (user?.role === 'BS') ? user._id : undefined,
            userId2: (user?.role === 'BSXN') ? user._id : undefined,
            generalHealth: state.generalHealth,
            attachment: state.listAttachment,
        }

        const rs = await newConsultation(data);
        if (rs.status === 200) {
            await reloadListConsultation();
            alert('Them thanh cong');
            setTimeout(() => {
                onCloseModalConsultation()
            }, 50)
        }
    }

    const handleUpdateConsultation = async () => {
        const data = {
            patientId: detailPatient?._id,
            medicines: state.medicines,
            description: state?.description,
            userId: (user?.role === 'BS') ? user._id : undefined,
            userId2: (user?.role === 'BSXN') ? user._id : undefined,
            generalHealth: state.generalHealth,
            attachment: state.listAttachment,
        }

        const rs = await updateConsultation(detailConsultation?._id, data);
        if (rs.status === 200) {
            alert('Cap nhat thanh cong');
            await reloadListConsultation();
            onCloseModalConsultation()
        }
    }

    const onChangeGeneralHealth = (type, value) => {
        state.generalHealth[type] = value;
        setState({ ...state });
    }

    useEffect(() => {
        if (detailConsultation?._id) {
            state.medicines = detailConsultation?.medicines ? detailConsultation?.medicines : [];
            state.generalHealth = detailConsultation?.generalHealth ? detailConsultation?.generalHealth : {};
            state.listAttachment = detailConsultation?.attachment ? detailConsultation?.attachment : [];
            state.description = detailConsultation?.description ? detailConsultation?.description : "";
            state._id = detailConsultation?._id;
            // state.listAttachment = detailConsultation?.attachment;
            setState({ ...state });
        }
    }, [JSON.stringify(detailConsultation?._id)])

    const finishConsultation = async () => {
        const rs = await updateConsultation(detailConsultation?._id, { status: 2, idPatient: detailPatient?._id });
        if (rs.status === 200) {
            await reloadListPatient()
            alert('Benh an da hoan thanh');
            onCloseModalConsultation()
        }
    }

    return (
        <>
            <Button className='h-5 flex justify-center items-center' variant="gradient" onClick={onToogleModalConsultation}>
                Thêm bệnh án
            </Button>
            <Dialog open={(state?.isOpen || state?._id)} className="!h-[850px] !min-w-[100vw] p-3 overflow-auto">
                <DialogHeader>
                    <span>
                        Thông tin bênh án
                    </span>
                </DialogHeader>
                {/* <div className="cursor-pointer pl-3 hover:underline" onClick={() => onCollapseInfo('collapseInfo', !state.collapseInfo)}>{state?.collapseInfo ? 'Ẩn thông tin cá nhân' : "Hiện thông tin cá nhân"}</div> */}
                <DialogBody className="flex justify-between gap-5">
                    <div className="flex flex-col gap-5 w-1/2">
                        <span className="font-semibold text-xl" >Bác sĩ: {detailConsultation?.user?.fullName}</span>
                        <Textarea label="Dặn dò bác sĩ" onChange={(e) => onChangeValue('description', e.target.value)} value={state?.description} />
                        <Card className="w-full flex gap-3 flex-col">
                            <div className="flex gap-3">
                                <span className="font-semibold text-xl">Đơn thuốc</span>
                                <ModalAddMedicine open={state?.isShowPopover} handler={onOpenModalMedicine} onCreated={onAddMedicine} />
                            </div>
                            <List className="!max-h-[440px] overflow-auto">
                                {state?.medicines?.map((item, index) => {
                                    return (
                                        <ListItem className="flex gap-2">
                                            <ListItemSuffix>
                                                {item?.name}
                                            </ListItemSuffix>
                                            <ListItemSuffix>
                                                {item?.amount}
                                            </ListItemSuffix>
                                            <ListItemSuffix>
                                                {item?.unit}
                                            </ListItemSuffix>
                                            <ListItemSuffix>
                                                {item?.period}
                                            </ListItemSuffix>
                                            <ListItemSuffix>
                                                <IconButton variant="text" color="blue-gray" onClick={() => onRemoveMedicine(index)}>
                                                    <TrashIcon />
                                                </IconButton>
                                            </ListItemSuffix>
                                        </ListItem>
                                    )
                                })}

                            </List>

                        </Card>
                    </div>
                    <div className="w-1/2 flex flex-col gap-3 pr-3">
                        <span className="font-semibold text-xl" >Bác sĩ xét nghiệm: {detailConsultation?.user2?.fullName}</span>
                        <span className="font-semibold text-xl" >Kết quả xét nghiệm</span>
                        <Input value={state.generalHealth.bloodPressure} label='Huyết áp' type='number' onChange={(e) => onChangeGeneralHealth('bloodPressure', e.target.value)} />
                        <Input value={state.generalHealth.sugarLevel} label='Đường huyết' type='number' onChange={(e) => onChangeGeneralHealth('sugarLevel', e.target.value)} />
                        <Input value={state.generalHealth.heartRate} label='Nhịp tim' type='number' onChange={(e) => onChangeGeneralHealth('heartRate', e.target.value)} />
                        <Input value={state.generalHealth.temperature} label='Nhiệt độ' type='number' onChange={(e) => onChangeGeneralHealth('temperature', e.target.value)} />
                        <Input value={state.generalHealth.weight} label='Cân nặng' type='number' onChange={(e) => onChangeGeneralHealth('weight', e.target.value)} />
                        <Input lvalue={state.generalHealth.height} label='Chiều cao' type='number' onChange={(e) => onChangeGeneralHealth('height', e.target.value)} />

                        <Input label='Hình ảnh xét nghiệm' type='file' className='p-2' multiple={true} onChange={onPickFile} />
                        <Carousel className="rounded-xl w-full h-[350px] relative">
                            {state.listAttachment?.map(item => {
                                return (
                                    <div key={item}>
                                        <>
                                            <IconButton onClick={() => onRemoveAttachment(item)} className="cursor-pointer z-30 absolute right-5 top-5">
                                                <TrashIcon />
                                            </IconButton>
                                            <img
                                                onClick={() => setState({ ...state, isOpenModalReview: !state.isOpenModalReview })}
                                                src={item}
                                                alt="image"
                                                className="h-full w-full object-cover"
                                            />
                                            <Dialog open={state.isOpenModalReview} className="!h-[850px] !min-w-[100vw] p-3 overflow-auto" handler={() => setState({ ...state, isOpenModalReview: !state.isOpenModalReview })}>
                                                <img
                                                    src={item}
                                                    alt="image"
                                                    className="h-full w-full object-cover"
                                                />
                                            </Dialog>

                                        </>
                                    </div>
                                )
                            })}

                        </Carousel>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full flex gap-3">
                    <Button
                        variant="text"
                        color="red"
                        onClick={onCloseModalConsultation}
                        className="mr-1"
                    >
                        <span>Huỷ</span>

                    </Button>
                    {detailConsultation?.status !== 2 && (
                        <Button variant="gradient" color="green" onClick={() => detailConsultation?._id ? handleUpdateConsultation() : onCreateNewConsultation()}>
                            Xong
                        </Button>
                    )}
                    {(detailConsultation?._id && detailConsultation?.status !== 2) && (
                        <Button variant="gradient" color="green" onClick={() => finishConsultation()}>
                            Hoàn thành bệnh án
                        </Button>
                    )}
                </DialogFooter>
            </Dialog>

        </>
    )
}

export default ModalConsultation;