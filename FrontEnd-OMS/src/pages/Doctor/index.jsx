import React, { useEffect, useRef, useState } from "react";
// import { getlistDoctor, getDetailPatient } from './function'
import DoctorModal from './DoctorModal'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";

import "./style.css"
import { getListtDoctorFaculty } from './funciton'

const TABLE_HEAD = ["Họ và tên", "Email", "Số điện thoại","Ngày vào làm", "Chỉnh sửa"];

const DoctorPage = () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    console.log('userInfo?.role', userInfo?.role);
    const isAddRole = ["TN", "TK"].indexOf(userInfo?.role) >= 0;
    const [state, setState] = useState({
        listDoctor: [],
        debounce: false,
        detailPatient: {}
    })

    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);


    const handleGetListDoctor = async (search = '') => {
        const rs = await getListtDoctorFaculty({ search });
        if (rs?.message) {
            console.log(' rs.data', rs.data);
            const isData = rs.data.length >= 0;
            setState({ ...state, listDoctor: isData ? rs.data: [] })
        }
        if (rs?.message == 'No user found') {
            setState({ ...state, listDoctor: [] })

        }
    }

    useEffect(() => {
        handleGetListDoctor()
    }, []);

    let throttleSearch;
    const onSearch = async (value) => {
        if (throttleSearch) {
            clearTimeout(throttleSearch);
        }
        throttleSearch = setTimeout(async () => {
            await handleGetListDoctor(value.target.value);
        }, 350);
    }

    const onSelectDoctor = async (patient) => {
        if (!patient?._id && !patient) return;
        // const rs = await getDetailPatient((patient?._id || patient));
        // if (rs?.status === 200 || rs?.data?._id) {
        //     setState({ ...state, detailPatient: rs?.data });
        // }
    }

    const onCloseModal = () => {
        setState({ ...state, detailPatient: {} });
    }

    return (
        <Card className="h-full w-full table-patient">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Danh sách bác sĩ
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <DoctorModal reloadlistDoctor={handleGetListDoctor} detailPatient={state.detailPatient} onCloseModal={onCloseModal} disabled={!isAddRole} />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row !mb-[33px]">
                    <div className="w-full md:w-72">
                        <Input
                            onChange={onSearch}
                            label="Tìm kiếm"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0 body-table-patient">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD?.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {state?.listDoctor?.map(
                            ({ email, fullName, birthDate, phoneNumber, _id, age, avatar, createdAt }, index) => {
                                const isLast = index === state.listDoctor.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                createdAt = createdAt?.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || "";

                                return (
                                    <tr key={_id}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={avatar} alt={fullName} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {fullName}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {email}
                                                </Typography>
                                            </div>
                                        </td>
                                        {/* <td className={classes}>
                                            <div className="w-max">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={status === 'NEW' ? "Mới" : "Tái Khám"}
                                                    color={status === 'NEW' ? "blue-gray" : "orange"}
                                                />
                                            </div>
                                        </td> */}

                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {phoneNumber}
                                            </Typography>
                                        </td>

                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {createdAt}
                                                </Typography>
                                            </div>
                                        </td>

                                        <td className={classes}>
                                            <Tooltip content="Chỉnh sửa">
                                                <IconButton variant="text" onClick={() => onSelectDoctor(_id)}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Trang 1 trên 10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Trước
                    </Button>
                    <Button variant="outlined" size="sm">
                        Tiếp
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default DoctorPage;