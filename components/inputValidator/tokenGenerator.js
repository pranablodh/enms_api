const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
    generateToken: function(uuid, company_name, email, contact_number, email_verified, mobile_verified)
    {
        const token = jwt.sign
        ({
          uuid: uuid,
          company_name: company_name,
          email: email,
          contact_number: contact_number,
          email_verified: email_verified,
          mobile_verified: mobile_verified
        },
          process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXP }
        );
        return token;
    }
}