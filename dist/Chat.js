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
        {popUp ? (
            !showChat ? (
                <div className="joinChatContainer">
                  <h3 className="joinChatHeader">Join a Chat Room</h3>
                  <input
                      type="text"
                      placeholder="Name"
                      onChange={(event) => {
                        setUsername(props.userName);
                        setRoom(props.roomKey);
                      }}
                  />
                  <button onClick={joinRoom}
                          onKeyPress={(event) =>
                          {event.key === "Enter" && joinRoom();}}

                  >Join
                  </button>
                </div>
            ) : (
                <div className="chat-window">
                  <div className="chat-header">
                    <p>
                      <span>Mr. Chat &nbsp;</span>
                    </p>
                    <button
                        onClick={() => setPopUp(false)}
                        className="chatBtn closeBtn"
                    >
                      <img
                          className="invertIcons"
                          alt="close"
                          src="https://mr-hoster.herokuapp.com/images/closeIcon.svg"
                          width="15px"
                      />
                    </button>
                  </div>
                  <div className="chat-body">
                    <ScrollToBottom className="message-container">
                      {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={
                                  username === messageContent.author
                                      ? "sender"
                                      : "receiver"
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
                    <button onClick={sendMessage} class="chatBtn">
                      <img
                          className="invertIcons"
                          alt="send"
                          src="https://mr-hoster.herokuapp.com/images/sendIcon.svg"
                          width="15px"
                      />
                    </button>
                  </div>
                </div>
            )
        ) : (
            <button className="mainBtn chatBtn" onClick={() => setPopUp(true)}>
              <img
                  className="invertIcons"
                  alt="chat"
                  width="40px"
                  src="https://mr-hoster.herokuapp.com/images/chatIcon.svg"
              />
            </button>
        )}
      </>
  );
}
