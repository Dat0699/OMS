import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useLayoutEffect, useState } from 'react';

const SelectFalcuty = (props) => {
    const falcuties = [
        {value: 'TMH', label: 'Tai mũi họng'},
        {value: 'RHM', label: 'Răng hàm mặt'},
        {value: 'M',   label: 'Mắt'},
        {value: 'PS',  label: 'Phụ sản'},
    ]
    const {onChange, value, disabled, className = ''} = props;
    const [ state, setState ] = useState({
        value: ''
    })

    useLayoutEffect(() => {
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
        <Select value={state?.value} variant="outlined" label="Chọn khoa" onChange={onSelectFalcuty} disabled={disabled} defaultValue={state?.value} className={`${className}`}>
            {falcuties.map(item => {
                return (
                    <Option key={item?.value} value={item?.value} className="!z-[99px]">{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectFalcuty;