import React, { useState, useEffect } from "react";
import "./Css/Login.css";
import Lock from "../assets/bx_bxs-lock-alt.png";
import DoneSent from "../assets/sentDOne.png";
import ViewPass from "../assets/viewPass.png";
import HidePass from "../assets/hidePass.png";
import Loader from "./Loader.js";

import {
  ChangePasswordPagesText,
  changePasswardPage,
} from "../CommonJquery/WebsiteText";
import {
  server_post_data,
  check_resetlink_vaild,
  change_password_by_forgot,
} from "../ServiceConnection/serviceconnection.js";
import {
  handlePasswordChange,
  check_vaild_save,
  combiled_form_data,
} from "../CommonJquery/CommonJquery";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
function ChangePassword() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [passwordChanged, setPasswordChanged] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("current_url_token", currentUrl.split("/")[1]);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            const invalidElement =
              document.getElementsByClassName("invalid_data")[0];
            invalidElement.innerHTML = Response.data.message;
            invalidElement.style.display = "block"; // Assuming you want to show the element
          } else {
            setPasswordChanged(2);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };

  useEffect(() => {
    const start_date = "";
    const end_date = "";
    const flag = "1";
    const call_id = currentUrl.split("/")[1];
    master_data_get(start_date, end_date, flag, call_id);
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("current_url_token", call_id);
    await server_post_data(check_resetlink_vaild, fd)
      .then((Response) => {
        console.log(Response.data.message);
        if (Response.data.error) {
          setPasswordChanged(3);
          const invalidElement =
            document.getElementsByClassName("adderrormsg")[0];
          invalidElement.innerHTML = Response.data.message;
          invalidElement.style.display = "block"; // Assuming you want to show the element
        } else {
          setPasswordChanged(1);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
      });
  };

  return (
    <div className="login">
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="login_container">
        <div className="row h-100 m-0">
          <div className="col-lg-7 p-0">
            <div className="loginLeft fgtPasLeft">
              <div className="loginText">
                <h1>{ChangePasswordPagesText.barleys}</h1>
                <h5>{ChangePasswordPagesText.tagLineLogin}</h5>
                <Link to="https://www.barleys.se/">
                  <button>{ChangePasswordPagesText.gotoWebBtn}</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5 p-0">
            <div className="loginRight fgtPasRight">
              {passwordChanged === 1 && (
                <div className="loginFormCol h-100 col-lg-8 col-md-6 col-11 m-auto">
                  <form id="ChangePassword">
                    <div className="loginFormContainer ">
                      <h4>{ChangePasswordPagesText.changePassword}</h4>
                      <h5>{ChangePasswordPagesText.changePasswordText}</h5>
                      <span className="invalid_data errorMsg"></span>
                      <div className="loginInputs">
                        <div className="password_image image_icon_position">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="new_password"
                            placeholder={
                              ChangePasswordPagesText.create_new_password
                            }
                            maxLength={40}
                            minLength={3}
                            className="trio_password trio_mandatory form-control input_field_custom new_password"
                            onInput={(e) => handlePasswordChange(e)}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onDrag={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                          />
                          <span
                            className="eye_icon"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <div className="eye_open"></div>
                            ) : (
                              <div className="eye_close"></div>
                            )}
                          </span>
                          <span className="condition_error"></span>
                        </div>
                        <div className="password_image image_icon_position">
                          <input
                            type={showPassword1 ? "text" : "password"}
                            name="confirm_new_password"
                            placeholder={
                              ChangePasswordPagesText.confirm_new_password
                            }
                            maxLength={40}
                            minLength={3}
                            className="trio_password trio_mandatory form-control input_field_custom confirm_new_password"
                            onInput={(e) => handlePasswordChange(e)}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onDrag={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                          />
                          <span
                            className="eye_icon"
                            onClick={() => setShowPassword1(!showPassword1)}
                          >
                            {showPassword1 ? (
                              <div className="eye_open"></div>
                            ) : (
                              <div className="eye_close"></div>
                            )}
                          </span>
                          <span className="condition_error"></span>
                        </div>
                      </div>
                      <p className="passwordValidation">
                        <span className="errorMsg">*</span>
                        {changePasswardPage.Error_massage}
                      </p>
                      <button
                        className="loginBtn"
                        type="button"
                        onClick={() =>
                          handleSaveChangesdynamic(
                            "ChangePassword",
                            change_password_by_forgot
                          )
                        }
                      >
                        {ChangePasswordPagesText.createPassword}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {passwordChanged === 2 && (
                <div className="loginFormCol h-100 col-lg-8 col-md-6 col-11 m-auto">
                  <form id="ForgotFormData">
                    <div className="loginFormContainer ">
                      <div className="doneImgDiv doneImgSuccess">
                        <img src={DoneSent} alt="Barley's Dashboard" />
                      </div>
                      <h4>{ChangePasswordPagesText.passwordChanged}</h4>
                      <p className="resendText changedSuccesTexts">
                        {ChangePasswordPagesText.passChangeSuccess}
                      </p>
                      <Link to="/">
                        <button className="loginBtn" type="button">
                          {ChangePasswordPagesText.continueLogin}
                        </button>
                      </Link>
                    </div>
                  </form>
                </div>
              )}
              {passwordChanged === 3 && (
                <div className="loginFormCol h-100 col-lg-8 col-md-6 col-11 m-auto">
                  <div className="loginFormContainer ">
                    <p className="resendText changedSuccesTexts">
                      <span className="adderrormsg"></span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
