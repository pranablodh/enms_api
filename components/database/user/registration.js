const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const token          = require('../../inputValidator/tokenGenerator');
const otp            = require('../../otp/otpGenerator');
const moment         = require('moment');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const newUser = (req, response) =>
{
    if(!req.body.company_name || !req.body.registration_number || !req.body.address_1 
        || !req.body.address_2 || !req.body.address_3 || !req.body.district)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing.'});
    }

    if(!inputValidator.isValidMobileNumber(req.body.contact_number)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Mobile Number.'});
    }

    if(!inputValidator.isValidEmail(req.body.email)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address.'});
    }

    if(!inputValidator.isValidPassword(req.body.password)) 
    {
        return response.status(400).send({'Message': 'Password Length Should Be In Between 8 to 15 and Must Contain Atleast' + 
       ' One Upper Case, One Lower Case, One Number and One Special Character.'});
    }

    if(!inputValidator.isvalidGSTIN(req.body.gstin)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid GSTIN.'});
    }

    if(!inputValidator.isValidString(req.body.owner_name)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Name.'});
    }

    if(!inputValidator.isValidString(req.body.city)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid City Name.'});
    }

    if(!inputValidator.isValidString(req.body.state)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid State Name.'});
    }

    if(!inputValidator.isvalidPinCode(req.body.pin_code)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Pin Code.'});
    }

    const uuid  = uuidv4(req.body.gstin);
    req.body.uuid  = uuid;

    const createQuery = `WITH data(uuid, company_name, owner_name, contact_number, email, registration_number,
    gstin, address_1, address_2, address_3, city, district, pin_code, state, password, user_type, email_verified, 
    mobile_verified, email_otp, mobile_otp, referral_uuid) AS(VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
    $15, $16, $17, $18, $19, $20, $21)),
    ins1 AS(INSERT INTO user_info(uuid, company_name, owner_name, contact_number, email, registration_number, gstin, 
    address_1, address_2, address_3, city, district, pin_code, state, created_at, updated_at) 
    SELECT uuid, company_name, owner_name, contact_number, email, registration_number, gstin,address_1, address_2, address_3, 
    city, district, pin_code, state, current_timestamp, current_timestamp FROM data RETURNING *),
	ins2 AS(INSERT INTO user_type(uuid, user_type) SELECT uuid, CAST(user_type as int) FROM data RETURNING uuid),
    ins3 AS(INSERT INTO user_cred(uuid, password, active_flag, pass_updated_at) SELECT uuid, password, 1, current_timestamp FROM data RETURNING uuid),
    ins4 AS(INSERT INTO user_otp(uuid, email_otp, mobile_otp) SELECT uuid, email_otp, mobile_otp FROM data RETURNING uuid),
    ins5 AS(INSERT INTO user_referral_track(referred_by, referred_to, reference_time) SELECT referral_uuid, uuid, current_timestamp FROM data RETURNING referred_to)
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
        0,
        0,
        0,
        otp.otpGenerator(process.env.OTP_MAX_LENGTH),
        otp.otpGenerator(process.env.OTP_MAX_LENGTH),
        req.body.referral_uuid
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(!err)
        {
            db.pool.end;
            return response.status(201).send({'Token': token.generateToken(req.body.company_name, 
            req.body.email, req.body.contact_number, 0, 0, 0, moment(new Date())._i, moment(new Date())._i, moment(new Date())._i)});               
        }

        else if(err.routine === '_bt_check_unique')
        {
            db.pool.end;

            if(err.detail.includes('contact_number'))
            {
                return response.status(405).send({'Message': 'User with that Contact Number Already Exist'});
            }

            else if(err.detail.includes('email'))
            {
                return response.status(405).send({'Message': 'User with that Email ID Already Exist'});
            }
        }

        else
        {
            console.log(err);
            db.pool.end;
            return response.status(500).send({'Message': 'Registration Failed.'});
        }
    });
}

module.exports = 
{
    newUser      
}