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
                var row = $("<tr>");
                row.append($("<td>Name</td>"))
                    .append($("<td>Phone Number</td>"))
                $("#search-results thead").append(row);

                for (item in stuff){
                    var row = $("<tr>");
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