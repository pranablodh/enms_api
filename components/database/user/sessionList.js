const db = require('../dbConnection/pgPool');

const sessionList = (req, response) =>
{
    const createQuery = `SELECT access_token, login_time FROM user_token WHERE uuid =
    (SELECT uuid FROM user_info WHERE email = $1 OR contact_number = $1)`

    const values = 
    [
        req.body.user
    ]

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
            return response.status(404).send({'Message': 'No Active Session Found.'});
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Data': res.rows});
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Error.'}); 
        }
        
    });
}

module.exports = 
{
    sessionList
}