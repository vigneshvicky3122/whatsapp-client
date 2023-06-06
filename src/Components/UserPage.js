import React, { useEffect, useRef, useState } from "react";
import { EmojiButton } from "@joeattardi/emoji-button";

function UserPage({ socket, Author, setShow, receiver, Chats }) {
  const picker = new EmojiButton();
  picker.on("emoji", (selection) => {
    setCurrentMessage(CurrentMessage + selection.emoji);
  });
  const [CurrentMessage, setCurrentMessage] = useState("");
  const [MessageList, setMessageList] = useState(
    Chats &&
      Chats.filter((x) =>
        x.participants.includes(Author && parseInt(receiver.current.mobile))
      )[0].messages
      ? Chats.filter((x) =>
          x.participants.includes(Author && parseInt(receiver.current.mobile))
        )[0].messages
      : []
  );

  const [disabled, setDisabled] = useState(true);
  const messagesEndRef = useRef(null);
  const MessageId = useRef({ id: null });
  const MessageIndex = useRef({ index: null });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [MessageList]);

  useEffect(() => {
    if (CurrentMessage !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [CurrentMessage]);

  const SendMessage = async () => {
    let messageData = {
      content: CurrentMessage,
      message_id: Date.now(),
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      sender: Author,
      isRead: false,
      isDelete: [],
    };
    if (CurrentMessage !== "") {
      await socket.emit("send_message", {
        messageData,
        receiver: receiver.current.mobile,
      });

      setMessageList([...MessageList, messageData]);
      setCurrentMessage("");
    }
  };
  const deleteForMe = async () => {
    let list = [...MessageList];
    list[MessageIndex.current.index].isDelete.push(Author);
    setMessageList(list);
    document.getElementById(MessageId.current.id).click();
    await socket.emit("delete-for-me", {
      message_id: MessageId.current.id,
      author: Author,
      receiver: receiver.current.mobile,
    });
  };

  useEffect(() => {
    socket.on("receive_message", (Data) => {
      setMessageList([...MessageList, Data]);
    });
  }, [socket, MessageList]);

  return (
    <>
      <div className="userPage-container">
        <div className="userPage-navBar-container">
          <nav className="navbar bg-primary bg-gradient">
            <div className="container-fluid">
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
                  src={receiver.current.profile}
                  alt="Logo"
                  width="30"
                  height="30"
                  className="list-profile d-inline-block align-text-top"
                />
                &nbsp; {receiver.current.name}
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
            </div>
          </nav>
        </div>
        <div className="container">
          {MessageList &&
            MessageList.map((message, index) => {
              return (
                <>
                  {!message.isDelete.includes(Author) ? (
                    <div
                      className={
                        Author === message.sender
                          ? "list-group-right"
                          : "list-group-left"
                      }
                      ref={messagesEndRef}
                      key={index}
                    >
                      <p
                        className={
                          Author === message.sender
                            ? "list-group-item-right"
                            : "list-group-item-left"
                        }
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                        id={message.message_id}
                        onClick={() => {
                          MessageId.current.id = message.message_id;
                          MessageIndex.current.index = index;
                        }}
                      >
                        {message.content}
                        {Author === message.sender ? (
                          <span
                            className={
                              message.isRead === false
                                ? "double-ticks"
                                : "double-blue-ticks"
                            }
                          >
                            {message.isRead === false ? (
                              <>&#10003;</>
                            ) : (
                              <>&#10003;&#10003;</>
                            )}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ) : null}
                </>
              );
            })}
          <div class="msg-opt-list-con collapse" id="collapseExample">
            <div class="list-group">
              <button
                id="msg-opt-list"
                type="button"
                class="list-group-item list-group-item-action"
                aria-current="true"
                onClick={() => deleteForMe()}
              >
                Delete for Me
              </button>
            </div>
          </div>
        </div>

        <div className="userPage-text-container">
          <div className="input-group mb-2">
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
            {window.screen.width > 425 ? (
              <button
                className="btn btn-light"
                type="button"
                id="button-emoji"
                onClick={() => picker.togglePicker()}
              >
                <img
                  src="https://dza205f4gev3o.cloudfront.net/Assets/emoji.png"
                  alt="Logo"
                  width="20"
                  height="20"
                />
              </button>
            ) : null}
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
      </div>
    </>
  );
}

export default UserPage;
