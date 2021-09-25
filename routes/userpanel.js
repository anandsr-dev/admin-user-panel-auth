const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const models = require('../models/User')
const userModel = models.User
const sessionCheck = (req, res, next) => {
    if (req.session.isAuth)
        next()
    else
        res.redirect('/')
}

const userExist = async function (req, res, next) {
    const user = await userModel.findOne({ email: req.session.email })

    if (user) {
        next()
    }
    else {
        req.session.isAuth = false
        req.session.email=""
        res.redirect('/')
    }
}


router.post('/userSignin', async function (req, res, next) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.redirect('/?error=Invalid Credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.redirect('/?error=Invalid Credentials')
    }

    req.session.isAuth = true
    req.session.email = email
    res.redirect('/userSignin')
})

router.get('/userSignin', userExist, sessionCheck, function (req, res, next) {

    res.render('userpanel', { title: 'Account', items: [{ id: 1, title: 'IPHONE 12' }, { id: 2, title: 'SAMSUNG S20 PLUS' }, { id: 3, title: 'MOTO G60' }, { id: 4, title: 'OPPO A74' }] })
})


router.post('/logout', (req, res, next) => {
    req.session.isAuth = false
    req.session.email = ""
    res.redirect('/')
})

module.exports = router