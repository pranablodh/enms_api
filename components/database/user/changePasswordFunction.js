const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');

const changePassword = (req, response) =>
{
    if(!inputValidator.isValidPassword(req.body.password)) 
    {
        return response.status(400).send({'Message': 'Password Length Should Be In Between 8 to 15 and Must Contain Atleast' + 
       ' One Upper Case, One Lower Case, One Number and One Special Character.'});
    }

    const createQuery = `UPDATE user_cred SET password = $2, pass_updated_at = current_timestamp WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        inputValidator.hashPassword(req.body.newPassword)
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;
            return response.status(201).send({'Message': 'Password Changed.'});    
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Registered.'});   
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Error.'});               
        }
    });
}

module.exports = 
{
    changePassword
}