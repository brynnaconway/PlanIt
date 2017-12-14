// From Stack Overflow
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// From Stack Overflow
var cache = {
    stack: {}, //Cache stack
    load: function (id) { //Load cache if found
        return (typeof(this.stack[id]) != 'undefined') ? this.stack[id] : false;
    },
    save: function (data, id) { //Cache data with unique id
        this.stack[id] = data;
    },
    remove: function (id) {//Remove cache for identifier
        if (typeof(this.stack[id]) != 'undefined')
            delete this.stack[id];
    }
};


window.onload = function () {
    $('#tabs a:first').tab('show');
    let tabNo = parseInt(getParameterByName('tab'));
    let tab = document.getElementsByClassName('nav-link')[tabNo];
    if (tab){tab.click();}


    let adminBool = $('#btnCloseLocationsPoll').val();
    var locationsInProgressData = $('#locationsInProgressData').val();
    var timeInProgressData = $('#timeInProgressData').val();
    var lodgingInProgressData = $('#lodgingInProgressData').val();
    console.log("locationsInProgress: ", locationsInProgressData[0]);
    console.log("timeInProgress: ", timeInProgressData[0]);
    console.log("lodgingInProgress: ", lodgingInProgressData[0]);
    console.log("adminBool: ", adminBool);

    if (String(adminBool) == "False") {
        document.getElementById('btnCloseLocationsPoll').style.display = 'none';
        document.getElementById('btnCloseLodgePoll').style.display = 'none';
        document.getElementById('btnCloseTimePoll').style.display = 'none';
    }

    // Show or hide voting for locations 
    if (locationsInProgressData[0] == 1) { //finalized 
        document.getElementById('locationsInProgressContent').style.display = 'none';
        document.getElementById('finalizedLocationContent').style.display = 'block';
        $("#tabs li:eq(2) a").removeClass('disabled');
        $('#tabs li:eq(2) a').attr('data-toggle', 'tab');

    }
    else {
        document.getElementById('finalizedLocationContent').style.display = 'none';
        $("#tabs li:eq(2) a").addClass('disabled');
        $('#tabs li:eq(2) a').removeAttr('data-toggle', 'tab');
    }

    // Show or hide voting for lodging 
    if (lodgingInProgressData[0] == 1) {
        document.getElementById('lodgingInProgressContent').style.display = 'none';
        document.getElementById('finalizedLodgingContent').style.display = 'block';
    }
    else {
        document.getElementById('finalizedLodgingContent').style.display = 'none';
    }

    // Show or hide voting for times 
    if (timeInProgressData[0] == 1) {
        document.getElementById('timeInProgressContent').style.display = 'none';
        document.getElementById('finalizedTimeContent').style.display = 'block';
    }
    else {
        document.getElementById('finalizedTimeContent').style.display = 'none';
    }

    $.ajax({
        url: '/getPeopleInGroup',
        type: 'POST',
        success: function (response) {
            console.log(response);
            cache.save(response, 'peopleData');
        },
        error: function (error) {
            alert("Unable to load group data! Changing group information may not work right now.");

        }
    });

    return true;
};


const CHANNEL_ID = 'tJIuiaaWpfpdOfcV';
var username = getName();
const drone = new ScaleDrone(CHANNEL_ID, {
    data: {
        name: username,
        color: getRandomColor()
    },
});

let members = [];

const DOM = {
    membersCount: document.querySelector('.members-count'),
    membersList: document.querySelector('.members-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form__input'),
    form: document.getElementById('message-form')
};

function getRandomName() {
    const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
    const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
    return (
        adjs[Math.floor(Math.random() * adjs.length)] +
        "_" +
        nouns[Math.floor(Math.random() * nouns.length)]
    );
}

