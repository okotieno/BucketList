$(function () {

    function getsession() {
        $.ajax({
            url: '/getsession',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function (response) {
                response = $.parseJSON(response);
                if (response.loggedin == 1) {
                    $("#nav-not-logged-in").addClass("hidden");
                    $(".bl_user").html(response.user[1]);
                    $(".form-signin").addClass("hidden");
                    $(".log-in-welcome").removeClass("hidden");

                }

                else {
                    $("#nav-logged-in").addClass("hidden");
                    var pathname = window.location.pathname;
                    if (pathname != "/showSignIn" && pathname != "/showSignUp") {
                        window.location.assign("/");
                    }

                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    getsession();

    $('.log-out').click(function () {
        $.ajax({
            url: '/logOut',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function (response) {
                alert("Successfully Logged Out!");
                window.location.assign("/");
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#btnSignUp').click(function () {
        $.ajax({
            url: '/signUp',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                alert(response)
                window.location.assign("showHome");
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#btnSignIn').click(function () {
        $.ajax({
            url: '/signIn',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                msg = response;
                response = $.parseJSON(response);
                if (response.loggedin == 0) {
                    alert("Invalid Username or Password !");
                }
                else if (response.loggedin == 1) {
                    window.location.assign("showHome");
                }
                else {
                    //$("#nav-not-logged-in").addClass("hidden");
                    //$("#nav-logged-in").removeClass("hidden");
                    //getsession();
                    alert(msg);
                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});