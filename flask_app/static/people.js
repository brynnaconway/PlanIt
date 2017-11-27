/**
 * Created by benedict on 10/31/17.
 */
$(function () {
    $('#btnPeopleSearch').click(function () {
        // $('#search-results').toggle();
        $.ajax({
            url: '/searchpeople',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                $("#search-results tr").remove();
                stuff = response['data']
                for (item in stuff) {
                    var row = $("<tr>");
                    row.id = stuff[item][2];
                    row.append($("<td>" + stuff[item][0] + "</td>"))
                        .append($("<td>" + stuff[item][2] + "</td>"))
                    $("#search-results tbody").append(row);
                }


            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(function () {
    $('#btnNewGroup').click(function () {
        console.log($('#groupName').val())
        $.ajax({
            url: '/addgroup',
            data: $('#groupName').val(),
            type: 'POST',
            success: function (response) {
                window.location = '/addmembership?id=' + response;
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(function () {
    $('#btnConfirmGroup').click(function () {
            var selids = [];
            var table = document.getElementById("selectionTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                selids.push(parseInt(row.cells[1].innerText))
            }
            console.log(selids);

            $.ajax({
                url: '/addmembership',
                data: JSON.stringify({ids:selids}),
                contentType: "application/json; charset=utf-8",
                type: 'POST',
                success: function (response) {
                    window.location = '/createEventDetails';
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    );
});


$(document).ready(function () {
    var table = $('#results');
    $('#results tbody').on('click', 'tr', function () {
        name = this.firstElementChild.textContent;
        id = parseInt(this.lastElementChild.textContent)
        var row = $("<tr>");
        row.append($("<td>" + name + "</td>"))
        row.append($("<td>" + id + "</td>"))
        $("#selection tbody").append(row);

    });
});