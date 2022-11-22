const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyJWT = async (req, res, next) =>
{
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer')) 
        return res.sendStatus(401);
    // console.log(authHeader);

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                console.log(err);
                return res.status(403).json(err.message); // invalid token
            }
            req.user = decoded.UserInfo.username;
            req.userId = decoded.UserInfo.userId;
            req.roles =  decoded.UserInfo.roles;
            // console.log(`Decoded: ${Object.values(decoded.UserInfo)}`);
            next();
    });
}

module.exports = verifyJWT;