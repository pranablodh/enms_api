const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
    generateToken: function(uuid)
    {
        const token = jwt.sign
        ({
          uuid: uuid
        },
          process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXP }
        );
        return token;
    }
}