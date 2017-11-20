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
    $('#goToHome').click(function() {
        window.location = '/';
    });
});