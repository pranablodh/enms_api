const db     = require('../database/dbConnection/pgPool');
const dotenv = require('dotenv');
dotenv.config();

const sessionRestrictor = (req, response, next) =>
{
    const createQuery = `SELECT COUNT(uuid) FROM user_token WHERE uuid 
    = (SELECT uuid FROM user_info WHERE email = $1 OR contact_number = $1)`

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

        else if(res.rows[0].count <= process.env.MAX_ALLOWED_USER)
        {
            db.pool.end;
            next();
        }

        else if(res.rows[0].count > process.env.MAX_ALLOWED_USER)
        {
            db.pool.end;
            return response.status(403).send({'Message': 'Maximum Number of Permitted Login Against This User is Exceeded.'});
        }
    });
}

module.exports = 
{
    sessionRestrictor
}
