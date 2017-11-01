/**
 * Created by benedict on 10/31/17.
 */
$(function() {
    $('#btnPeopleSearch').click(function() {
        // $('#search-results').toggle();
        $.ajax({
            url: '/searchpeople',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                $("#search-results tr").remove();
                stuff = response['data']
                for (item in stuff){
                    var row = $("<tr>");
                    row.id = stuff[item][2];
                    // console.log(row.id);
                    row.append($("<td>" +stuff[item][0]+ "</td>"))
                        .append($("<td>" +stuff[item][1]+ "</td>"))
                    $("#search-results tbody").append(row);
                }


            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function() {
    $('#btnNewGroup').click(function() {
        console.log($('#groupName').val())
        $.ajax({
            url: '/addgroup',
            data: $('#groupName').val(),
            type: 'POST',
            success: function(response) {
                window.location = '/addmembership?id=' + response;
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

// $(document).ready(function() {
//     var table = $('#results').DataTable();
//     $('#results tbody').on( 'click', 'tr', function () {
//         console.log( table.row( this ).data() );} );
// });

$(function() {
    $(".clickable-row").click(function() {
        console.log($(this.data()))
        var row = $("<tr>");
        row.append($("<td>" +$(this).name + "</td>"))
        $("#selection tbody").append(row);
        });
    });
