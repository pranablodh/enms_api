const bcrypt = require('bcrypt');

module.exports = 
{
    hashPassword: function(password)
    {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    },

    comparePassword: function(hashPassword, password) 
    {
        return bcrypt.compareSync(password, hashPassword);
    },

    isValidEmail: function(email) 
    {
        return /\S+@\S+\.\S+/.test(email);
    }
}