const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');

const checkPassword = (req, response, next) =>
{
    if(!req.body.password)
    {
        return response.status(400).send({'Message': 'Password is Missing.'});
    }

    const createQuery = `SELECT password FROM user_cred WHERE uuid = $1`

    const values = 
    [
        req.body.uuid
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
            db.pool.end;
            return next();
        }

        else if(!inputValidator.comparePassword(res.rows[0].password, req.body.password))
        {
            db.pool.end;
            return response.status(403).send({'Message': 'Wrong Credentials.'});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Password Checking Failed.'});
        }
    });
}

module.exports = 
{
    checkPassword
}