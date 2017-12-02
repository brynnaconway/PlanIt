/*$(function () {
    $('#btnAddEvent').click(function () {
        $.ajax({
            url: '/createEvent',
            type: 'POST',
            success: function (response) {
                console.log(response);
                document.getElementById("btnNewGroup").style.display = "inline";
                document.getElementById("btnExistingGroup").style.display = "inline";
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
}); */


$(function () {
    $('#btnNewGroup').click(function () {
        document.getElementById("textinputNewEventName").style.display = "inline";
        document.getElementById("btnNewGroup").style.display = "none";
        document.getElementById("btnExistingGroup").style.display = "none";
    });
});

$(function () {
    $('#myModal').on('show.bs.modal', function () {
        $.ajax({
            url: '/getGroups',
            type: 'POST',
            success: function (response) {
                console.log(response);
                if (response['valid'] == false) {
                    pass;
                } else {
                    for (name in response['groups']) {
                        $('#existingGroupSelect').append($('<option>', {
                            value: response['groups'][name],
                            text: name
                        }));
                    }
                    //document.getElementById('dropdownExistingGroup').style.display = "inline";
                    //document.getElementById("btnNewGroup").style.display = "none";
                    //document.getElementById("btnExistingGroup").style.display = "none";
                }
            },
            error: function (error) {
            }
        });
    });
});

// Function for creating a new group
$(function () {
    $('#btnCreateNewGroup').click(function () {
        $.ajax({
            url: '/addgroup',
            data: {new_group: true, name: $('#newGroupName').val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/pickPeople'
                // document.getElementById("existingGroupBtn").style.visibility = "visible";
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

// function for using an existing group, redirects to new event page
$(function () {
    $('#btnSelectExistingGroup').click(function () {
        $.ajax({
            url: '/addgroup',
            data: {new_group: false, id: $('#existingGroupSelect').val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/createEventDetails'
            },
            error: function (error) {
                console.log(error);
            }
        })
        ;
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
            window.location = '/dashboard'
        },
        error: function (error) {
            console.log(error);
        }
    });
}
