/** @format */

const User = require("../model/user");
const express = require("express");
const router = express.Router();
const { checkHeaderConfig, getUser } = require("../middleware");
const {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
  generateToken,
} = require("../util");
const Patient = require("../model/patient");
const nodemailer = require("nodemailer");
const appPassword = 'cmrwzgdmhnoaroli'

const log = require("../model/log");

// const { set, get, isExist } = require("../request/redis");

let CachedMemoized = {};
let debounce;
const keyRequires = [
  "password",
  "fullName",
  "age",
  "address",
  "phoneNumber",
  "username",
  "email",
];


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // secure: true,
  auth: {
    user: '13816@student.vgu.edu.vn',
    pass: appPassword
  }
});



///register
router.post("/register", async (req, res) => {
  const body = req.body;
  const detechDevice = req.header("access-device");
  let time = CachedMemoized[detechDevice] ? 300 : 0;
  time && clearTimeout(debounce);
  debounce = setTimeout(async () => {
    try {
      for (let i = 0; i < keyRequires.length; i++) {
        if (!Object.keys(body).includes(keyRequires[i])) {
          res.send(Response(400, "Some key require"));
          return;
        }
      }

      const checkExits = await User.aggregate([
        {
          $match: {
            $or: [
              { username: { $eq: body.username } },
              { email: { $eq: body.email } },
            ],
          },
        },
      ]);

      if (checkExits.length > 0) {
        res.send(Response(400, "Account was exits !"));
        return;
      }

      const newUser = await User.create({ ...body });
      console.log('newUser', newUser);
      if (newUser) {
        res.send(Response(200, "Create user success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      throw e;
    }
  }, time);
});




/// login
router.post("/login", async (req, res) => {
  // let acc = await nodemailer.createTestAccount();

  // const transporter = nodemailer.createTransport({
  //   port:5702,
  //   auth: {
  //     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
  //     user: "13816@student.vgu.edu.vn",
  //     pass: "ippclnyrtwhmbrzm"
  //   }
  // });
  const { username, password } = req.body;
  try {
    const checkUser = await User.aggregate([
      {
        $match: {
          $and: [
            { username: { $eq: username } },
            { password: { $eq: password } },
          ],
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

    if (checkUser.length > 0) {
      const response = checkUser[0];
      const key = await generateToken();
      const codeCheck = await generateToken(32);
      console.log('codeCheck', codeCheck);
      if (key) {
        response.token = key;
        const rs = await cached.set(codeCheck, JSON.stringify(response), {EX: 120});
        if(rs) {
         
          // await transporter.sendMail({
          //   from: "13816@student.vgu.edu.vn", // sender address
          //   to: "nguyensaithanhdat@gmail.com", // list of receivers
          //   subject: "Verify Code", // Subject line
          //   text: `Your code is ${codeCheck}`, // plain text body
          // });
          const newResponse = {email: response?.email}
          res.send(Response(200, "Login success", newResponse));
          const mail = await transporter.sendMail({
            from: '13816@student.vgu.edu.vn',
            to: response?.email || '', // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Mã bảo mật của bạn là : ${codeCheck}. Vui lòng không chia sẽ mã này cho bất kỳ ai</b>`, // html body
          });
          console.log('mail', mail);
        
        }
      }
    } else {
      res.send(Response(404, "Username or password incorrect"));
    }
  } catch (e) {
    throw e;
  }
});


router.post("/checkAuth", async (req, res) => {
  const codeCheck = req.params?.code || req.body.code
  console.log('codeCheck', codeCheck);
  if(!codeCheck) {
    res.send(Response(404, "Please enter code to sign in"));
    res.end();
    return;
  }

  const checkValidCode = await cached.get(codeCheck);
  console.log('checkValidCode',checkValidCode);
  if(!checkValidCode) {
    res.send(Response(404, "Your code was be invalid or expired"));
    res.end();
    return;
  } else {
    const rs = JSON.parse(checkValidCode);
    await cached.del(codeCheck);
    await cached.set(rs?.token, JSON.stringify(rs));
    console.log('rs', rs);
    res.send(Response(200, "Success", rs));
    res.end();
    return;
  }
});




router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if(!id) {
    res.send(Response(400, "No Patient found"));
    return;
  }
  try {
    let response = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $eq: convertId(id)} },
          ],
        },
      },
    ]);
    if (response?.length > 0) {
      response = response[0];
      res.send(
        Response(200, "success", response)
      );
    } else {
      res.send(Response(400, "Not found"));
    }
  } catch (e) {}
});

