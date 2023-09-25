const express = require('express');
const router = express.Router();
// const puppeteer = require('puppeteer');
const Consultation = require("../model/consultation");
const User = require("../model/user");
const Patient = require("../model/patient");


const {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
  generateToken,
} = require("../util");





// router.get('/export-consulation', async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const htmlContent = '<html><body><h1>Hello PDF!</h1></body></html>';
//     await page.setContent(htmlContent);
//     const pdfBuffer = await page.pdf({ format: 'A4' });
//     await browser.close();
  
//     res.setHeader('Content-Disposition', 'attachment; filename="generated-pdf.pdf"');
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(pdfBuffer);
// });



router.post("/full/:patientId", async (req, res) => {
  const body = req.body;
  const patientId = body?.patientId || req.params.patientId || "";
  const userId = req.userInfo?._id;
  const fromDate = body?.fromDate || new Date('2023-08-21T17:02:17.244Z')
  const toDate = body?.toDate || new Date();
  if(!(patientId && userId)) {
      res.send(Response(400, "Some key requires !"));
      return;
  }
  try {
    const rs = await Consultation.aggregate([
      {
        $match: {
          $and: [
            { patientId: {$eq: patientId}}
          ],
        },
      },

     

      {
        $project: {
          _id: 1,
          createdAt: 1
        }
      }
    ])
    if (rs) {
      res.send(Response(200, "Success", rs));
    } else {
      res.send(Response(500, "Internal Server !"));
    }
  } catch (e) {
    throw e;
  }
  // }, time);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let rs = await Consultation.aggregate([
      {
        $match: {
          $and: [
            { _id: { $eq: convertId(id)} },
          ],
        },
      },
    ])
    if (rs) {
      rs =rs[0];
      console.log('rs.userId', rs.userId);
      if(rs.userId) {
        const user = await User.findById(rs?.userId);
        console.log('user', user);
        rs.user= user;
      }

      if(rs.userId2) {
        const user2 = await User.findById(rs?.userId2);
        rs.user2 = user2;
      }

      res.send(Response(200, "Success", rs));
    } else {
      res.send(Response(500, "Internal Server !"));
    }
  } catch (e) {
    throw e;
  }
  // }, time);
});


router.post("/add", async (req, res) => {
    const body = req.body;
    const patientId = body?.patientId;
    const userId = req.userInfo?._id;
    try {
      const newPatient = await Consultation.create({ ...body, patientId, userId });
      if (newPatient) {
        res.send(Response(200, "Create Success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      console.log(e);
    }
    // }, time);
  });


  router.put("/update/:id", async (req, res) => {
    const body = req.body;
    const consulationId = req.params.id || body.idConsultation || "";

    const medicineIds = body.medicineIds;
    const description = body.description;

    if(!consulationId) {
        res.send(Response(400, "Some key requires !"));
    }

    const data = {
        medicineIds,
        description
    }
    try {
      if (rs) {
        res.send(Response(200, "Update Success"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }
    } catch (e) {
      throw e;
    }
    // }, time);
  });

  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const idPatient = req.body.idPatient;
    const isUpdateStatusPatient = req.body.status === 2;
    try {
      const updateUser = await Consultation.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (updateUser) {
        if(isUpdateStatusPatient && idPatient) {
            await Patient.findByIdAndUpdate(
              idPatient,
            {
              $set: {status : 'RE-EXAM'},
            },
            { new: true }
          );
        }
        res.send(Response(200, "Update success"));
      }
    } catch (e) {
      Response(500, "Internal sever", e);
    }
  });

module.exports = router;
