const db = require('../dbConnection/pgPool');

const changeEmail = (req, response) =>
{
    const createQuery = `UPDATE user_info SET email = $2 WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        req.body.email
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Found.'}); 
        }

        else
        {
            db.pool.end;
            return response.status(200).send({'Message': 'Email ID Updated.'});
        }
    });
}

module.exports = 
{
    changeEmail
}