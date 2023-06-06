import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Add_new_contact() {
  let navigate = useNavigate();

  const [Messages, setMessages] = useState("");
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");

  const handleSubmit = async (data) => {
    try {
      let request = await axios.post(
        `${URL}/save/contact`,
        { data: data },
        {
          headers: {
            mobile: window.sessionStorage.getItem("mobile"),
          },
        }
      );
      if (request.data.statusCode === 200) {
        setActiveResponse(true);
        setColor("green");
        setMessages(request.data.message);
        document.querySelector("#modal-btn-close").click();
        window.location.reload();
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
      name: yup
        .string()
        .min(3, "Must be 3 to 15 characters")
        .max(15, "Must be 3 to 15 characters")
        .required("* Required"),
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
    if (formik.touched.name && formik.errors.name) {
      setActiveResponse(true);
      setMessages(formik.errors.name);
    } else if (formik.touched.mobile && formik.errors.mobile) {
      setActiveResponse(true);
      setMessages(formik.errors.mobile);
    } else {
      setActiveResponse(false);
      setMessages("");
    }
  }, [formik]);
  return (
    <>
      <a data-bs-toggle="modal" data-bs-target="#exampleModal">
        New Contact
      </a>

      <div
        class="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Save New Contact
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form className="forms" onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label for="exampleInputEmail1" className="form-label d-flex">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control shadow-none"
                    id="name"
                    placeholder="ie. John Doe"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </div>
                <div className="mb-3">
                  <label for="exampleInputEmail1" className="form-label d-flex">
                    Mobile Number
                  </label>
                  <input
                    name="mobile"
                    type="number"
                    className="form-control shadow-none"
                    id="mobile"
                    placeholder="ie. 830XXXX122"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile}
                  />
                </div>

                <div className="mb-3">
                  <button
                    id="saveButton"
                    type="submit"
                    className="form-control btn btn-outline-success display-none"
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
            <div class="modal-footer">
              <button
                id="modal-btn-close"
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => {
                  document.querySelector("#saveButton").click();
                }}
                type="button"
                class="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Add_new_contact;
