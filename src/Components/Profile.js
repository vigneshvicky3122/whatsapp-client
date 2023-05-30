import React, { useState } from "react";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
import FileSaver from "file-saver";

function Profile({ User, setProfile, setSearch, setShow }) {
  let navigate = useNavigate();
  let params = { id: "8304873122" };
  const [Disable, setDisable] = useState(true);
  const [OptionList, setOptionList] = useState(false);
  const [Messages, setMessages] = useState("");
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");
  const [Name, setName] = useState(User[0].Name);
  const [Mobile, setMobile] = useState(User[0].Mobile);
  const [ProfileImg, setProfileImg] = useState(User[0].Profile);

  const handleSubmit = async () => {
    let f_data;
    if (ProfileImg === User[0].Profile) {
      f_data = {
        name: Name,
        profile: User[0].Profile,
        mobile: window.sessionStorage.getItem("mobile"),
      };
    } else {
      f_data = {
        name: Name,
        profile: ProfileImg,
        mobile: window.sessionStorage.getItem("mobile"),
      };
    }
    try {
      let request = await axios.post(`${URL}/profile/set`, f_data);
      if (request) {
        setActiveResponse(true);
      }
      if (request.data.statusCode === 200) {
        setColor("green");
        setMessages("Profile updated successfully");
        setTimeout(() => {
          setDisable(true);
          setOptionList(false);
          setActiveResponse(false);
        }, "3000");
      }
      if (request.data.statusCode === 400) {
        setMessages(request.data.message);
      }
      if (request.data.statusCode === 500) {
        console.log(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const DownloadFile = (Url) => {
    FileSaver.saveAs(Url, `${params.id}'s profile`);
  };
  return (
    <>
      <div className="profile-container">
        <li
          className="navbar-brand d-flex align-items-center"
          onClick={() => {
            setProfile(false);
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

        <div class="input-group mb-4">
          <div class="form-floating d-flex justify-content-center align-items-center">
            <input
              name="profile"
              type="file"
              accept="image/*"
              className="form-control shadow-none display-none"
              id="profile-pic"
              disabled={Disable}
              onChange={(e) => {
                let file = e.target.files[0];
                let readDataUrl = new FileReader();
                readDataUrl.addEventListener("load", (event) => {
                  setProfileImg(event.target.result);
                });
                readDataUrl.readAsDataURL(file);
              }}
            />
            <img
              class="profile-img"
              src={ProfileImg}
              alt="profile picture"
              onClick={() => {
                if (!Disable) {
                  setOptionList(true);
                }
              }}
            />
            &nbsp;
            {OptionList ? (
              <div class="list-group">
                <button
                  type="button"
                  class="list-group-item list-group-item-action "
                  aria-current="true"
                  onClick={() => {
                    document.getElementById("profile-pic")?.requestFullscreen();
                  }}
                >
                  View
                </button>
                <button
                  type="button"
                  class="list-group-item list-group-item-action"
                  onClick={() => document.querySelector("#profile-pic").click()}
                >
                  Add New
                </button>
                <button
                  type="button"
                  class="list-group-item list-group-item-action"
                  onClick={() =>
                    setProfileImg(
                      "https://dza205f4gev3o.cloudfront.net/Assets/download.png"
                    )
                  }
                >
                  Remove
                </button>
                <button
                  type="button"
                  class="list-group-item list-group-item-action"
                  onClick={() => DownloadFile(ProfileImg)}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div class="input-group ">
          <div class="form-floating">
            <input
              type="text"
              class="form-control shadow-none"
              id="floatingInputGroup1"
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              value={Name}
              disabled={Disable}
            />
            <label for="floatingInputGroup1">Name</label>
          </div>
        </div>
        <div class="input-group mb-3 ">
          <div class="form-floating ">
            <input
              type="text"
              class="form-control shadow-none"
              id="floatingInputGroup1"
              placeholder="Username"
              onChange={(e) => setMobile(e.target.value)}
              value={Mobile}
              disabled={true}
            />
            <label for="floatingInputGroup1">Mobile Number</label>
          </div>
        </div>

        {ActiveResponse ? (
          <div className="pop-up-message mb-3" style={{ color: isColor }}>
            {Messages}
          </div>
        ) : null}
        <div class="input-group ">
          <div class="form-floating d-flex justify-content-center">
            {Disable ? (
              <button
                type="button"
                class="btn btn-secondary"
                onClick={() => setDisable(false)}
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-secondary"
                onClick={() => {
                  setDisable(true);
                  setOptionList(false);
                }}
              >
                Cancel
              </button>
            )}
            &nbsp; &nbsp;
            {Disable ? (
              <button
                type="button"
                class="btn btn-outline-warning"
                onClick={() => {
                  window.sessionStorage.clear();
                  navigate("/signup");
                }}
              >
                Logout &rarr;
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => handleSubmit()}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
