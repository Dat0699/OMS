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
import ReactPaginate from 'react-paginate';
 
import "./style.css"

const TABS = [
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Mới",
      value: "NEW",
    },
    {
      label: "Tái khám",
      value: "RE-EXAM",
    },
  ];
   
  const TABLE_HEAD = ["Họ và tên", "Số điện thoại", "Trạng thái", "Ngày sinh", "Ngày nhập viện", "Chỉnh sửa"];
   
const PatientPage = () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const isAddRole = (["TN", "TK"].indexOf(userInfo?.role) >= 0 || userInfo?.isAdmin);
    const [state, setState] = useState({
        listPatient: [],
        debounce: false,
        detailPatient: {},
        search: ''
    })

    const [open, setOpen] = React.useState(false);
 
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
   

    const handleGetListPatient = async (name = '', status='', pageNumber = 0) => {
        const rs = await getListPatient({name, status, pageNumber});
        if(rs?.message) {
            console.log('rs', rs?.data);
            setState({...state, listPatient: rs.data?.data, pageSetting: {pageLength: rs?.data?.pageLength, pageNumber: rs?.data?.pageNumber, totalLength: rs?.data?.totalLength}})
        } 
        if(rs?.message == 'No Patient found') {
            setState({...state, listPatient: []})
        }
    }

    useEffect(() => {
        handleGetListPatient('', '', 0);
    }, []);

    let throttleSearch;
    const onSearch = async (value) => {
        if(throttleSearch) {
            clearTimeout(throttleSearch);
        }
        throttleSearch = setTimeout( async () => {
            state.search = value.target.value;
            await handleGetListPatient(value.target.value);
        }, 350);
    }

    const onSelectPatient = async (patient, mode = '') => {
      if(!patient?._id && !patient) return;
      const rs = await getDetailPatient((patient?._id || patient));
      if(rs?.status === 200 || rs?.data?._id) {
        setState({...state, detailPatient: rs?.data, mode});
      }
    }

    const onCloseModal = () => {
      setState({...state, detailPatient: {}});
    }

    const onChangeStatusPatient = async (e) => {
      console.log('e', e);
        await handleGetListPatient(state.search, e);;
    }

    const onChangePage = async (e) => {
        await handleGetListPatient(state?.search, '', e?.selected);
    }

    const onPageActive = (e) => {
      const curPage = e?.selected + 1
    }

    return (
        <Card className="w-full h-full w-full table-patient">
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
              <PatientModal reloadListPatient={handleGetListPatient} detailPatient={state.detailPatient} onCloseModal={onCloseModal} disabled={(state.mode === "detail" || !isAddRole)} mode={state.mode}/>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row !mb-[33px]">
            <Tabs value="all" className="w-[300px] h-[80px]" >
              <TabsHeader className="">  
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => onChangeStatusPatient(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72 mb-[40px]">
              <Input
                onChange={onSearch}
                label="Tìm kiếm"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <thead className="!w-full flex justify-start !gap-[135px] absolute !top-[156px] !z-[99]" style={{background: 'grey'}}>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className=" p-4"
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
            </thead>
        <CardBody className="overflow-scroll px-0 body-table-patient ">
          <table className="mt-4 w-full min-w-max table-auto text-left relative">
        
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
                      <td className={`${classes}${index == 0 ? ' w-[245px]' : ''}`}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar src={""} alt={fullName} size="sm" onClick={() => onSelectPatient(_id, 'detail')}/> */}
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
                      <td className={`${classes} absolute right-[760px] !border-b-0 `}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={status === 'NEW' ? "Mới" : "Tái Khám"}
                            color={status === 'NEW' ? "blue-gray" : "orange"}
                          />
                        </div>
                      </td>
                    
                      <td className={`${classes} absolute right-[530px] !border-b-0 `}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {birthDate}
                        </Typography>
                      </td>

                      <td className={`${classes} absolute right-[270px] !border-b-0 `}>
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
                      
                      <td className={`${classes} absolute right-[20px] !border-b-0 `}>
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
        <ReactPaginate
            onPageActive={onPageActive}
            className="flex gap-12 p-6 rounded-md w-full justify-between paginate"
            breakLabel="..."
            nextLabel="Kế >"
            onPageChange={onChangePage}
            // pageRangeDisplayed={0}
            pageCount={Math.floor(state?.pageSetting?.totalLength / state?.pageSetting?.pageLength) + ((state?.pageSetting?.totalLength / state?.pageSetting?.pageLength > 1 && state?.pageSetting?.totalLength / state?.pageSetting?.pageLength < 2) ? 1 : 0)}
            previousLabel="< Trước"
            disableInitialCallback
          />
        </CardFooter>
        </Card>
    )
}

export default PatientPage;