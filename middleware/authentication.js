const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authentication
    const token = authHeader.split(' ')[1]
    const payLoad = jwt.verify(token, 'jwtsecret')
    req.user = {
        userID: payLoad.userID,
        name: payLoad.name
    }
    next()
}

module.exports = auth