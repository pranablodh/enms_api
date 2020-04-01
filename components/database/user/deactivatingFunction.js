const db = require('../dbConnection/pgPool');

const deactivatingFunction = (req, response) =>
{
    const createQuery = `WITH U AS(UPDATE user_cred SET active_flag = 0 WHERE uuid = $1 RETURNING *)
    DELETE FROM user_token WHERE uuid = $1 RETURNING *`

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

        else
        {
            db.pool.end;
            return response.status(201).send({'Message': 'Account Deactivated.'});
        }
    });
}

module.exports =
{
    deactivatingFunction
}