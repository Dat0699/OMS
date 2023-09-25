const log = require("../model/log");
const Log = require("../model/log");


const reqHeader = ['access-device'];

const actionDefine = {
    '/api/users/login'         : "login",
    '/api/medicines/add'       : "Add new medicine",
    // '/api/medicines/add'       : "Add new medicine",
    // '/api/medicines/add'       : "Add new medicine",
}

const checkHeaderConfig = (req, res, next) => {
    for(let i = 0; i <reqHeader.length; i++) {
        if(!req.header(reqHeader[i])) {
            return false; 
        }
    }
    next();
}

const getUser =  async (req, res, next) => {
    const token = req.header("User-Token");
    if(!token) {
        res.end();
        return;
    }
    let user = await cached.get(token);
    if(!user) {
        res.end();
        return;
    };
    req.userInfo = JSON.parse(user);
    next(); 
}

const getLog = async (req, res, next) => {
    const endPointApi = req.originalUrl;
    const user = req.userInfo;
    const deviceAccess = req.header("access-device");

    const action = actionDefine[endPointApi] || false;
    if(action) {
        const log = {
            userId: user._id,
            action,
            deviceAccess
        }
        setTimeout(async () => {
            await Log.create({...log});
        }, 20)
        // await cached.set("tempLog", JSON.stringify(log));
    }
    next();
}



module.exports = {
    checkHeaderConfig,
    getUser,
    getLog
};
