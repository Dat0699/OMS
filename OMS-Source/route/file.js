const { log } = require("../");
const express = require("express");
const router = express.Router();
const {
    Response,
  } = require("../util");
const fs = require('fs');
const path = require('path');

router.post("/upload", (req, res) => {
    console.log('req.files', req.files);
    const { image } = req.files;
    if (!image) return res.sendStatus(400);
    const filePath = 'http://'+res.req.headers.host + "/" +image.name;
    Response(200, "",{path: filePath});
    image.mv("stored/" + image.name);
    res.sendStatus(200);
    // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
});


router.get("/:name", (req, res) => {
    const nameFile = req.params.name;
    const imageSavePath = path.join("stored", nameFile);
    console.log('res', res);
    fs.readFile(imageSavePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading image');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        }
    });
});


module.exports = router;
