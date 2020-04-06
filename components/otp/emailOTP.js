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

// const transporter = nodemailer.createTransport
// ({
//     host: 'mail.consistentservices.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: 
//     {
//       user: 'pranablodh@consistentservices.com',
//       pass: 'Bumb@98047'
//     }
// });

const sendOTP = (req, response, next) =>
{
    const mailOptions = 
    {
        from: 'cs.covid.tracking@gmail.com',
        to: req.email,
        subject: req.subject,
        text: req.email_message
    };

    transporter.sendMail(mailOptions, function(error, info)
    {
        if(error) 
        {
          console.log(error);
          next();
          return response.status(400).send({'Message': 'OTP Not Sent'});
        } 
        
        else 
        {
          console.log('Email sent: ' + info.response);
          next();
          return response.status(200).send({'Message': 'OTP Sent'});
        }
    });
}

module.exports = 
{
    sendOTP    
}