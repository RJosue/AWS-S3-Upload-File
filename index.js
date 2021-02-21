const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();

const AWSUpload = require('./src/upload-to-aws');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

AWSUpload.UploadAWS.uploadFile();

server.listen(port, () => {
    console.log("Server Up in " + port);
});