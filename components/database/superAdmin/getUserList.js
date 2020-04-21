const db = require('../dbConnection/pgPool');

const getUserList = (req, response) =>
{
    const createQuery = `SELECT i.company_name, i.owner_name, i.contact_number, i.email, i.registration_number,
    i.gstin, i.address_1, i.address_2, i.address_3, i.city, i.district, i.pin_code, i.state, uc.active_flag, ut.user_type,
    uv.email_verified, uv.mobile_verified, i.created_at, i.updated_at, uc.pass_updated_at 
    FROM user_info i
    INNER JOIN user_cred uc ON uc.uuid = i.uuid 
    INNER JOIN user_verified uv ON uv.uuid = uc.uuid
    INNER JOIN user_type ut ON ut.uuid = uv.uuid`

    db.pool.query(createQuery, (err, res)=>
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
            return response.status(200).send({'Data': res.rows[0]});
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'No Data Found.'}); 
        }

        else
        {
            db.pool.end;
            return response.status(400).send({'Message': 'Data Fetching Failed.'});
        }
    });
}

module.exports =
{
    getUserList
}
