const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chats");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

//Join chatroom
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});
//Message from server
socket.on("message", (message) => {
	console.log(message);
	outputMessage(message);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("message-me", (message) => {
	console.log(message);
	outputMessageMe(message);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//submit message
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//Get message text
	const msg = e.target.elements.msg.value;

	//Emit message to server
	socket.emit("chatMessage", msg);

	//Clear input
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    const divMsg = document.createElement("div")
	divMsg.classList.add("chat-messages")
	divMsg.appendChild(div);
	document.querySelector(".chats").appendChild(divMsg);
}

function outputMessageMe(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    const divMsg = document.createElement("div")
	divMsg.classList.add("chat-messages-me")
	divMsg.appendChild(div);
	document.querySelector(".chats").appendChild(divMsg);
}

//Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
      ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
