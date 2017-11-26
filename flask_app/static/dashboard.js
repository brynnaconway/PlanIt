$(function () {
    $('#btnAddEvent').click(function () {
        document.getElementById('btnAddEvent').style.display="none"
        document.getElementById("btnNewGroup").style.display = "inline";
        document.getElementById("btnExistingGroup").style.display = "inline";
    });
});

$(function () {
    $('#btnNewGroup').click(function () {
        document.getElementById("textinputNewEventName").style.display = "inline";
        document.getElementById("btnNewGroup").style.display = "none";
        document.getElementById("btnExistingGroup").style.display = "none";
    });
});

$(function () {
    $('#btnExistingGroup').click(function () {
        $.ajax({
            url: '/getGroups',
            type: 'POST',
            success: function (response) {
                console.log(response);
                if (response['valid'] == false) {
                    window.alert("You're not in any groups yet, make a new one! ");
                } else {
                    for (name in response['groups']) {
                        var li = document.createElement("li");
                        var link = document.createElement("a");
                        var text = document.createTextNode(name);
                        link.appendChild(text);
                        link.href = "#";
                        li.appendChild(link);
                        $('#dropdownExistingGroup ul').append(li);
                    }
                    document.getElementById('dropdownExistingGroup').style.display = "inline";
                    document.getElementById("btnNewGroup").style.display = "none";
                    document.getElementById("btnExistingGroup").style.display = "none";
                }
            },
            error: function (error) {
            }
        });
    });
});


$(function() {
    $('#input-group-btn').click(function() {
        $.ajax({
            url: '/createEvent',
            data:{new_group:true,name:$('#newGroupName').text},
            type: 'POST',
            success: function(response) {
                console.log(response);
                window.location = '/dashboard'
                document.getElementById("newGroupBtn").style.visibility = "visible";
                document.getElementById("existingGroupBtn").style.visibility = "visible";
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

function deleteEvent(eventID) {
    console.log("eventID: ", eventID);
    $.ajax({
        url: '/deleteEvent',
        data: {eventID: eventID},
        type: 'POST',
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
