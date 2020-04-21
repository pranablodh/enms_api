const db = require('../dbConnection/pgPool');

const selfDetails = (req, response) =>
{
    const createQuery = `SELECT company_name, owner_name, registration_number, gstin, 
    address_1, address_2, address_3, city, district, pin_code, state FROM user_info WHERE uuid = $1`

    const values = 
    [
        req.body.uuid
    ]

    db.pool.query(createQuery, values, (err, res) =>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'No Data Found.'}); 
        }

        else if(res.rows.length >= 0)
        {
            db.pool.end;
            return response.status(200).send({'Data': res.rows[0]}); 
        }
    });
}

module.exports = 
{
    selfDetails
}