import React, { useState, useEffect } from "react";
import FilterIcon from "../assets/filterIcon.png";
import Search from "../assets/search.png";
import Person from "../assets/person.png";
import PersonCount from "../assets/account_circle.svg";
import Pets from "../assets/pets.svg";
import Childs from "../assets/escalator_warning.svg";
import { Modal, Button } from "react-bootstrap";
import DoneGreen from "../assets/doneGreen.svg";
import Loader from "./Loader.js";

import userIcn from "../assets/person_pin_circle.svg";
import OrngMsg from "../assets/orngMsg.svg";
import {
  ViewStaffPagesText,
  options_search,
} from "./../CommonJquery/WebsiteText";
import TimeTable from "../assets/time_table.svg";
import {
  server_post_data,
  view_reservation_history,
  allot_table_to_reservation,
  action_update_staff,
  table_release_from_reservation,
  APL_LINK,
  get_all_notes_by_id,
} from "../ServiceConnection/serviceconnection.js";
import {
  computeTodayDate,
  handleAphabetsChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  inputdateformateChange,
  formatTimeintotwodigit,
  handleLinkClick,
  handleNumbersDecimalChange,
  handleAlphabetsNumberWithoutSpaceChange,
  handleEmailChange,
  handleNumbersChange,
  handleIaphabetnumberChange,
  handleSuccess,
  formatDateStringdot,
  formatTimeFormatcustom,
  computeplussevendays,
} from "../CommonJquery/CommonJquery.js";
const ReservationHistory = ({ sharedValue }) => {
  let flag = "1";
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);
  const [infoShow, setInfoShow] = useState(false);
  const [SelectedTableForBooking, setSelectedTableForBooking] = useState([]);
  const [SelectedReservationBooking, setSelectedReservationBooking] = useState(
    []
  );
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [noteShow2, setNoteShow2] = useState(false);
  const [flagData, setflagData] = useState("1");
  let formattedSevenDaysAgo = computeplussevendays();
  let formattedToday = computeTodayDate();

  if (sharedValue !== null) {
    formattedToday = sharedValue;
    formattedSevenDaysAgo = sharedValue;
    flag = "2";
  }
  // Set initial state using useState hook
  const [startDate, setStartDate] = useState(formattedSevenDaysAgo);
  const [endDate, setEndDate] = useState(formattedToday);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [Moneyiconleft, setMoneyiconleft] = useState(null);
  const [Moneyiconright, setMoneyiconright] = useState(null);
  const [searchfilter, setSearchFilter] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const [SelectedDataDetails, setSelectedDataDetails] = useState([]);
  const handleClose1 = () => setModalShow1(false);
  const handleClose = () => setModalShow(false);
  const handleNoteClose2 = () => {
    setNoteShow2(false);
  };
  const handleShow = (data_call, click_type, index) => {
    console.log(click_type);
    const currentTime = new Date();
    // const timeParts = "14:15:00".split(":"); // Split the time string
    const timeParts = data_call.book_time.split(":"); // Split the time string
    const DateParts = data_call.book_date.split("-"); // Split the time string
    const givenTime = new Date(
      DateParts[0],
      DateParts[1],
      DateParts[2],
      timeParts[0],
      timeParts[1],
      timeParts[2]
    );
    let isWithinFifteenMinutes = false;
    // Check if `givenTime` is a valid Date object
    if (isNaN(givenTime.getTime())) {
      console.log(
        "Invalid date format for data_call.book_time:",
        data_call.book_time
      );
      // Handle the error accordingly
    } else {
      const fifteenMinutesBeforeGivenTime = new Date(
        givenTime.getTime() - 15 * 60000
      );
      isWithinFifteenMinutes =
        currentTime.getTime() >= fifteenMinutesBeforeGivenTime.getTime();
    }
    isWithinFifteenMinutes = true;
    if (click_type === "no_show") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        counter_invoice: data_call.counter_invoice,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "4",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to mark this reservation as No Show?",
        button_name: "No Show",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "cancel") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        counter_invoice: data_call.counter_invoice,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "6",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to mark this reservation as Cancel?",
        button_name: "Yes",
        button_name_next: "No",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "revive") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        counter_invoice: data_call.counter_invoice,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "1",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Revive this reservation?",
        button_name: "Revive",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "dispute") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        counter_invoice: data_call.counter_invoice,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "8",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Dispute this reservation?",
        button_name: "Dispute",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "accepts") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        counter_invoice: data_call.counter_invoice,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "1",
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Accept the request?",
        button_name: "Accept",
        edit_click: true,
        button_name_next: "Edit Now",
        button_class: "assignModalBtn",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "decline") {
      console.log(data_call);
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        counter_invoice: data_call.counter_invoice,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "5",
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Decline the request?",
        button_name: "Decline",
        edit_click: false,
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "realeasetable") {
      console.log(data_call);
      setSelectedData(data_call);
      setModalShow1(true);
    } else if (click_type === "msgshow") {
      console.log(data_call);
      master_data_get_ajax(
        data_call.guest_mobile_no,
        data_call.primary_id,
        1,
        data_call
      );
    } else if (click_type === "edit_reservation") {
      handleLinkClick("edit_Reservation/" + data_call.primary_id);
    } else if (click_type === "got_to_dashboard") {
      handleLinkClick("Dashboard");
    }
  };
  const handleActiveDeactive = () => {
    if (SelectedData.comfirm_booking) {
      handleSaveChangesdynamic(null, allot_table_to_reservation);
    } else {
      master_data_action_update(
        SelectedData.primary_id,
        SelectedData.booking_status
      );
    }
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

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = true;
    if (form_data !== null) {
      vaild_data = check_vaild_save(form_data);
    }

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = new FormData();
      if (form_data !== null) {
        fd_from = combiled_form_data(form_data, null);
      }

      fd_from.append("reservation_id", SelectedReservationBooking.primary_id);
      let table_id_dd = "";
      let table_name_dd = "";
      let max_person_dd = 0;
      let min_person_dd = 0;
      let preferred_person_dd = 0;
      let total_table_count = 0;
      if (SelectedTableForBooking.length > 0) {
        let uniqueTableIds = {};
        SelectedTableForBooking.forEach((item, i) => {
          // Add the table_id to the object with a value of true
          uniqueTableIds[item.table_id] = {
            table_id: item.table_id,
            table_name: item.table_name,
            max_person: item.max_person,
            min_person: item.min_person,
            preferred_person: item.preferred_person,
          };
        });

        for (let key in uniqueTableIds) {
          if (uniqueTableIds.hasOwnProperty(key)) {
            total_table_count++;
            table_id_dd += uniqueTableIds[key].table_id + ",";
            table_name_dd += uniqueTableIds[key].table_name + ",";
            max_person_dd += uniqueTableIds[key].max_person;
            min_person_dd += uniqueTableIds[key].min_person;
            preferred_person_dd += uniqueTableIds[key].preferred_person;
          }
        }
        table_id_dd = table_id_dd.slice(0, -1);
        table_name_dd = table_name_dd.slice(0, -1);
        fd_from.append("table_id_dd", table_id_dd);
        fd_from.append("total_tablebooking", total_table_count);
        fd_from.append("table_name_dd", table_name_dd);
        fd_from.append("max_person_dd", max_person_dd);
        fd_from.append("min_person_dd", min_person_dd);
        fd_from.append("preferred_person_dd", preferred_person_dd);
        fd_from.append("available_online_dd", "0");
        fd_from.append("priority_level_dd", "0");
        await server_post_data(url_for_save, fd_from)
          .then((Response) => {
            setshowLoaderAdmin(false);
            if (Response.data.error) {
              handleError(Response.data.message);
            } else {
              handleSuccessSession(Response.data.message, "/allot_table");
            }
          })
          .catch((error) => {
            setshowLoaderAdmin(false);
            handleError("network");
          });
      }
    }
  };

  const handleSaveChangesdynamic_relase = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    console.log(vaild_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("reservation_id", SelectedData.primary_id);

      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleClose1();
            handleSuccessSession(Response.data.message, "/allot_table");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const [selectedValue, setSelectedValue] = useState("Name"); // State to hold the selected value

  const handleSelect = (event) => {
    setSelectedValue(event.target.value); // Update the selected value when an option is selected
  };

  const search_data = () => {
    flag = "2";
    const call_id = "0";
    master_data_get(startDate, endDate, flag, call_id);
  };

  useEffect(() => {
    let call_id = "0";
    master_data_get(startDate, endDate, flag, call_id);
  }, []);

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
    await server_post_data(view_reservation_history, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data_reservationInformation);
          setfilteredData(Response.data.message.data_reservationInformation);
          setMoneyiconright(Response.data.message.data_money_right);
          setMoneyiconleft(Response.data.message.data_money_left);
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
        console.log(Response.data);
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
    <>
      <div className="reservationHistory">
        {showLoaderAdmin && <Loader />}
        <div className="viewStaff_head">
          <div className="row m-0">
            <div className="col-lg-2 col-sm-4 bottomAlgin">
              <label className="labelView">
                {ViewStaffPagesText.Start_Date}
              </label>
              <div className="person__calenderFrame_image image_icon_position1 ">
                <input
                  id="startDate"
                  type="date"
                  placeholder={ViewStaffPagesText.D_O_B}
                  className="form-control  input_field_custom4"
                  defaultValue={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={computeTodayDate()}
                />
              </div>
            </div>
            <div className="col-lg-2 col-sm-4 bottomAlgin">
              <label className="labelView">{ViewStaffPagesText.End_Date}</label>
              <div className="person__calenderFrame_image image_icon_position1 ">
                <input
                  id="endDate"
                  type="date"
                  placeholder={ViewStaffPagesText.D_O_B}
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
                    } else if (selectedValue === options_search[1].value) {
                      handleEmailChange(e);
                    } else if (selectedValue === options_search[2].value) {
                      handleNumbersChange(e);
                    }
                  }}
                  placeholder={ViewStaffPagesText.Search_Employee_reservation}
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

            <div
              className="col-md-4 centerAlgin"
              style={{ marginLeft: "auto", marginRight: "0" }}
            >
              <div className="inputDiv2">
                <label className="labelPointer" htmlFor="selectFilter">
                  <img src={FilterIcon} alt="Barley's Dashboard" />
                </label>
                <input
                  type="text"
                  placeholder={ViewStaffPagesText.Staff_Filter_reservation}
                  onInput={handleIaphabetnumberChange}
                  value={searchfilter}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="reservationHistoryTable">
          <div className="historyTableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Sr.No.</th>
                  <th scope="col">Time</th>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <img src={Person} alt="Barley's Dashboard" />
                  </th>
                  <th scope="col">Table</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((option, index) => (
                  <tr className="historyTableRow" key={index}>
                    <td>
                      <div
                        style={{
                          marginLeft: "1rem",
                          fontSize: "14px",
                          marginTop: "1.2rem",
                        }}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <div className="topMargin historyTime">
                        <p>
                          {option.booking_type === 0 && <>Walk In : </>}
                          {option.booking_type === 1 && <>Reservation : </>}
                          {option.booking_type === 2 && <>Online : </>}

                          {formatDateStringdot(option.book_date)}
                        </p>
                        <div className="historyTimeImgText">
                          <img src={TimeTable} alt="Barley's Dashboard" />
                          <p>{formatTimeintotwodigit(option.book_time)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="historyTableRowText historyName">
                        <h6 className="infoDetalisStats">
                          {option.guest_name}{" "}
                          {option.guest_status === 1 && (
                            <p className="statusName personTag">VIP</p>
                          )}
                          {option.customer_new_old === 0 && (
                            <p className=" statusName personTag">NEW</p>
                          )}
                        </h6>
                        <p>Contact No.: {option.guest_mobile_no}</p>
                        <p>{option.guest_email}</p>
                      </div>
                    </td>
                    <td>
                      <div className="historyTableRowText historyStatus">
                        {option.booking_status === 0 && (
                          <p className="toConfirm">To Confirm</p>
                        )}
                        {option.booking_status === 1 && (
                          <p className="toArrive">To Arrive</p>
                        )}
                        {option.booking_status === 2 && (
                          <p className="toreserved">Reserved</p>
                        )}

                        {option.booking_status === 3 && (
                          <p className="toCompleted">Completed</p>
                        )}

                        {option.booking_status === 4 && (
                          <p className="tonoshow">No Show</p>
                        )}

                        <p>ID : {option.counter_invoice}</p>
                        <p>
                          Booking date: {formatDateStringdot(option.entry_date)}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="historyTableRowText historyPerson">
                        <div>
                          <img src={PersonCount} alt="Barley's Dashboard" />
                          <p>{option.no_of_guest}P</p>
                        </div>
                        <div>
                          <img src={Pets} alt="Barley's Dashboard" />
                          <p>
                            {option.no_of_pets} pet
                            {option.no_of_pets > 1 && "s"}
                          </p>
                        </div>
                        <div>
                          <img src={Childs} alt="Barley's Dashboard" />
                          <p>
                            {option.no_of_child}{" "}
                            {option.no_of_child > 1 ? "children" : "child"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="historyTableRowText historyActions">
                        <div className="historyActionsBtns mb-2">
                          {option.note_intruction != 0 && (
                            <button
                              className="instructions Add_Instructions"
                              onClick={() => handleShow(option, "msgshow")}
                            >
                              INSTRUCTIONS
                            </button>
                          )}

                          <button className="tableNo Add_Instructions">
                            {option !== null &&
                            option.table_code_names !== undefined &&
                            option.table_code_names !== "" &&
                            option.table_code_names !== null
                              ? option.table_code_names.replace(/,/g, "+")
                              : ""}
                          </button>
                        </div>
                        <div className="historyActionsBtns">
                          {/* {option.booking_status === 0 && (
                            <>
                              <button
                                className="acceptResrv Accept_Reservation"
                                onClick={(e) => handleShow(option, "accepts")}
                              >
                                Accept
                              </button>
                              <button
                                className="noShowActiveResrv"
                                onClick={(e) => handleShow(option, "decline")}
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {option.booking_status === 1 && (
                            <>
                              <button
                                className="arrivedResrv Arrived_Reservation"
                                onClick={(e) =>
                                  handleShow(option, "got_to_dashboard")
                                }
                              >
                                Arrived
                              </button>
                              <button
                                className="noShowActiveResrv"
                                onClick={(e) => handleShow(option, "no_show")}
                              >
                                No Show
                              </button>
                            </>
                          )}
                          {option.booking_status === 2 && (
                            <>
                              <button
                                className="cancelRsrv Release_Table"
                                onClick={(e) =>
                                  handleShow(option, "realeasetable")
                                }
                              >
                                Released
                              </button>
                              <button
                                className="declineResrv Decline_Reservation"
                                onClick={(e) => handleShow(option, "cancel")}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {option.booking_status === 4 && (
                            <>
                              <button
                                className="cancelRsrv Release_Table"
                                onClick={(e) => handleShow(option, "revive")}
                              >
                                Revive
                              </button>
                              <button
                                className="declineResrv Decline_Reservation"
                                onClick={(e) => handleShow(option, "dispute")}
                              >
                                Dispute
                              </button>
                            </>
                          )} */}

                          {option.booking_status === 3 && (
                            <>
                              <div className="historyActionsBtns">
                                <button className="billResrv">
                                  Bill No. {option.invoice_no_bill}
                                </button>
                                <button className="declineResrv">
                                  {Moneyiconleft}
                                  {option.payout_amt}
                                  {Moneyiconright}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
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
        <Modal
          show={modalShow}
          className="releaseModal"
          centered
          onHide={(e) => handleClose(0)}
        >
          <Modal.Header className="releaseModalHeader"></Modal.Header>
          <Modal.Body className="releaseModalBody">
            <p> ID:{SelectedData.counter_invoice}</p>
            <div className="releaseModalHead">
              <div className="releaseModalHeadLeft align-items-start">
                <img
                  style={{ paddingTop: "0.2rem" }}
                  src={DoneGreen}
                  alt="Barley's Dashboard"
                />
                <h5>
                  <span>&nbsp;{SelectedData.show_msg}</span>
                </h5>
              </div>
              {/* <div className="releaseModalHeadRight">
                      <img src={OrngMsg} alt="Barley's Dashboard" />
                    </div> */}
            </div>
            <div className="releaseModalDetails">
              <h5>{SelectedData.guest_name}</h5>
              <p className="redtext">{SelectedData.table_code_names}</p>
              <p>
                BOOKING DATE : {inputdateformateChange(SelectedData.book_date)}
              </p>
              <p>
                BOOKING TIME : {formatTimeintotwodigit(SelectedData.book_time)}
              </p>
              <div className="countOfGuests">
                <p>
                  {SelectedData.no_of_guest}{" "}
                  {SelectedData.no_of_guest > 1 ? "PERSON" : "PERSON"}{" "}
                </p>
                <p>
                  {SelectedData.no_of_child}{" "}
                  {SelectedData.no_of_child > 1 ? "CHILDREN" : "CHILD"}
                </p>
                <p>
                  {SelectedData.no_of_pets}{" "}
                  {SelectedData.no_of_pets > 1 ? "PETS" : "PET"}{" "}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="releaseModalFooter">
            <Button
              className={`releaseModalBtn ${SelectedData.button_class}`}
              onClick={handleActiveDeactive}
            >
              {SelectedData.button_name}
            </Button>

            <Button
              className="editNowBtn Edit_Now"
              onClick={(e) => handleClose(1)}
            >
              <label style={{ cursor: "pointer" }}>
                {SelectedData.button_name_next}
              </label>
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modalShow1}
          className="releaseModal"
          centered
          onHide={handleClose1}
        >
          <Modal.Header className="releaseModalHeader"></Modal.Header>
          <Modal.Body className="releaseModalBody">
            <p> ID:{SelectedData.counter_invoice}</p>
            <div className="releaseModalHead">
              <div className="releaseModalHeadLeft">
                <img src={DoneGreen} alt="Barley's Dashboard" />
                <h5>
                  Release Table
                  <span>&nbsp;{SelectedData.table_code_names}</span>
                </h5>
              </div>
              {/* <div className="releaseModalHeadRight">
                      <img src={OrngMsg} alt="Barley's Dashboard" />
                    </div> */}
            </div>
            <div className="releaseModalDetails">
              <h5>{SelectedData.guest_name}</h5>
              <p>
                BOOKING DATE : {inputdateformateChange(SelectedData.book_date)}
              </p>
              <p>
                BOOKING TIME : {formatTimeintotwodigit(SelectedData.book_time)}
              </p>
              <div className="countOfGuests">
                <p>{SelectedData.no_of_guest} PERSON</p>

                <p>
                  {SelectedData.no_of_child}{" "}
                  {SelectedData.no_of_child > 1 ? "CHILDREN" : "CHILD"}
                </p>
                <p>
                  {SelectedData.no_of_pets}{" "}
                  {SelectedData.no_of_pets > 1 ? "PETS" : "PET"}{" "}
                </p>
              </div>
            </div>
            <form id="update_realse_data">
              <div className="update_realse_dataContainer">
                <div className="inpContainer m-0">
                  <div className=" image_icon_position image_icon_position1">
                    <input
                      type="text"
                      id="payout_amt"
                      name="payout_amt"
                      tabIndex="1"
                      placeholder={"Enter Bill Amount"}
                      minLength={3}
                      maxLength={10}
                      className="  form-control  input_field_custom1 "
                      style={{ paddingLeft: "1rem" }}
                      onInput={handleNumbersDecimalChange}
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="inpContainer m-0">
                  <div className=" image_icon_position image_icon_position1">
                    <input
                      type="text"
                      id="invoice_no_bill"
                      name="invoice_no_bill"
                      tabIndex="1"
                      placeholder={"Enter Invoice No Bill"}
                      minLength={3}
                      maxLength={30}
                      style={{ paddingLeft: "1rem" }}
                      className="  form-control  input_field_custom1 "
                      onInput={handleAlphabetsNumberWithoutSpaceChange}
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="releaseModalFooter">
            <Button
              className="releaseModalBtn Release_Table"
              onClick={() =>
                handleSaveChangesdynamic_relase(
                  "update_realse_data",
                  table_release_from_reservation
                )
              }
            >
              RELEASE TABLE
            </Button>
            <Button className="editNowBtn Edit_Now" onClick={handleClose1}>
              <label style={{ cursor: "pointer" }}>Cancel</label>
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={noteShow2}
          className="releaseModal"
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
                    <label>Booking Details</label>{" "}
                    <p> ID:{SelectedData.counter_invoice}</p>
                  </div>
                  <div className="booking-info">
                    <div className="booking-date">
                      {inputdateformateChange(SelectedData.book_date)}
                    </div>
                    <div className="booking-time">
                      Booking Time :{" "}
                      {formatTimeintotwodigit(SelectedData.book_time)}
                    </div>
                    <div className="table-number">
                      {SelectedData !== null &&
                      SelectedData.table_code_names !== undefined &&
                      SelectedData.table_code_names !== "" &&
                      SelectedData.table_code_names !== null
                        ? SelectedData.table_code_names.replace(/,/g, "+")
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="guest-details">
                  <div className="guest-name-wrapper">
                    <div className="guest-name">{SelectedData.guest_name}</div>

                    <div className="guest-count">
                      <p>{SelectedData.no_of_guest} PERSON</p>

                      <p>
                        {SelectedData.no_of_child}{" "}
                        {SelectedData.no_of_child > 1 ? "CHILDREN" : "CHILD"}
                      </p>
                      <p>
                        {SelectedData.no_of_pets}{" "}
                        {SelectedData.no_of_pets > 1 ? "PETS" : "PET"}{" "}
                      </p>
                    </div>
                    <div className="guest-name">
                      {SelectedData.reservation_description}
                    </div>
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
                                <div
                                  key={indexsss}
                                  className="info-header-left"
                                >
                                  <div className="staff-info">
                                    <img
                                      src={
                                        StaffImageLinkData + note.staff_image
                                      }
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
    </>
  );
};

export default ReservationHistory;
