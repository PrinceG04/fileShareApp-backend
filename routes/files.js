const router = require("express").Router();

const multer = require("multer");
const path = require("path");

const File = require("../models/file");

const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const path = `uploads/`;
    callback(null, path);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 34568643656-286334624626283.zip(eg. pdf,jpeg,jpg)
    callback(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 1024 * 1024 * 100 }, // fileSize: 100mb
}).single("myfile");

// console.log(JSON.stringify(upload));

router.post("/", (req, res) => {
  // Store file
  upload(req, res, async (err) => {
    // Validate request
    if (!req.file) {
      return res.json({ error: "All fields are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    // http://localhost:3000/files/2363jsdgfgj-234bhjbhbjhb
  });

  //    console.log(req.body);

  // Response-> Link
});

router.post("/send", async (req, res) => {
  // console.log(req.body);
  const {uuid,emailTo,emailFrom} = req.body;

 
 
  // validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All Fields are required." });
  }

  const file = await File.findOne({ uuid: uuid });
  // console.log(file);
  // console.log(parseInt(file.size/1000)+"KB");

  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // send email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Files received",
    text: `${emailFrom} shared a files with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size/1024)+' KB',
      expires: "24 hours",
    }),
  });
  res.send({success: true});

});

module.exports = router;
