import "./Chat.css";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
const backend_address = "https://mr-chat-server.herokuapp.com/";
const socket = io.connect(backend_address);
export default function Chat(props) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [popUp, setPopUp] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      };
      await socket.emit("send_message", messageData);
      setMessageList(list => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", data => {
      setMessageList(list => [...list, data]);
    });
  }, [socket]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, popUp ? !showChat ? /*#__PURE__*/React.createElement("div", {
    className: "joinChatContainer"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "joinChatHeader"
  }, "Join a Chat Room"), /*#__PURE__*/React.createElement("button", {
    onClick: joinRoom && setUsername(props.userName) && setRoom(props.roomKey),
    onKeyPress: event => {
      event.key === "Enter" && joinRoom();
    }
  }, "Join")) : /*#__PURE__*/React.createElement("div", {
    className: "chat-window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, "Mr. Chat \xA0")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPopUp(false),
    className: "chatBtn closeBtn"
  }, /*#__PURE__*/React.createElement("img", {
    className: "invertIcons",
    alt: "close",
    src: "https://mr-hoster.herokuapp.com/images/closeIcon.svg",
    width: "15px"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat-body"
  }, /*#__PURE__*/React.createElement(ScrollToBottom, {
    className: "message-container"
  }, messageList.map(messageContent => {
    return /*#__PURE__*/React.createElement("div", {
      className: "message",
      id: username === messageContent.author ? "sender" : "receiver"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "message-content"
    }, /*#__PURE__*/React.createElement("p", {
      className: ""
    }, messageContent.message), /*#__PURE__*/React.createElement("div", {
      className: "message-meta"
    }, /*#__PURE__*/React.createElement("p", {
      id: "time"
    }, messageContent.time), /*#__PURE__*/React.createElement("p", {
      id: "author"
    }, messageContent.author)))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat-footer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: currentMessage,
    placeholder: "Type a message",
    onChange: event => {
      setCurrentMessage(event.target.value);
    },
    onKeyPress: event => {
      event.key === "Enter" && sendMessage();
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendMessage,
    class: "chatBtn"
  }, /*#__PURE__*/React.createElement("img", {
    className: "invertIcons",
    alt: "send",
    src: "https://mr-hoster.herokuapp.com/images/sendIcon.svg",
    width: "15px"
  })))) : /*#__PURE__*/React.createElement("button", {
    className: "mainBtn chatBtn",
    onClick: () => setPopUp(true)
  }, /*#__PURE__*/React.createElement("img", {
    className: "invertIcons",
    alt: "chat",
    width: "40px",
    src: "https://mr-hoster.herokuapp.com/images/chatIcon.svg"
  })));
}