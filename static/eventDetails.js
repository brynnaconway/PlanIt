window.onload = function () {
    $('#tabs a:first').tab('show');
    let adminBool = $('#btnCloseLocationsPoll').val();
    var inProgressData = $('#inProgressData').val();
    console.log("locationsInProgress: ", inProgressData[1]);
    console.log("adminBool: ", adminBool);
    if (String(adminBool) == "False") {
        document.getElementById('btnCloseLocationsPoll').style.display = 'none';
        document.getElementById('btnCloseLodgePoll').style.display = 'none';
    }
    if (inProgressData[1] == 1) {
        document.getElementById('locationsInProgressContent').style.display = 'none';
        document.getElementById('finalizedLocationContent').style.display = 'block';
    }
    else {
        document.getElementById('finalizedLocationContent').style.display = 'none';
    }

    return true;
}

$(function () {
    $('#btnCloseLocationsPoll').click(function () {
        $.ajax({
            url: '/submitLocation',
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails'
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

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

$(function () {
    $('#btnSubmitLodgeVote').click(function () {
        $.ajax({
            url: '/submitLodgeVote',
            data: {submit_vote: true, lodgeName: $("input[name=lodgingRadio]:checked").val()},
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


function submitLodge() {
    $.ajax({
        url: '/submitLodge',
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


// function submitLodge() {
//     $.ajax({
//               url: '/submitLodge',
//
// <<<<<<< HEAD
//         url: '/submitLocation',
//         type: 'POST',
//         success: function (response) {
//             console.log(response);
//             window.location = '/eventDetails'
//         },
//         error: function (error) {
//             console.log(error);
//         }
//     });
// }
//
// $(function () {
//     $("#newLodgeForm").submit(function (event) {
//         console.log("data: ", $('#newLodgeForm').serialize());
//         $.ajax({
//             url: '/addlodge',
//             data: $('#newLodgeForm').serialize(),
// =======
//             url: '/submitLodge',
// >>>>>>> finalize
//             type: 'POST',
//             success: function (response) {
//                 console.log("From data: ", $('#newLodgeForm').serialize());
//                 console.log(response);
//                 window.location = "/eventDetails";
//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//         event.preventDefault();
//     });
// });

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


