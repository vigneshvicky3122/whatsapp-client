import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
function Signup() {
  let navigate = useNavigate();
  const [Messages, setMessages] = useState([]);
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");

  let handleSubmit = async (data) => {
    try {
      let request = await axios.post(`${URL}/signup`, data);
      setActiveResponse(true);
      if (request.data.statusCode === 200) {
        setColor("green");
        setMessages(request.data.message);
        setTimeout(() => {
          navigate("/login");
        }, "3000");
      }
      if (request.data.statusCode === 401) {
        setMessages(request.data.message);
        setTimeout(() => {
          navigate("/login");
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
      name: "",
      mobile: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("* Required"),
      mobile: yup
        .number()
        .min(10, "Enter a valid detail")
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <div className="form-center-signup">
        <form className="forms" onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <h1>Register</h1>
          </div>

          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label d-flex">
              Name
            </label>
            <input
              name="name"
              type="text"
              className="form-control"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
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
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className="text-danger">{formik.errors.mobile}</div>
            ) : null}
          </div>

          {ActiveResponse ? (
            <div className="mb-3" style={{ color: isColor }}>
              {Messages}
            </div>
          ) : null}
          <div className="mb-3">
            <button type="submit" className="form-control btn btn-primary">
              Submit
            </button>
          </div>
          <div className="mb-3">
            <label className="text-white">Have an Account?</label>
            <a href="/login" className="text-decoration-none">
              {" "}
              Login
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
