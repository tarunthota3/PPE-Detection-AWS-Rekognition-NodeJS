var express = require('express')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const DetectPPRRouter = require('./routes/detectPPERouter');
require("dotenv").config()
const port = process.env.port;
const ipaddress = process.env.ipAddress;
var app = express()

const options = {
    swaggerDefinition: {
        info: {
            title: 'AWS Recognition PPE Detection API',
            version: '1.0.0',
            description: 'AWS Recognition PPE Detection API autogenerated by swagger'
        },
        host:ipaddress + ":" + port,
        basePath:'/'
    },
    apis:['./routes/detectPPERouter.js']
};

const specs = swaggerJsDoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/detectPPE', DetectPPRRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://${ipaddress}:${port}`);
});