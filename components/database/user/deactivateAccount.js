const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const otp            = require('otp-generator');

const deactivate = (req, response, next) =>
{
    if(!req.body.user || !req.body.password)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address or Mobile Number'});
    }

    const createQuery = `SELECT i.uuid, c.password FROM user_info i
    INNER JOIN user_cred c ON c.uuid = i.uuid WHERE i.email = $1 OR i.contact_number = $1`

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

        else if(inputValidator.comparePassword(res.rows[0].password, req.body.password))
        {
            next();
        }

        else if(!inputValidator.comparePassword(res.rows[0].password, req.body.password))
        {
            db.pool.end;
            return response.status(403).send({'Message': 'Wrong Credentials.'});
        }

        else
        {
            db.pool.end;
            console.log(res.rows);
            return response.status(400).send({'Message': 'Deactivation Failed.'});
        }
    });
}

module.exports = 
{
    deactivate
}