const nodemailer     = require('nodemailer');
const dotenv         = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport
({
    service: 'gmail',
    auth: 
    {
        user: 'cs.covid.tracking@gmail.com',
        pass: 'Qwerty@1234'
    }
});

const sendOTP = (req, response) =>
{
    const mailOptions = 
    {
        from: 'cs.covid.tracking@gmail.com',
        to: req.email,
        subject: req.subject,
        text: req.message + " " + req.email_otp
    };

    transporter.sendMail(mailOptions, function(error, info)
    {
        if(error) 
        {
          console.log(error);
          return response.status(400).send({'Message': 'OTP Not Sent'});
        } 
        
        else 
        {
          console.log('Email sent: ' + info.response);
          return response.status(200).send({'Message': 'OTP Sent'});
        }
    });
}

module.exports = 
{
    sendOTP    
}