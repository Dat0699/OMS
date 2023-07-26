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
      if (newUser) {
        CachedMemoized[detechDevice] = true;
        await cached.del("usersCached");
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
  const { username, password } = req.body;

  console.log("username", username);
  console.log("password", password);

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
    console.log("checkUser", checkUser);

    if (checkUser.length > 0) {
      const response = checkUser[0];
      const key = await generateToken();
      console.log("key", key);
      if (key) {
        response.token = key;
        const a = await cached.set(key, JSON.stringify(response));
        if (a) {
          res.send(Response(200, "Login success", response));
        }
      }
    } else {
      res.send(Response(404, "Username or password incorrect"));
    }
  } catch (e) {
    throw e;
  }
});

// /// get list and search
router.post("/full/s", checkHeaderConfig, getUser, async (req, res) => {
  const search = req.body?.search || req.query?.search || "";
  const isCached = await cached.exists("usersCached");

  console.log("req", req.socket.localAddress);

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
      };

  const regexPattern = getRegexPatternSearch(search) || "";
  try {
    const response = await User.aggregate([
      {
        $match: {
          $or: [
            { fullName: { $regex: regexPattern, $options: "i" } },
            { email: { $regex: regexPattern, $options: "i" } },
            // {name : {$regex: regexPattern}},
          ],
        },
      },
      {
        $project: project,
      },
    ]);
    console.log("running");
    if (response?.length > 0) {
      await cached.set("usersCached", JSON.stringify(response));
      res.send(Response(200, "Get user success", response));
    } else {
      res.send(Response(400, "No user found"));
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
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updateUser) {
      res.send(Response(200, "Update user success"));
    }
  } catch (e) {
    Response(500, "Internal sever", e);
  }
});

// /// update user
router.post("/logout", checkHeaderConfig, getUser, async (req, res) => {
  const token = req.body.token;
  if(!token) {
    res.send(Response(400, "Token Required", false));
  }
  const delCached = await cached.del(token);
  if(delCached) {
    res.send(Response(200, "Suceessfully", true));
  }
});

module.exports = router;
