const  jwt = require('jsonwebtoken')
const config = require('../config')

function verifyToken (req, res, next){
    const token = req.headers['x-access-token']
    if (!token) {
        return res.status(500).json({
            auth: false,
            message: 'No token provided'
        })
    }
    const decode = jwt.verify(token, config.secret)
    req.userId = decode.id
    next()
}

module.exports = verifyToken