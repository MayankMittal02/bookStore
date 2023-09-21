const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {errorHandlerMiddleware} = require('./error-handler')


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    // if(!authHeader){
    //      throw new Error("provide token")
    // }

    try {
        const token = authHeader
        const payLoad = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            userId: payLoad.userId,
            name: payLoad.name
        }
        next()
    }
    catch (err) {
        // const q = new Error("provide tokennn")
        // // console.log(err)
        // res.send(err)
        next(err)
        // res.send(err)


    }
}

module.exports = auth