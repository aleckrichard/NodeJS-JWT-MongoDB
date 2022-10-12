const { Router } = require('express')
const axios = require('axios')
const user = require('../models/user')
const router = Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyToken = require('./verifyToken')

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body
    const user = new User({
        username: username,
        password: password,
        email: email
    })
    user.password = await user.encryptPassword(user.password)
    await user.save()
    const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 3600
    })

    res.json({ auth: true, token: token })
    console.log(user)
})

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ message: 'email not found' })
    }

    const validPassword = await user.validatePassword(password)

    if (!validPassword) {
        return res.status(404).json({ auth: false, token: null })
    }

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 60 * 60 * 24 })

    res.status(200).json({ auth: true, token: token })
})

router.get('/me', verifyToken, async (req, res, next) => {
    /* Obtener usuario de la BD Mongo */
    const getUser = await User.findById(req.userId, { password: 0 })

    if (!getUser) {
        return res.status(404).json({ message: 'user not found' })
    }
    console.log(getUser)
    res.json({ getUser })
})

router.get('/dashboard', verifyToken, (req, res, next) => {
    res.status(200).json({message: 'Acceso al dashboard'})
})

router.get('/axios', (req,res, next) => {
    axios.get('https://gorest.co.in/public/v2/users')    
    .then(resp => {
    res.send(resp.data)
    console.log(resp.data);
});
})

module.exports = router