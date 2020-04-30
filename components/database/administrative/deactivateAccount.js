const db = require('../dbConnection/pgPool');

const deactivateAccount = (req, response) =>
{
    const createQuery = `WITH D AS(DELETE FROM user_token WHERE uuid = (SELECT uuid FROM user_info 
    WHERE email = $1 OR contact_number = $1))
    UPDATE user_cred SET active_flag = 0 WHERE uuid = (SELECT uuid FROM user_info 
    WHERE email = $1 OR contact_number = $1) RETURNING *`

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
            return response.status(500).send({'Message': 'Error.'});               
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
    deactivateAccount
}