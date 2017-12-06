const CHANNEL_ID = 'tJIuiaaWpfpdOfcV'
var username = getName();
const drone = new ScaleDrone(CHANNEL_ID, {
    data: {
        name: username,
        color: getRandomColor()
    },
});

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

drone.on('open', error=> {
    if(error) {
        return console.error(error);
    }
    console.log("Successfully connected to ScaleDrone");

    const room = drone.subscribe('observable-room');
    room.on('open', error => {
        if(error) {
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
        if(member) {
            addMessageToListDOM(text, member);
        }
        else {
            // Message is from server
        }
    });
});

window.onload = function() {
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

function createMemberElement(member) {
    const { name, color } = member.clientData;
    console.log(member.clientData);
    const el = document.createElement('div');
    // here is where colon and timestamp can be added i think
    el.appendChild(document.createTextNode(name));
    el.className = 'member';
    el.style.color = color;
    return el;
}
      
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

function addMessageToListDOM(text, member) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if(wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }
}

DOM.form.addEventListener('submit', sendMessage);
function sendMessage() {
    const value = DOM.input.value; // value is message for messages table
    var dt = new Date($.now());
    var timestamp = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2) + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2) + ":" + ("0" + dt.getSeconds()).slice(-2);
    console.log("timestamp: " + timestamp.replace('+', ' '));
    if(value === '') {
        return;
    }
    DOM.input.value = '';
    drone.publish({
        room: 'observable-room',
        message: value,
    });

    console.log("sendMessage() data: "+{timestamp: value});
    $.ajax({
        url: '/sendMessage',
        type: 'POST',
        data: {
            "timestamp": timestamp,
            "message": value,
        },
        success: function(res) {
            console.log("sendMessage success");
            console.log(res);
        },
        error: function(err) {
            console.log("sendMessage failure");
            console.log(err);
        }
    });
}

function showMessages() {
    var x = document.getElementById("chatbox");
    var y = document.getElementById("chatButton");
    if(x.style.display === "none") {
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
                window.location = "/eventDetails";
            },
            error: function (error) {
                console.log(error);
            }
        });
        event.preventDefault();
    });
});
