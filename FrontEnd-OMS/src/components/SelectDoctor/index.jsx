
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Select, Option } from "@material-tailwind/react";
import { getListSelectDoctor } from '../../pages/Doctor/funciton'
const SelectDoctors = (props) => {
 
    const { falcuty, onSeclect, value, disabled } = props;
    const [ state, setState ] = useState({
        listData: [],
        value
    })


    const handleGetListDoctor = async (name = '') => {
        const rs = await getListSelectDoctor(falcuty, name);
        if(rs?.status === 200) {
            let listData = [];
            for (let i = 0; i < rs?.data?.length; i++) {
                const curItem = rs?.data[i];
                if(curItem?._id) {
                    listData.push({
                        label: curItem?.fullName,
                        value: curItem?._id
                    })
                }
            }
            setState({...state, listData: listData})
        } else {
            setState({...state, listData: []})
            
        }
    }

    useLayoutEffect(() => {
        if(!falcuty) return;
        handleGetListDoctor();
        state.value = value;
    }, [falcuty, value])


    const onSelectDoctor = (value) => {
        if(onSeclect) {
            onSeclect(value)
        }
        state.value = value;
        setState({...state});
    }

    return (
        <Select value={state?.value} variant="outlined" label={!falcuty ? 'Chọn bác sĩ (Vui lòng chọn khoa !)' : 'Chọn bác sĩ'} disabled={!falcuty || disabled} onChange={onSelectDoctor}>
            {state.listData.map(item => {
                return (
                    <Option key={item?.value} value={item?.value}>{item?.label}</Option>
                )
            })}
        </Select>
    )
}


export default SelectDoctors;