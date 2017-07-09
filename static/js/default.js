$(function() {
     $.ajax({
            url: '/getsession',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function(response) {

                response = $.parseJSON(response);
                if (response.loggedin==1){
                    $("#nav-not-logged-in").addClass("hidden");
                    $(".bl_user").html(response.user[1]);
                }

                else{
                    $("#nav-logged-in").addClass("hidden");

                }

            },
            error: function(error) {
                console.log(error);
            }
        });

    $('#btnSignUp').click(function() {
        $.ajax({
            url: '/signUp',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                alert(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    $('#btnSignIn').click(function() {
        $.ajax({
            url: '/signIn',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                response = $.parseJSON(response);
                if(response.loggedin==0){
                    alert("Invalid Username or Password !");
                }
                else{
                    $("#nav-not-logged-in").addClass("hidden");
                    $("#nav-logged-in").removeClass("hidden");
                }

            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});