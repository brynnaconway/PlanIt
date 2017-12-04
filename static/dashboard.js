/*$(function () {
    $('#createEvent').click(function (event) {
        //console.log("Form data: ", document.getElementById('newEventform').serialize());
        event.preventDefault();
        $.ajax({
            url: '/createEvent',
            data: $('newEventform').serialize(),
            type: 'POST',
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
}); */

$(function() {
    $("#newEventForm").submit(function(event) {
        $.ajax({
            url: '/createEvent',
            data: $('#newEventForm').serialize(),
            type: 'POST',
            success: function(response) {
                console.log("From data: ", $('#newEventForm').serialize());
                console.log(response);
                window.location = "/dashboard";
            },
            error: function(error) {
                console.log(error);
            }
        });
        event.preventDefault();
    });
});


$(function () {
    $('#existingGroupSelect').change(function() {
        if ($(this).val() == '_createNewGroup') {
            document.getElementById("textinputNewGroupName").style.display = "inline";
            document.getElementById("existingGroupSelect").style.display = "none";
            document.getElementById("groupSelectLabel").style.display = "none";
            //document.getElementById("newGroupNameLabel").style.display = "inline";            
        }
    });
});

$(function () {
    $('#myModal').on('hide.bs.modal', function () {
        document.getElementById("newUserForm").reset();  
        document.getElementById("newEventForm").reset();
        document.getElementById("btnCreateNewGroup").style.display = "inline";
        document.getElementById("newGroupName").readOnly = false;  
        document.getElementById("searchBox").reset();
        $("#search-results tr").remove();   
        // TODO: remove rows from members tables too, except first row                           
    })
})

$(function () {
    $('#myModal').on('show.bs.modal', function () {
        document.getElementById("existingGroupSelect").style.display = "block"; 
        document.getElementById("textinputNewGroupName").style.display = "none";
        document.getElementById("selectPeople").style.display = "none"; 
        $.ajax({
            url: '/getGroups',
            type: 'POST',
            success: function (response) {
                console.log(response);
                var select = document.getElementById("existingGroupSelect");
                select.length = 0;
                for (i=0; i<= select.length; i++) {
                    select.remove(i);
                }
                if (response['valid'] == false) {
                    pass;
                } else {
                    for (name in response['groups']) {
                        $('#existingGroupSelect').append($('<option>', {
                            value: response['groups'][name],
                            text: name
                        }));
                    }
                    $('#existingGroupSelect').append($('<option>', {
                        value: '_createNewGroup',
                        text: "Create a new group..."
                    }));
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
                document.getElementById("btnCreateNewGroup").style.display = "none";
                document.getElementById("newGroupName").readOnly = true;
                //window.location = '/pickPeople'
                document.getElementById("selectPeople").style.display = "block"; 
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


