import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";

function SetProfile() {
  let navigate = useNavigate();

  const [Messages, setMessages] = useState("");
  const [Profile, setProfile] = useState(
    "https://dza205f4gev3o.cloudfront.net/Assets/camera (1).png"
  );
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");
  const [Name, setName] = useState("");
  const [Disabled, setDisabled] = useState(true);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      let req = await axios.get(`${URL}/user`, {
        headers: {
          Authorization: window.sessionStorage.getItem("app-token"),
          mobile: window.sessionStorage.getItem("mobile"),
        },
      });
      if (req.data.statusCode === 200) {
        if (req.data.user[0].Profile === null) {
          setProfile(
            "https://dza205f4gev3o.cloudfront.net/Assets/camera (1).png"
          );
        } else {
          setProfile(req.data.user[0].Profile);
        }
        if (req.data.user[0].Name === null) {
          setName("");
        } else {
          setName(req.data.user[0].Name);
        }
      }
      if (req.data.statusCode === 500) {
        console.log(req.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    let f_data;
    if (
      Profile === "https://dza205f4gev3o.cloudfront.net/Assets/camera (1).png"
    ) {
      f_data = {
        name: Name,
        profile: "https://dza205f4gev3o.cloudfront.net/Assets/download.png",
        mobile: window.sessionStorage.getItem("mobile"),
      };
    } else {
      f_data = {
        name: Name,
        profile: Profile,
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
        setMessages(request.data.message);
        setTimeout(() => {
          navigate("/chats");
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

  useEffect(() => {
    if (Messages === "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [Messages]);
  useEffect(() => {
    if (Name.length < 3 || Name.length > 15) {
      setActiveResponse(true);
      setMessages("Must be 3 to 15 Characters");
    } else {
      setActiveResponse(false);
      setMessages("");
    }
    if (Name.length === 0 && Name === "") {
      setActiveResponse(true);
      setMessages("* Required");
    }
  }, [Name]);
  return (
    <>
      <div className="form-center-signup">
        <form className="forms" onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <img
              src={Profile}
              alt="profile"
              onClick={() => {
                document.querySelector("#profile").click();
              }}
              className="profile_pic"
            />
            <input
              name="profile"
              type="file"
              accept="image/*"
              className="form-control shadow-none display-none"
              id="profile"
              onChange={(e) => {
                let file = e.target.files[0];
                let readDataUrl = new FileReader();
                readDataUrl.addEventListener("load", (event) => {
                  setProfile(event.target.result);
                });
                readDataUrl.readAsDataURL(file);
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label d-flex">
              Enter Your Name
            </label>
            <input
              name="name"
              type="text"
              className="form-control shadow-none"
              id="name"
              placeholder="ie. John Doe"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
          </div>
          <div className="mb-3">
            <button
              disabled={Disabled}
              type="submit"
              className="form-control btn btn-outline-success"
            >
              Next
            </button>
          </div>
        </form>
        {ActiveResponse ? (
          <div className="pop-up-message mb-3" style={{ color: isColor }}>
            {Messages}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SetProfile;
