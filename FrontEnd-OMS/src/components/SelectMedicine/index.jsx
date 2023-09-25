import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectMedicine = (props) => {
    const medicines = [
        {fullIinfo: {name: 'Panadone', amount: 1, unit:'Viên', period:'Ngày'}, value: {name: 'Panadone', amount: 1, unit:'Viên', period:'Ngày'}, label: 'Panadone'},
        {fullIinfo: {name: 'Aspirine', amount: 1, unit:'Hộp', period:'Tuần'}, value: {name: 'Aspirine', amount: 1, unit:'Hộp', period:'Tuần'}, label: 'Aspirine'},
        {fullIinfo: {name: 'Dopamine', amount: 5, unit:'Viên', period:'Ngày'}, value: {name: 'Dopamine', amount: 5, unit:'Viên', period:'Ngày'},   label: 'Dopamine'},
    ]
    const {onChange, value, disabled} = props;
    const [ state, setState ] = useState({
        value: value || ''
    })

    useEffect(() => {
        if(value) {
            setState({...state, value});
        }
    }, [value])
    
    const onSelectGender = (value) => {
       
        setState({...state, value: value});
    }
    const onCB = (value) => {
        if(onChange) {
            onChange(value)
        }
    }

    return (
        <Select value={state?.value?.name} variant="outlined" label="Thuốc" onChange={onSelectGender} disabled={disabled}>
            {medicines.map(item => {
                return (
                    <Option onClick={() =>onCB(item?.fullIinfo)} key={item?.value?.name} value={item?.value?.name}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectMedicine;