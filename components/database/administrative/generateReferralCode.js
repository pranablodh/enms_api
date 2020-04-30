const db       = require('../dbConnection/pgPool');
const referral = require('../../inputValidator/generateReferralCode');

const storeCode = (req, response) =>
{
    const createQuery = `WITH ins AS(INSERT INTO user_referral_code(uuid, referral_code) VALUES($1, $2)
    ON CONFLICT (uuid) DO NOTHING RETURNING *)
    SELECT referral_code::text FROM ins UNION ALL
    SELECT referral_code FROM user_referral_code WHERE uuid = $1`

    const values = 
    [
        req.body.uuid,
        referral.generateCode()
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
            return response.status(200).send({'Referral Code': res.rows[0].referral_code}); 
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Can Not Get the Referral Code.'});  
        }
    });
}

module.exports = 
{
    storeCode
}