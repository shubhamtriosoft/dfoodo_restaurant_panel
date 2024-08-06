import React, { useState, useEffect } from "react";
import "./Css/Login.css";
import { loginPagesText } from "../CommonJquery/WebsiteText";
import Loader from "./Loader.js";
import {
  APL_LINK,
  server_post_data,
  login_to_superadmin,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleEmailChange,
  handlePasswordChange,
  check_vaild_save,
  combiled_form_data,
} from "../CommonJquery/CommonJquery";
import { Link } from "react-router-dom";
import { storeData } from "../LocalConnection/LocalConnection.js";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logoIcon.svg";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
function Login() {
  const navigate = useNavigate();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const decryptEmail = (encryptedEmail) => {
    const encrypted = CryptoJS.AES.decrypt(encryptedEmail, "secret_key");
    const decryptedEmail = encrypted.toString(CryptoJS.enc.Utf8);
    const [email, salt] = decryptedEmail.split("::");
    return email;
  };

  const encryptPassword = (password) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const passwordWithSalt = password + "::" + salt.toString(CryptoJS.enc.Hex);
    const encryptedPassword = CryptoJS.AES.encrypt(
      passwordWithSalt,
      "secret_key"
    ).toString();
    return encryptedPassword;
  };

  const decryptPassword = (encryptedPassword) => {
    const encrypted = CryptoJS.AES.decrypt(encryptedPassword, "secret_key");
    const decryptedEmail = encrypted.toString(CryptoJS.enc.Utf8);
    const [passwordWithSalt, salt] = decryptedEmail.split("::");
    const password = passwordWithSalt.split("::")[0];
    return password;
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response);
          if (Response.data.error) {
            const invalidElement =
              document.getElementsByClassName("invalid_data")[0];
            if (invalidElement) {
              invalidElement.innerHTML = Response.data.message;
              invalidElement.style.display = "block"; // Assuming you want to show the element
            }
          } else {
            let Response_data = Response.data.message.data_admin;
            let Response_restaurant = Response.data.message.data_restaurant;
            let Response_designation = Response.data.message.data_designation;
            let data_admin_image = Response.data.message.data_admin_image;
            storeData("admin_id", Response_data.primary_id);
            storeData("admin_name", Response_data.admin_name);
            let show_mr = "";
            if (Response_data.admin_gender === "Male") {
              show_mr = "Mr. ";
            } else if (Response_data.admin_gender === "Female") {
              show_mr = "Ms. ";
            }
            storeData(
              "admin_name_with_gender",
              show_mr + Response_data.admin_name
            );
            storeData("admin_email", Response_data.admin_email);
            storeData("admin_designation", Response_data.admin_designation);
            storeData(
              "admin_image",
              APL_LINK + data_admin_image + Response_data.admin_image
            );
            storeData(
              "designation_name",
              Response_designation.designation_name
            );

            storeData(
              "access_permission",
              Response_designation.access_permission
            );
            /*Restaurant Data*/
            storeData(
              "default_restaurant_id",
              Response_data.default_restaurant_id
            );
            storeData(
              "restaurant_image",
              APL_LINK + data_admin_image + Response_restaurant.restaurant_image
            );
            storeData("restaurant_name", Response_restaurant.restaurant_name);
            storeData("wowreview_key", Response_restaurant.wowreview_key);

            if (rememberMe) {
              const encryptedEmail = CryptoJS.AES.encrypt(
                Response_data.admin_email,
                "secret_key"
              ).toString();
              const encryptedPassword = encryptPassword(
                Response_data.admin_password
              );

              Cookies.set("email", encryptedEmail, { expires: 30 });
              Cookies.set("password", encryptedPassword, {
                expires: 30,
              });
            } else {
              Cookies.remove("email");
              Cookies.remove("password");
            }

            /*Restaurant Data*/
            navigate("/Dashboard");
          }
          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
        });
    }
  };

  // const decryptPassword = (encryptedPassword) => {
  //   const encrypted = CryptoJS.AES.decrypt(encryptedPassword, "secret_key");
  //   const decryptedEmail = encrypted.toString(CryptoJS.enc.Utf8);
  //   const [password, salt] = decryptedEmail.split("::");
  //   return password;
  // };

  // const decryptPassword = (encryptedPassword) => {
  //   const decryptedPassword = CryptoJS.SHA256(encryptedPassword).toString(
  //     CryptoJS.enc.Hex
  //   );
  //   return decryptedPassword;
  // };

  useEffect(() => {
    const email = Cookies.get("email");
    const password = Cookies.get("password");

    if (email && password) {
      const decryptedEmail = decryptEmail(email);
      const decryptedPassword = decryptPassword(password);

      if (decryptedEmail && decryptedPassword) {
        document.getElementsByName("useremail")[0].value = decryptedEmail;
        document.getElementsByName("userpassword")[0].value = decryptedPassword;
        setRememberMe(true); // Check the rememberMe checkbox
      }
    }
  }, [rememberMe]);

  const [showPassword, setShowPassword] = useState(false);

  console.log(loginPagesText.forgotPass);
  return (
    <div className="login">
      {showLoaderAdmin && <Loader />}
      <div className="login_container">
        <div className="row h-100 m-0">
          <div className="col-lg-7 p-0">
            <div className="loginLeft">
              <div className="loginText">
                {/* <h1>{loginPagesText.barleys}</h1> */}
                <img src={Logo} alt="Barley's Food Factory" />
                <h5>{loginPagesText.tagLineLogin}</h5>

                <Link to="https://www.barleys.se/">
                  <button style={{ fontWeight: "500" }}>www.Dfoodo.se</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5 p-0">
            <div className="loginRight">
              <div className="loginFormCol h-100 col-xl-7 col-lg-8 col-md-6 col-11">
                <form id="loginFormData">
                  <div className="loginFormContainer">
                    <h5>{loginPagesText.logingetstarted}</h5>
                    <span className="invalid_data"></span>
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
                          autoFocus
                          tabIndex={1} // Set tabindex for the email input
                        />
                        <span className="condition_error"></span>
                      </div>
                      <div className="password_image image_icon_position">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="userpassword"
                          placeholder="Password"
                          maxLength={40}
                          minLength={3}
                          className="trio_password trio_mandatory form-control input_field_custom"
                          onInput={(e) => handlePasswordChange(e)}
                          tabIndex={2} // Set tabindex for the password input
                        />
                        <span
                          className="eye_icon"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={3} // Set tabindex for the eye icon
                        >
                          {showPassword ? (
                            <div className="eye_open"></div>
                          ) : (
                            <div className="eye_close"></div>
                          )}
                        </span>
                        <span className="condition_error"></span>
                      </div>
                    </div>
                    <button
                      style={{ color: "black" }}
                      className="loginBtn"
                      type="button"
                      onClick={() =>
                        handleSaveChangesdynamic(
                          "loginFormData",
                          login_to_superadmin
                        )
                      }
                      tabIndex={4} // Set tabindex for the login button
                    >
                      {loginPagesText.login}
                    </button>
                    <div className="forgetRem">
                      <div className="rememberMe">
                        <input
                          type="checkbox"
                          id="myCheckbox"
                          className="hidden-checkbox"
                          style={{
                            color: "#666666",
                          }}
                          tabIndex={5 - 6} // Set tabindex for the checkbox
                          checked={rememberMe} // Set checked status based on rememberMe state
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label
                          htmlFor="myCheckbox"
                          className="checkbox-label"
                          tabIndex={6}
                        >
                          {" "}
                          {/* Changed 'for' to 'htmlFor' */}
                          <p
                            style={{
                              color: "#666666",
                            }}
                          >
                            {loginPagesText.rememberMe}
                          </p>
                        </label>
                      </div>
                      <Link to="/Forgot_Password" tabIndex={7}>
                        {" "}
                        {/* Set tabindex for the Forgot Password link */}
                        <p>{loginPagesText.forgotPass}</p>
                      </Link>
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

export default Login;
