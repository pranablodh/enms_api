const db = require('../pgPool');

const tokenStore = (req, response) =>
{
    const createQuery = `INSERT INTO user_token(uuid, access_token) VALUES($1, $2)
    ON CONFLICT (uuid) DO UPDATE SET access_token = EXCLUDED.access_token RETURNING *`

    const values = 
    [
        req.body.uuid,
        req.body.token
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
            db.pool.end;
            return response.status(400).send({'Message': 'Login Failed'});
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(200).send({'Message': 'You are Logged In.', 'Token': req.body.token});
        }

        else
        {
            db.pool.end;
            console.log(res.rows);
            return response.status(200).send({'Message': 'Login Failed.'});
        }
    });
}

module.exports = 
{
    tokenStore
}