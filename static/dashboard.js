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

let cache = {
    stack: {}, //Cache stack
    load: function(id){ //Load cache if found
        return (typeof(this.stack[id]) != 'undefined') ? this.stack[id] : false;
    },
    save: function(data,id){ //Cache data with unique id
        this.stack[id] = data;
    },
    remove: function(id){//Remove cache for identifier
        if(typeof(this.stack[id]) != 'undefined')
            delete this.stack[id];
    }
};

// Create the event
$(function () {
    $("#newEventForm").submit(function (event) {
        gid = document.getElementById("existingGroupSelect").value;
        name = document.getElementById("existingGroupSelect").val;

        $.ajax({
            url: '/createEvent',
            data: $('#newEventForm').serialize(),
            type: 'POST',
            success: function (response) {
                console.log("From data: ", $('#newEventForm').serialize());
                console.log(response);
                window.location = "/dashboard";
            },
            error: function (error) {
                console.log(error);
            }
        });
        event.preventDefault();
    });
});

// Basically does what the function below does without checking what is selected
let newGroup = function () {
    document.getElementById("textinputNewGroupName").style.display = "inline";
    document.getElementById("existingGroupSelect").style.display = "none";
    document.getElementById("groupSelectLabel").style.display = "none";
};

// Function that displays the new group name box, and hides the dropdown containing other groups if the current
// dropdown selection is "Create new group"
$(function () {
    $('#existingGroupSelect').change(function () {
        if ($(this).val() == '_createNewGroup') {
            document.getElementById("textinputNewGroupName").style.display = "inline";
            document.getElementById("existingGroupSelect").style.display = "none";
            document.getElementById("groupSelectLabel").style.display = "none";
            //document.getElementById("newGroupNameLabel").style.display = "inline";
        }
    });
});

// Function that cleans up once the modal is closed (either submitted or exited)
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

// Function that gets all the groups that the user is in and displays them in the dropdown
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
                for (i = 0; i <= select.length; i++) {
                    select.remove(i);
                }
                // javascript is such a shitty language
                if (response['groups'].length == undefined && Object.keys(response['groups']).length <= 0) {
                    console.log(response['groups'].length == undefined)
                    newGroup()
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
                cache.save(response[id], 'groupID')

            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

// Function for using an existing group, redirects to new event page
$(function () {
    $('#existingGroupSelect').change(function () {
        $.ajax({
            url: '/addgroup',
            data: {new_group: false, id: $('#existingGroupSelect').val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                // window.location = '/createEventDetails'
            },
            error: function (error) {
                console.log(error);
            }
        })
        ;
    });

});

// Function for deleting an event
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


