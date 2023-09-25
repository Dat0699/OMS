const express = require('express');
const Patient = require("../model/patient");
const router = express.Router();
const { checkHeaderConfig, getUser } = require("../middleware");
const {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
  generateToken
} = require("../util");
const log = require('../model/log');

const keyRequires = ["fullName", "birthDate", "address", "phoneNumber"];

const nodemailer = require("nodemailer");
const appPassword = 'cmrwzgdmhnoaroli'


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // secure: true,
  auth: {
    user: '13816@student.vgu.edu.vn',
    pass: appPassword
  }
});


router.post("/add", async (req, res) => {
    const body = req.body;
    const isAdmin = req.userInfo.isAdmin;
    if(req.userInfo.role !== "TN" && !isAdmin) {
      res.send(Response(400, "User was not permission"));
      return;
    }
    try {
      for (let i = 0; i < keyRequires.length; i++) {
        if (!Object.keys(body).includes(keyRequires[i])) {
          res.send(Response(400, "Some key require"));
          return;
        }
      }
  
      const newPatient = await Patient.create({ ...body });
      if (newPatient) {
        res.send(Response(200, "Create Patient Success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      throw e;
    }
    // }, time);
});
  
  // /// get list and search for recption
  router.post("/full/s", async (req, res) => {
    const name = req.body?.name || req.query?.name || "";
    const pageNumber = req.body?.pageNumber || 0;
    const role = req.userInfo?.role || "";
    const isAdmin = req.userInfo.isAdmin;
    const status = req.body?.status || ""
    const pageLength = req?.userInfo?.setting?.pageLength || 5

    const aggregateStatus = status === "" ? {$match: {
     
    }} :  {
      $match: {
        $and : [
          { status: {$eq: status}}
        ]
      }
    }

    if(!(["TN"].indexOf(role) >=0) && !isAdmin) {
      res.send(Response(400, "User was not permission"));
      return;
    }
    const isSelectMode = req.body?.isSelectMode;
    const project = isSelectMode
      ? {
            fullName: 1,
        }
      : {
          fullName: 1,
          age: 1,
          phoneNumber: 1,
          address: 1,
          status: 1,
          gender: 1,
          birthDate: 1,
          createdAt: 1,
          count: 1,
        };
  
    const regexName = getRegexPatternSearch(name) || "";


    try {
      const totalLength = await Patient.find({}).count();
      const response = await Patient.aggregate([
        {
          $skip: pageNumber * pageLength
        },
        {...aggregateStatus},
        {
          $match: {
            $or: [
              { fullName: { $regex: regexName, $options: "i" } },
              { phoneNumber: { $regex: regexName, $options: "i" } },
              { address: { $regex: regexName, $options: "i" } },
            ],
          },
        },
        {
          $project: project,
        },
        {
          $limit: pageLength
        },
        {
          $sort: { createdAt: 1 }
        },
      ]);

      if (response?.length > 0) {
        res.send(
          Response(200, "Get Patient success", { data: [...response], pageNumber: pageNumber + 1, pageLength: pageLength, totalLength })
        );
      } else {
        res.send(Response(400, "No Patient found"));
      }
    } catch (e) {}
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    console.log('id', id);
    if(!id) {
      res.send(Response(400, "No Patient found"));
      return;
    }
    try {
      let response = await Patient.aggregate([
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
          Response(200, "Get Patient success", response)
        );
      } else {
        res.send(Response(400, "No Patient found"));
      }
    } catch (e) {}
  });

  router.post("/full/tk/s", async (req, res) => {
    const name = req.body?.name || req.query?.name || "";
    const pageNumber = req.body?.pageNumber || 0;
    const role = req.userInfo?.role || "";
    const faculty =  req.userInfo?.faculty || "";
    const isAdmin = req.userInfo.isAdmin;
    const pageLength = req?.userInfo?.setting?.pageLength || 5
    if(!(["TK"].indexOf(role) >=0) && !isAdmin) {
      res.send(Response(400, "User was not permission"));
      return;
    }
    const status = req.body?.status || ""

    const aggregateStatus = status === "" ? {$match: {
     
    }} :  {
      $match: {
        $and : [
          { status: {$eq: status}}
        ]
      }
    }

    const isSelectMode = req.body?.isSelectMode;
    const project = isSelectMode
      ? {
            fullName: 1,
        }
      : {
          fullName: 1,
          age: 1,
          phoneNumber: 1,
          address: 1,
          status: 1,
          gender: 1,
          birthDate: 1,
          createdAt: 1,
        };
  
    const regexName = getRegexPatternSearch(name) || "";
    try {
      const totalLength = await Patient.find({facutyRef: faculty}).count();
      const response = await Patient.aggregate([

        {
          $match: {
            $and : [
              { facutyRef: {$eq: faculty}}
            ]
          }
        },

        {
          $addFields: {
            // Add a new field 'newField' with a value of 1 to each document
            newField: 1
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }
          }
        },

        {
          $skip: pageNumber * pageLength 
        },
        {...aggregateStatus},
        {
          $match: {
            $or: [
              { fullName: { $regex: regexName, $options: "i" } },
              { phoneNumber: { $regex: regexName, $options: "i" } },
              { address: { $regex: regexName, $options: "i" } },
            ],
          },
        },
        {
          $project: project,
        },
        {
          $limit: pageLength
        },
        {
          $sort: { createdAt: 1 }
        },
      ]);
      if (response?.length > 0) {
        res.send(
          Response(200, "Get Patient success", { data: [...response], pageNumber: pageNumber + 1, pageLength: pageLength, totalLength })
        );
      } else {
        res.send(Response(400, "No Patient found"));
      }
    } catch (e) {}
  });
  
  router.post("/doctor/full/s", async (req, res) => {
    const name = req.body?.name || req.query?.name || "";
    const pageNumber = req.body?.pageNumber || 0;
    const id = req.userInfo?._id || "";
    const pageLength = req?.userInfo?.setting?.pageLength || 5
    const status = req.body?.status || ""
    const aggregateStatus = status === "" ? {$match: {
     
    }} :  {
      $match: {
        $and : [
          { status: {$eq: status}}
        ]
      }
    }
    const isSelectMode = req.body?.isSelectMode;
    const project = isSelectMode
      ? {
            fullName: 1,
        }
      : {
            fullName: 1,
            age: 1,
            phoneNumber: 1,
            address: 1,
            status: 1,
            gender: 1,
            birthDate: 1,
            createdAt: 1,
        };
  
    const regexName = getRegexPatternSearch(name) || "";
    try {
      const totalLength = await Patient.find({userId: id}).count();
      console.log('totalLength', totalLength);
      const response = await Patient.aggregate([
        {
          $match: {
            $and: [
              { userId:   {$eq: id}}
            ],
          },
        },

        {
          $skip: pageNumber * pageLength 
        },
        {
          $skip: pageNumber * pageLength 
        },

        {...aggregateStatus},
        {
          $match: {
            $or: [
              { fullName: { $regex: regexName, $options: "i" } },
              { phoneNumber: { $regex: regexName, $options: "i" } },
              { address: { $regex: regexName, $options: "i" } },
            ],
          },
        },
        {
          $project: project,
        },
        {
          $limit: pageLength
        },
      
        {
          $sort: { createdAt: 1 }
        },
      ]);

      if (response?.length > 0) {
        res.send(
          Response(200, "Get Patient success", { data: [...response], pageNumber: pageNumber + 1, pageLength: pageLength, totalLength })
        );
      } else {
        res.send(Response(400, "No Patient found"));
      }
    } catch (e) {}
  });
  /// remove Patient
  router.delete("/", checkHeaderConfig, async (req, res) => {
    const Ids = req.body.id;
    let deletePatient;
  
    try {
      if (typeof Ids == "string") {
        deletePatient = await Patient.deleteOne({
          _id: { $eq: convertId(Ids) },
        });
      }
  
      if (Array.isArray(Ids)) {
        const InactiveIds = await Patient.aggregate([
          {
            $match: {
              $and: [{ _id: { $in: convertManyId(Ids) } }],
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ]);
  
        deletePatient = await Patient.deleteMany({
          _id: { $in: InactiveIds },
        });
      }
  
      if (deletePatient?.deletedCount > 0) {
        res.send(Response(200, "Delete Patient success"));
      } else {
        res.send(Response(400, "Delete Patient unsuccess"));
      }
    } catch (e) {}
  });
  
  // // /// update Patient
  router.put("/:id", async (req, res) => {
    let updatePatient;
    try {
      updatePatient = await Patient.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.send(Response(200, "Update Patient success", updatePatient));
    } catch (e) {
      Response(500, "Internal Sever", e);
    }
  });

  router.post("/register", async (req, res) => {
    const body = req.body;
    const keyRequire = ["email", "password", "fullName"];
    try {
      for (let i = 0; i < keyRequire.length; i++) {
        if (!Object.keys(body).includes(keyRequire[i])) {
          res.send(Response(400, "Some key require"));
          return;
        }
      }
  
      const newPatient = await Patient.create({ ...body });
      if (newPatient) {
        res.send(Response(200, "Create Patient Success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      throw e;
    }
    // }, time);
  });

  router.post("/login", async (req, res) => {
    console.log('go here');
    const { email, password } = req.body;
    try {
      const checkUser = await Patient.aggregate([
        {
          $match: {
            $and: [
              { email: { $eq: email } },
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


module.exports = router;
