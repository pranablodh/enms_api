const db             = require('../pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const token          = require('../../inputValidator/tokenGenerator');

const login = (req, response, next) =>
{
    if(!req.body.email || !req.body.password)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.email)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address'});
    }

    const createQuery = `SELECT i.uuid, i.company_name, i.email, i.contact_number, c.pasword, c.email_verified, c.mobile_verified 
    FROM user_info i, user_cred c, user_verified v
    JOIN user_cred c ON c.uuid = i.uuid 
    JOIN user_verified v ON v.uuid = c.uuid
    WHERE i.email = $1`


    const values = 
    [
        req.body.email
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        // if(res.rows.length === 0)
        // {
        //     db.pool.end;
        //     return response.status(400).send({'Message': 'Invalid OTP.'}); 
        // }

        else
        {
            db.pool.end;
            console.log(res.rows);
            return response.status(200).send({'Message': 'Email Verified.'});
        }
    });
}

module.exports =
{
    login
}