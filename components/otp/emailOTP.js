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
        subject: 'OTP For Registration in CSIoT Portal',
        text: process.env.OTP_MESSAGE + req.email_otp
    };

    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error) 
        {
          console.log(error);
        } 
        
        else 
        {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = 
{
    sendOTP    
}