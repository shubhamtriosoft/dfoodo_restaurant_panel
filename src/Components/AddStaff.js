import React, { useState, useEffect } from "react";
import "./Css/AddStaff.css";

import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import editImg from "../assets/edit_square.png";
import GreyArrow from "../assets/greyLeftAr.png";
import DropDwn from "../assets/drop-dwn.png";
import Person from "../assets/person.png";
import "react-datepicker/dist/react-datepicker.css";
import {
  Open_Menu_text,
  AddStaffPageText,
  options_gender,
  options_blood_group,
} from "./../CommonJquery/WebsiteText";
import {
  handleEmailChange,
  handleNumbersChange,
  handleURLChange,
  handleAphabetsChange,
  handleError,
  handlePasswordChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  computeTodayDate,
  handlecoordinatory_no,
  handlepersonal_id_no,
  empty_form,
  cencelChanges,
  calculateMaxDate,
  calculateMinJoinDate,
  calculateMaxJoinDate,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_staff,
  get_all_staff,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import { useLocation } from "react-router-dom";
function AddStaff() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editStaffData, seteditStaffData] = useState([]);
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [designations, setdesignations] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState("");
  const [copyAddress, setCopyAddress] = useState(false);

  const handleFileChangedynamic = (keyname) => (event) => {
    const file = event.target.files[0];
    let new_file_name = keyname + "_show";

    if (!file) {
      alert("Please select an image.");
      return;
    }

    if (file.type.startsWith("image/")) {
      // Validate file size
      if (file.size < 200 * 1024) {
        // 200KB in bytes
        alert("File size is below the minimum limit (200KB).");
        return;
      }

      if (file.size > 500 * 1024) {
        // 500KB in bytes
        alert("File size exceeds the maximum limit (500KB).");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        setDynaicimage((prevImages) => ({
          ...prevImages,
          [keyname]: file,
          [new_file_name]: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      event.target.value = ""; // Clear the file input
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
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/View_Staff");
            empty_form(form_data);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };

  const openCustomDatePicker = (customDatePickerInput_id) => {
    document.getElementById(customDatePickerInput_id).focus();
  };

  useEffect(() => {
    const url = currentUrl;
    const parts = url.split("/");
    const start_date = "";
    const end_date = "";
    const flag = "3";
    let call_id = "0";
    if (parts.length !== 1) {
      call_id = parts[1];
    }
    const input = document.getElementById("searchInput");
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      let full_address = place.address_components;
      let formatted_address = place.formatted_address;
      let length_data = place.address_components.length;
      let citys = "";
      let state = "";
      let country = "";
      let tehsil = "";
      for (let i = 0; i < length_data; i++) {
        if (full_address[i].types[0] === "administrative_area_level_1") {
          state = full_address[i].long_name;
        } else if (full_address[i].types[0] === "country") {
          country = full_address[i].long_name;
        } else if (full_address[i].types[0] === "administrative_area_level_2") {
          citys = full_address[i].long_name;
        } else if (full_address[i].types[0] === "locality") {
          tehsil = full_address[i].long_name;
        }
      }
      if (tehsil !== "") {
        citys = tehsil;
      }
      setPermanentAddress(formatted_address);
      document.getElementById("admin_city").value = citys;
      document.getElementById("admin_state").value = state;
      document.getElementById("admin_country").value = country;
    });
    master_data_get(start_date, end_date, flag, call_id);
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_staff, fd)
      .then((Response) => {
        console.log(Response.data);
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
            setPermanentAddress(
              Response.data.message.data_staff[0].admin_manual_adrress
            );
            setTemporaryAddress(
              Response.data.message.data_staff[0].admin_temorary_adrress
            );
            if (Response.data.message.data_staff[0].coordinatory_no != "") {
              setIsCheckboxChecked(true);
            }
          }
          setdesignations(Response.data.message.data_designation);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };
  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
    if (!isCheckboxChecked) {
      document.getElementById("personal_identity_no").value = "";
    }
  };

  const handleCheckboxChange2 = () => {
    setCopyAddress(!copyAddress); // Toggle checkbox state
    if (!copyAddress) {
      setTemporaryAddress(permanentAddress); // Copy permanent address to temporary address
    } else {
      setTemporaryAddress(""); // Clear temporary address
    }
  };

  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                {location.pathname.includes("/edit_staff") ? (
                  <p>{AddStaffPageText.update_staff}</p>
                ) : (
                  <p>{AddStaffPageText.Add_Staff}</p>
                )}
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="addStaffForms">
                <form id="addNewStaff">
                  <div className="row m-0">
                    <div className="col-xl-6 col-lg-7">
                      <div className="personalForm">
                        <h3>{AddStaffPageText.Personal_Details}</h3>
                        <div className="staffForm_container">
                          <div className="row m-0">
                            <div className="col-md-7">
                              <div className="addstaffInputs">
                                <div className="inpContainer">
                                  <div className="person_image image_icon_position image_icon_position1">
                                    <input
                                      type="text"
                                      id="admin_name"
                                      name="admin_name"
                                      tabIndex="1"
                                      placeholder={
                                        AddStaffPageText.Placeholder_Name
                                      }
                                      minLength={3}
                                      maxLength={75}
                                      className=" trio_mandatory form-control  input_field_custom1 "
                                      onInput={handleAphabetsChange}
                                      defaultValue={
                                        editStaffData.admin_name || ""
                                      }
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                                <div className="inpContainer">
                                  <div className="no_prsnl_id">
                                    <div className="rememberMe">
                                      <input
                                        type="checkbox"
                                        id="id_checkbox"
                                        tabIndex="1"
                                        className="hidden-checkbox"
                                        checked={isCheckboxChecked}
                                        onChange={handleCheckboxChange}
                                      />

                                      <label
                                        htmlFor="id_checkbox"
                                        className="checkbox-label labelCheckbox"
                                        tabIndex="2"
                                      >
                                        {AddStaffPageText.PesonalID_text}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="person_image image_icon_position1">
                                    {isCheckboxChecked ? (
                                      <input
                                        type="text"
                                        id="coordinatory_no"
                                        name="coordinatory_no"
                                        tabIndex="3"
                                        placeholder={
                                          AddStaffPageText.Coordinatory_no
                                        }
                                        defaultValue={
                                          editStaffData.coordinatory_no || ""
                                        }
                                        onChange={handlecoordinatory_no}
                                        minLength={1}
                                        maxLength={76}
                                        className=" form-control trio_mandatory input_field_custom1"
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        id="personal_identity_no"
                                        name="personal_identity_no"
                                        placeholder={
                                          AddStaffPageText.Personal_id_no
                                        }
                                        defaultValue={
                                          editStaffData.personal_identity_no ||
                                          ""
                                        }
                                        onChange={handlepersonal_id_no}
                                        minLength={1}
                                        maxLength={76}
                                        className=" form-control trio_mandatory input_field_custom1"
                                      />
                                    )}
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5 col-md-4 mx-auto">
                              <div
                                className={
                                  "inpContainer imginputContainer flex-column "
                                }
                              >
                                <div
                                  className={
                                    dynaicimage ? "" : " inputDiv1 imgInput"
                                  }
                                >
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
                                </div>
                                <input
                                  name="event_list_image"
                                  id="event_list_image"
                                  type="file"
                                  onChange={handleFileChangedynamic(
                                    "event_list_image"
                                  )}
                                  className={
                                    dynaicimage &&
                                    dynaicimage.event_list_image_show
                                      ? "form-control"
                                      : " form-control"
                                  }
                                  accept=".jpg,.jpeg,.png"
                                  hidden
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0">
                            <div className="col-md-6">
                              <label className="no_prsnl_id">
                                {AddStaffPageText.D_O_B}
                              </label>
                              <div className="calendar_month_icon image_icon_position1 curser_Pointer">
                                <input
                                  type="date"
                                  name="admin_dob_date"
                                  placeholder={AddStaffPageText.D_O_B}
                                  max={calculateMaxDate()}
                                  className=" trio_mandatory form-control  input_field_custom1  "
                                  id="customDatePickerInput"
                                  onClick={() =>
                                    openCustomDatePicker(
                                      "customDatePickerInput"
                                    )
                                  }
                                  defaultValue={
                                    editStaffData.admin_dob_date || ""
                                  }
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="inpContainer curser_Pointer">
                                <label className="no_prsnl_id">
                                  {AddStaffPageText.Gender_text}
                                </label>
                                <div className="person__gender_image   image_icon_position1">
                                  <div className="dropDownn">
                                    <img src={DropDwn} alt="img"></img>
                                  </div>

                                  <select
                                    id="admin_gender"
                                    name="admin_gender"
                                    className="trio_mandatory form-control input_field_custom2 curser_Pointer genderDropDown"
                                    defaultValue={
                                      editStaffData.admin_gender || ""
                                    }
                                  >
                                    <option value={" "} disabled hidden>Select Gender</option>
                                    {options_gender.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                        selected={
                                          editStaffData.admin_gender ===
                                          option.value
                                        }
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="inpContainer">
                                <div className="person__email_image image_icon_position1 mt-2">
                                  <input
                                    type="text"
                                    name="admin_email"
                                    placeholder={AddStaffPageText.Add_Email}
                                    minLength={4}
                                    maxLength={72}
                                    className="trio_email trio_mandatory form-control  input_field_custom1 "
                                    onInput={(e) => handleEmailChange(e)}
                                    defaultValue={
                                      editStaffData.admin_email || ""
                                    }
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
                                <div className="person__blood_image image_icon_position1 curser_Pointer mt-2">
                                  <div className="dropDownn">
                                    <img src={DropDwn} alt="img"></img>
                                  </div>
                                  <select
                                    id="admin_blood_group"
                                    name="admin_blood_group"
                                    className=" form-control input_field_custom2 curser_Pointer"
                                    defaultValue={
                                      editStaffData.admin_blood_group || ""
                                    }
                                  >
                                    <option value={" "} disabled hidden>
                                      {AddStaffPageText.Select_Blood_Group}
                                    </option>
                                    {options_blood_group.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                        selected={
                                          editStaffData.admin_blood_group ===
                                          option.value
                                        }
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="condition_error"></span>
                                </div>
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
                                    className="trio_no trio_mandatory form-control input_field_custom2 "
                                    onInput={(e) => handleNumbersChange(e)}
                                    defaultValue={
                                      editStaffData.admin_mobile_no || ""
                                    }
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

                            <div className="col-md-12">
                              <div className="inpContainer ">
                                <div className="image_icon_position1">
                                  <label className="no_prsnl_id">
                                    {AddStaffPageText.Permanent_Address}
                                  </label>
                                  <textarea
                                    type="text"
                                    rows="7"
                                    id="searchInput"
                                    autoComplete="off"
                                    name="admin_manual_adrress"
                                    maxLength={250}
                                    minLength={5}
                                    placeholder={
                                      AddStaffPageText.Permanent_addressplaceholder
                                    }
                                    value={permanentAddress}
                                    onChange={(e) =>
                                      setPermanentAddress(e.target.value)
                                    }
                                    className="trio_mandatory form-control input_field_custom3"
                                    defaultValue={
                                      editStaffData.admin_manual_adrress || ""
                                    }
                                  ></textarea>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="form-row hidden">
                              <div className="col-md-4 mb-3">
                                <label htmlFor="validationCustom01">City</label>
                                <input
                                  type="text"
                                  className="form-control  searchInput_google"
                                  name="admin_city"
                                  id="admin_city"
                                  autoComplete="off"
                                  maxLength={100}
                                  minLength={3}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.City_Name}
                                  defaultValue={editStaffData.admin_city || ""}
                                />
                                <span className="condition_error"></span>
                              </div>
                              <div className="col-md-4 mb-3">
                                <label htmlFor="validationCustom01">
                                  {AddStaffPageText.State}
                                </label>
                                <input
                                  type="text"
                                  className="form-control  "
                                  name="admin_state"
                                  id="admin_state"
                                  autoComplete="off"
                                  maxLength={100}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.Enter_State}
                                  defaultValue={editStaffData.admin_state || ""}
                                />
                                <span className="condition_error"></span>
                              </div>
                              <div className="col-md-4 mb-3">
                                <label htmlFor="validationCustom01">
                                  {AddStaffPageText.Country}
                                </label>
                                <input
                                  type="text"
                                  className="form-control  "
                                  name="admin_country"
                                  id="admin_country"
                                  autoComplete="off"
                                  maxLength={100}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.Enter_Country}
                                  defaultValue={
                                    editStaffData.admin_country || "India"
                                  }
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="inpContainer">
                                <div className="no_prsnl_id">
                                  <div className="rememberMe">
                                    <input
                                      type="checkbox"
                                      id="adress_box"
                                      tabIndex="2"
                                      className="hidden-checkbox"
                                      onChange={handleCheckboxChange2}
                                    />

                                    <label
                                      htmlFor="adress_box"
                                      className="checkbox-label labelCheckbox"
                                      tabIndex="2"
                                    >
                                      {AddStaffPageText.Same_Address}
                                    </label>
                                  </div>
                                </div>

                                <div className="image_icon_position1">
                                  <label className="no_prsnl_id">
                                    {AddStaffPageText.Temporary_Address}
                                  </label>
                                  <textarea
                                    type="text"
                                    id="searchInput2"
                                    rows="4"
                                    name="admin_temorary_adrress"
                                    maxLength={250}
                                    minLength={5}
                                    value={temporaryAddress}
                                    placeholder={
                                      AddStaffPageText.Permanent_addressplaceholder
                                    }
                                    onChange={(e) =>
                                      setTemporaryAddress(e.target.value)
                                    }
                                    className="trio_mandatory form-control input_field_custom3 "
                                    defaultValue={
                                      editStaffData.admin_temorary_adrress || ""
                                    }
                                  ></textarea>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="socialdetails">
                              <h5>{AddStaffPageText.Social_media_text}</h5>
                              <div className="inpContainer">
                                <div className="person__facebook_image image_icon_position1">
                                  <input
                                    type="text"
                                    name="facebook_link"
                                    placeholder={AddStaffPageText.facebook_link}
                                    maxLength={150}
                                    minLength={4}
                                    className="form-control input_field_custom2 "
                                    onInput={(e) => handleURLChange(e)}
                                    defaultValue={
                                      editStaffData.facebook_link || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                              <div className="inpContainer">
                                <div className="person__instagram_image image_icon_position1">
                                  <input
                                    type="text"
                                    name="instragram_link"
                                    placeholder={
                                      AddStaffPageText.instagram_link
                                    }
                                    maxLength={150}
                                    minLength={4}
                                    className="form-control input_field_custom2 "
                                    onInput={(e) => handleURLChange(e)}
                                    defaultValue={
                                      editStaffData.instragram_link || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                              <div className="inpContainer">
                                <div className="person__linkedin_image image_icon_position1">
                                  <input
                                    type="text"
                                    name="linkedin_link"
                                    placeholder={AddStaffPageText.linkedin_link}
                                    maxLength={150}
                                    minLength={4}
                                    className="form-control input_field_custom2 "
                                    onInput={(e) => handleURLChange(e)}
                                    defaultValue={
                                      editStaffData.linkedin_link || ""
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
                      <div className="employeForm">
                        <h3>{AddStaffPageText.Employee_Details}</h3>
                        <div className="staffForm_container">
                          <div className="row m-0">
                            <div className="col-xl-8 col-lg-12 col-md-6">
                              <div className="inpContainer curser_Pointer">
                                <label className="no_prsnl_id">
                                  {AddStaffPageText.join_date}
                                </label>
                                <div className="calendar_month_icon image_icon_position1 ">
                                  <input
                                    type="date"
                                    name="admin_join_date"
                                    placeholder={AddStaffPageText.D_O_B}
                                    className=" trio_mandatory form-control input_field_custom1"
                                    id="customDatePickerInput2"
                                    max={calculateMaxJoinDate()}
                                    min={calculateMinJoinDate()}
                                    onClick={() =>
                                      openCustomDatePicker(
                                        "customDatePickerInput2"
                                      )
                                    }
                                    defaultValue={
                                      editStaffData.admin_join_date || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-8 col-lg-12 col-md-6">
                              <div className="inpContainer curser_Pointer">
                                <label className="no_prsnl_id">
                                  {AddStaffPageText.Designation}
                                </label>
                                <div className="person__business_center_image image_icon_position1">
                                  <div className="dropDownn">
                                    <img src={DropDwn} alt="img"></img>
                                  </div>
                                  <select
                                    id="select_designation"
                                    name="admin_designation"
                                    className="trio_mandatory form-control input_field_custom1"
                                  >
                                    <option value="" disabled hidden>
                                      {AddStaffPageText.Select_Designation}
                                    </option>
                                    {designations.map((option, index) => (
                                      <option
                                        key={index}
                                        value={option.primary_id}
                                        selected={
                                          editStaffData.admin_designation ===
                                          option.primary_id
                                        }
                                      >
                                        {option.designation_name}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
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
                                  <span className="condition_error"></span>
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
                                "addNewStaff",
                                save_update_staff
                              )
                            }
                          >
                            {location.pathname.includes("/edit_staff")
                              ? AddStaffPageText.update_text
                              : AddStaffPageText.save_text}
                          </button>
                        </div>
                      </div>
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

export default AddStaff;
