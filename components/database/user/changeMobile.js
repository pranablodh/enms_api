const db = require('../pgPool');

const changeMobile = (req, response) =>
{
    const createQuery = `UPDATE user_info SET contact_number = $2 WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        req.body.mobile
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
            return response.status(400).send({'Message': 'User Not Found.'}); 
        }

        else
        {
            db.pool.end;
            return response.status(200).send({'Message': 'Mobile Number Updated.'});
        }
    });
}

module.exports = 
{
    changeMobile
}