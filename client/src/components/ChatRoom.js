import React, { useContext, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "../styles/ChatRoom.css";
import { AppContext } from "../App";

// Function to format time in AM/PM format
const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export default function ChatRoom() {
  // Accessing context to get shared state and functions
  const {
    name,
    room,
    message,
    setMessage,
    messages,
    setSigned,
    socket,
    usersKeys,
    pack,
    usersList,
  } = useContext(AppContext);

  // State for expanding/collapsing chat room members list
  const [expand, setExpand] = useState(false);

  // Function to handle leaving the chat room
  const handleLeave = () => {
    setSigned(false);
    socket.emit("logout");
  };

  // Function to handle expanding/collapsing chat room members list
  const handleExpand = (e) => {
    e.preventDefault();
    setExpand(!expand);
  };

  // Function to send a chat message
  const sendHandler = (e) => {
    e.preventDefault();
    const plaintext = {
      name,
      time: formatAMPM(new Date()),
      message,
    };
    // Emit a message to the server with encrypted data
    socket.emit("message", pack(plaintext, usersKeys));
    setMessage("");
  };

  return (
    <div className="chat-room">
      <div className="chat-room-container">
        <div className="room-number">
          ROOM {room}
          {expand ? (
            <i className="material-icons expand" onClick={handleExpand}>
              keyboard_arrow_up
            </i>
          ) : (
            <i className="material-icons expand" onClick={handleExpand}>
              keyboard_arrow_down
            </i>
          )}
        </div>
        <div className="chat-container">
          <div className="chat-room-controls">
            <div className="room-members">
              <div className="members-header">Members list</div>
              {/* Display the list of chat room members */}
              {usersList.map((user) => (
                <div key={user} className="room-member">
                  {user}
                </div>
              ))}
            </div>
            {/* Button to logout from the chat room */}
            <div className="leave-room" onClick={handleLeave}>
              <span>Logout</span>
              <i className="material-icons">logout</i>
            </div>
          </div>

          <div className="chat-room-messages">
            <ScrollToBottom className="messages-area">
              {/* Display chat messages */}
              {messages.map(({ m, t, n, e, k }) => (
                <div
                  key={Math.random()}
                  className={n === name ? "message sender" : "message"}
                >
                  <div className="message-meta">
                    <span className="message-sender">{n}</span>
                    <span className="message-time">{t}</span>
                  </div>
                  <div className="message-text">{m}</div>
                  {/* Display encrypted data when expanded */}
                  {expand && (
                    <div className="enc-data">
                      <div>
                        <span>
                          Encrypted message: <br />
                        </span>
                        {e.data}
                      </div>
                      {/* Display AES key and private RSA key*/}
                      <div><span>AES key: <br /></span>{e.aesKey}</div>
                                    <div><span>Private RSA key: <br /></span>{k.replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '')}</div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollToBottom>
            {/* Input area for typing and sending messages */}
            <div className="send-message-area">
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  e.key === "Enter" && sendHandler(e);
                }}
              ></input>
              <button onClick={sendHandler}>
                <span>Send</span>
                <i className="material-icons">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
