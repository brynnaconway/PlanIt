window.onload = function() {
    /*var url = location.href;
    url = url.split("data=")[1]
    console.log(url)
    if (String(url) == "lodge") {
        $('#tabs a:third').tab('show');
    }
    else {
        $('#tabs a:first').tab('show');
    }*/
    $('#tabs a:first').tab('show');


    let adminBool = $('#btnClosePoll').val();
    console.log("adminBool: ", adminBool);
    if (String(adminBool) == "False"){
        document.getElementById('btnClosePoll').style.display = 'none';
    }
    return true;
}

$(function () {
    $('#btnAddNewLocation').click(function () {
        $.ajax({
            url: '/addlocation',
            data: {new_location: true, location: $('#newLocation').val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails'
                // document.getElementById("existingGroupBtn").style.visibility = "visible";
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
$(function () {
    $('#textinputNewLocation').change(function () {
        let input = document.getElementById('newLocation').value;
        $.ajax({
            url: '/getLocationSuggestions',
            data: {input: input},
            type: 'POST',
            success: function (response) {
                console.log(response);
                for (val in response) {
                    let descript = response[val]['description'];
                    let row = $("<option>");
                    row.val(descript);
                    $("#suggestionList").append(row);
                }
                document.getElementById('suggestionList').click();


            },
            error: function (error) {
                console.log(error)

            }
        });
    });

});

$(function () {
    $('#btnSubmitLocationVote').click(function () {
        $.ajax({
            url: '/submitLocationVote',
            data: {submit_vote: true, location: $("input[name=optionsRadios]:checked").val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

function submitLocation() {
    $.ajax({
            url: '/submitLocation',
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails'
            },
            error: function (error) {
                console.log(error);
            }
        });
}

$(function () {
    $("#newLodgeForm").submit(function (event) {
        console.log("data: ", $('#newLodgeForm').serialize()); 
        $.ajax({
            url: '/addlodge',
            data: $('#newLodgeForm').serialize(),
            type: 'POST',
            success: function (response) {
                console.log("From data: ", $('#newLodgeForm').serialize());
                console.log(response);
                window.location = "/eventDetails";
            },
            error: function (error) {
                console.log(error);
            }
        });
        //event.preventDefault();
    });
});

