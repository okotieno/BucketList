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
                        '<th>&nbsp;</th>' +


                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    for (var _part in response.data) {

                        attach = attach + '<tr class="activity-item">' +
                            '<td class="activity-item-name">' + response.data[_part][1] + '</td>' +
                            '<td>Done</td>' +
                            '<td class="activity-item-date">' + response.data[_part][3] + '</td>' +
                            '<td>' +
                                '&nbsp;' +
                            '</td>' +
                            '</tr>';
                    }
                    attach = attach + '</tbody>' +
                        '</table>';

                }
                else {
                    attach = attach + '<div class="alert alert-warning">  No Activities found under this category! </div>';
                }

                attach = attach + '';
                attach = attach + '<div class="collapse" id="new_activity' + $this.attr("data-bl_id") + '"></div>';
                $this.html(attach);
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
                        var attach = '<a class="list-group-item" aria-controls="bl' + response.data[_part][0] +
                            '" data-bl_id="' + response.data[_part][0] + '"' +
                            '" aria-expanded="false" ' +
                            'data-toggle="collapse" href="#bl' + response.data[_part][0] + '" >' +
                            response.data[_part][1] + '</a>';

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

                attach = '' +
                    '<div class="collapse" id="bl_new"> ' +
                    '<div class="well"> ' +
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


    load_category();

    $(document).on("click", "a[data-bl_id]", function () {
        var clicked_category = $(this).attr("data-bl_id");
        load_activity($("div[data-bl_id='" + clicked_category + "']"));
    });

});