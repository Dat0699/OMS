/** @format */

const Medicine = require("../model/medicine");
const express = require("express");
const router = express.Router();
const { checkHeaderConfig } = require("../middleware");
const {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
} = require("../util");

const keyRequires = ["name", "typeMedicineIds", "entryPrice", "unit"];
let CachedMemoized = {};
let debounce;

/// create
router.post("/add", async (req, res) => {
  const body = req.body;
  // const detechDevice = req.header("access-device");
  // let time = CachedMemoized[detechDevice] ? 300 : 0;
  // time && clearTimeout(debounce);
  // debounce = setTimeout(async () => {
  try {
    for (let i = 0; i < keyRequires.length; i++) {
      if (!Object.keys(body).includes(keyRequires[i])) {
        res.send(Response(400, "Some key require"));
        return;
      }
    }

    const checkExits = await Medicine.aggregate([
      {
        $match: { name: { $eq: body.name } },
      },
    ]);

    if (checkExits.length > 0) {
      res.send(Response(400, "Medicine was exits !"));
      return;
    }

    const newMedicine = await Medicine.create({ ...body });
    if (newMedicine) {
      CachedMemoized[detechDevice] = true;
      // await cached.del("medicinesCached");
      res.send(Response(200, "create medicine success"));
    } else {
      res.send(Response(500, "Internal Server !"));
    }
  } catch (e) {
    throw e;
  }
  // }, time);
});

// /// get list and search
router.post("/full/s", checkHeaderConfig, async (req, res) => {
  const name = req.body?.name || req.query?.name || "";
  const priceFrom = req.body?.priceFrom || req.query?.priceFrom || 0;
  const priceTo =
    req.body?.priceTo ||
    req.query?.priceTo ||
    new Intl.NumberFormat().format(3000000000);
  const cachedKeyFromClient = req.body.cachedKey || "";

  const isCached = await cached.exists(cachedKeyFromClient);

  if (isCached) {
    const response = await cached.get(cachedKeyFromClient);
    res.send(Response(200, "Get medicine success", JSON.parse(response)));
  }

  //
  const isSelectMode = req.body?.isSelectMode;
  const project = isSelectMode
    ? {
        name: 1,
      }
    : {
        name: 1,
        typeMedicineIds: 1,
        entryPrice: 1,
        price: 1,
      };

  const regexName = getRegexPatternSearch(name) || "";
  try {
    const response = await Medicine.aggregate([
      {
        $match: {
          $and: [
            {
              $expr: {
                $and: [
                  { $gte: ["$entryPrice", priceFrom] },
                  { $lte: ["$entryPrice", priceTo] },
                ],
              },
            },
            { name: { $regex: regexName, $options: "i" } },
          ],
        },
      },
      {
        $project: project,
      },
    ]);
    console.log("response", response);
    if (response?.length > 0) {
      const cachedKey = name + (priceFrom + "") + (priceTo + "");
      await cached.set(cachedKey, JSON.stringify(response), {
        EX: 10,
        NX: true,
      });
      res.send(
        Response(200, "Get Medicine success", { ...response, cachedKey })
      );
    } else {
      res.send(Response(400, "No Medicine found"));
    }
  } catch (e) {}
});

/// remove Medicine
// router.delete("/:id", checkHeaderConfig, async (req, res) => {
//   const Ids = req.body.id;
//   let deleteMedicine;

//   try {
//     if (typeof Ids == "string") {
//       deleteMedicine = await Medicine.deleteOne({
//         status: { $eq: "Inactive" },
//         _id: { $eq: convertId(Ids) },
//       });
//     }

//     if (Array.isArray(Ids)) {
//       const InactiveIds = await Medicine.aggregate([
//         {
//           $match: {
//             $and: [
//               { _id: { $in: convertManyId(Ids) } },
//               { status: "Inactive" },
//             ],
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//           },
//         },
//       ]);

//       deleteMedicine = await Medicine.deleteMany({
//         _id: { $in: InactiveIds },
//       });
//     }

//     if (deleteMedicine?.deletedCount > 0) {
//       await cached.del("MedicinesCached");
//       res.send(Response(200, "delete Medicine success"));
//     } else {
//       res.send(Response(400, "delete Medicine unsuccess"));
//     }
//   } catch (e) {}
// });

// // /// update Medicine
// router.put("/:id", async (req, res) => {
//   let updateMedicine;

//   try {
//     updateMedicine = await Medicine.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.send(Response(200, "Update Medicine success", updateMedicine));
//   } catch (e) {
//     Response(500, "internal sever", e);
//   }
// });

module.exports = router;
