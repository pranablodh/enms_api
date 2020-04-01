const db = require('../dbConnection/pgPool');

const logout = (req, response) =>
{
    const createQuery = `DELETE FROM user_token WHERE uuid = $1 RETURNING *`

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

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Message': 'You Are Logged Out.'});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Logout Failed.'});
        }
    });

}

module.exports = 
{
    logout
}