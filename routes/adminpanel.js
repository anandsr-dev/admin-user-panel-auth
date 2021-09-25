const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const models = require('../models/User')
const adminModel = models.Admin
const userModel = models.User
const mySessions = models.mySessions

const sessionCheck = (req, res, next) => {
    if (req.session.adminAuth)
        next()
    else
        res.redirect('/admin')
}

router.post('/adminSignin', async (req, res, next) => {
    const { email, password } = req.body
    const admin = await adminModel.findOne({ email })
    if (!admin) {
        return res.redirect('/admin?error=Invalid Credentials')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        return res.redirect('/admin?error=Invalid Credentials')
    }
    req.session.adminAuth = true
    res.redirect('/adminhome')
})

router.get('/adminhome', sessionCheck, async (req, res, next) => {
    let users = await userModel.find({})
    await users.forEach((user, index) => {
        user.index = index + 1
    })
    res.render('adminpanel', { title: 'Admin', users: users })
})

router.get('/adduser', sessionCheck, async (req, res, next) => {
    res.render('createuser', { title: "Add User", error:req.query.error })
})

router.post('/adduser', async (req, res, next) => {
    const { name, email, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
        return res.redirect('/adduser?error=User with this email already exists!')
    }

    const hashPass = await bcrypt.hash(password, 12)

    user = new userModel({
        name,
        email,
        password: hashPass
    })

    await user.save()

    res.redirect('/adminhome')
})

router.get('/edit', sessionCheck, async (req, res) => {
    let email = req.query.email
    let user = await userModel.findOne({ email })
    res.render('updateusers', { title: "Edit User", user: user, error:req.query.error })
})

router.post('/edit', async (req, res) => {
    const { name, email, password } = req.body
    let user = await userModel.findOne({email})
    if(user && user.email!=req.query.email){
        return res.redirect(`/edit?error=User with this email already exists!&&email=${req.query.email}`)
    }
    let hashPass
    if (password) {
        hashPass = await bcrypt.hash(password, 12)
        await userModel.updateOne({ email: req.query.email }, { $set: { name: name, email: email, password: hashPass } })
    }
    else {
        await userModel.updateOne({ email: req.query.email }, { $set: { name: name, email: email } })
    }
    res.redirect('/adminhome')

})

router.post('/delete', sessionCheck, async (req, res, next) => {

   
    // await mySessions.updateOne({ "session.email": req.query.email }, { $set: { "session.isAuth": false, "session.email": "" } })
    // let user = await mySessions.findOne({ })
    // console.log(user);
     await userModel.deleteOne({ email: req.query.email })
    res.redirect('/adminhome')

})

router.get('/signout', sessionCheck, (req, res, next) => {
    req.session.adminAuth = false
    res.redirect('/admin')
})

module.exports = router