function getName() {
    return $.ajax({
        url: "/getName",
        async: false
    }).responseText;
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

drone.on('open', error => {
    if (error) {
        return console.error(error);
    }
    console.log("Successfully connected to ScaleDrone");

    const room = drone.subscribe('observable-room');
    room.on('open', error => {
        if (error) {
            return console.error(error);
        }
        console.log('Successfully joined room');
    });

    room.on('members', m => {
        members = m;
        updateMembersDOM();
    });

    // User joined room
    room.on('member_join', member => {
        members.push(member);
        updateMembersDOM();
    });

    // User left the room
    room.on('member_leave', ({id}) => {
        const index = members.findIndex(member => member.id === id);
        members.splice(index, 1);
        updateMembersDOM();
    });

    room.on('data', (text, member) => {
        if (member) {
            addMessageToListDOM(text, member);
        }
        else {
            // Message is from server
        }
    });
});

drone.on('close', event => {
    console.log('Connectionn was closed', event);
});

drone.on('error', error => {
    console.error(error);
});


$(function () {
    $('#btnCloseLocationsPoll').click(function () {
        $.ajax({
            url: '/submitLocation',
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=0';
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
                window.location = '/eventDetails?tab=0'
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
                window.location = '/eventDetails?tab=0'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

$(function () {
    $('#btnSubmitTimeVote').click(function () {
        $.ajax({
            url: '/submitTimeVote',
            data: {submit_vote: true, timeID: $("input[name=timeRadio]:checked").val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=1'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

$(function () {
    $('#btnSubmitLodgeVote').click(function () {
        console.log("in click function");
        $.ajax({
            url: '/submitLodgeVote',
            data: {submit_vote: true, lodgeName: $("input[name=lodgingRadio]:checked").val()},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=2'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
    const value = DOM.input.value; // value is message for messages table
    var dt = new Date($.now());
    var timestamp = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2) + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2) + ":" + ("0" + dt.getSeconds()).slice(-2);
    console.log("timestamp: " + timestamp.replace('+', ' '));
    if (value === '') {
        return;
    }
    DOM.input.value = '';
    drone.publish({
        room: 'observable-room',
        message: value,
    });

    console.log("sendMessage() data: " + {timestamp: value});
    $.ajax({
        url: '/sendMessage',
        type: 'POST',
        data: {
            "timestamp": timestamp,
            "message": value,
        },
        success: function (res) {
            console.log("sendMessage success");
            console.log(res);
        },
        error: function (err) {
            console.log("sendMessage failure");
            console.log(err);
        }
    });
}

function createMemberElement(member) {
    const {name, color} = member.clientData;
    console.log(member.clientData);
    const el = document.createElement('div');
    // here is where colon and timestamp can be added i think
    el.appendChild(document.createTextNode(name));
    el.className = 'member';
    el.style.color = color;
    return el;
}

function updateMembersDOM() {
    DOM.membersCount.innerText = `${members.length} users in room:`;
    DOM.membersList.innerHTML = '';
    members.forEach(member =>
        DOM.membersList.appendChild(createMemberElement(member))
    );
}

function createMessageElement(text, member) {
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message';
    return el;
}

function addMessageToListDOM(text, member) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if (wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }
}

function showMessages() {
    var x = document.getElementById("chatbox");
    var y = document.getElementById("chatButton");
    if (x.style.display === "none") {
        //console.log("none -> block");
        x.style.display = "block";
        //y.style.display = "none";
    }
    else {
        //console.log("block -> none");
        x.style.display = "none";
        //y.style.display = "block";
    }
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
                window.location = "/eventDetails?tab=2";
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
            url: '/addTime',
            data: {start: start._d, stop: stop._d},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=1'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

function deleteMembership(id) {
    return $.ajax({
        url: "/deleteMembership",
        data: {id: id},
        type: 'POST',
        success: function (response) {
            console.log(response);
            window.location = '/eventDetails?tab=3'
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(function () {
    $('#btnPeopleSearch').click(function () {
        // $('#search-results').toggle();
        $.ajax({
            url: '/searchpeople2',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                $("#search-results tr").remove();

                cache.save(response, 'searchData');
                for (item in response) {
                    var row = $("<tr>");

                    // Don't ask
                    row.append("<div class='checkbox' style='padding-left: 7px'><td></td><label>" +
                        "<input type='checkbox' id='regular' name='memberAddCheck' value='" + item + "'>"
                        + item + "</label></td></div>");

                    // row.append($("<td>" + item + "</td>"))
                    row.append($("<td>" + response[item][1] + "</td>"));
                    row.append("");
                    $("#search-results tbody").append(row);
                }

                document.getElementById("btnAddPeople").style.display = "inline";

            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(function () {
    $('#btnCloseLodgingPoll').click(function () {
        $.ajax({
            url: '/submitLodging',
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=2';
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(function () {
    $('#btnAddPeople').click(function () {
        selids = [];
        checked = $('#results').find('input[type="checkbox"]:checked')
        for (var i in [...Array(checked.length).keys()]) {
            name = checked[i].value;
            id = cache.load('searchData')[name];
            console.log(id);
            selids.push(parseInt(id))
        }
        $.ajax({
            url: '/addmembership',
            data: JSON.stringify({ids: selids}),
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=3'
            },
            error: function (error) {
                console.log(error);
            }
        });

    });
});

$(function () {
    $('#addNewPerson').click(function () {

        name = $('#newPersonName').val();
        email = $('#newPersonEmail').val();
        number = $('#newPersonPhone').val();

        $.ajax({
            url: '/addperson',
            data: {inputName: name, inputEmail: email, inputNum: number, addToGroup: true},
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=3';
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(function () {
    $('#btnCloseTimePoll').click(function () {
        $.ajax({
            url: '/submitTime',
            type: 'POST',
            success: function (response) {
                console.log(response);
                window.location = '/eventDetails?tab=1';
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

