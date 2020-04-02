const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const token          = require('../../inputValidator/tokenGenerator');

const login = (req, response, next) =>
{
    if(!req.body.user || !req.body.password)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address or Mobile Number'});
    }

    const createQuery = `SELECT i.uuid, i.company_name, i.email, i.contact_number, i.created_at, i.updated_at, 
    c.password, c.active_flag, c.pass_updated_at, v.email_verified, v.mobile_verified, user_type
    FROM user_info i
    INNER JOIN user_cred c ON c.uuid = i.uuid 
    INNER JOIN user_verified v ON v.uuid = c.uuid
    INNER JOIN user_type t ON t.uuid = v.uuid
    WHERE i.email = $1 OR i.contact_number = $1`

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
            if(res.rows[0].email_verified === 0 && res.rows[0].mobile_verified === 0)
            {
                db.pool.end;
                return response.status(400).send({'Message': 'Email and Mobile Number are Not Verifed'}); 
            }

            else if(res.rows[0].mobile_verified === 0)
            {
                db.pool.end;
                return response.status(400).send({'Message': 'Mobile Number is Not Verifed'}); 
            }

            else if(res.rows[0].email_verified === 0)
            {
                db.pool.end;
                return response.status(400).send({'Message': 'Email is Not Verifed'}); 
            }

            else if(res.rows[0].active_flag === 0)
            {
                db.pool.end;
                return response.status(403).send({'Message': 'Your Account is Deactivated'}); 
            }

            else
            {
                req.body.token = token.generateToken(res.rows[0].uuid, res.rows[0].company_name,
                                 res.rows[0].email, res.rows[0].contact_number, res.rows[0].user_type, 
                                 res.rows[0].created_at, res.rows[0].updated_at);
                req.body.uuid = res.rows[0].uuid;
                next();
            }
        }

        else if(!inputValidator.comparePassword(res.rows[0].password, req.body.password))
        {
            db.pool.end;
            return response.status(403).send({'Message': 'Wrong Credentials.'});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Login Failed.'});
        }
    });
}

module.exports =
{
    login
}