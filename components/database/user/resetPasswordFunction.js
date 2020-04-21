const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');

const resetPasswordFunction = (req, response, next) =>
{

    if(!inputValidator.isValidPassword(req.body.password)) 
    {
        return response.status(400).send({'Message': 'Password Length Should Be In Between 8 to 15 and Must Contain Atleast' + 
       ' One Upper Case, One Lower Case, One Number and One Special Character.'});
    }
    
    const createQuery = `UPDATE user_cred SET password = $1, pass_updated_at = current_timestamp
    WHERE uuid = (SELECT uuid FROM user_otp WHERE email_otp = $2 OR mobile_otp = $2) RETURNING *`

    const values = 
    [
       inputValidator.hashPassword(req.body.password),
       req.body.otp
    ]

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            req.body.uuid = res.rows[0].uuid;
            next();
            return response.status(201).send({'Message': 'Password Changed.'});   
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Wrong OTP.'});  
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Error.'});  
        }
    });
}

module.exports = 
{
    resetPasswordFunction
}