import React, { useEffect, useState } from "react";

function SearchBar({
  Users,
  Author,
  User,
  joinRoom,
  setSearch,
  setShow,
  Search,
  receiver,
  Chats,
  isProfile,
  setProfile,
}) {
  const [SearchText, setSearchText] = useState("");
  const [SearchItems, setSearchItems] = useState([]);
  const [SearchMessageItems, setSearchMessageItems] = useState([]);
  useEffect(() => {
    if (SearchText === "") {
      setSearchMessageItems([]);
      setSearchItems([]);
    } else {
      setSearchMessageItems(
        Chats &&
          Chats.filter((c) =>
            c.messages.some(
              (x) =>
                !x.isDelete.includes(Author) && x.content.startsWith(SearchText)
            )
          )
      );
      setSearchItems(
        User &&
          User[0].MyContacts.filter(
            (c) =>
              c.name.startsWith(SearchText) &&
              Users.some((f) => f.Mobile === c.mobile)
          )
      );
    }
  }, [SearchText]);

  return (
    <>
      <div className="searchBar-dummy input-group searchBack">
        {Search ? (
          <li
            className="navbar-brand d-flex align-items-center"
            onClick={() => {
              setSearch(false);
              setSearchText("");
            }}
          >
            <img
              src="https://dza205f4gev3o.cloudfront.net/Assets/chevron-pointing-to-the-left.png"
              alt="Logo"
              width="20"
              height="20"
              className="d-inline-block align-text-top"
            />
          </li>
        ) : null}
        {!isProfile ? (
          <input
            type="text"
            id="search-input"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onClick={() => setSearch(true)}
            className="form-control shadow-none searchBar"
            placeholder="Search..."
            value={SearchText}
          />
        ) : null}
      </div>
      <div>
        <ul className="list-group" id="Chats">
          {SearchMessageItems &&
            SearchMessageItems.map((element, index) => {
              return (
                <>
                  <li
                    key={index}
                    onClick={() => {
                      joinRoom(
                        Author,
                        Users &&
                          Users.filter(
                            (c) =>
                              c.Mobile ===
                              element.participants.filter(
                                (x) => x !== Author
                              )[0]
                          ).map((j) => j.Mobile)
                      );
                      receiver.current =
                        Users &&
                        Users.filter(
                          (c) =>
                            c.Mobile ===
                            element.participants.filter((x) => x !== Author)[0]
                        ).map((j) => {
                          return {
                            name: j.Name,
                            mobile: j.Mobile,
                            profile: j.Profile,
                          };
                        })[0];
                      setSearchText("");
                      setSearch(false);
                      setShow(true);
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
                              element.participants.filter(
                                (x) => x !== Author
                              )[0]
                          ).map((j) => j.Profile)
                        }
                        alt="Logo"
                        width="30"
                        height="30"
                        className="list-profile d-inline-block align-text-top"
                      />
                    </div>
                    <div className="list-data-item">
                      <div className="list-data-con">
                        <h6 className="mb-1">
                          {Users &&
                            Users.filter(
                              (c) =>
                                c.Mobile ===
                                element.participants.filter(
                                  (x) => x !== Author
                                )[0]
                            ).map((j) => j.Name)}
                        </h6>
                        <small className="text-body-secondary">
                          1 days ago
                        </small>
                      </div>
                      <div className="list-data-con">
                        <p className="mb-1">
                          {element.messages.length > 0
                            ? element.messages.map((m) => {
                                if (!m.isDelete.includes(Author)) {
                                  return element.messages[
                                    element.messages.length - 1
                                  ].content;
                                }
                              })
                            : null}
                        </p>
                        <span className="badge bg-primary rounded-pill">
                          {element.messages.length > 0
                            ? element.messages.filter(
                                (f) =>
                                  !f.isDelete.includes(Author) &&
                                  f.isRead !== true
                              ).length === 0
                              ? null
                              : element.messages.filter(
                                  (f) =>
                                    !f.isDelete.includes(Author.current) &&
                                    f.isRead !== true
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

        <ul className="list-group" id="Chats">
          {SearchItems &&
            SearchItems.map((element, index) => {
              return (
                <>
                  <li
                    key={index}
                    onClick={() => {
                      joinRoom(Author, element.mobile);
                      receiver.current = {
                        name: element.name,
                        mobile: element.mobile,
                        profile: Users.filter(
                          (x) => x.Mobile === element.mobile
                        )[0].Profile,
                      };
                      setSearchText("");
                      setSearch(false);
                      setShow(true);
                    }}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="list-profile-con">
                      <img
                        src={
                          Users.filter((x) => x.Mobile === element.mobile)[0]
                            .Profile
                        }
                        alt="Logo"
                        width="30"
                        height="30"
                        className="list-profile d-inline-block align-text-top"
                      />
                    </div>
                    <div className="list-data-item">
                      <div className="list-data-con">
                        <h6 className="mb-1">{element.name}</h6>
                        <img
                          src="https://dza205f4gev3o.cloudfront.net/Assets/info.png"
                          alt="Logo"
                          width="30"
                          height="30"
                          className=" d-inline-block align-text-top"
                        />
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
        </ul>
      </div>
    </>
  );
}

export default SearchBar;
