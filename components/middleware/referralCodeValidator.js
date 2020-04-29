const db             = require('../database/dbConnection/pgPool');
const inputValidator = require('../inputValidator/inputValidator');

const referralCodeValidator = (req, response, next) =>
{

    if(!inputValidator.isValidAlphaNumericString(req.body.referral_code)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Referral Code.'});
    }

    const createQuery = `SELECT uuid from user_referral_code WHERE referral_code = $1`

    const values = 
    [
        req.body.referral_code
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(500).send({'Message': 'Error.'});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(401).send({'Message': 'Invalid Referral Code.'}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            req.body.referral_uuid = res.rows[0].uuid;
            next(); 
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
    referralCodeValidator
}