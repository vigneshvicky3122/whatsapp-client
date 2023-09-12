import React from "react";
import AddNewContact from "./AddNewContact";

function Nav({ isProfile, setProfile, Users, setUsers }) {
  return (
    <>
      <div className="navi-container">
        <div className="navi-main-header">
          <nav className="navbar navbar-expand-lg bg-body-tertiary ">
            <div className="container-fluid">
              <a className="navbar-brand " href="/chats">
                ChatBot
              </a>
              <button
                className="navbar-toggler"
                id="navbar-toggler-btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="/chats">
                      Home
                    </a>
                  </li>
                  <li className="nav-item nav-link">
                    <AddNewContact Users={Users} setUsers={setUsers} />
                  </li>

                  <li
                    className="nav-item nav-link"
                    onClick={() => {
                      setProfile(true);
                      document.querySelector("#navbar-toggler-btn").click();
                    }}
                  >
                    Profile
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        {!isProfile ? (
          <div className="navi-header">
            <ul className="nav nav-fill nav-underline">
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Status
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link" href="/chats">
                  Chats
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link" href="#!">
                  Calls
                </a>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Nav;
