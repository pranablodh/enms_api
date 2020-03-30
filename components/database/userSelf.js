const db             = require('./pgPool');
const inputValidator = require('../inputValidator/inputValidator');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const newUser = (req, response) =>
{
    if(!req.body.email || !req.body.password)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.email)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address'});
    }

    const createQuery =
    `START TRANSACTION;
        INSERT INTO user_info(uuid, company_name, owner_name, contact_number, email, registration_number,
        gstin, address_1, address_2, address_3, city, district, pin_code, state, created_on, updated_on) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING uuid;
	    INSERT INTO user_type(uuid, user_type) VALUES($1);
	    INSERT INTO user_cred(uuid, password) VALUES($1);
	    INSERT INTO user_verified(uuid, email_verified, mobile_verifed) VALUES($1);
    COMMIT;`

    const values = 
    [
        uuidv4(req.body.gstin),
        req.body.company_name,
        req.body.owner_name,
        req.body.contact_number,
        req.body.email,
        req.body.registration_number,
        req.body.gstin,
        req.body.address_1,
        req.body.address_2,
        req.body.address_3,
        req.body.city,
        req.body.district,
        req.body.pin_code,
        req.body.state,
        moment(new Date()),
        moment(new Date()),
        inputValidator.hashPassword(req.body.password),
        //req.body.user_type,
        //req.body.email_verified,
        //req.body.mobile_verified
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(200).send({'Message': 'User Registered', "Token": helper.generateToken(res.rows[0].uuid)});               
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;
            return response.status(400).send({'Message': 'User with that GSTIN Already Exist'})
        }

        else
        {
            console.log(err);
            db.pool.end;
            return response.status(400).send({'Message': 'User Not Registered'});
        }
    });
}

module.exports = 
{
    newUser       
}