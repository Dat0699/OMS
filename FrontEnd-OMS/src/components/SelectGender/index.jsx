import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectGender = (props) => {
    const falcuties = [
        {value: 'MALE', label: 'NAM'},
        {value: 'FEMALE', label: 'NỮ'},
        {value: 'OTHERS',   label: 'KHÁC'},
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
        <Select value={state?.value} variant="outlined" label="Giới tính" onChange={onSelectGender} disabled={disabled}>
            {falcuties.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectGender;