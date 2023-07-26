
const reqHeader = ['user-token', 'access-device'];

const checkHeaderConfig = (req, res, next) => {
    for(let i = 0; i <reqHeader.length; i++) {
        if(!req.header(reqHeader[i])) {
            return false; 
        }
    }
    next();
}


const getUser =  async (req, res, next) => {
    const token = req.header("user-token");
    if(!token) {
        res.send("...");
        res.end();
        return;
    }
    let user = await cached.get(token);
    user ? JSON.parse(user) : false;
    if(!user) {
        res.send("...");
        res.end();
        return;
    };
    req.userInfo = user;
    next(); 
}




module.exports = {
    checkHeaderConfig,
    getUser
};
