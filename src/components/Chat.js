import "./Chat.css";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const backend_address = "https://mr-chat-server.herokuapp.com/";

const socket = io.connect(backend_address);

export default function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3 className="header">Join a Chat Room</h3>
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room Key"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && joinRoom();
            }}
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <p>
              <span>Mr. Chat &nbsp;</span>
              <i class="far fa-comments"></i>
            </p>
          </div>
          <div className="chat-body">
            <ScrollToBottom className="message-container">
              {messageList.map((messageContent) => {
                return (
                  <div
                    className="message"
                    id={
                      username === messageContent.author ? "sender" : "receiver"
                    }
                  >
                    <div>
                      <div className="message-content">
                        <p className="">{messageContent.message}</p>
                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>
                          <p id="author">{messageContent.author}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage}
              placeholder="Type a message"
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage} class="btn" type="button">
              <i class="fas fa-paper-plane icons"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
