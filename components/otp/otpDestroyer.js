module.exports =
{
    otpDestroyer: function(length)
    {
        const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+/|\{}[]";:.<>,'; 
        let destroyed = ''; 
        
        for (let i = 0; i < length; i++)
        { 
            destroyed += digits[Math.floor(Math.random() * digits.length)]; 
        } 
        
        return destroyed;
    }
}