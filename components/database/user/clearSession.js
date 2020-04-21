const db = require('../dbConnection/pgPool');

const clearSession = (req, response) =>
{
    const createQuery = `DELETE FROM user_token WHERE access_token = $1 RETURNING *`

    const values =
    [
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
            return response.status(200).send({'Message': 'Selected Session Cleared.'});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Session Clearing Failed.'});
        }
    });
}

module.exports = 
{
    clearSession
}