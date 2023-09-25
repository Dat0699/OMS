import instance from "../../Request/axios"

export const login = async (data) => {
    if(!(data?.username && data?.password)) {
        console.log('user and password invalid');
        return;
    } 
    try {
        const { username, password } = data;
        const rs = await instance.post('/users/login', {username, password});
        return rs;
    } catch(e) {
    }
}

export const checkAuth = async (qr) => {
    if(qr && typeof qr === 'string') {
        try {
            const rs = await instance.post(`/users/checkAuth`, {code:qr})
            return rs;
        } catch(e) {
            console.log('e >>>>>>>>>>', e);
        }
    }
}
