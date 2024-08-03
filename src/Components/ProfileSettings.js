import React, { useState, useEffect } from "react";
import "./Css/AddStaff.css";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import Person from "../assets/person.png";
import editImg from "../assets/edit_square.png";
import "react-datepicker/dist/react-datepicker.css";
import {
  AddStaffPageText,
  ProfileSettingPage,
} from "./../CommonJquery/WebsiteText";
import {
  handleEmailChange,
  handleNumbersChange,
  handleAphabetsChange,
  handleError,
  handlePasswordChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  cencelChanges,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  update_profile_staff,
  get_all_staff,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
function ProfileSettings() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editStaffData, seteditStaffData] = useState([]);
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);

  const handleFileChangedynamic = (keyname) => (event) => {
    const file = event.target.files[0];

    let new_file_name = keyname + "_show";

    if (file && file.type.startsWith("image/")) {
      // Validate file size
      if (file.size < 200 * 1024) {
        // 200KB in bytes
        alert("File size is below the minimum limit (200KB).");
        return; // Stop further execution
      }

      if (file.size > 500 * 1024) {
        // 500KB in bytes
        alert("File size exceeds the maximum limit (500KB).");
        return; // Stop further execution
      }

      const reader = new FileReader();

      reader.onload = () => {
        // Create temporary image element to get dimensions
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          setDynaicimage((prevImages) => ({
            ...prevImages,
            [keyname]: file,
            [new_file_name]: reader.result,
          }));
        };
      };

      reader.readAsDataURL(file);
    } else {
      setDynaicimage((prevImages) => ({
        ...prevImages,
        [keyname]: null,
        [new_file_name]: null,
      }));
    }
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      fd_from.append("main_id", editorDataMainID);
      fd_from.append("old_image_link", editOldImageData);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/Profile_Settings");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  useEffect(() => {
    const start_date = "";
    const end_date = "";
    const flag = "3";
    let call_id = "0";
    master_data_get(start_date, end_date, flag, call_id);
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("data_call", "personal");
    await server_post_data(get_all_staff, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_staff.length > 0) {
            seteditStaffData(Response.data.message.data_staff[0]);
            setDynaicimage({
              event_list_image_show:
                APL_LINK +
                Response.data.message.data_link_image +
                Response.data.message.data_staff[0].admin_image,
            });
            setEditorDatMainID(Response.data.message.data_staff[0].primary_id);
            seteditOldImageData(
              Response.data.message.data_staff[0].admin_image
            );
          }
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{`Profile Settings`}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="addStaffForms">
                <form id="updateStaffProfile">
                  <div className="row m-0">
                    <div className="col-xl-6 col-lg-7">
                      <div className="personalForm">
                        <h3>{AddStaffPageText.Personal_Details}</h3>
                        <div className="staffForm_container">
                          <div className="row m-0">
                            <div className="col-md-7">
                              <div className="addstaffInputs">
                                <div className="inpContainer">
                                  <div className="person_image image_icon_position image_icon_position1 mt-2 PrOfle_colr">
                                    <input
                                      type="text"
                                      id="admin_name"
                                      name="admin_name"
                                      // tabIndex="1"
                                      placeholder={
                                        AddStaffPageText.Placeholder_Name
                                      }
                                      minLength={3}
                                      maxLength={75}
                                      className="trio_name trio_mandatory form-control  input_field_custom1 "
                                      onInput={(e) => {
                                        handleAphabetsChange(e);
                                      }}
                                      defaultValue={
                                        editStaffData.admin_name || ""
                                      }
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                                <div className="inpContainer">
                                  <div className="userId image_icon_position image_icon_position1">
                                    <input
                                      type="text"
                                      id="admin_name"
                                      name="admin_name"
                                      // tabIndex="2"
                                      minLength={3}
                                      maxLength={75}
                                      className="input_field_custom1 pointerEvents"
                                      onInput={handleAphabetsChange}
                                      value={editStaffData.admin_name || ""}
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5 col-md-4 mx-auto">
                              <div
                                className={"inpContainer imginputContainer "}
                              >
                                <div
                                  className={
                                    dynaicimage ? "" : " inputDiv1 imgInput"
                                  }
                                >
                                  <input
                                    name="event_list_image"
                                    id="event_list_image"
                                    type="file"
                                    onChange={handleFileChangedynamic(
                                      "event_list_image"
                                    )}
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png"
                                    hidden
                                  />
                                  <label
                                    htmlFor="event_list_image"
                                    className="imgInptImg"
                                  >
                                    {dynaicimage &&
                                    dynaicimage.event_list_image_show ? (
                                      <div
                                        className="imgDiv"
                                        htmlFor="event_list_image"
                                      >
                                        <img
                                          src={
                                            dynaicimage.event_list_image_show
                                          }
                                          onError={(e) =>
                                            (e.target.src = Person)
                                          }
                                          alt="Preview"
                                        />
                                        <img
                                          className="profileImgEdit"
                                          src={editImg}
                                          alt="Barley's Dashboard"
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <img
                                          src={Person}
                                          alt="Barley's Dashboard"
                                        />
                                        <p className="m-0">
                                          {AddStaffPageText.Add_Image}
                                        </p>
                                        <div className="imgValidationalert ">
                                          <p>
                                            {AddStaffPageText.Image_Validation}
                                          </p>
                                          <p>
                                            {AddStaffPageText.Image_Validation2}
                                          </p>
                                        </div>
                                      </>
                                    )}
                                  </label>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0">
                            <div className="col-md-12">
                              <div className="inpContainer">
                                <div className="person__email_image image_icon_position1 mt-2">
                                  <input
                                    type="text"
                                    name="admin_email"
                                    placeholder={AddStaffPageText.Add_Email}
                                    minLength={4}
                                    maxLength={72}
                                    className="trio_email trio_mandatory pointerEvents form-control  input_field_custom1 "
                                    onInput={(e) => handleEmailChange(e)}
                                    defaultValue={
                                      editStaffData.admin_email || ""
                                    }
                                    style={{
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.5)",
                                    }}
                                  />
                                  <span className="condition_error"></span>
                                </div>
                                <p className="noteMsg">
                                  {AddStaffPageText.User_Id_text}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="inpContainer">
                                <div className="person__phone_image image_icon_position1">
                                  <input
                                    type="text"
                                    name="admin_mobile_no"
                                    placeholder={AddStaffPageText.Phone_Number}
                                    minLength={4}
                                    maxLength={10}
                                    className="trio_no trio_mandatory pointerEvents form-control input_field_custom2 "
                                    onInput={(e) => handleNumbersChange(e)}
                                    defaultValue={
                                      editStaffData.admin_mobile_no || ""
                                    }
                                    style={{
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.5)",
                                    }}
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="inpContainer">
                                <div className="person__phone_image image_icon_position1">
                                  <input
                                    type="text"
                                    id="admin_other_no"
                                    name="admin_other_no"
                                    placeholder={
                                      AddStaffPageText.Alt_Phone_Number
                                    }
                                    maxLength={10}
                                    minLength={4}
                                    className="trio_no  form-control input_field_custom2 "
                                    onInput={(e) => handleNumbersChange(e)}
                                    defaultValue={
                                      editStaffData.admin_other_no || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-5">
                      <div className="employeForm heightBefore991">
                        {/* <h3>{AddStaffPageText.Employee_Details}</h3> */}
                        <h3>{AddStaffPageText.password_detail}</h3>
                        <div className="staffForm_container h-100">
                          <div className="row m-0">
                            <div className="col-xl-8 col-lg-12 col-md-6">
                              <div className="inpContainer">
                                <label className="no_prsnl_id">
                                  {AddStaffPageText.Create_pass}
                                </label>

                                <div className="password_image image_icon_position1">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    name="admin_password"
                                    id="admin_password"
                                    placeholder={AddStaffPageText.password_text}
                                    maxLength={40}
                                    minLength={3}
                                    className="trio_password trio_mandatory form-control input_field_custom1 new_password"
                                    onInput={(e) => handlePasswordChange(e)}
                                    defaultValue={
                                      editStaffData.admin_password || ""
                                    }
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onDrag={(e) => e.preventDefault()}
                                    onDrop={(e) => e.preventDefault()}
                                  />
                                  <span
                                    className="eye_icon1"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                            </div>
                            <div className="col-xl-8 col-lg-12 col-md-6">
                              <div className="inpContainer">
                                <label className="no_prsnl_id">
                                  {AddStaffPageText.Confirm_pass}
                                </label>

                                <div className="password_image image_icon_position1">
                                  <input
                                    type={showPassword1 ? "text" : "password"}
                                    name="admin_confirm_password"
                                    id="admin_confirm_password"
                                    placeholder={
                                      AddStaffPageText.password_text2
                                    }
                                    maxLength={40}
                                    minLength={3}
                                    className="trio_password trio_mandatory form-control input_field_custom1 confirm_new_password"
                                    onInput={(e) => handlePasswordChange(e)}
                                    defaultValue={
                                      editStaffData.admin_password || ""
                                    }
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onDrag={(e) => e.preventDefault()}
                                    onDrop={(e) => e.preventDefault()}
                                  />
                                  <span
                                    className="eye_icon1"
                                    onClick={() =>
                                      setShowPassword1(!showPassword1)
                                    }
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="saveFormBtns">
                    <button
                      className="btnCancel"
                      type="button"
                      onClick={cencelChanges}
                    >
                      {AddStaffPageText.cencel_text}
                    </button>
                    <button
                      className="btnSave"
                      type="button"
                      onClick={() =>
                        handleSaveChangesdynamic(
                          "updateStaffProfile",
                          update_profile_staff
                        )
                      }
                    >
                      {ProfileSettingPage.Update}
                    </button>
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

export default ProfileSettings;
