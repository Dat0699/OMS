import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectFalcuty = (props) => {
    const falcuties = [
        {value: 'TMH', label: 'Tai mũi họng'},
        {value: 'RHM', label: 'Răng hàm mặt'},
        {value: 'M',   label: 'Mắt'},
        {value: 'PS',  label: 'Phụ sản'},
    ]
    const {onChange, value, disabled} = props;
    const [ state, setState ] = useState({
        value: ''
    })

    useEffect(() => {
        state.value = value;
        setState({...state});
    }, [value])

    const onSelectFalcuty = (value) => {
        if(onChange) {
            onChange(value)
        }
        setState({...state});
    }
    return (
        <Select value={state?.value} variant="outlined" label="Chọn khoa" onChange={onSelectFalcuty} disabled={disabled}>
            {falcuties.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectFalcuty;