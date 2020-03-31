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

    const createQuery = `SELECT i.uuid, i.company_name, i.email, i.contact_number, c.password, email_verified, mobile_verified 
    FROM user_info i
    INNER JOIN user_cred c ON c.uuid = i.uuid 
    INNER JOIN user_verified v ON v.uuid = c.uuid
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

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(400).send({'Message': 'User Not Registered.'}); 
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

            else
            {
                //return response.status(200).send({'Message': 'You are Logged In.',
                //'Token': token.generateToken(res.rows[0].uuid, res.rows[0].company_name, res.rows[0].email, res.rows[0].contact_number)});
                req.body.token = token.generateToken(res.rows[0].uuid, res.rows[0].company_name,
                                 res.rows[0].email, res.rows[0].contact_number);
                req.body.uuid = res.rows[0].uuid;
                next();
            }
        }

        else if(!inputValidator.comparePassword(res.rows[0].password, req.body.password))
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Wrong Credentials.'});
        }

        else
        {
            db.pool.end;
            console.log(res.rows);
            return response.status(200).send({'Message': 'Login Failed.'});
        }
    });
}

module.exports =
{
    login
}