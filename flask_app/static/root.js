$(function() {
    $("signInForm").submit(function() {
        window.location = '/dashboard';
    });
});

$(function() {
    $('#goToSignUp').click(function() {
        window.location = '/signUp';
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

