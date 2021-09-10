const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL --?
const {username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});


const socket = io();

//Join chatroom
socket.emit("joinRoom",{username,room});

//Get room and users
socket.on("roomUsers", ({room,users})=>{
  outputUsers(users)
})

//Message from server
socket.on("message", message=>{
  console.log(message);
  outputMessage(message); //erevum e ekranin(chati mej)


  //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight; //sms in down
})

//Message submit
chatForm.addEventListener("submit", (e)=>{
  e.preventDefault();

//Get message text
  const msg = e.target.elements.msg.value; //stanum enq mer usarkac message@ erb semum enq chat.htmul grac Send button-@, ayisnqn message-i value

  //Emit message to server
  socket.emit("chatMessage", msg) //Emit enq anum mer stacat msg-n

  //Clean input message
  e.target.elements.msg.value = ""; 
  e.target.elements.msg.focus(); //focus- method, click-i tartvel@
})

//Output message to DOM
function outputMessage(message){
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class ="meta>${message.username}<span>${message.time}</span></p>
  <p class="test">
  ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});