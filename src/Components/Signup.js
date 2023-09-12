import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
function Signup() {
  let navigate = useNavigate();
  const [Messages, setMessages] = useState("");
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");

  let handleSubmit = async (data) => {
    try {
      let request = await axios.post(`${URL}/signup`, data);
      if (request) {
        setActiveResponse(true);
      }
      if (request.data.statusCode === 201) {
        setColor("green");
        setMessages(request.data.message);
        setTimeout(() => {
          navigate(`/verification/otp/${data.mobile}`);
        }, "3000");
      }
      if (request.data.statusCode === 404) {
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
      mobile: "",
    },
    validationSchema: yup.object({
      mobile: yup
        .number()
        .test(
          "len",
          "Enter a valid Mobile Number",
          (val) => !val || (val && val.toString().length === 10)
        )
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useEffect(() => {
    if (formik.touched.mobile && formik.errors.mobile) {
      setActiveResponse(true);
      setMessages(formik.errors.mobile);
    }
  }, [formik]);
  return (
    <>
      <div className="form-center-signup">
        <form className="forms" onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label d-flex">
              *Enter Your Mobile Number
            </label>
            <input
              name="mobile"
              type="number"
              className="form-control shadow-none"
              id="mobile"
              placeholder="ie. 830XXXX122"
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="form-control btn btn-outline-success"
            >
              Verify
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

export default Signup;
