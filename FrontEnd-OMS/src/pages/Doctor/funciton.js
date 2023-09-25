import instance from "../../Request/axios"

const userInfo = JSON.parse(localStorage.getItem("user-info"));

    export const getListSelectDoctor = async (type = 'ALL', name = '') => {
    const data = {
        isSelectMode: true,
        faculty: type,
        name: name
    }
    const rs = await instance.post("/users/full/s", data);
    return rs?.data;
}

const token = localStorage.getItem("user-token");
export const logout = async () => {
    const rs = await instance.post("/users/logout", {token});
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-info");
    window.location.pathname='/login';
    return rs?.data;
}

export const getListtDoctorFaculty = async (data) => {
    const isAdmin = userInfo?.isAdmin
    
    if(isAdmin == true) {
        console.log('123');
        // data.faculty = "ALL";
    } else {
        console.log('456');
        data.faculty = userInfo?.faculty;
    }
    const rs = await instance.post("/users/full/s", data);
    return rs?.data;
}

export const createNewAccount = async (data) => {
    const rs = await instance.post("users/register", data);
    return rs?.data;
}

export const updateUser = async (data, id) => {
    const rs = await instance.put(`users/${id || data?._id}`, data);
    return rs?.data;
}

export const getDetailUser = async (id) => {
    const rs = await instance.get(`users/${id}`);
    return rs?.data;
}


// const endpointList = {
//     'TK': '/full/falcuty',
//     'ALL': '/users/full/s',
// }[userInfo?.role || "ALL"];
