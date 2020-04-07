const dotenv = require('dotenv');
dotenv.config();

module.exports =
{
    otpTime: function(time)
    {
        if(((new Date() - new Date(time)) /1000.0 / 60.0) <= process.env.OTP_VALIDITY)
        {
            return true;
        }

        else
        {
            return false;
        }
    }
}