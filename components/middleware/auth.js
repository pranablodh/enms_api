const jwt = require('jsonwebtoken');
const db  = require('../database/pgPool');

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

        const createQuery = `SELECT * FROM user_token WHERE uuid = $1`
        const values = 
        [
            decoded.uuid
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
                req.body.uuid = decoded.uuid;
                next();
            }

            else if(res.rows.length === 0)
            {
                db.pool.end;
                return response.status(404).send({'Message': 'Access Denied'});
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