const db             = require('../dbConnection/pgPool');
const token          = require('../../inputValidator/tokenGenerator');
const moment         = require('moment');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const changeUserDetails = (req, response, next) =>
{
    if(!req.body.company_name || !req.body.owner_name || !req.body.registration_number || !req.body.gstin
        || !req.body.address_1 || !req.body.address_2 || !req.body.address_3 || !req.body.city
        || !req.body.district|| !req.body.pin_code || !req.body.state)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    const uuid  = uuidv4(req.body.gstin);

    const createQuery = `WITH
    del1 AS(DELETE FROM user_token WHERE uuid = $13),
    upd1 AS(UPDATE user_verified SET uuid = $1 WHERE uuid = $13),
    upd2 AS(UPDATE user_cred SET uuid = $1 WHERE uuid = $13),
    upd3 AS(UPDATE user_otp SET uuid = $1 WHERE uuid = $13),
    upd4 AS(UPDATE user_type SET uuid = $1 WHERE uuid = $13)
    UPDATE user_info SET uuid = $1, company_name = $2, owner_name = $3, registration_number = $4,
    gstin = $5, address_1 = $6, address_2 = $7, address_3 = $8, city = $9, district = $10, pin_code = $11, state = $12,
    updated_at = current_timestamp WHERE uuid = $13 RETURNING *`

    const values = 
    [
        uuid,
        req.body.company_name,
        req.body.owner_name,
        req.body.registration_number,
        req.body.gstin,
        req.body.address_1,
        req.body.address_2,
        req.body.address_3,
        req.body.city,
        req.body.district,
        req.body.pin_code,
        req.body.state,
        req.body.uuid,
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
            const Token = token.generateToken(res.rows[0].company_name, res.rows[0].email, res.rows[0].contact_number,
            0, 0, 0, moment(new Date())._i, moment(new Date())._i, moment(new Date())._i);               

            req.body.token = Token;
            req.body.uuid = uuid;
            next();
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Registered.'});   
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Updation Failed.'});               
        }
    });
}

module.exports =
{
    changeUserDetails
}