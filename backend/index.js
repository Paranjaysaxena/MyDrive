require("dotenv").config();
const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const fileRouter = require("./routers/file_management");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
var cors = require("cors");

app.use(bodyParser.json());
app.use(fileUpload());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(fileRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
