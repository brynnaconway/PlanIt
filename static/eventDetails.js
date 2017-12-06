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
