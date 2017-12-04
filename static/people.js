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
                    row.append($("<td>" + stuff[item][2] + "</td>"))
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
    $('#btnConfirmGroup').click(function () {
            var selids = [];
            var table = document.getElementById("selectionTable");
            for (var i = 1, row; row = table.rows[i]; i++) {
                console.log("ROW: ", row);
                selids.push(parseInt(row.cells[1].innerText))
            }
            console.log(selids);
            $.ajax({
                url: '/addmembership',
                data: JSON.stringify({ids: selids}),
                contentType: "application/json; charset=utf-8",
                type: 'POST',
                success: function (response) {
                    document.getElementById('selectPeople').style.display = "none"; 
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
        document.getElementById("noMembers").style.display = "none"; 
        name = this.firstElementChild.textContent;
        id = parseInt(this.lastElementChild.textContent)
        var row = $("<tr>");
        row.append($("<td style=\"border-top: none\">" + name + "</td>"));
        row.append($("<td style=\"border-top: none\">" + id + "</td>"));
        $("#selection tbody").append(row);

    });
});



$(document).ready(function () {
    $('#btnSendNewPerson').click(function () {
        name = document.getElementById('newPersonName').value;
        email = document.getElementById('newPersonEmail').value;
        phone = document.getElementById('newPersonPhone').value;
        document.getElementById('addMembersOptions').style.display = "inline";         
        document.getElementById('newUserForm').style.display = "none"; 
        document.getElementById("noMembers").style.display = "none"; 
        document.getElementById("newUserForm").reset();                

        $.ajax({
            url: '/addperson',
            data: {inputName: name, inputEmail: email, inputNum: phone},
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            success: function (response) {
        var row = $("<tr style=\"border-top: none\">");
                var row = $("<tr>");
                row.append($("<td style=\"border-top: none\">" + name + "</td>"));
                row.append($("<td style=\"border-top: none\">" + response["id"] + "</td>"));
                $("#selection tbody").append(row);
            },
            error: function (error) {
                console.log(error);
            }
        });

    });
});


$(document).ready(function () {
    $('#newUserButton').click(function () {
        document.getElementById('addMembersOptions').style.display = "none";         
        document.getElementById('newUserForm').style.display = "inline"; 
    });
});