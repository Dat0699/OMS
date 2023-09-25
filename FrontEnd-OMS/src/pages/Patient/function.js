import instance from "../../Request/axios"


    export const getListPatient = async (data) => {
        const user = JSON.parse(localStorage.getItem('user-info'));
        console.log('user?.role', user?.role);
        let typeListPatient = {
            'BS' : '/patient/doctor/full/s',
            'TN' : '/patient/full/s',
            'TK' : '/patient/full/tk/s'
        }[user?.role || 'BS'];

        if(user?.isAdmin) {
            typeListPatient = '/patient/full/s'
        }

        const rs = await instance.post(typeListPatient, {status: data?.status || '' ,name: (data?.name || ""), pageNumber: data?.pageNumber});
        return rs?.data;
    }

    export const newPatient = async (data) => {
        const rs = await instance.post("/patient/add", data);
        return rs?.data;
    }

    export const getListConsultation = async(patiendId) => {
        if(!patiendId) return;
        const rs = await instance.post(`/consultation/full/${patiendId}`);
        return rs?.data;
    }

    export const updatePatient = async (data, id) => {
        if(!id && !data?.id) return;
        const idPatient = id || data?.id;
        const rs = await instance.put(`/patient/${idPatient}`, data);
        return rs?.data;
    }

    export const getDetailPatient = async (id) => {
        const rs = await instance.get(`/patient/${id}`);
        return rs?.data;
    }


    export const newConsultation = async (data) => {
        const rs = await instance.post(`/consultation/add`, data);
        return rs?.data;
    }

    export const getDetailConsultation = async (id) => {
        const rs = await instance.get(`/consultation/${id}`);
        return rs?.data;
    }

    export const updateConsultation = async (id, data) => {
        const rs = await instance.put(`/consultation/${id}`, data);
        return rs?.data;
    }