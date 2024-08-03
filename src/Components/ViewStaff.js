import React, { useState, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import FilterIcon from "../assets/filterIcon.png";
import Search from "../assets/search.png";
import EmployeeImg from "../assets/person_pin_circle.svg";
import FaceBook from "../assets/facebook.png";
import Instagram from "../assets/instaNew.png";
import LinkedIn from "../assets/linkedInNew.png";
import EditBtn from "../assets/edit_square.png";
import crosIcon from "../assets/crossicon.svg";
import Email from "../assets/mail.png";
import DeactiIcon from "../assets/deactiIcon.png";
import { Modal, Button } from "react-bootstrap";
import {
  ViewStaffPagesText,
  options_search,
} from "./../CommonJquery/WebsiteText";
import {
  server_post_data,
  action_update_staff,
  get_all_staff,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  handleIaphabetnumberChange,
  formatDateStringdot,
  handleEmailClick,
  handleAphabetsChange,
  handleEmailChange,
  handleNumbersChange,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
import { Link } from "react-router-dom";

function ViewStaff() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [SelectedData, setSelectedData] = useState([]);
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const [flagData, setflagData] = useState("1");
  const [modalShow, setModalShow] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [searchfilter, setSearchFilter] = useState("");
  const [filteredData, setfilteredData] = useState([]);

  // for the  name show with .. deafult will show  the  10 charecter only
  const handleClick = (id) => {
    setSelectedName(id);
  };

  const truncateName = (name, maxLength) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  const handleDeactivate = () => {
    handleActiveDeactive();
  };

  const handleClose = () => setModalShow(false);
  const handleShow = (data_call) => {
    setSelectedData(data_call);
    setModalShow(true);
  };
  const [selectedValue, setSelectedValue] = useState("Name"); // State to hold the selected value

  const handleSelect = (event) => {
    setSelectedValue(event.target.value); // Update the selected value when an option is selected
  };

  const handleActiveDeactive = () => {
    let allow_access_data = "0";
    if (SelectedData.allow_access === "0") {
      allow_access_data = "1";
    }
    master_data_action_update(SelectedData.primary_id, allow_access_data);
  };

  useEffect(() => {
    const flag = "1";
    let call_id = "0";
    master_data_get(startDate, endDate, flag, call_id);
  }, []);

  const search_data = () => {
    const flag = "2";
    const call_id = "0";
    master_data_get(startDate, endDate, flag, call_id);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    setflagData(flag);
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("search_option", selectedValue);
    fd.append("search_data", document.getElementById("search_data").value);
    await server_post_data(get_all_staff, fd)
      .then((Response) => {
        console.log(Response.data.message);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          Response.data.message.data_staff.forEach((subObj) => {
            subObj.designation_name = Response.data.message.data_designation
              .filter(
                (optiondddd) =>
                  subObj.admin_designation === optiondddd.primary_id
              )
              .map((optiondddd) => optiondddd.designation_name);
          });
          seteditStaffData(Response.data.message.data_staff);
          setfilteredData(Response.data.message.data_staff);
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const master_data_action_update = async (call_id, for_status_final) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("id_for_delete", call_id);
    fd.append("flag_for", "1");
    fd.append("for_status_final", for_status_final);
    await server_post_data(action_update_staff, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          // toggleRef.current.click();
          handleClose();
          master_data_get(startDate, endDate, flagData, "0");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleClearDate = (datevl) => {
    if (datevl === "startDate") {
      setStartDate("");
    }

    if (datevl === "endDate") {
      setEndDate("");
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchFilter(searchValue);

    // Filter table data based on search value
    const filteredDatashow = editStaffData.filter((row) => {
      return Object.values(row).some((value) => {
        if (value !== null && value !== undefined) {
          // Add null check here
          return (
            typeof value === "string"
              ? value.toLowerCase()
              : value.toString().toLowerCase()
          ).includes(searchValue.toLowerCase());
        }
        return false;
      });
    });

    setfilteredData(filteredDatashow);
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
                <p>{ViewStaffPagesText.View_Staff}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className=" page_body">
              <div className="viewStaff">
                <div className="viewStaff_head">
                  <div className="row m-0">
                    <div className="col-xl-2 col-sm-4 bottomAlgin">
                      <label className="labelView">
                        {ViewStaffPagesText.Start_Date}
                      </label>
                      <div className="person__calenderFrame_image image_icon_position1 ">
                        <input
                          id="startDate"
                          type="date"
                          placeholder={ViewStaffPagesText.D_O_B}
                          className="form-control  input_field_custom4"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={computeTodayDate()}
                        />

                        <button
                          onClick={() => handleClearDate("startDate")}
                          className="crsBTN"
                        >
                          <div className="crsICN">
                            <img src={crosIcon} alt="barlays"/>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="col-xl-2 col-sm-4 bottomAlgin">
                      <label className="labelView">
                        {ViewStaffPagesText.End_Date}
                      </label>
                      <div className="person__calenderFrame_image image_icon_position1 ">
                        <input
                          id="endDate"
                          type="date"
                          placeholder={ViewStaffPagesText.D_O_B}
                          className="form-control  input_field_custom4"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          max={computeTodayDate()}
                        />

                        <button
                          onClick={() => handleClearDate("endDate")}
                          className="crsBTN"
                        >
                          <div className="crsICN">
                            <img src={crosIcon} alt="barlays"/>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="col-xl-2 col-sm-4 bottomAlgin">
                      <div className="inputDiv2">
                        <label className="labelPointer" htmlFor="selectFilter">
                          <img src={FilterIcon} alt="Barley's Dashboard" />
                        </label>
                        <select id="selectFilter" onChange={handleSelect}>
                          {options_search.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-xl-4 col-sm-8 bottomAlgin">
                      <div className="inputDiv2">
                        <img src={Search} alt="Barley's Dashboard" />
                        <input
                          type="text"
                          id="search_data"
                          onInput={(e) => {
                            if (selectedValue === options_search[0].value) {
                              handleAphabetsChange(e);
                            } else if (
                              selectedValue === options_search[1].value
                            ) {
                              handleEmailChange(e);
                            } else if (
                              selectedValue === options_search[2].value
                            ) {
                              handleNumbersChange(e);
                            }
                          }}
                          placeholder={ViewStaffPagesText.Search_Employee}
                        />
                        <button
                          type="button"
                          className="btnSearch"
                          onClick={() => search_data()}
                        >
                          {ViewStaffPagesText.Search_text}
                        </button>
                      </div>
                    </div>
                    <div className="col-xl-2 col-sm-4 bottomAlgin">
                      <Link to="/Add_Staff">
                        <button type="button" className="btnAddStaff add_staff">
                          {ViewStaffPagesText.Add_Employee}
                        </button>
                      </Link>
                    </div>
                    <div
                      className="col-md-4 centerAlgin"
                      style={{ marginLeft: "auto", marginRight: "0" }}
                    >
                      <div className="inputDiv2 empoyeeButtn">
                        <label className="labelPointer" htmlFor="selectFilter">
                          <img src={FilterIcon} alt="Barley's Dashboard" />
                        </label>
                        <input
                          type="text"
                          placeholder={ViewStaffPagesText.Staff_Filter}
                          onInput={handleIaphabetnumberChange}
                          value={searchfilter}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="viewStaff_table">
                  <div className="viewStaff_table_container">
                    <div className="viewStaff_table_head">
                      <div className="row m-0">
                        <div className="col-xl-3 col-md-4 centerAlgin">
                          {ViewStaffPagesText.Personal_Details}
                        </div>
                        <div className="col-xl-3 col-md-4 centerAlgin">
                          {ViewStaffPagesText.Contact_Details}
                        </div>
                        <div className="col-xl-3 col-md-4 p-0 centerAlgin">
                          {ViewStaffPagesText.Employee_Details}
                        </div>
                      </div>
                    </div>
                    {filteredData.map((option, index) => (
                      <div className="row m-0 mb-2" key={index}>
                        <div className="col-md-12">
                          <div className="viewStaff_table_Body">
                            <div className="viewStaff_table_item">
                              <div className="row m-0">
                                <div className="col-xl-3 col-md-4 p-0">
                                  <div className="prsnlDetails">
                                    <img
                                      src={
                                        StaffImageLinkData + option.admin_image
                                      }
                                      onError={(e) =>
                                        (e.target.src = EmployeeImg)
                                      }
                                      alt="Barley's Dashboard"
                                    />
                                    <div className="prsnlDetailsText">
                                      <h6
                                        className={`${
                                          option.allow_access === "0"
                                            ? "non_workingEmp"
                                            : "workingEmp"
                                        }`}
                                        onClick={() =>
                                          handleClick(option.primary_id)
                                        }
                                      >
                                        {selectedName === option.primary_id
                                          ? option.admin_name
                                          : truncateName(option.admin_name, 10)}
                                      </h6>
                                      <>
                                        DOB:{" "}
                                        {formatDateStringdot(
                                          option.admin_dob_date
                                        )}
                                      </>
                                      <p>{option.admin_gender}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-md-4 centerAlgin">
                                  <div className="prsnlDetailsText">
                                    <p>Mob. No.: {option.admin_mobile_no}</p>
                                    <p>Email: {option.admin_email} </p>
                                    <div className="prsnlDetailsSocial">
                                      <ul>
                                        <li>
                                          <a
                                            href={option.facebook_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={
                                              option.facebook_link &&
                                              option.facebook_link.length >= 5
                                                ? ""
                                                : "disabledIcon"
                                            }
                                            onClick={(e) => {
                                              if (
                                                !option.facebook_link ||
                                                option.facebook_link.length < 5
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                          >
                                            <img
                                              src={FaceBook}
                                              alt="Barley's Dashboard"
                                            />
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href={option.instagram_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={
                                              option.instagram_link &&
                                              option.instagram_link.length >= 5
                                                ? ""
                                                : "disabledIcon"
                                            }
                                            onClick={(e) => {
                                              if (
                                                !option.instagram_link ||
                                                option.instagram_link.length < 5
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                          >
                                            <img
                                              src={Instagram}
                                              alt="Barley's Dashboard"
                                            />
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href={option.linkedin_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={
                                              option.linkedin_link &&
                                              option.linkedin_link.length >= 5
                                                ? ""
                                                : "disabledIcon"
                                            }
                                            onClick={(e) => {
                                              if (
                                                !option.linkedin_link ||
                                                option.linkedin_link.length < 5
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                          >
                                            <img
                                              src={LinkedIn}
                                              alt="Barley's Dashboard"
                                            />
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-md-4 p-0 centerAlgin">
                                  <div className="prsnlDetailsText empDetailsText">
                                    <p>{option.designation_name}</p>

                                    <p>Staff ID: {option.emp_unquire_id}</p>
                                    <p>
                                      Joining Date :{" "}
                                      {formatDateStringdot(
                                        option.admin_join_date
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-md-12 paddingZero centerAlginHorizontal">
                                  <div className="editstaff_container">
                                    <div className="actionsSections">
                                      <div className="on-off-toggle">
                                        <input
                                          className="on-off-toggle__input"
                                          type="checkbox"
                                          id={`dynamic_id${option.primary_id}`}
                                          defaultChecked={
                                            option.allow_access === "1"
                                              ? true
                                              : false
                                          }
                                        />

                                        <label
                                          // htmlFor={`dynamic_id${option.primary_id}`}
                                          className="on-off-toggle__slider"
                                          onClick={(e) => handleShow(option)}
                                        ></label>
                                      </div>
                                      <Link
                                        to={`/edit_staff/${option.primary_id}`}
                                      >
                                        <button
                                          className="editStaffBtn Edti_Staff_btn"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="left"
                                          title="Edit staff"
                                        >
                                          <img
                                            src={EditBtn}
                                            alt="Barley's Dashboard"
                                          />
                                        </button>
                                      </Link>
                                    </div>
                                    <button
                                      type="button"
                                      className="sendEmailBtn Send_Email_Staff"
                                      onClick={() =>
                                        handleEmailClick(option.admin_email)
                                      }
                                    >
                                      <img
                                        src={Email}
                                        alt="Barley's Dashboard"
                                      />
                                      <p> {ViewStaffPagesText.Send_Email}</p>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredData.length === 0 && (
                      <div className="viewStaff_table_head">
                        <div className="row m-0">
                          <div className="col-xl-12 centerAlgin text_align_center">
                            No Results Found
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        className="confirmModal"
        centered
        onHide={handleClose}
      >
        <Modal.Header className="confirmModalHeader" closeButton></Modal.Header>
        <Modal.Body className="confirmBody">
          <img src={DeactiIcon} alt="Barley's Dashboard" />
          <p className="modalText">
            {ViewStaffPagesText.model_text}{" "}
            {SelectedData.allow_access === "0" ? "Activate" : "Deactivate"}?
          </p>

          <p className="modalTextRed">Name: {SelectedData.admin_name} </p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`${
              SelectedData.allow_access === "0" ? "closeConfirmAeBtn" : ""
            } closeConfirmBtn`}
            onClick={handleClose}
          >
            {ViewStaffPagesText.Close_text}
          </Button>
          <Button
            className={`${
              SelectedData.allow_access === "0"
                ? "confirmAeBtn"
                : "confirmDeBtn"
            } Confirm_Deactive`}
            onClick={handleDeactivate}
          >
            <label
              style={{ cursor: "pointer" }}
              htmlFor={`dynamic_id${SelectedData.primary_id}`}
            >
              {SelectedData.allow_access === "0" ? "Activate" : "Deactivate"}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewStaff;
