const jwt = require('jsonwebtoken');
const db  = require('../database/dbConnection/pgPool');

const authentication = (req, response, next) =>
{
    const token = req.headers['x-access-token'];

    if(!token) 
    {
        return response.status(400).send({'Message': 'Token is Not Provided'});
    }

    jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded)
    {

        if(err)
        {
            return response.status(400).send({'Message': 'Invalid Token'});
        }

        //const createQuery = `SELECT * FROM user_token WHERE uuid = $1 AND access_token = $2`
        const createQuery = `SELECT uuid, access_token, login_time FROM user_token 
        WHERE uuid = (SELECT uuid FROM user_info WHERE email = $1 OR email = $2 OR contact_number = $1 OR contact_number = $2)
        AND access_token = $3`

        const values = 
        [
            decoded.email,
            decoded.contact_number,
            req.headers['x-access-token']
        ];

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
            }

            else if(res.rows.length === 0)
            {
                db.pool.end;
                return response.status(401).send({'Message': 'Access Denied'});
            }

            else
            {
                db.pool.end;
                return response.status(400).send({'Message': 'Error'});
            }
        });
    });
}

module.exports = 
{
    authentication
}