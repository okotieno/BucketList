$(function() {
    function load_category(){
        $.ajax({
            url: '/allBlCategory',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function(response) {
                
                $(".bl_categories_edit").html("");

                var raw_response = response;
                response = $.parseJSON(response);

                if(response.empty_data == 0){
                    for (var _part in response.data){
                        var attach = '<a class="list-group-item" aria-controls="bl' + response.data[_part][0]  +
                            '" aria-expanded="false" ' +
                            'data-toggle="collapse" href="#bl'+ response.data[_part][0] + '" >' +
                            response.data[_part][1] + '</a>';

                        attach = attach + '<div class="collapse" id="bl'+ response.data[_part][0] + '">' +
                            '<div class="well"> well';
                        attach = attach + '</div></div>'
                        $(".bl_categories_edit").append(attach);
                        //response.data[_part][1]

                    }

                }
                else{
                    alert(raw_response);
                    $(".bl_categories_edit").append('<div class="alert alert-warning"> You have not set up any category yet!</div>');
                }



                // for (var _part in response.data){
                //     var attach = '<a class="list-group-item" aria-controls="bl' + response.data[_part][0]  +
                //         '" aria-expanded="false" ' +
                //         'data-toggle="collapse" href="#bl'+ response.data[_part][0] + '" >' +
                //         response.data[_part][1] + '</a>';
                //
                //     attach = attach + '<div class="collapse" id="bl'+ response.data[_part][0] + '">' +
                //         '<div class="well"> well';
                //     attach = attach + '</div></div>'
                //     $(".bl_categories_edit").append(attach);
                //     //response.data[_part][1]
                //
                // }
                attach ='<a aria-controls="bl_new" data-toggle="collapse" aria-expanded="false" href ="#bl_new" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> Add new category </a> ' +
                    '<div class="collapse" id="bl_new"> ' +
                    '<div class="well"> ' +
                    '<form action="" class="form-inline">' +
                    '<input class="form-control" type="text" name="bl_new_name" id="">' +
                    '<input type="submit" class="btn btn-success" value="Add Category">' +
                    '</form>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $(".bl_categories_edit").append(attach);                                                                                                                                                                                                                                                                                                                                                                                             },
            error: function(error) {
                console.log(error);
            }
        });
    }
    function getsession() {
         $.ajax({
            url: '/getsession',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function(response) {
                response = $.parseJSON(response);
                if (response.loggedin==1){
                    $("#nav-not-logged-in").addClass("hidden");
                    $(".bl_user").html(response.user[1]);
                    $(".form-signin").addClass("hidden");
                    $(".log-in-welcome").removeClass("hidden");

                }

                else{
                    $("#nav-logged-in").addClass("hidden");
                    var pathname = window.location.pathname;
                    if(pathname != "/showSignIn" && pathname != "/showSignUp" ){
                        window.location.assign("/");
                    }

                }

            },
            error: function(error) {
                console.log(error);
            }
        });
    }
    getsession();
    load_category();
//      $.ajax({
//             url: '/getsession',
//             //data: $('form').serialize(),
//             //type: 'POST',
//             success: function(response) {
//
//                 response = $.parseJSON(response);
//                 if (response.loggedin==1){
//                     $("#nav-not-logged-in").addClass("hidden");
//                     $(".bl_user").html(response.user[1]);
//                 }
//
//                 else{
//                     $("#nav-logged-in").addClass("hidden");
//
//                 }
//
//             },
//             error: function(error) {
//                 console.log(error);
//             }
//         });
    $(document).on('submit','#bl_new form',function(form) {
        $this = $(this);
        form.preventDefault();
        $.ajax({
            url: '/addNewCategory',
            data:  $this.serialize(),
            type: 'POST',
            success: function(response) {
                load_category();
                alert(response);

            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    $('.log-out').click(function() {
        $.ajax({
            url: '/logOut',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function(response) {
                alert("Successfully Logged Out!");
                window.location.assign("/");
            },
            error: function(error) {
                console.log(error);
            }
        });
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
                msg = response;
                response = $.parseJSON(response);
                if(response.loggedin==0){
                    alert("Invalid Username or Password !");
                }
                else if(response.loggedin==1){
                    window.location.assign("showHome");
                }
                else{
                    //$("#nav-not-logged-in").addClass("hidden");
                    //$("#nav-logged-in").removeClass("hidden");
                    //getsession();
                    alert(msg);
                }

            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});