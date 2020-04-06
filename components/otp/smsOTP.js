const SendOtp = require('sendotp');
const sendOtp = new SendOtp(process.env.SMS_API_KEY);
const dotenv = require('dotenv');
dotenv.config();

const sendSMS = (req, response) =>
{
    sendOtp.send(req.mobile , process.env.SMS_SENDER_ID, parseInt(req.sms_otp), function (err, data)
    {
        if(err && typeof req.regFlag === 'undefined')
        {
            console.log(err);
            return response.status(400).send({'Message': 'Error.'}); 
        }

        else if(data && typeof req.regFlag === 'undefined')
        {
            return response.status(200).send({'Message': 'OTP Sent.'}); 
        }

        else
        {
            console.log(err);
        }
    });
}

module.exports =
{
    sendSMS
}