//Essential Functions Import and Port Number Declaration
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const portNumber = process.env.SERVER_PORT;
const userSelf = require('./components/routers/userSelf')

//Configure the App to Use BodyParser, Cors and SQL-Injection Detector
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/', userSelf.router);

app.get('/', (req, res) => 
{
    res.json({Info: 'API Endpoint is Running'});
})

app.listen(portNumber, () => console.log('Server Listnening on Port: ' + portNumber));