$("document").ready(function () {
    function load_activity($this) {
        var attach = "";
        $.ajax({
            url: '/allActivity',
            data: {id: $this.attr("data-bl_id")},
            type: 'POST',
            success: function (response) {
                response = $.parseJSON(response);

                if (response.empty_data == 0) {
                    attach = attach + '<table class="table table-hover">' +
                        '<thead>' +
                        '<tr>' +
                        '<th>Activity</th>' +

                        '<th>Status</th>' +
                        '<th>Period</th>' +
                        '<th>Actions</th>' +


                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    for (var _part in response.data) {

                        attach = attach + '<tr class="activity-item">' +
                            '<td class="activity-item-name">' + response.data[_part][1] + '</td>' +
                            '<td>Done</td>' +
                            '<td class="activity-item-date">' + response.data[_part][3] + '</td>' +
                            '<td>' +
                            '<a class="btn btn-default btn-sm"><span class="glyphicon glyphicon-check"></span>Done</a> ' +
                            '<a class="btn btn-success btn-sm"  data-category-id="' + response.data[_part][4] + '" ' +
                            'data-activity-edit="' + response.data[_part][0] + '"><span class="glyphicon glyphicon-pencil"></span>Edit </a> ' +
                            '<a class="btn btn-danger btn-sm" data-category-id="' + response.data[_part][4] + '" ' +
                            'data-activity-delete="' + response.data[_part][0] + '">' +
                            '<span class="glyphicon glyphicon-trash"></span>' +
                            'Delete ' +
                            '</a> ' +
                            '</td>' +
                            '</tr>';
                    }
                    attach = attach + '</tbody>' +
                        '</table>';

                }
                else {
                    attach = attach + '<div class="alert alert-warning">  No Activities found under this category! </div>';
                }

                attach = attach +
                    '<a aria-controls="new_activity' + $this.attr("data-bl_id") + '" ' +
                    'aria-expanded="false" ' +
                    'data-toggle="collapse" href="#new_activity' + $this.attr("data-bl_id") + '"' +
                    'class="btn btn-default"><span class="glyphicon glyphicon-plus"></span>Add Activity</a>';
                attach = attach + '<div class="collapse" id="new_activity' + $this.attr("data-bl_id") + '"><form action="" class="form-inline bl_activity">' +
                    '<input class="form-control" type="hidden" name="bl_id"  value="' + $this.attr("data-bl_id") + '">' +
                    'Name: <input class="form-control" type="text" name="bl_activity_new_name" >' +
                    'Date: <input class="form-control datepicker" type="text" name="date" >' +
                    '<input type="submit" class="btn btn-success " value="Add Activity">' +
                    '</form></div>';
                $this.html(attach);
                $(".datepicker").datepicker({
                    dateFormat: 'yy-mm-dd',
                    showAnim: 'slide'
                });
            },
            error: function (error) {
                alert(error);
            }
        });
    }

    function load_category() {
        $.ajax({
            url: '/allBlCategory',
            //data: $('form').serialize(),
            //type: 'POST',
            success: function (response) {

                $(".bl_categories_edit").html("");

                response = $.parseJSON(response);

                if (response.empty_data == 0) {
                    for (var _part in response.data) {
                        var attach = '<div class="row"><div class="col-md-10"><a class="list-group-item" aria-controls="bl' + response.data[_part][0] +
                            '" data-bl_id="' + response.data[_part][0] + '"' +
                            ' aria-expanded="false" ' +
                            'data-toggle="collapse" href="#bl' + response.data[_part][0] + '" >' +
                            response.data[_part][1] + '</a></div>';

                        attach = attach + '<div class="col-md-2"> <div class="btn-group btn-group-justified" role="group">' +
                            '<a class="btn btn-primary " data-category-edit="' + response.data[_part][0] + '" >Edit</a>' +
                            '<a class="btn btn-danger" data-category-delete="' + response.data[_part][0] + '" >Delete</a>' +
                            '</div></div></div>';

                        attach = attach + '<div class="collapse" id="bl' + response.data[_part][0] + '">' +
                            '<div data-bl_id="' + response.data[_part][0] + '" class="well"> ';
                        attach = attach + '</div></div>'
                        $(".bl_categories_edit").append(attach);
                        //response.data[_part][1]


                    }

                }
                else {
                    $(".bl_categories_edit").append('<div class="alert alert-warning"> You have not set up any category yet!</div>');
                }

                attach = '<div class="col-md-12"> <a aria-controls="bl_new" data-toggle="collapse" aria-expanded="false" href ="#bl_new" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> Add new category </a> </div>' +
                    '<div class="collapse clearfix" id="bl_new"> ' +
                    '<div class="well "> ' +
                    '<form action="" class="form-inline">' +
                    '<input class="form-control" type="text" name="bl_new_name" id="">' +
                    '<input type="submit" class="btn btn-success" value="Add Category">' +
                    '</form>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $(".bl_categories_edit").append(attach);

                var activity_li = '<td>' +
                    '</td>';
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $(document).on("click", "[data-activity-edit]", function () {
        var name = $(this).parents('.activity-item').children(".activity-item-name").text();
        var date = $(this).parents('.activity-item').children(".activity-item-date").text();
        var userDate = new Date(date);

        var edit_id = $(this).attr("data-activity-edit");
        var category_id = $(this).attr("data-category-id");

        date = moment(userDate).format("YYYY-MM-DD");

        $("#activity-new-date").attr("value", date);
        $("#activity-new-name").attr("value", name);
        $("#activity-edit-id").attr("value", edit_id);
        $("#activity-category_id").attr("value", category_id);

        $("#activity-edit-dialog").dialog({
            title: "Activity Edit",
            width: 430,
            height: 360,
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog('close');
                    }
                }

            ]
        });
        //$("#activity-edit-dialog").removeClass("hidden");
    });

    $(document).on("submit", "#activity-edit-dialog form", function (form) {
        var $this = $(this);
        form.preventDefault();
        $.ajax({
            url: "/activityUpdate",
            data: $this.serializeArray(),
            type: 'POST',
            success: function (response) {
                load_activity($("div[data-bl_id='" + $("#activity-category_id").attr("value") + "']"));
                alert(response);
                $("#activity-edit-dialog").dialog('close');
            },
            error: function () {
                alert("error while accessing link");
            }
        });

    });

    $(document).on("submit", "#category-edit-dialog form", function (form) {
        var $this = $(this);
        form.preventDefault();
        $.ajax({
            url: "/categoryUpdate",
            data: $this.serializeArray(),
            type: 'POST',
            success: function (response) {
                load_category();
                alert(response);
                $("#category-edit-dialog").dialog('close');
            },
            error: function () {
                alert("error while accessing link");
            }
        });

    });

    load_category();

    $(document).on("click", "a[data-bl_id]", function () {
        var clicked_category = $(this).attr("data-bl_id");
        load_activity($("div[data-bl_id='" + clicked_category + "']"));
    });

    $(document).on("click", "[data-activity-delete]", function () {
        var activity_id;
        var category_id;
        activity_id = $(this).attr("data-activity-delete");
        category_id = $(this).attr("data-category-id");
        $.ajax({
            url: '/deleteActivity',
            data: {'activity_id': activity_id},
            type: 'POST',
            success: function (response) {

                load_activity($("div[data-bl_id='" + category_id + "']"));
                alert(response);
                //load_activity($this)
            },
            error: function (error) {
                console.log(error);
            }
        });

    });

    $(document).on('submit', '.bl_activity', function (form) {
        $this = $(this)
        form.preventDefault();
        $.ajax({
            url: '/addNewActivity',
            data: $this.serialize(),
            type: 'POST',
            success: function (response) {
                var category_updated = $this.children("input[name=bl_id]").val();
                load_activity($("div[data-bl_id='" + category_updated + "']"));
                alert(response);
                //load_activity($this)
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $(document).on('submit', '#bl_new form', function (form) {
        $this = $(this);
        form.preventDefault();
        $.ajax({
            url: '/addNewCategory',
            data: $this.serialize(),
            type: 'POST',
            success: function (response) {
                alert(response);
                load_category();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $(document).on('click', "[data-category-delete]", function(){
        var category_delete_id = $(this).attr("data-category-delete");
        $.ajax({
            url: '/deleteCategory',
            data: {'category_delete_id': category_delete_id},
            type: 'POST',
            success: function (response) {

                load_category();
                alert(response);
                //load_activity($this)
            },
            error: function (error) {
                console.log(error);
            }
        });
    })

    $(document).on("click", "[data-category-edit]", function () {
        var name = $(this).parents('.bl_categories_edit').children("div").children("div").children("a").text();
        var edit_id = $(this).attr("data-category-edit");
        $("#category-new-name").attr("value", name);
        $("#category_id").attr("value", edit_id);

        $("#category-edit-dialog").dialog({
            title: "Activity Edit",
            width: 430,
            height: 360,
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog('close');
                    }
                }

            ]
        });

    });
});