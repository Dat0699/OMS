import React, { useEffect, useRef, useState } from "react";
import { getListPatient, getDetailPatient } from './function'
import PatientModal from './PatientModal'
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

const TABS = [
    {
      label: "Tất cả",
      value: "1",
    },
    {
      label: "Mới",
      value: "2",
    },
    {
      label: "Tái khám",
      value: "3",
    },
  ];
   
  const TABLE_HEAD = ["Họ và tên", "Số điện thoại", "Trạng thái", "Ngày sinh", "Ngày nhập viện", "Chỉnh sửa"];
   
const PatientPage = () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    console.log('userInfo?.role', userInfo?.role);
    const isAddRole = ["TN", "TK"].indexOf(userInfo?.role) >= 0;
    const [state, setState] = useState({
        listPatient: [],
        debounce: false,
        detailPatient: {}
    })

    const [open, setOpen] = React.useState(false);
 
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
   

    const handleGetListPatient = async (name = '') => {
        const rs = await getListPatient({name});
        if(rs?.message) {
            console.log('rs', rs?.data);
            setState({...state, listPatient: rs.data?.data})
        } 
        if(rs?.message == 'No Patient found') {
            setState({...state, listPatient: []})

        }
    }

    useEffect(() => {
        handleGetListPatient()
    }, []);

    let throttleSearch;
    const onSearch = async (value) => {
        if(throttleSearch) {
            clearTimeout(throttleSearch);
        }
        throttleSearch = setTimeout( async () => {
            await handleGetListPatient(value.target.value);
        }, 350);
    }

    const onSelectPatient = async (patient) => {
      if(!patient?._id && !patient) return;
      const rs = await getDetailPatient((patient?._id || patient));
      if(rs?.status === 200 || rs?.data?._id) {
        setState({...state, detailPatient: rs?.data});
      }
    }

    const onCloseModal = () => {
      setState({...state, detailPatient: {}});
    }

    return (
        <Card className="h-full w-full table-patient">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Danh sách bệnh nhân
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <PatientModal reloadListPatient={handleGetListPatient} detailPatient={state.detailPatient} onCloseModal={onCloseModal} disabled={!isAddRole}/>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row !mb-[33px]">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
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
                {TABLE_HEAD.map((head) => (
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
              {state.listPatient.map(
                ({ phoneNumber, fullName, birthDate, address, _id, status, createdAt  }, index) => {
                  const isLast = index === state.listPatient.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                    createdAt = createdAt.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || "";
   
                  return (
                    <tr key={_id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={""} alt={fullName} size="sm" />
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
                            {phoneNumber}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={status === 'NEW' ? "Mới" : "Tái Khám"}
                            color={status === 'NEW' ? "blue-gray" : "orange"}
                          />
                        </div>
                      </td>
                    
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {birthDate}
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
                          <IconButton variant="text" onClick={() => onSelectPatient(_id)}>
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

export default PatientPage;