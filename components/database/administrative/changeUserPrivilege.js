const db = require('../dbConnection/pgPool');

const changePrivilege = (req, response) =>
{  
    const createQuery = `UPDATE user_type SET user_type = $2 WHERE uuid = (SELECT uuid FROM user_info WHERE
    email = $1 OR contact_number = $1) RETURNING *`

    const values = 
    [
        req.body.user,
        req.body.new_type
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
            db.pool.end;
            return response.status(500).send({'Message': 'Error.'}); 
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Found.'}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;  
            return response.status(202).send({'Message': 'New Role Assigned.'});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Failed to Assign New Role.'}); 
        }
    });
}

module.exports =
{
    changePrivilege
}