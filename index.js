//Essential Functions Import and Port Number Declaration
const bodyParser = require('body-parser');
const express    = require('express');
const app        = express();
const cors       = require('cors');
const dotenv     = require('dotenv');
dotenv.config();
const portNumber = process.env.SERVER_PORT;
const user   = require('./components/routers/user/user');
const admin  = require('./components/routers/admin/admin');


//Configure the App to Use BodyParser, Cors
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/user', user.router);
app.use('/admin', admin.router);


app.get('/', (req, res) => 
{
    res.json({Info: 'API Endpoint is Running'});
})

app.listen(portNumber, () => console.log('Server Listnening on Port: ' + portNumber));