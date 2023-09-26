const express = require("express");
const http = require ("http");
const path = require ("path");
const {routesInit} = require ("./routes/configRoutes");
const cors = require('cors');
const fileUpload = require("express-fileupload");
require("./db/mongoConnect");

const app = express();
app.use(express.json({limit:'30mb'}));

app.use(cors());

app.use(fileUpload({
    limits:{fileSize:"15mb"},
    useTempFiles:true
  }))

app.use(express.static(path.join(__dirname,"public")));

routesInit(app);

const server = http.createServer(app);
const port = process.env.PORT || 3005;
server.listen(port);