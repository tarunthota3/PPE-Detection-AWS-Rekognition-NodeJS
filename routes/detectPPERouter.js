const router = require("express").Router();
var multer = require('multer');
var rekognition = require('../config/aws');
var fs = require('fs');
var path = require('path');


var localFileName = "";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../images/')
    },
    filename: function (req, file, cb) {
        localFileName = Date.now() + "-" + file.originalname
        cb(null, localFileName)
    }
});

var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
})

function getFile(path) {
    try {
        const image = fs.readFileSync(path)
        return (image)
    }
    catch (e) {
        console.error(e.message)
        process.exit()
    }
}


/**
 * @swagger
 * /detectPPE:
 *   post:
 *     description: Return the PPE detection of an image uploaded
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The file to upload.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Response from AWS rekognition with details of PPE detection
 *       400:
 *         description: File can't be empty
 *       500:
 *         description: Only images are allowed
 */ 
router.post('/', upload.any(), function (req, res) {
    if(localFileName.length == 0)
        res.status(400).send("File can't be empty");
    
    var params = {
        Image: {
            Bytes: getFile(`./images/${localFileName}`)
        }
    };
    
    rekognition.detectProtectiveEquipment(params, function (err, data) {
        if (err) console.log("err: ", err, err.stack);
        else {
            console.log("data: ", data);
            res.json(data);
        }
    });
});

module.exports = router;