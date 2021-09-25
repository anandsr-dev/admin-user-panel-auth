const express = require('express')
const router = express.Router()
const models = require('../models/User')
const adminModel = models.Admin

const adminExist = async (req,res,next) => {
    const admin = await adminModel.findOne()
    if(admin)
    next()
    else
    res.redirect('/adminreg')
}

const adminSession = (req, res, next) => {
    if (req.session.adminAuth) {
        res.redirect('/adminhome')
    }
    else
        next()
}

const userSession = (req, res, next) => {
    if (req.session.isAuth) {
        res.redirect('/userSignin')
    }
    else
        next()
}

router.get('/', userSession, function (req, res, next) {
    res.render('login', { title: 'Log In', head: 'User Login', action: "/userSignin", iconlink: "images/icon.png", errMsg:req.query.error, style: "#home{display:none}" })
})

router.get('/admin', adminExist, adminSession, function (req, res, next) {
    res.render('login', { title: 'Log In', head: 'Admin Login', action: "/adminSignin", iconlink: "images/icon.png", errMsg:req.query.error, style: '#reg, #admin{display: none;}' })
})


module.exports = router