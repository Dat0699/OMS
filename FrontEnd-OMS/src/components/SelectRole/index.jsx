import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectRole = (props) => {
    const units = [
        {value: 'BS', label: 'Bác sĩ'},
        {value: 'BSXN', label: 'Bác sĩ xét nghiêm'},
        {value: 'TN',   label: 'Tiếp nhận'},
        {value: 'TK',   label: 'Trưởng khoa'},
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
        <Select value={state?.value} variant="outlined" label="Đơn vị" onChange={onSelectGender} disabled={disabled}>
            {units.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectRole;