const db             = require('../pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const otp            = require('otp-generator');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const newUser = (req, response, next) =>
{
    const uuid  = uuidv4(req.body.gstin);

    req.body.uuid  = uuid;

    if(!req.body.email || !req.body.password)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.email)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address'});
    }

    const createQuery = `WITH data(uuid, company_name, owner_name, contact_number, email, registration_number,
    gstin, address_1, address_2, address_3, city, district, pin_code, state, password, user_type, email_verified, 
    mobile_verified, email_otp, mobile_otp) AS(VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
    $15, $16, $17, $18, $19, $20)),
    ins1 AS(INSERT INTO user_info(uuid, company_name, owner_name, contact_number, email, registration_number, gstin, 
    address_1, address_2, address_3, city, district, pin_code, state, created_on, updated_on) 
    SELECT uuid, company_name, owner_name, contact_number, email, registration_number, gstin,address_1, address_2, address_3, 
    city, district, pin_code, state, current_timestamp, current_timestamp FROM data RETURNING *),
	ins2 AS(INSERT INTO user_type(uuid, user_type) SELECT uuid, CAST(user_type as int) FROM data RETURNING uuid),
    ins3 AS(INSERT INTO user_cred(uuid, password) SELECT uuid, password FROM data RETURNING uuid),
    ins4 AS(INSERT INTO user_otp(uuid, email_otp, mobile_otp) SELECT uuid, email_otp, mobile_otp FROM data RETURNING uuid)
    INSERT INTO user_verified(uuid, email_verified, mobile_verified) SELECT uuid, CAST(email_verified as int), 
    CAST(mobile_verified as int) FROM data RETURNING uuid`

    const values = 
    [
        uuid,
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
        inputValidator.hashPassword(req.body.password),
        req.body.user_type,
        0,
        0,
        otp.generate(6, { upperCase: false, specialChars: false }),
        otp.generate(6, { upperCase: false, specialChars: false })
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            next();
            return response.status(200).send({'Message': 'User Registered'});               
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