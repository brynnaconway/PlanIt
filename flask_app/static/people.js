/**
 * Created by benedict on 10/31/17.
 */
$(function() {
    $('#btnPeopleSearch').click(function() {
        $('#search-results').toggle();
        $.ajax({
            url: '/searchpeople',
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