import React, { useRef, useState } from "react";
import UserPage from "./UserPage";
import Nav from "./Nav";
import io from "socket.io-client";
import { URL } from "../App";

function Chat() {
  const [Show, setShow] = useState(false);
  const Author = useRef(null);
  const Room = useRef(null);
  const socket = useRef(io.connect(URL));

  const joinRoom = (room, auth) => {
    Room.current = room;
    Author.current = auth;

    if (Room.current !== null && Author.current !== null) {
      window.localStorage.setItem("author", Author.current);
      socket.current.emit("join_room", Room.current);
      setShow(true);
    }
  };

  return (
    <>
      {!Show ? <Nav /> : null}
      {!Show ? (
        <ul className="list-group" id="Chats">
          <li
            onClick={() => joinRoom("1234", "wikky")}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">Bubbly</h6>
              <small className="text-body-secondary">1 days ago</small>
              <span className="badge bg-primary rounded-pill">14</span>
            </div>
            <p className="mb-1">Some placeholder content in a paragraph.</p>
          </li>
          <li
            onClick={() => joinRoom("1234", "bubbly")}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">Wikky</h6>
              <small className="text-body-secondary">2 days ago</small>
              <span className="badge bg-primary rounded-pill">14</span>
            </div>
            <p className="mb-1">Some placeholder content in a paragraph.</p>
          </li>
          <li
            onClick={() => joinRoom("123", "john")}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">billie</h6>
              <small className="text-body-secondary">2 days ago</small>
              <span className="badge bg-primary rounded-pill">14</span>
            </div>
            <p className="mb-1">Some placeholder content in a paragraph.</p>
          </li>
        </ul>
      ) : (
        <UserPage
          socket={socket.current}
          Room={Room.current}
          Author={Author.current}
          setShow={setShow}
        />
      )}
    </>
  );
}

export default Chat;
