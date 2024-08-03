import React, { useState, useEffect } from "react";
import "./Css/AddStaff.css";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import Person from "../assets/storefrontGrey.svg";
import editImg from "../assets/edit_square.png";
import "react-datepicker/dist/react-datepicker.css";
import {
  AddStaffPageText,
  create_restaurants,
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
  empty_form,
  handleIaphabetnumberChange,
  cencelChanges,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_new_resturant,
  get_all_new_resturant,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import { useLocation } from "react-router-dom";
function CreateRestro() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editStaffData, seteditStaffData] = useState([]);
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [designations, setdesignations] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);

  const [permanentAddress, setPermanentAddress] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState("");
  const [copyAddress, setCopyAddress] = useState(false);

  const handleFileChangedynamic = (keyname) => (event) => {
    const file = event.target.files[0];

    let new_file_name = keyname + "_show";
    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
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
            handleSuccessSession(Response.data.message, "/View_Restaurants");
            empty_form(form_data);
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
      document.getElementById("restaurant_city").value = citys;
      document.getElementById("restaurant_state").value = state;
      document.getElementById("restaurant_country").value = country;
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
    await server_post_data(get_all_new_resturant, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_restaurant.length > 0) {
            seteditStaffData(Response.data.message.data_restaurant[0]);
            setEditorDatMainID(
              Response.data.message.data_restaurant[0].primary_id
            );
            seteditOldImageData(
              Response.data.message.data_restaurant[0].restaurant_image
            );
            setPermanentAddress(
              Response.data.message.data_restaurant[0].restaurant_full_adrress
            );
            setDynaicimage({
              event_list_image_show:
                APL_LINK +
                Response.data.message.data_restaurant_image +
                Response.data.message.data_restaurant[0].restaurant_image,
            });
            setTemporaryAddress(
              Response.data.message.data_restaurant[0]
                .restaurant_temorary_adrress
            );
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
                <p>{create_restaurants.Restaurant_details}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="addStaffForms">
                <form id="addNewStaff">
                  <div className="row m-0 justify_center">
                    <div className="col-xl-6 col-lg-7">
                      <div className="personalForm">
                        <div className="staffForm_container">
                          <div className="row m-0">
                            <div className="col-lg-3 col-md-4 mx-auto">
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
                                          style={{ width: "1.5rem" }}
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
                                  className=" form-control"
                                  accept=".jpg,.jpeg,.png"
                                  hidden
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="addstaffInputs">
                                <div className="inpContainer">
                                  <div className="resturant_icon image_icon_position image_icon_position1">
                                    <input
                                      type="text"
                                      id="restaurant_name"
                                      name="restaurant_name"
                                      tabIndex="1"
                                      placeholder={
                                        create_restaurants.Restaurant_name
                                      }
                                      minLength={3}
                                      maxLength={75}
                                      className="trio_name trio_mandatory form-control  input_field_custom1 "
                                      onInput={handleAphabetsChange}
                                      defaultValue={
                                        editStaffData.restaurant_name || ""
                                      }
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                                <div className="inpContainer">
                                  <div className="tagline_icon image_icon_position image_icon_position1">
                                    <input
                                      type="text"
                                      id="restaurant_tagline"
                                      name="restaurant_tagline"
                                      tabIndex="1"
                                      placeholder={
                                        create_restaurants.Restaurant_tag_line
                                      }
                                      minLength={3}
                                      maxLength={75}
                                      className="trio_name trio_mandatory form-control  input_field_custom1 "
                                      onInput={handleIaphabetnumberChange}
                                      defaultValue={
                                        editStaffData.restaurant_tagline || ""
                                      }
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row m-0">
                            <div className="col-md-6">
                              <div className="inpContainer">
                                <div className="person__phone_image image_icon_position1">
                                  <input
                                    type="text"
                                    name="restaurant_mobile_no"
                                    placeholder={AddStaffPageText.Phone_Number}
                                    minLength={4}
                                    maxLength={10}
                                    className="trio_no trio_mandatory form-control input_field_custom2 "
                                    onInput={(e) => handleNumbersChange(e)}
                                    defaultValue={
                                      editStaffData.restaurant_mobile_no || ""
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
                                    id="restaurant_other_no"
                                    name="restaurant_other_no"
                                    placeholder={
                                      AddStaffPageText.Alt_Phone_Number
                                    }
                                    maxLength={10}
                                    minLength={4}
                                    className="trio_no  form-control input_field_custom2 "
                                    onInput={(e) => handleNumbersChange(e)}
                                    defaultValue={
                                      editStaffData.restaurant_other_no || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="inpContainer">
                                <div className="person__email_image image_icon_position1 mt-2">
                                  <input
                                    type="text"
                                    name="restaurant_email"
                                    placeholder={"Email Id*"}
                                    minLength={4}
                                    maxLength={72}
                                    className="trio_email trio_mandatory form-control  input_field_custom1 "
                                    onInput={(e) => handleEmailChange(e)}
                                    defaultValue={
                                      editStaffData.restaurant_email || ""
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
                                    name="restaurant_full_adrress"
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
                                      editStaffData.restaurant_full_adrress ||
                                      ""
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
                                  name="restaurant_city"
                                  id="restaurant_city"
                                  maxLength={100}
                                  minLength={3}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.City_Name}
                                  defaultValue={
                                    editStaffData.restaurant_city || ""
                                  }
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
                                  name="restaurant_state"
                                  id="restaurant_state"
                                  maxLength={100}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.Enter_State}
                                  defaultValue={
                                    editStaffData.restaurant_state || ""
                                  }
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
                                  name="restaurant_country"
                                  id="restaurant_country"
                                  maxLength={100}
                                  onInput={handleAphabetsChange}
                                  placeholder={AddStaffPageText.Enter_Country}
                                  defaultValue={
                                    editStaffData.restaurant_country || "India"
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
                                    name="restaurant_temorary_adrress"
                                    maxLength={250}
                                    minLength={5}
                                    value={temporaryAddress}
                                    placeholder={
                                      AddStaffPageText.Permanent_addressplaceholder
                                    }
                                    onChange={(e) =>
                                      setTemporaryAddress(e.target.value)
                                    }
                                    className="form-control input_field_custom3 "
                                    defaultValue={
                                      editStaffData.restaurant_temorary_adrress ||
                                      ""
                                    }
                                  ></textarea>
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                            {editorDataMainID === "0" && (
                              <div className="socialdetails row m-0 p-0">
                                <div className="col-sm-6">
                                  <div className="inpContainer">
                                    <label className="no_prsnl_id">
                                      {AddStaffPageText.Create_pass}
                                    </label>

                                    <div className="password_image image_icon_position1">
                                      <input
                                        type={
                                          showPassword ? "text" : "password"
                                        }
                                        name="admin_password"
                                        id="admin_password"
                                        placeholder={
                                          AddStaffPageText.password_text
                                        }
                                        maxLength={40}
                                        minLength={3}
                                        className="trio_password trio_mandatory form-control input_field_custom1 new_password"
                                        onInput={(e) => handlePasswordChange(e)}
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
                                <div className="col-sm-6">
                                  {" "}
                                  <div className="inpContainer">
                                    <label className="no_prsnl_id">
                                      {AddStaffPageText.Confirm_pass}
                                    </label>

                                    <div className="password_image image_icon_position1">
                                      <input
                                        type={
                                          showPassword1 ? "text" : "password"
                                        }
                                        name="admin_confirm_password"
                                        id="admin_confirm_password"
                                        placeholder={
                                          AddStaffPageText.password_text2
                                        }
                                        maxLength={40}
                                        minLength={3}
                                        className="trio_password trio_mandatory form-control input_field_custom1 confirm_new_password"
                                        onInput={(e) => handlePasswordChange(e)}
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
                            )}
                            {editorDataMainID !== "0" && (
                              <div className="saveFormBtns row m-0 p-0">
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
                                      save_new_resturant
                                    )
                                  }
                                >
                                  {location.pathname.includes(
                                    "/edit_restaurants"
                                  )
                                    ? AddStaffPageText.update_text
                                    : AddStaffPageText.save_text}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {editorDataMainID === "0" && (
                      <div className="col-xl-6 col-lg-5">
                        <div className="employeForm">
                          <div className="staffForm_container">
                            <h5
                              className="mb-4"
                              style={{ paddingLeft: "12px", fontWeight: "400" }}
                            >
                              {create_restaurants.conatct_person_details}
                            </h5>
                            <div className="row m-0">
                              <div className="col-xl-8 col-lg-12 col-md-6">
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
                                      className="trio_name trio_mandatory form-control  input_field_custom1 "
                                      onInput={handleAphabetsChange}
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-8 col-lg-12 col-md-6">
                                <div className="inpContainer">
                                  <div className="person__phone_image image_icon_position1">
                                    <input
                                      type="text"
                                      name="admin_mobile_no"
                                      placeholder={
                                        AddStaffPageText.Phone_Number
                                      }
                                      minLength={4}
                                      maxLength={10}
                                      className="trio_no trio_mandatory form-control input_field_custom2 "
                                      onInput={(e) => handleNumbersChange(e)}
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-8 col-lg-12 col-md-6">
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
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-8 col-lg-12 col-md-6">
                                <div className="inpContainer curser_Pointer">
                                  <div className="person__business_center_image image_icon_position1">
                                    <select
                                      id="select_designation"
                                      name="admin_designation"
                                      className="trio_mandatory form-control input_field_custom1"
                                    >
                                      <option value="">
                                        {AddStaffPageText.Select_Designation}
                                      </option>
                                      {designations.map((option, index) => (
                                        <option
                                          key={index}
                                          value={option.primary_id}
                                        >
                                          {option.designation_name}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="condition_error"></span>
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
                                  save_new_resturant
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
                    )}
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

export default CreateRestro;
