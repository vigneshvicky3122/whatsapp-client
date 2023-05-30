import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
function Login() {
  let navigate = useNavigate();
  const [Messages, setMessages] = useState([]);
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");

  let handleSubmit = async (data) => {
    try {
      let request = await axios.post(`${URL}/login`, data);
      setActiveResponse(true);
      if (request.data.statusCode === 200) {
        window.localStorage.setItem("app-token", request.data.token);
        window.localStorage.setItem("username", request.data.users[0].username);
        window.localStorage.setItem("name", request.data.users[0].name);
        let check = request.data.users[0].profilePic;
        if (check === undefined) {
          let profile =
            "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";
          window.localStorage.setItem("profile", profile);
        } else {
          window.localStorage.setItem(
            "profile",
            request.data.users[0].profilePic
          );
        }
        setColor("green");
        setMessages(request.data.message);
        setTimeout(() => {
          navigate("/instagram");
        }, "3000");
      }
      if (request.data.statusCode === 401) {
        setMessages(request.data.message);
      }
      if (request.data.statusCode === 404) {
        setMessages(request.data.message);
        setTimeout(() => {
          navigate("/accounts/emailsignup");
        }, "3000");
      }
      if (request.data.statusCode === 500) {
        console.log(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
    },
    validationSchema: yup.object({
      mobile: yup
        .number()
        .test(
          "len",
          "Enter a valid Mobile Number",
          (val) => val.toString().length === 10
        )

        .required("* Required"),
      otp: yup
        .number()
        .test("len", "Must be 6 digits", (val) => val.toString().length === 6)
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <div className="form-center">
        <form className="forms" onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <h1>Login</h1>
          </div>

          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label d-flex">
              Mobile Number
            </label>
            <input
              name="mobile"
              type="text"
              className="form-control"
              id="mobile"
              aria-describedby="emailHelp"
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className="text-danger">{formik.errors.mobile}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label for="exampleInputotp1" className="form-label d-flex">
              otp
            </label>
            <input
              name="otp"
              type="number"
              className="form-control"
              id="otp"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
            />
            {formik.touched.otp && formik.errors.otp ? (
              <div className="text-danger">{formik.errors.otp}</div>
            ) : null}
          </div>
          {/* <div className="mb-3">
            <a
              href="/reset/password/mobile/verification"
              className="fs-6 d-flex justify-content-end text-secondary text-decoration-none"
            >
              forgot password
            </a>
          </div> */}
          {ActiveResponse ? (
            <div className="mb-3" style={{ color: isColor, fontSize: "1px" }}>
              {Messages}
            </div>
          ) : null}
          <div className="mb-3">
            <button type="submit" className="form-control btn btn-primary">
              Submit
            </button>
          </div>
          <div className="mb-3">
            <a href="/signup" className="text-decoration-none">
              Create New Account
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
