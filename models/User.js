const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const adminSchema = new Schema ({
    name:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
},{collection:"admin"})

const sessionSchema = new Schema({},{collection:"mySessions"})

const User=mongoose.model('User',userSchema)
const Admin = mongoose.model('Admin', adminSchema)
const mySessions = mongoose.model('mySessions',sessionSchema)
module.exports = {User,Admin,mySessions}