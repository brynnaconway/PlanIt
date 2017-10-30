
$(function() {
    $('#btnSignUp').click(function() {
        $.ajax({
            url: '/addperson',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
                alert("Success");
            },
            error: function(error) {
                console.log(error);
                alert("Failure");
            }
        });
    });
});
