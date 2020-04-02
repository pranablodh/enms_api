const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
    generateToken: function(uuid, company_name, email, contact_number, user_type, created_at, updated_at)
    {
        const token = jwt.sign
        ({
          uuid: uuid,
          company_name: company_name,
          email: email,
          contact_number: contact_number,
          user_type: user_type,
          created_at: created_at,
          updated_at: updated_at
        },
          process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXP }
        );
        return token;
    }
}