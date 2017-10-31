$(function() {
    $('#btnSignUp').click(function() {
        $.ajax({
            url: '/addperson',
            data: $('form').serialize(),
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

$(function() {
    $('#btnGen').click(function() {
        $.ajax({
            url: '/generate',
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


$(function() {
    $('#btnReset').click(function() {
        $.ajax({
            url: '/reset',
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

$(function() {
    $('#btnSignIn').click(function() {
        window.location = '/dashboard';
    });
});

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
    eventID = eventID.toString();
    $.ajax({
        url: '/deleteEvent',
        data: {'eventID': eventID},
        type: 'POST',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}