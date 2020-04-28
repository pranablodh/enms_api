module.exports =
{
    generateCode: function()
    {
        const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
        let code = ''; 
        
        for (let i = 0; i < 8; i++)
        { 
            code += digits[Math.floor(Math.random() * digits.length)]; 
        } 
        
        return code;
    }
}