const db      = require('../dbConnection/pgPool');
const destroy = require('../../otp/otpDestroyer');

const destroyOtpEmail = (req, response) =>
{
    const createQuery = `UPDATE user_otp SET email_otp = $2 WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        destroy.otpDestroyer(20)
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
        }

        else
        {
            //console.log(res.rows[0]);
        }
    });
}

const destroyOtpMobile = (req, response) =>
{
    const createQuery = `UPDATE user_otp SET mobile_otp = $2 WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        destroy.otpDestroyer(20)
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
        }

        else
        {
            //console.log(res.rows[0]);
        }
    });
}

const destroyOtpBoth = (req, response) =>
{
    const createQuery = `UPDATE user_otp SET (mobile_otp, email_otp) = ($2, $3) WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        destroy.otpDestroyer(20),
        destroy.otpDestroyer(20)
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
        }

        else
        {
            //console.log(res.rows[0]);
        }
    });
}

module.exports = 
{
    destroyOtpEmail,
    destroyOtpMobile,
    destroyOtpBoth
}