// /// get list and search
router.post("/full/s", checkHeaderConfig, getUser, async (req, res) => {
  const search = req.body?.search || req.query?.search || "";
  const typeFacuty = req.body.faculty || "";
  const role = req.body.role || "";
  const isAdmin = req.userInfo.isAdmin;
  const isSelectMode = req.body?.isSelectMode;
  const pageNumber = req.body?.pageNumber || 0;
  const pageLength = req?.userInfo?.setting?.pageLength || 5


  const aggregateRole = role === "" ? {$match: {
     
  }} :  {
    $match: {
      $and : [
        { role: {$eq: role}}
      ]
    }
  }


  const aggregateFalcuty = typeFacuty === "" ? {$match: {
     
  }} :  {
    $match: {
      $and : [
        { faculty: {$eq: typeFacuty}}
      ]
    }
  }

  const project = isSelectMode
    ? {
        fullName: 1,
      }
    : {
        fullName: 1,
        age: 1,
        address: 1,
        phoneNumber: 1,
        email: 1,
        avatar: 1,
        createdAt: 1
      };

  const regexPattern = getRegexPatternSearch(search) || "";
  let totalLength = 0;
  console.log('pageLength', pageLength);
  try {
    if(!isAdmin) {
        totalLength = await User.find({faculty: userInfo?.faculty}).count()
        const response = await User.aggregate([
          {
            $match: {
              $and: [
                { faculty : {$eq: typeFacuty}},
              ],
            },
          },
          {
            $skip: pageNumber * pageLength
          },
          {
            $match: {
              $or: [
                { fullName: { $regex: regexPattern, $options: "i" } },
                { email: { $regex: regexPattern, $options: "i" } },
              ],
            },
          },
          {
            $project: project,
          },
          {
            $limit: isSelectMode ? 1000000 : pageLength
          },
          {
            $sort: { createdAt: 1 }
          },
        ]);
        if (response?.length > 0) {
          res.send(Response(200, "Get user success", {data: response, totalLength, pageNumber: pageNumber + 1, pageLength: pageLength}));
        } else {
          res.send(Response(400, "No user found"));
        }
    } else {
      totalLength = await User.find({}).count()
      const response = await User.aggregate([
        {...aggregateFalcuty},
        {...aggregateRole},
        {
          $match: {
            $or: [
              { username: { $regex: regexPattern, $options: "i" } },
              { fullName: { $regex: regexPattern, $options: "i" } },
              { email: { $regex: regexPattern, $options: "i" } },
            ],
          },
        },
        {
          $skip: isSelectMode ? 0 : pageNumber * pageLength
        },
        {
          $project: project,
        },
        {
          $limit: isSelectMode ? 1000000 : pageLength
        },
        {
          $sort: { createdAt: 1 }
        },
      ]);
      console.log('response', response);
      if (response?.length > 0) {
        await cached.set("usersCached", JSON.stringify(response));
        console.log('totalLength', totalLength);
        res.send(Response(200, "Get user success", {data: response, totalLength, pageNumber: pageNumber + 1, pageLength: pageLength}));
      } else {
        res.send(Response(400, "No user found"));
      }
    }
  } catch (e) {}
});
/// remove user
router.delete("/:id", checkHeaderConfig, getUser, async (req, res) => {
  const Ids = req.body.id;
  let deleteUser;

  try {
    if (typeof Ids == "string") {
      deleteUser = await User.deleteOne({
        status: { $eq: "Inactive" },
        _id: { $eq: convertId(Ids) },
      });
    }

    if (Array.isArray(Ids)) {
      const InactiveIds = await User.aggregate([
        {
          $match: {
            $and: [
              { _id: { $in: convertManyId(Ids) } },
              { status: "Inactive" },
            ],
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      deleteUser = await User.deleteMany({
        _id: { $in: InactiveIds },
      });
    }

    if (deleteUser?.deletedCount > 0) {
      await cached.del("usersCached");
      res.send(Response(200, "delete user success"));
    } else {
      res.send(Response(400, "delete user unsuccess"));
    }
  } catch (e) {}
});

// /// update user
router.put("/:id", checkHeaderConfig, getUser, async (req, res) => {
  const userInfo = req.userInfo;
  try {
    let updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log('updateUser', updateUser);
    if (updateUser) {
      res.send(Response(200, "Update user success"));
    }
  } catch (e) {
    Response(500, "Internal sever", e);
  }
});

// /// logout user
router.post("/logout", checkHeaderConfig, getUser, async (req, res) => {
  const token = req.body.token;
  if (!token) {
    res.send(Response(400, "Token Required", false));
  }
  const delCached = await cached.del(token);
  if (delCached) {
    res.send(Response(200, "Suceessfully", true));
  }
});


router.post("/assign-patient", checkHeaderConfig, getUser, async (req, res) => {
  const doctorId = req.body?.doctorId;
  const patientId = req.body?.patientId;
  const role = req.userInfo?.role || "";
  const faculty = req.userInfo?.faculty || "";

  if(!(['TK', 'TN'].indexOf(role) >=0)) {
    res.send(Response(400, "You have not permission !", false));
    return;
  }
  if(!doctorId) {
    res.send(Response(400, "DoctorId Require", false));
    return;
  }

  if(!patientId) {
    res.send(Response(400, "DoctorId Require", false));
    return;
  }

  try {
    const response = await Patient.findByIdAndUpdate(patientId, {userId: doctorId, faculty: faculty}, { new: true });
    if(response) {
      res.send(Response(400, "Assign Successfully", response));
    } else {
      res.send(Response(500, "Internal Server", false));
    }
  } catch(e) {
    console.log('error', e);
  }
 
});


router.post("/full/falcuty", checkHeaderConfig, getUser, async (req, res) => {
  const search = req.body?.search || req.query?.search || "";
  const role = req.userInfo.role || "";
  const faculty = req.userInfo.faculty || "";
  console.log('faculty', faculty);
  if(!(role === 'TK')) {
    res.send(Response(400, "You dont have permission !"));
  }
  const isCached = await cached.exists("usersCached");
  if (!search && isCached) {
    const response = await cached.get("usersCached");
    res.send(Response(200, "Get user success", JSON.parse(response)));
  }

  const isSelectMode = req.body?.isSelectMode;
  const project = isSelectMode
    ? {
        fullName: 1,
      }
    : {
        fullName: 1,
        age: 1,
        address: 1,
        phoneNumber: 1,
        email: 1,
        createdAt: 1,
        avatar: 1
      };

  const regexPattern = getRegexPatternSearch(search) || "";
  try {
    const response = await User.aggregate([
      {
        $match: {
          $and: [
            { faculty : {$eq: faculty}},
          ],
        },
      },
      {
        $match: {
          $or: [
            { fullName: { $regex: regexPattern, $options: "i" } },
            { email: { $regex: regexPattern, $options: "i" } },
          ],
        },
      },
      {
        $project: project,
      },
    ]);
    if (response?.length > 0) {
      await cached.set("usersCached", JSON.stringify(response));
      res.send(Response(200, "Get user success", response));
    } else {
      res.send(Response(400, "No user found"));
    }
  } catch (e) {}
});


module.exports = router;
