const jwt = require('jsonwebtoken');
const db = require('../database/pgPool');

module.exports = 
{
    verifyToken: function(req, response)
    {
        const token = req.headers['x-access-token'];

        if(!token) 
        {
            return response.status(400).send({ 'Message': 'Token is Not Provided' });
        }

        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded)
        {
            const createQuery = `SELECT * FROM user_info WHERE UUID = $1`
            const values = 
            [
                decoded.uuid
            ];

            if(err)
            {
                return response.status(400).send({ 'Message': 'Error in Token' });
            }

            db.pool.query(createQuery, values, (err, res)=>
            {
                if(!err)
                {
                    if(res.rows.length > 0)
                    {
                        db.pool.end;
                        return response.status(200).send({ 'Message': 'Authentication Successfull' });
                    }

                    else if(res.rows.length === 0)
                    {
                        db.pool.end;
                        return response.status(404).send({ 'Message': 'Authentication Failedl' });
                    }
                }

                else
                {
                    db.pool.end;
                    return response.status(400).send({ 'Message': 'Error' });
                }
            });
        });
    }    
}