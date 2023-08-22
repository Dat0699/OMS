import { Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';

const SelectMedicine = (props) => {
    const medicines = [
        {value: 'Panadone', label: 'Panadone'},
        {value: 'Aspirine', label: 'Aspirine'},
        {value: 'Dopamine',   label: 'Dopamine'},
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
        <Select value={state?.value} variant="outlined" label="Thuốc" onChange={onSelectGender} disabled={disabled}>
            {medicines.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectMedicine;