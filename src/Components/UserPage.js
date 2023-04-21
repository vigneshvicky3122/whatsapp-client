import React, { useEffect, useRef, useState } from "react";

function UserPage({ socket, Room, Author, setShow }) {
  const [CurrentMessage, setCurrentMessage] = useState("");
  const [MessageList, setMessageList] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [MessageList]);

  useEffect(() => {
    if (CurrentMessage !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [CurrentMessage]);

  const SendMessage = () => {
    if (CurrentMessage !== "") {
      let messageData = {
        room: Room,
        author: Author,
        message: CurrentMessage,
        message_id: Date.now(),
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_message", messageData);
      setMessageList([...MessageList, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...MessageList, data]);
    });
  }, [socket, MessageList]);

  return (
    <>
      <nav className="navbar bg-primary bg-gradient">
        <div className="container-fluid ">
          <li
            className="navbar-brand d-flex align-items-center"
            onClick={() => setShow(false)}
          >
            <img
              src="https://dza205f4gev3o.cloudfront.net/Assets/chevron-pointing-to-the-left.png"
              alt="Logo"
              width="20"
              height="20"
              className="d-inline-block align-text-top"
            />
          </li>
          <a className="navbar-brand align-items-center" href="#">
            <img
              src="https://dza205f4gev3o.cloudfront.net/profile.png"
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-text-top"
            />
            &nbsp; Wikky
          </a>

          <a className="navbar-brand" href="#">
            <img
              src="https://dza205f4gev3o.cloudfront.net/phone-call.png"
              alt="Logo"
              width="20"
              height="20"
              className="d-inline-block align-text-top"
            />
          </a>
          <a className="navbar-brand" href="#">
            <img
              src="https://dza205f4gev3o.cloudfront.net/camcorder.png"
              alt="Logo"
              width="20"
              height="20"
              className="d-inline-block align-text-top"
            />
          </a>
          <a className="navbar-brand" href="#">
            <img
              src="https://dza205f4gev3o.cloudfront.net/more.png"
              alt="Logo"
              width="20"
              height="20"
              className="d-inline-block align-text-top"
            />
          </a>
        </div>
      </nav>
      <div className="container">
        {MessageList &&
          MessageList.map((message, index) => {
            return (
              <>
                <div
                  className={
                    Author === message.author
                      ? "list-group-right"
                      : "list-group-left"
                  }
                  ref={messagesEndRef}
                >
                  <p
                    className={
                      Author === message.author
                        ? "list-group-item-right"
                        : "list-group-item-left"
                    }
                    id={message.id}
                    key={index}
                  >
                    {message.message}
                  </p>
                </div>
              </>
            );
          })}
      </div>

      <nav className="navbar fixed-bottom bg-body-tertiary">
        <div className="container-fluid">
          <div className="input-group mb-1 ">
            <input
              type="text"
              className="form-control shadow-none rounded-4"
              placeholder="Write your message..."
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              onChange={(e) => {
                setCurrentMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (CurrentMessage !== "") {
                  if (e.key === "Enter") {
                    SendMessage();
                  }
                }
              }}
              value={CurrentMessage}
            />
            <button
              className="btn btn-light"
              type="button"
              id="button-addon1"
              disabled={disabled}
              onClick={SendMessage}
            >
              <img
                src="https://dza205f4gev3o.cloudfront.net/Assets/send-message.png"
                alt="Logo"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default UserPage;
