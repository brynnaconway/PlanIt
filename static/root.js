$(function() {
    $("#signInForm").submit(function(event) {
        $.ajax({
            url: '/signIn',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                try { // invalid username or password 
                    response = JSON.parse(response);
                    if (response['valid'] == false) {
                        console.log("FALSE");
                        $('#invalid_login').show(); 
                        $('#invalid_login').fadeOut(9900); 
                    }
                }
                catch(err) {
                    console.log(response);
                    window.location = '/dashboard';
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
        event.preventDefault();
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

