import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({
  socket,
  username,
  room
}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
  return /*#__PURE__*/React.createElement("div", {
    className: "chat-window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", null, "Mr. Chat \xA0"), /*#__PURE__*/React.createElement("i", {
    class: "far fa-comments"
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
    class: "btn",
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    class: "fas fa-paper-plane icons"
  }))));
}

export default Chat;