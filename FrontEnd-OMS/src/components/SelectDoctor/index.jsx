
import React, { useEffect, useState, useMemo } from 'react';
import { Select, Option } from "@material-tailwind/react";
import { getListSelectDoctor } from '../../pages/Doctor/funciton'

const SelectDoctors = (props) => {
 
    const { falcuty, onSeclect, value, disabled, listData = [] } = props;
    const [ state, setState ] = useState({
        listData: [],
        value
    })
    console.log('value', value);
    const handleGetListDoctor = async (name = '') => {
        const rs = await getListSelectDoctor(falcuty, name);
        if(rs?.status === 200) {
            for (let i = 0; i < rs?.data?.data?.length; i++) {
                const curItem = rs?.data?.data[i];
                if(curItem?._id) {
                    listData.push({
                        label: curItem?.fullName,
                        value: curItem?._id
                    })
                }
            }
            setState(prev => ({...prev, listData: listData}))
        } else {
            setState(prev => ({...prev, listData: []}))
        }
    }

    useEffect(() => {
        if(!falcuty) return;
        handleGetListDoctor();
    }, [falcuty, state.listData.length, JSON.stringify(state.listData)])


    const onSelectDoctor = (value) => {
        console.log('onSeclect', value);
        setState(prev => ({...prev, value: value}))
        if(onSeclect && typeof onSeclect === 'function') {
            onSeclect(value)
        }
    }

    const OptionMemo = useMemo(() => {
        return Option
    }, [state.value, value, JSON.stringify(state), falcuty])

    const onRenderValue = (value) => {
        console.log('run');
        const rs = state?.listData.map(i => {
            if(i?.value === value) {
                return i?.label
            }
        })
        return rs;
    }
    console.log('value', value);
    return (
        <div>
        <Select value={onRenderValue(state?.value)} defaultValue={onRenderValue(state?.value)} variant="outlined" label={!falcuty ? 'Chọn bác sĩ (Vui lòng chọn khoa !)' : 'Chọn bác sĩ'} disabled={!falcuty || disabled}>
            {state.listData?.map(item => {
                return (
                    <option className='!h-8 !cursor-pointer hover:bg-[#bcbaba]' key={item?.value} value={item?.value} onClick={(e) => {e.stopPropagation(); e.preventDefault(); onSelectDoctor(item?.value)}}>{item?.label}</option>
                )
            })}
        </Select>
        <div className='text-sm mt-2 font-bold'> Bác sĩ đảm nhiệm : {onRenderValue(value)}</div>

        </div>
    )
}


export default SelectDoctors;