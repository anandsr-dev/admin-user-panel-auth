const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const models = require('../models/User')
const userModel = models.User
const adminModel = models.Admin


const adminPresent = async (req, res, next) => {
    if (await adminModel.findOne({}))
        res.redirect('/admin')
    else
        next()
}

router.get('/signup', async function (req, res) {
    const adminCheck = await adminModel.findOne({})

    if (!adminCheck) {
        
        res.render('signup', { title: 'Sign Up', iconlink: "images/signup.png", header: "Sign Up", action: "/signup", signUpErr:req.query.error })        
        return
    }
    res.render('signup', { title: 'Sign Up', iconlink: "images/signup.png", header: "Sign Up", action: "/signup", signUpErr:req.query.error, style: "#adminreg{display:none}" })
})

router.get('/adminreg', adminPresent, function (req, res, next) {
    res.render('signup', { title: 'Admin Sign Up', iconlink: "images/signup.png", header: "One-Time Admin Registration", style: "#adminreg{display:none}", action: "/adminreg" })
})

router.post('/signup', async function (req, res) {
    const { name, email, password } = req.body

    let user = await userModel.findOne({ email })
    if (user) {
        return res.redirect('/signup?error=The email already exists!')
    }

    const hashedPass = await bcrypt.hash(password, 12)

    user = new userModel({
        name,
        email,
        password: hashedPass
    })

    await user.save()
    res.redirect('/')
})

router.post('/adminreg', adminPresent, async function (req, res) {
    const { name, email, password } = req.body

    const hashedPass = await bcrypt.hash(password, 12)

    admin = new adminModel({
        name,
        email,
        password: hashedPass
    })

    await admin.save()
    res.redirect('/admin')
})




module.exports = router