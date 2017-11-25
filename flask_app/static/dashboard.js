$(function() {
    $('#btnAddEvent').click(function() {
        $.ajax({
            url: '/createEvent',
            type: 'POST',
            success: function(response) {
                console.log(response);
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
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}
