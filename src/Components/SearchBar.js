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
  isProfile,
  Chats,
  setChats,
}) {
  const [SearchText, setSearchText] = useState("");
  const [SearchItems, setSearchItems] = useState([]);

  useEffect(() => {
    if (SearchText === "") {
      setSearchItems([]);
    } else {
      setSearchItems(
        User &&
          User[0].MyContacts.filter(
            (c) =>
              c.name.toLowerCase().startsWith(SearchText.toLowerCase()) &&
              Users.some((f) => f.Mobile === c.mobile)
          )
      );
    }
  }, [SearchText]);
  async function CheckInRoom(author, receiver) {
    let check =
      Chats &&
      Chats.some((s) =>
        s.participants.includes(parseInt(author) && parseInt(receiver))
      );

    if (check) {
      await joinRoom(author, receiver);
    } else {
      let update = [...Chats];
      update.push({
        participants: [parseInt(author), parseInt(receiver)],
        createdAt: new Date(),
        messages: [],
      });
      setChats(update);
      await joinRoom(author, receiver);
    }
  }
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
          {SearchItems &&
            SearchItems.map((element, index) => {
              return (
                <>
                  <li
                    key={index}
                    onClick={() => {
                      CheckInRoom(Author, element.mobile);
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
