

/*****************************************************************************
 * account management
 ****************************************************************************/

function User(userViews) {
    this.userViews = userViews;

    // (for constructor stuff, see bottom of this function.)

    /*  Handling data (CRUD) locally
     ************************/


    // Create
    this.create = function(){
        this.userdata({colls: {}})
    }


    // Read
    this.userdata = function(toSave) {
        if (toSave) {
            return $.cookie("userdata", JSON.stringify(toSave))
        }
        else {
            return JSON.parse($.cookie("userdata"))
        }
    }
    this.userkey = function(toSave) {
        if (toSave) {
            return $.cookie("userkey", JSON.stringify(toSave))
        }
        else {
            return JSON.parse($.cookie("userkey"))
        }
    }
    this.hasCreds = function() {
        return (
            typeof this.userdata()._id != "undefined" && this.userkey() != null)
    }


    // Update
    this.addColl = function(cid, updateKey) {
        u = this.userdata()
        u.colls[cid] = updateKey
        return this.userdata(u)
    }

    this.clearCreds = function(){
        u = this.userdata()
        delete u._id
        this.userdata(u)
        $.removeCookie("userkey")
    }

    this.setCreds = function(username, pw) {
        u = this.userdata()
        u._id = username
        this.userdata(u)

        // this doesn't provide any extra security, since anyone with access
        // to this machine can still use this key to login to this user's ti
        // acct. but it keep us from storing users' passwords, which may be
        // also used elsewhere, in plaintext.
        this.userkey(CryptoJS.HmacSHA1(pw, "a8d9e12a2903eecf554").toString())
    }

    this.removeColl = function(cid) {
        u = this.userdata()
        delete u.colls[cid]
        return true
    }


    // Delete
    this.deleteLocal = function() {
        $.removeCookie("userdata")
        $.removeCookie("userkey")
        this.create()
        this.userViews.logout()
    }



    /*  Persisting state with the server.
     ************************/


    this.syncWithServer = function(isNewUser) {
        if (!this.hasCreds()) {
            return false;
        }

        if (isNewUser) {
            var httpMethod = "POST"
            var colls = this.userdata()["colls"]
            var bodyString = JSON.stringify({key: this.userkey(), colls: colls})
        }
        else {
            var httpMethod = "PUT"
            u = this.userdata()
            u.key = this.userkey()
            var bodyString = JSON.stringify(u)
        }

        var userViews = this.userViews
        var thisThing = this
        var url = "http://"+api_root+"/user/"+this.userdata()._id

        $.ajax({
            url: url,
            type: httpMethod,
            data: bodyString,
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            statusCode: {
                200: function(data) {
                    userViews.login(data._id)

                    // merge the colls from the server in
                    u = thisThing.userdata()
                    data.colls = $.extend({}, data.colls,  u.colls)
                    thisThing.userdata(data)
                },
                400: function(data){
                   userViews.registerFail(data)
                   thisThing.clearCreds()
                },
                403: function(data){
                   userViews.registerFail(data)
                   thisThing.clearCreds()
                },
                404: function(data) {
                   thisThing.clearCreds()
                   userViews.registerFail(data)
                },
                409: function(data) {
                   thisThing.clearCreds()
                   userViews.registerFail(data)
                },
                500: function(data){console.log("wo, server error.")}
        }
        })
    }


    this.getCollsWithTitles = function() {
        thisThing = this
        colls = JSON.parse($.cookie("userdata"))["colls"]
        collsStr = colls.join(",")
        $.ajax({
                   url: "http://"+api_root+"/collections/"+colls,
                   type: "GET",
                   dataType:"json",
                   contentType: "application/json; charset=utf-8",
                   statusCode: {
                       404: function(data){
                           console.log("that broke. probably oughta have some error handling.")
                       },
                       200: function(data) {
                           thisThing.userViews.showColls(data)
                       }
                   }
               })

    }

    // constructor here, because has to read the rest of function first it seems.
    if (this.hasCreds()) {
        this.userViews.login(this.userdata()._id)
        this.syncWithServer()
        this.create()
    }
    else if (this.userdata()) {
        // nothing, we'll keep storing events and wait for the user to login
    }
    else {
        this.create()
    }

    return true
}







function UserViews() {
    this.loginFail = function(data) {
        console.log("login fail!")
    }
    this.login = function(username) {
        $("#register-link, #log-in-link").hide()
            .siblings("li#logged-in").show()
            .find("span.username").html(username+"!")
        console.log("logged in!")
    }
    this.registerFormStart = function(loginOrRegister) {
        if (loginOrRegister == "register") {
            $("div#register-login").slideDown().removeClass("log-in").addClass("register")
        }
        else {
            $("div#register-login").slideDown().removeClass("register").addClass("log-in")
        }
    }
    this.registerFormFinished = function(){
        $("div#register-login").slideUp();
    }
    this.registerFail = function(data) {
        console.log("oh noes, registration fail!")
    }
    this.logout = function(){
        $("#register-link, #log-in-link").show()
            .siblings("li#logged-in").hide()
        console.log("logged out.")
    }

    this.showColls = function(colls) {
        console.log(colls)
    }
    return true
}







function UserController(user, userViews) {
    this.user = user;
    this.userViews = userViews;

    this.init = function() {

        user = this.user
        userViews = this.userViews


        /* registration and login
         ******************************************/

        $("#register-link a").click(function(){
            userViews.registerFormStart("register");
            return false;
        })

        $("#log-in-link").click(function(){
            userViews.registerFormStart("login");
            return false;
        })

        // works for both the registration and login forms.
        $("#register-login form").submit(function(){

            var email = $("#email").val()
            var pw = $("#pw").val()
            user.setCreds(email, pw)
            var isNewUser = $(this).parent().hasClass("register")
            user.syncWithServer(isNewUser)

            userViews.registerFormFinished();
            return false;
        })

        $("#logout-link").click(function(){
            user.deleteLocal();
            return false;
        })

    }

    return true
}
