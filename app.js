const express = require('express')
const path = require('path')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')


const loginRoute = require('./routes/login')
const signupRoute = require('./routes/signup')
const userAccountRoute = require('./routes/userpanel')
const adminAccountRoute = require('./routes/adminpanel')
const app = express()

const mongoURI = 'mongodb://localhost:27017/sessions'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')


mongoose.connect(mongoURI)
    .then((res) => {
        console.log('MongoDB connected');
    })
const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'mySessions'
})

app.use(session({
    secret: "cookie key",
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.listen(5000, (err) => {
    if (err)
        console.log('error in server setup')
    else
        console.log('server listening on port 5000');
})

app.get(['/', '/admin'], loginRoute)
app.get(['/signup', '/adminreg'], signupRoute)
app.post(['/signup', '/adminreg'], signupRoute)
app.post('/userSignin', userAccountRoute)
app.get('/userSignin', userAccountRoute)
app.post(['/adminSignin', '/delete', '/edit', '/adduser'], adminAccountRoute)
app.post('/logout', userAccountRoute)
app.get(['/adminhome', '/signout', '/edit', '/adduser'], adminAccountRoute)