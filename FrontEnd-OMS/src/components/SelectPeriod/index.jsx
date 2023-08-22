import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectPeriod = (props) => {
    const periods = [
        {value: 'Ngày', label: 'Ngày'},
        {value: 'Tuần', label: 'Tuần'},
        {value: 'Tháng',   label: 'Tháng'},
        {value: 'Năm',   label: 'Năm'},
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
        if(onChange) {
            onChange(value)
        }
        setState({...state, value});
    }
    return (
        <Select value={state?.value} variant="outlined" label="Trong thời gian" onChange={onSelectGender} disabled={disabled}>
            {periods.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectPeriod;