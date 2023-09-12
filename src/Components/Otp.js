import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
function Otp() {
  let navigate = useNavigate();
  let params = useParams();
  const [Messages, setMessages] = useState("");
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");

  let handleSubmit = async (data) => {
    let f_data = { ...data, mobile: params.id };
    try {
      let request = await axios.post(`${URL}/verification/otp`, f_data);
      if (request) {
        setActiveResponse(true);
      }
      if (request.data.statusCode === 200) {
        window.sessionStorage.setItem("app-token", request.data.token);
        window.sessionStorage.setItem("mobile", params.id);
        setColor("green");
        setMessages(request.data.message);
        setTimeout(() => {
          navigate(`/profile/set`);
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

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object({
      otp: yup
        .number()
        .test(
          "len",
          "Must be a 6 digits number",
          (val) => !val || (val && val.toString().length === 6)
        )
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useEffect(() => {
    if (formik.touched.otp && formik.errors.otp) {
      setActiveResponse(true);
      setMessages(formik.errors.otp);
    }
  }, [formik]);
  return (
    <>
      <div className="form-center-signup">
        <form className="forms" onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label d-flex">
              *One Time Password
            </label>
            <input
              name="otp"
              type="password"
              className="form-control shadow-none"
              id="otp"
              placeholder="x x x x x x"
              onChange={formik.handleChange}
              value={formik.values.otp}
            />
          </div>
          <div className="mb-3">
            <button
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

export default Otp;
