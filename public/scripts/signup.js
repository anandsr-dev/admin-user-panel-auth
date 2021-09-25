$(document).ready(function () {
    let pass1 = null, pass2 = null, name = null, mail = null
    let flag = 1
    let mailcheck = 2
    let namecheck = 1

    $("#fname").keydown(function (e) {
        name = this.value
        let namekey = e.key
        let namereg = /^[A-Za-z ]$/
        let prev = name.length - 1
        if (e.which != 0 && e.which != 8 && e.which != 9 && e.which != 13 && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && e.which != 46) {
            if (!namekey.match(namereg) || (name[prev] == " " && namekey == " ")) {

                e.preventDefault();
            }
        }
    })

    $("#fname").blur(function (e) {
        name = this.value
        if (name.length < 3) {
            $("#nameerr").text('Name should be minimum 3 characters')
        }
        else {
            namecheck = 0
            $("#nameerr").text("")
        }
    })

    $("#femail").blur(function () {
        mail = this.value
        let mailreg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        if (mail === "") {
            mailcheck = 2
            $("#emailerr").text("This field is required!")
        }
        else if (!mail.match(mailreg)) {
            mailcheck = 1
            $("#emailerr").text("Enter a valid email id!")
        }
        else {
            mailcheck = 0
            $("#emailerr").text("")
        }
    })

    $("#fpass1").blur(function () {
        pass1 = this.value
        if (pass1.length < 3) {
            flag = 1
            $("#pass1err").text("Password should be minimum 3 characters")
        }
        else {
            flag = 0
            $("#pass1err").text("")
        }
    })
    $("#fpass2").blur(function () {
        flag = 0
        pass2 = this.value
        if (pass2 !== pass1) {
            flag = 1
            $("#pass2err").text("Passwords don't match! Try again")
        }
        else {
            flag = 0
            $("#pass2err").text("")
        }
    })

    $("#form").submit(function (e) {
        let emptyflag = 0
        let form = this
        e.preventDefault()
        console.log(pass2);
        if (!name || !pass2 || !pass2 || !mail)
            emptyflag = 1

        if (flag === 0 && mailcheck === 0 && namecheck === 0 && emptyflag === 0) {

            form.submit()
        }
        else {
            alert("Can't submit with invalid entries")
        }

    })
})