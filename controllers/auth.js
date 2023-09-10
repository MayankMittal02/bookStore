const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.send('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        res.send('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ token })
}

module.exports = {
    register,
    login,
}