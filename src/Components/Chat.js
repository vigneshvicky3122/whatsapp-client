import React, { useEffect, useRef, useState } from "react";
import UserPage from "./UserPage";
import Nav from "./Nav";
import SearchBar from "./SearchBar";
import io from "socket.io-client";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile";

function Chat() {
  let navigate = useNavigate();
  const [Users, setUsers] = useState([]);
  const [Chats, setChats] = useState([]);
  const [User, setUser] = useState([]);
  const [Show, setShow] = useState(false);
  const [Search, setSearch] = useState(false);
  const [isProfile, setProfile] = useState(false);
  const Author = useRef(parseInt(window.localStorage.getItem("mobile")));
  const receiver = useRef({
    name: "",
    mobile: "",
    profile: "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
  });
  const socket = useRef(io.connect(URL));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let req = await axios.get(`${URL}/users`, {
        headers: {
          Authorization: window.localStorage.getItem("app-token"),
          mobile: Author.current,
        },
      });
      if (req.data.statusCode === 200) {
        setUsers(req.data.users);
        setChats(req.data.chats);
        setUser(req.data.user);
      }
      if (req.data.statusCode === 400) {
        navigate("/signup");
      }
      if (req.data.statusCode === 500) {
        console.log(req.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = async (author, receiver) => {
    await socket.current.emit("join_room", { author, receiver });
    setShow(true);
  };

  return (
    <>
      <div className={"main-wrapper"}>
        {!Show && window.screen.width <= 425 ? (
          <div className="main-1">
            <Nav
              isProfile={isProfile}
              setProfile={setProfile}
              User={User}
              setUser={setUser}
            />
            {isProfile ? (
              <Profile
                User={User}
                setSearch={setSearch}
                setShow={setShow}
                setProfile={setProfile}
              />
            ) : null}
            <SearchBar
              Users={Users}
              Chats={Chats}
              setChats={setChats}
              Author={Author.current}
              joinRoom={joinRoom}
              setSearch={setSearch}
              setShow={setShow}
              Search={Search}
              User={User}
              isProfile={isProfile}
              receiver={receiver}
            />

            <div className="list-group-chats">
              {!Search && !isProfile ? (
                <ul className="list-group" id="Chats">
                  {Chats &&
                    Chats.map((Data, index) => {
                      return (
                        <>
                          {Data.messages ? (
                            <li
                              key={index}
                              onClick={() => {
                                joinRoom(
                                  Author.current,
                                  Data.participants.filter(
                                    (x) => x !== Author.current
                                  )[0]
                                );

                                receiver.current =
                                  Users &&
                                  Users.filter(
                                    (c) =>
                                      c.Mobile ===
                                      Data.participants.filter(
                                        (x) => x !== Author.current
                                      )[0]
                                  ).length > 0
                                    ? Users &&
                                      Users.filter(
                                        (c) =>
                                          c.Mobile ===
                                          Data.participants.filter(
                                            (x) => x !== Author.current
                                          )[0]
                                      ).map((j) => {
                                        return {
                                          name:
                                            User &&
                                            User.map((n) =>
                                              n.MyContacts.filter(
                                                (m) => m.mobile === j.Mobile
                                              ).length > 0
                                                ? n.MyContacts.filter(
                                                    (m) => m.mobile === j.Mobile
                                                  )[0].name
                                                : Data.participants.filter(
                                                    (x) => x !== Author.current
                                                  )[0]
                                            )[0],
                                          mobile: Data.participants.filter(
                                            (x) => x !== Author.current
                                          )[0],
                                          profile:
                                            Users &&
                                            Users.filter(
                                              (c) =>
                                                c.Mobile ===
                                                Data.participants.filter(
                                                  (x) => x !== Author.current
                                                )[0]
                                            ).length > 0
                                              ? Users &&
                                                Users.filter(
                                                  (c) =>
                                                    c.Mobile ===
                                                    Data.participants.filter(
                                                      (x) =>
                                                        x !== Author.current
                                                    )[0]
                                                ).map((j) => j.Profile)[0]
                                              : "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
                                        };
                                      })[0]
                                    : {
                                        name:
                                          User &&
                                          User.map((n) =>
                                            n.MyContacts.filter(
                                              (m) =>
                                                m.mobile ===
                                                Data.participants.filter(
                                                  (x) => x !== Author.current
                                                )[0]
                                            ).length > 0
                                              ? n.MyContacts.filter(
                                                  (m) =>
                                                    m.mobile ===
                                                    Data.participants.filter(
                                                      (x) =>
                                                        x !== Author.current
                                                    )[0]
                                                )[0].name
                                              : Data.participants.filter(
                                                  (x) => x !== Author.current
                                                )[0]
                                          )[0],
                                        mobile: Data.participants.filter(
                                          (x) => x !== Author.current
                                        )[0],
                                        profile:
                                          "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
                                      };
                              }}
                              className="list-group-item list-group-item-action"
                            >
                              <div className="list-profile-con">
                                <img
                                  src={
                                    Users &&
                                    Users.filter(
                                      (c) =>
                                        c.Mobile ===
                                        Data.participants.filter(
                                          (x) => x !== Author.current
                                        )[0]
                                    ).length > 0
                                      ? Users &&
                                        Users.filter(
                                          (c) =>
                                            c.Mobile ===
                                            Data.participants.filter(
                                              (x) => x !== Author.current
                                            )[0]
                                        ).map((j) => j.Profile)
                                      : "https://dza205f4gev3o.cloudfront.net/Assets/download.png"
                                  }
                                  alt="profile"
                                  width="30"
                                  height="30"
                                  className="list-profile d-inline-block align-text-top"
                                />
                              </div>
                              <div className="list-data-item">
                                <div className="list-data-con">
                                  <h6 className="mb-1">
                                    {User &&
                                      User.map((n) => {
                                        return n.MyContacts.filter(
                                          (m) =>
                                            m.mobile ===
                                            Data.participants.filter(
                                              (x) => x !== Author.current
                                            )[0]
                                        ).length > 0
                                          ? n.MyContacts.filter(
                                              (m) =>
                                                m.mobile ===
                                                Data.participants.filter(
                                                  (x) => x !== Author.current
                                                )[0]
                                            )[0].name
                                          : Data.participants.filter(
                                              (x) => x !== Author.current
                                            )[0];
                                      })}
                                  </h6>
                                  <small className="text-body-secondary">
                                    1 days ago
                                  </small>
                                </div>
                                <div className="list-data-con">
                                  <p className="mb-1">
                                    {Data.messages && Data.messages.length > 0
                                      ? Data.messages.filter(
                                          (f) =>
                                            !f.isDelete.includes(
                                              Author.current
                                            ) && f.isRead !== true
                                        )[
                                          Data.messages.filter(
                                            (f) =>
                                              !f.isDelete.includes(
                                                Author.current
                                              ) && f.isRead !== true
                                          ).length - 1
                                        ].content
                                      : null}
                                  </p>
                                  <span className="badge bg-primary rounded-pill">
                                    {Data.messages.length > 0
                                      ? Data.messages.filter(
                                          (f) =>
                                            !f.isDelete.includes(
                                              Author.current
                                            ) && f.isRead !== true
                                        ).length === 0
                                        ? null
                                        : Data.messages.filter(
                                            (f) =>
                                              !f.isDelete.includes(
                                                Author.current
                                              ) && f.isRead !== true
                                          ).length
                                      : null}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ) : null}
                        </>
                      );
                    })}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}
        {window.screen.width > 425 ? (
          <div className="main-1">
            <Nav
              isProfile={isProfile}
              setProfile={setProfile}
              User={User}
              setUser={setUser}
            />
            {isProfile ? (
              <Profile
                User={User}
                setSearch={setSearch}
                setShow={setShow}
                setProfile={setProfile}
              />
            ) : null}
            <SearchBar
              Users={Users}
              Chats={Chats}
              setChats={setChats}
              Author={Author.current}
              joinRoom={joinRoom}
              setSearch={setSearch}
              setShow={setShow}
              Search={Search}
              User={User}
              receiver={receiver}
              isProfile={isProfile}
            />

            <div className="list-group-chats">
              {!Search && !isProfile ? (
                <ul className="list-group" id="Chats">
                  {Chats &&
                    Chats.map((Data, index) => {
                      return (
                        <>
                          <li
                            key={index}
                            onClick={() => {
                              joinRoom(
                                Author.current,
                                Data.participants.filter(
                                  (x) => x !== Author.current
                                )[0]
                              );

                              receiver.current =
                                Users &&
                                Users.filter(
                                  (c) =>
                                    c.Mobile ===
                                    Data.participants.filter(
                                      (x) => x !== Author.current
                                    )[0]
                                ).length > 0
                                  ? Users &&
                                    Users.filter(
                                      (c) =>
                                        c.Mobile ===
                                        Data.participants.filter(
                                          (x) => x !== Author.current
                                        )[0]
                                    ).map((j) => {
                                      return {
                                        name:
                                          User &&
                                          User.map((n) =>
                                            n.MyContacts.filter(
                                              (m) => m.mobile === j.Mobile
                                            ).length > 0
                                              ? n.MyContacts.filter(
                                                  (m) => m.mobile === j.Mobile
                                                )[0].name
                                              : Data.participants.filter(
                                                  (x) => x !== Author.current
                                                )[0]
                                          )[0],
                                        mobile: Data.participants.filter(
                                          (x) => x !== Author.current
                                        )[0],
                                        profile:
                                          Users &&
                                          Users.filter(
                                            (c) =>
                                              c.Mobile ===
                                              Data.participants.filter(
                                                (x) => x !== Author.current
                                              )[0]
                                          ).length > 0
                                            ? Users &&
                                              Users.filter(
                                                (c) =>
                                                  c.Mobile ===
                                                  Data.participants.filter(
                                                    (x) => x !== Author.current
                                                  )[0]
                                              ).map((j) => j.Profile)[0]
                                            : "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
                                      };
                                    })[0]
                                  : {
                                      name:
                                        User &&
                                        User.map((n) =>
                                          n.MyContacts.filter(
                                            (m) =>
                                              m.mobile ===
                                              Data.participants.filter(
                                                (x) => x !== Author.current
                                              )[0]
                                          ).length > 0
                                            ? n.MyContacts.filter(
                                                (m) =>
                                                  m.mobile ===
                                                  Data.participants.filter(
                                                    (x) => x !== Author.current
                                                  )[0]
                                              )[0].name
                                            : Data.participants.filter(
                                                (x) => x !== Author.current
                                              )[0]
                                        )[0],
                                      mobile: Data.participants.filter(
                                        (x) => x !== Author.current
                                      )[0],
                                      profile:
                                        "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
                                    };
                            }}
                            className="list-group-item list-group-item-action"
                          >
                            <div className="list-profile-con">
                              <img
                                src={
                                  Users &&
                                  Users.filter(
                                    (c) =>
                                      c.Mobile ===
                                      Data.participants.filter(
                                        (x) => x !== Author.current
                                      )[0]
                                  ).length > 0
                                    ? Users &&
                                      Users.filter(
                                        (c) =>
                                          c.Mobile ===
                                          Data.participants.filter(
                                            (x) => x !== Author.current
                                          )[0]
                                      ).map((j) => j.Profile)
                                    : "https://dza205f4gev3o.cloudfront.net/Assets/download.png"
                                }
                                alt="profile"
                                width="30"
                                height="30"
                                className="list-profile d-inline-block align-text-top"
                              />
                            </div>
                            <div className="list-data-item">
                              <div className="list-data-con">
                                <h6 className="mb-1">
                                  {User &&
                                    User.map((n) => {
                                      return n.MyContacts.filter(
                                        (m) =>
                                          m.mobile ===
                                          Data.participants.filter(
                                            (x) => x !== Author.current
                                          )[0]
                                      ).length > 0
                                        ? n.MyContacts.filter(
                                            (m) =>
                                              m.mobile ===
                                              Data.participants.filter(
                                                (x) => x !== Author.current
                                              )[0]
                                          )[0].name
                                        : Data.participants.filter(
                                            (x) => x !== Author.current
                                          )[0];
                                    })}
                                </h6>
                                <small className="text-body-secondary">
                                  1 days ago
                                </small>
                              </div>
                              <div className="list-data-con">
                                <p className="mb-1">
                                  {Data.messages && Data.messages.length > 0
                                    ? Data.messages.filter(
                                        (f) =>
                                          !f.isDelete.includes(
                                            Author.current
                                          ) && f.isRead !== true
                                      )[
                                        Data.messages.filter(
                                          (f) =>
                                            !f.isDelete.includes(
                                              Author.current
                                            ) && f.isRead !== true
                                        ).length - 1
                                      ].content
                                    : null}
                                </p>
                                <span className="badge bg-primary rounded-pill">
                                  {Data.messages.length > 0
                                    ? Data.messages.filter(
                                        (f) =>
                                          !f.isDelete.includes(
                                            Author.current
                                          ) && f.isRead !== true
                                      ).length === 0
                                      ? null
                                      : Data.messages.filter(
                                          (f) =>
                                            !f.isDelete.includes(
                                              Author.current
                                            ) && f.isRead !== true
                                        ).length
                                    : null}
                                </span>
                              </div>
                            </div>
                          </li>
                        </>
                      );
                    })}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}

        {Show ? (
          <div className="main-2">
            <UserPage
              socket={socket.current}
              Author={Author.current}
              setShow={setShow}
              receiver={receiver}
              Chats={Chats}
              setChats={setChats}
              Users={Users}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Chat;
