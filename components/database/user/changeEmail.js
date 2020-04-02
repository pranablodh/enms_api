const db             = require('../dbConnection/pgPool');
const otp            = require('otp-generator');
const inputValidator = require('../../inputValidator/inputValidator');

const changeEmail = (req, response, next) =>
{
    if(!inputValidator.isValidEmail(req.body.email)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address.'});
    }

    const createQuery = `WITH 
    upd1 AS(UPDATE user_verified SET email_verified = 0 WHERE uuid = $1),
    upd2 AS(UPDATE user_otp SET email_otp = $3 WHERE uuid = $1)
    UPDATE user_info SET email = $2 WHERE uuid = $1 RETURNING uuid, email`

    const values = 
    [
        req.body.uuid,
        req.body.email,
        otp.generate(6, { upperCase: false, specialChars: false })
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Found.'}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            req.subject = process.env.EMAIL_CHANGE_SUBJECT;
            req.message = process.env.EMAIL_CHANGE_MESSAGE;
            next();
            return response.status(200).send({'Message': 'Email ID Updated.'});
        }

        else
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Email ID Not Updated'}); 
        }
    });
}

module.exports = 
{
    changeEmail
}
