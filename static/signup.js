$(function() {
    $("#signUpForm").submit(function(event) {
        $.ajax({
            url: '/addperson',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
                window.location = '/dashboard'
            },
            error: function(error) {
                console.log(error);
            }
        });
        event.preventDefault(); 
    });
});

$(function() {
    $('#goToHome').click(function() {
        window.location = '/';
    });
});