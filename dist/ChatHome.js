import "./Chat.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
const backend_address = "https://mr-chat-server.herokuapp.com/";
const socket = io.connect(backend_address);
export default function ChatHome() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, !showChat ? /*#__PURE__*/React.createElement("div", {
    className: "joinChatContainer"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "header"
  }, "Join a Chat Room"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Name",
    onChange: event => {
      setUsername(event.target.value);
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Room Key",
    onChange: event => {
      setRoom(event.target.value);
    },
    onKeyPress: event => {
      event.key === "Enter" && joinRoom();
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: joinRoom
  }, "Join")) : /*#__PURE__*/React.createElement(Chat, {
    socket: socket,
    username: username,
    room: room
  }));
}