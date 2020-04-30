const db = require('../database/dbConnection/pgPool');

const adminPrivilegeRestrictor = (req, response, next) =>
{
    const createQuery = `SELECT rf.referred_by, rf.referred_to, ut.uuid, ut.user_type FROM user_referral_track rf
    INNER JOIN user_type ut ON ut.uuid = rf.referred_by
    WHERE rf.referred_to = (SELECT uuid FROM user_info WHERE email = $1 OR contact_number = $1)`

    const values = 
    [
        req.body.user
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
            return response.status(401).send({'Message': 'Access Denied.'});
        }

        else if(res.rows.length > 0 && res.rows[0].referred_by != req.body.uuid)
        {
            db.pool.end;
            return response.status(401).send({'Message': 'Access Denied.'});
        }

        else if(res.rows.length > 0 && res.rows[0].referred_by === req.body.uuid)
        {
            db.pool.end;
            next();
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
    adminPrivilegeRestrictor
}