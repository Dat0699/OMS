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
    Popover,
    PopoverHandler,
    PopoverContent,
    IconButton,
    Typography,
    List
} from "@material-tailwind/react";

import SelectMedicine from '../../components/SelectMedicine';
import SelectUnit from '../../components/SelectUnit';
import SelectPeriod from '../../components/SelectPeriod';
const ModalAddMedicine = (props) => {
    const {open, onCreated } = props;
    const [ state, setState ] = useState({
        isOpen: open,
    });
    const onCloseModal = () => {
        setState({...state, isOpen: !state.isOpen})
    }

    const onCreateMedicine = () => {
        let data = {};
        if(!state.name || !state.amount || !state.unit) return;
        data.name = state.name;
        data.amount = state.amount;
        data.unit = state.unit;
        data.period = state.period;
        data.descMedicine = state.descMedicine;
        onCreated(data);
        onCloseModal();
    }



    return (
        <>
            <Button className='h-5 flex justify-center items-center'  variant="gradient" onClick={() => onCloseModal()}>
                Thêm thuốc
            </Button>
            <Dialog open={state.isOpen} className="min-h-[50px] !max-w-[250px]">
                <DialogHeader>
                    <span>
                        Thêm thuốc
                    </span>
                </DialogHeader>
                {/* <div className="cursor-pointer pl-3 hover:underline" onClick={() => onCollapseInfo('collapseInfo', !state.collapseInfo)}>{state?.collapseInfo ? 'Ẩn thông tin cá nhân' : "Hiện thông tin cá nhân"}</div> */}
                <DialogBody className="flex">
                    <div className="flex flex-col gap-5 w-full">
                        <SelectMedicine onChange={(value) => setState({...state, name: value?.name, amount: value?.amount, unit: value?.unit, period: value?.period})}/>
                        <Input label="Số lượng" type='number' onChange={(e) => setState({...state, amount: e.target.value})} value={state?.amount}/>
                        <Input label="Dặn dò thuốc uống" type='text' onChange={(e) => setState({...state, descMedicine: e.target.value})} value={state?.descMedicine}/> 
                        <SelectUnit onChange={(value) => setState({...state, unit: value})} value={state?.unit}/>
                        <SelectPeriod onChange={(value) => setState({...state, period: value})} value={state?.period}/>
                    </div>
                </DialogBody>
                <DialogFooter className="">
                    <Button
                        variant="text"
                        color="red"
                        // onClick={handleClose}
                        className="mr-1"
                        onClick={() => onCloseModal()}
                    >
                        <span>Huỷ</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={onCreateMedicine}>
                        <span>Thêm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

        </>
    )
}

export default ModalAddMedicine;