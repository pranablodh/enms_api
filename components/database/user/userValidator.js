const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');

const userValidator = (req, response, next) =>
{
    if(!req.body.user)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address or Mobile Number'});
    }

    const createQuery = `SELECT * FROM user_info WHERE contact_number = $1 OR email = $1`

    const values =
    [
        req.body.user
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Registered.'}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            next();
        }
    });
}

module.exports = 
{
    userValidator
}
