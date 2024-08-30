import React, { useEffect, useState } from "react";
import "./Css/Login.css";
import DoneSent from "../assets/sentDOne.png";
import { ForgotPagesText } from "../CommonJquery/WebsiteText";
import Loader from "./Loader.js";
import { Link } from "react-router-dom";
import Logo from "../assets/logoIcon.svg";
import {
  server_post_data,
  forgot_password,
  Website_URL,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleEmailChange,
  check_vaild_save,
  combiled_form_data,
} from "../CommonJquery/CommonJquery";
import DOMPurify from "dompurify";
function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            const invalidElement =
              document.getElementsByClassName("invalid_data")[0];
            invalidElement.innerHTML = Response.data.message;
            invalidElement.style.display = "block"; // Assuming you want to show the element
          } else {
            setEmailId(Response.data.message);
            setEmailSent(true);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };

  useEffect(() => {}, [emailSent]);

  return (
    <div className="login">
      {showLoaderAdmin && <Loader />}
      <div className="login_container">
        <div className="row h-100 m-0">
          <div className="col-lg-7 p-0">
            <div className="loginLeft fgtPasLeft">
              <div className="loginText">
                <img src={Logo} alt="Barley's Food Factory" />
                <h5>{ForgotPagesText.tagLineLogin}</h5>
                <Link to={Website_URL}>
                  <button>{ForgotPagesText.gotoWebBtn}</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5 p-0">
            <div className="loginRight fgtPasRight">
              <div className="loginFormCol h-100 col-lg-8 col-md-6 col-11 m-auto">
                <form id="ForgotFormData">
                  <div className="loginFormContainer">
                    <div className={`resetpastext ${!emailSent && "hidden"}`}>
                      <div className="doneImgDiv">
                        <img src={DoneSent} alt="Barley's Dashboard" />
                      </div>
                      <div
                        className="mb-4 resetRequesText"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(emailId),
                        }}
                      />
                      <span className="show_email_access"></span>
                    </div>
                    <div className={` ${emailSent && "hidden"}`}>
                      <h4>{ForgotPagesText.forgotPassword}</h4>
                      <h5>{ForgotPagesText.forgotPasswordText}</h5>
                      <span className="invalid_data errorMsg"></span>
                      <div className="loginInputs">
                        <div className="email_image image_icon_position">
                          <input
                            type="text"
                            name="useremail"
                            placeholder="Email Address"
                            className="trio_email trio_mandatory form-control input_field_custom"
                            maxLength={75}
                            minLength={3}
                            onInput={(e) => handleEmailChange(e)}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                      <button
                        className="loginBtn"
                        type="button"
                        onClick={() =>
                          handleSaveChangesdynamic(
                            "ForgotFormData",
                            forgot_password
                          )
                        }
                      >
                        {ForgotPagesText.sendLink}
                      </button>
                    </div>

                    <div className={`sendPassTxt ${!emailSent && "hidden"}`}>
                      <p className="resendText">
                        {ForgotPagesText.didntReceive}{" "}
                        <span
                          className="resendP2"
                          onClick={() =>
                            handleSaveChangesdynamic(
                              "ForgotFormData",
                              forgot_password
                            )
                          }
                        >
                          {ForgotPagesText.resend}
                        </span>
                      </p>
                      <span className="show_email_access"></span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
