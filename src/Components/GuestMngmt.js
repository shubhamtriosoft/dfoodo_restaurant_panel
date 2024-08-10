import React, { useState, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import FilterIcon from "../assets/filterIcon.png";
import Search from "../assets/search.png";
import Email from "../assets/mailRed.png";
import GuestIcon from "../assets/guestIcon.png";
import { Modal, Button } from "react-bootstrap";
import MsgBox from "../assets/orngMsg.svg";
import OrngMsg from "../assets/orngMsg.svg";
import userIcn from "../assets/person_pin_circle.svg";
import {
  options_search,
  GuestManagementPageText,
} from "./../CommonJquery/WebsiteText";
import {
  server_post_data,
  get_all_guestInformation,
  update_guest_vip_status,
  get_all_notes_by_id,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  handleIaphabetnumberChange,
  handleEmailClick,
  handleAphabetsChange,
  handleEmailChange,
  handleNumbersChange,
  formatTimeFormatcustom,
  inputdateformateChange,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
function GuestMngmt() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  // Set initial state using useState hook
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const [SelectedData, setSelectedData] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const [flagData, setflagData] = useState("1");
  const [selectedValue, setSelectedValue] = useState("Name"); // State to hold the selected value
  const [noteShow2, setNoteShow2] = useState(false);
  const [SelectedDataDetails, setSelectedDataDetails] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const handleSelect = (event) => {
    setSelectedValue(event.target.value); // Update the selected value when an option is selected
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
    await server_post_data(get_all_guestInformation, fd)
      .then((Response) => {
        console.log(Response.data.message)
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          Response.data.message.data_customerInformation.forEach((subObj) => {
            if (subObj.guest_status === 1) {
              subObj.vipmarkdata = "vip";
            } else {
              subObj.vipmarkdata = "";
            }
          });
          seteditStaffData(Response.data.message.data_customerInformation);
          setfilteredData(Response.data.message.data_customerInformation);
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
    await server_post_data(update_guest_vip_status, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          closeModal();
          master_data_get(startDate, endDate, flagData, "0");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
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
  const [showModal, setShowModal] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [selectedGuestIndex, setSelectedGuestIndex] = useState(null);

  const openModal = (guestName, index) => {
    let tesr_show = " Not ";
    if (guestName.guest_status === 0) {
      tesr_show = "";
    }
    setSelectedData(guestName);
    setShowModal(true);
    setClickedButton(guestName.guest_name + tesr_show);
    setSelectedGuestIndex(index);
  };

  const confirmVIP = (index) => {
    let allow_access_data = "0";
    if (SelectedData.guest_status === 0) {
      allow_access_data = "1";
    }
    master_data_action_update(SelectedData.primary_id, allow_access_data);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleShow = (data_call, click_type, index) => {
    master_data_get_ajax(
      data_call.primary_id,
      data_call.primary_id,
      3,
      data_call
    );
  };

  const master_data_get_ajax = async (
    guest_mobile_no,
    reservation_id,
    flag,
    data_call
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("guest_mobile_no", guest_mobile_no);
    fd.append("reservation_id", reservation_id);
    fd.append("flag", flag);
    await server_post_data(get_all_notes_by_id, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setSelectedData(data_call);
          setSelectedDataDetails(Response.data.message.guest_data_data);
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
          setNoteShow2(true);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleNoteClose2 = () => {
    setNoteShow2(false);
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
                <p>{GuestManagementPageText.Guest_Management}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="viewStaff">
                <div className="viewStaff_head">
                  <div className="row m-0">
                    <div className="col-lg-2 col-sm-4 bottomAlgin">
                      <label className="labelView">
                        {GuestManagementPageText.Start_Date}
                      </label>
                      <div className="person__calenderFrame_image image_icon_position1 ">
                        <input
                          id="startDate"
                          type="date"
                          placeholder={GuestManagementPageText.D_O_B}
                          className="form-control  input_field_custom4"
                          defaultValue={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={computeTodayDate()}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-4 bottomAlgin">
                      <label className="labelView">
                        {GuestManagementPageText.End_Date}
                      </label>
                      <div className="person__calenderFrame_image image_icon_position1 ">
                        <input
                          id="endDate"
                          type="date"
                          placeholder={GuestManagementPageText.D_O_B}
                          className="form-control  input_field_custom4"
                          defaultValue={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          max={computeTodayDate()}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-4 bottomAlgin">
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
                    <div className="col-lg-5 col-sm-8 bottomAlgin">
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
                          placeholder={GuestManagementPageText.Search_Guest}
                        />
                        <button
                          type="button"
                          className="btnSearch"
                          onClick={() => search_data()}
                        >
                          {GuestManagementPageText.Search_text}
                        </button>
                      </div>
                    </div>

                    <div
                      className="col-xl-3 col-md-4"
                      style={{ marginLeft: "auto", marginRight: "0" }}
                    >
                      <div className="inputDiv2">
                        <label className="labelPointer" htmlFor="selectFilter">
                          <img src={FilterIcon} alt="Barley's Dashboard" />
                        </label>
                        <input
                          type="text"
                          placeholder={GuestManagementPageText.Guest_Filter}
                          value={searchfilter}
                          onInput={handleIaphabetnumberChange}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="viewGuest_table ">
                  <div className="viewGuest_table_container ">
                    <div className="row m-0">
                      <div className="col-md-12">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <div className="theadStyle imgThead  ">
                                  <span>S.No</span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle imgThead  ">
                                  <img
                                    src={GuestIcon}
                                    alt="Barley's Dashboard"
                                  />
                                  <span>
                                    {GuestManagementPageText.Guest_Name}
                                  </span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {GuestManagementPageText.Contact_Details}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {GuestManagementPageText.Email_ID}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {GuestManagementPageText.Booking_text}
                                </div>
                              </th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody className="tboday">
                            {filteredData.map((option, index) => (
                              <React.Fragment key={index}>
                                <tr className="tableRow tbodyStyle">
                                  <td className="th1 tabledata">
                                    <div className="guest_incenter borderLeftRadius">
                                      {index + 1}
                                    </div>
                                  </td>
                                  <td className="th1 tabledata">
                                    <div className="guest_incenter borderLeftRadius">
                                      {option.guest_name}
                                    </div>
                                  </td>
                                  <td className="tabledata">
                                    <div className="guest_incenter shadowOnlyBottom">
                                      {option.guest_mobile_no}
                                    </div>
                                  </td>
                                  <td className="tabledata">
                                    <div className="guest_incenter shadowOnlyBottom">
                                      {option.guest_email}
                                    </div>
                                  </td>
                                  <td className="tabledata">
                                    <div className="guest_incenter shadowOnlyBottom">
                                      {option.no_of_booking}
                                    </div>
                                  </td>
                                  <td className="th2 tabledata">
                                    <div className="guest_incenterActions borderRightRadius">
                                      {option.feedback_notes === 0 && (
                                        <button
                                          onClick={(e) =>
                                            handleShow(option, "msgshow", index)
                                          }
                                          style={{
                                            opacity: "0",
                                            pointerEvents: "none",
                                          }}
                                          className="msgicon guesticon"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="bottom"
                                          htmlFor="top"
                                          type="button"
                                          title={`Notes`}
                                        >
                                          <img
                                            src={MsgBox}
                                            alt="Barley's Dashboard"
                                          />
                                        </button>
                                      )}

                                      {option.feedback_notes > 0 && (
                                        <button
                                          onClick={(e) =>
                                            handleShow(option, "msgshow", index)
                                          }
                                          className="msgicon guesticon"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="bottom"
                                          htmlFor="top"
                                          type="button"
                                          title={`Notes`}
                                        >
                                          <img
                                            src={MsgBox}
                                            alt="Barley's Dashboard"
                                          />
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        className={`markVip Mark_Vip ${
                                          option.guest_status === 1
                                            ? "vipMarked"
                                            : ""
                                        }`}
                                        onClick={() => openModal(option, index)}
                                      >
                                        <p>VIP</p>
                                      </button>

                                      <button
                                        type="button"
                                        className="sendEmailBtn sendEmailBtnGuest Send_Email_Guest"
                                        onClick={() =>
                                          handleEmailClick(option.guest_email)
                                        }
                                      >
                                        <img
                                          src={Email}
                                          alt="Barley's Dashboard"
                                        />
                                        <p>
                                          {GuestManagementPageText.Send_Email}
                                        </p>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  key={`spacer-${index}`}
                                  style={{ height: "1rem" }}
                                ></tr>
                              </React.Fragment>
                            ))}
                            {filteredData.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text_align_center">
                                  No Results Found
                                </td>{" "}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Body className="modal_body">
          <div className="success_img d-flex justify-content-center">
            {/* ... Modal content goes here ... */}
          </div>

          <p>
            Are you sure you want to mark{" "}
            <span style={{ color: "#3268C1" }}>{clickedButton}</span> as VIP
            guest?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="logoutYesBtn"
            onClick={() => confirmVIP(selectedGuestIndex)}
          >
            Yes
          </Button>
          <Button className="logoutNoBtn" onClick={closeModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={noteShow2}
        className="releaseModal modalzindex"
        centered
        onHide={handleNoteClose2}
      >
        <Modal.Header
          style={{ border: "none", paddingBottom: "0" }}
          closeButton
        ></Modal.Header>
        <Modal.Body className="releaseModalBody notesDoby">
          <div className="booking-container">
            <>
              <div className="booking-details">
                <div className="booking-details-label">
                  <label>Notes Details</label>{" "}
                </div>
              </div>

              <div className="guest-details">
                <div className="guest-name-wrapper">
                  <div className="guest-name">{SelectedData.guest_name}</div>
                </div>
              </div>
              {SelectedDataDetails && SelectedDataDetails.length > 0 && (
                <div className="additional-info addtional_notes_css">
                  <div className="info-header">
                    <div className="info_header_container">
                      <div>
                        <img
                          src={OrngMsg}
                          alt="Calendar icon"
                          className="calendar-icon"
                        />
                      </div>

                      <div className="w-100">
                        {SelectedDataDetails &&
                          SelectedDataDetails.map((note, indexsss) => (
                            <>
                              <div key={indexsss} className="info-header-left">
                                <div className="staff-info">
                                  <img
                                    src={StaffImageLinkData + note.staff_image}
                                    onError={(e) => (e.target.src = userIcn)}
                                    alt="Staff avatar"
                                    className="staff-avatar"
                                  />
                                  <div className="staff-name">
                                    {note.staff_name}
                                  </div>
                                </div>
                                <div className="booking-datetime">
                                  {inputdateformateChange(note.entry_date)}{" "}
                                  <span
                                    style={{
                                      color: "rgba(245, 134, 52, 1)",
                                    }}
                                  >
                                    I
                                  </span>{" "}
                                  {formatTimeFormatcustom(note.entry_date)}{" "}
                                </div>
                              </div>
                              <div className="info-header-right">
                                <div className="note-item">
                                  {note.note_details}
                                </div>
                              </div>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default GuestMngmt;
