const db             = require('./pgPool');
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
        to: 'bumba007lodh@gmail.com',
        subject: 'OTP For Registration in CSIoT Portal',
        text: process.env.OTP_MESSAGE + ": " + req.email_otp
    };
    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error) 
        {
          console.log(error);
          return response.status(400).send({'Message': 'User Not Registered'});
        } 
        
        else 
        {
          console.log('Email sent: ' + info.response);
          return response.status(200).send({'Message': 'User Registered'});  
        }
    });
}

module.exports = 
{
    sendOTP    
}