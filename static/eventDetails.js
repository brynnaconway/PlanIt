window.onload = function () {
    $('#tabs a:first').tab('show');
    let adminBool = $('#btnClosePoll').val();
    console.log("adminBool: ", adminBool);
    if (String(adminBool) == "False") {
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
        event.preventDefault();
    });
});

// $(function () {
//     $("#newTimeForm").submit(function (event) {
//         let start = $('#datetimepickerStart').data("DateTimePicker").date();
//         let stop = $('#datetimepickerStop').data("DateTimePicker").date();
//         $.ajax({
//             url: '/submitTime',
//             data: {start: start, stop: stop},
//             type: 'POST',
//             success: function (response) {
//                 console.log(response);
//                 window.location = '/eventDetails'
//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//         event.preventDefault();
//
//     });
// });
$(function () {
    $("#btnAddNewTime").click(function () {
        let start = $('#datetimepickerStart').data("DateTimePicker").date();
        let stop = $('#datetimepickerStop').data("DateTimePicker").date();
        console.log(start);
        $.ajax({
            url: '/submitTime',
            data: {start: start._d, stop: stop._d},
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

$(function () {
    $('#datetimepickerStart').datetimepicker({
        format: "YYYY-M-D H:m:s"

    });
    $('#datetimepickerStop').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        format: "YYYY-M-D H:m:s"
    });
    $("#datetimepickerStart").on("dp.change", function (e) {
        $('#datetimepickerStop').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepickerStop").on("dp.change", function (e) {
        $('#datetimepickerStart').data("DateTimePicker").maxDate(e.date);
    });
});
