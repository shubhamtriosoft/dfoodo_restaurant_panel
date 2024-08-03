import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import "./Css/Analytics.css";
import MsgBox from "../assets/3p.svg";
import MsgBox2 from "../assets/msgbox2.svg";
import CallBtn from "../assets/phone_forwarded.svg";
import FilterIcon from "../assets/filterIcon.png";
import Search from "../assets/search.png";
import { Modal } from "react-bootstrap";
import OrngMsg from "../assets/orngMsg.svg";
import { Pagination } from "react-bootstrap";
import userIcn from "../assets/person_pin_circle.svg";
import $ from "jquery";
import {
  server_post_data,
  bad_bus_search_api,
  insert_note_from_feedback,
  get_all_notes_by_id,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  handleCallClick,
  handleIaphabetnumberChange,
  check_vaild_save,
  combiled_form_data,
  handleAphabetsChange,
  handleEmailChange,
  handleNumbersChange,
  inputdateformateChange,
  formatTimeFormatcustom,
  empty_form,
  handleSuccess,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
import { options_search } from "./../CommonJquery/WebsiteText";
function ViewFeedback() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  // Set initial state using useState hook
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const [SelectedData, setSelectedData] = useState([]);
  const [SelectedDataDetails, setSelectedDataDetails] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [searchfilter, setSearchFilter] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("Name"); // State to hold the selected value
  const [noteShow, setNoteShow] = useState(false);
  const initialCharsToShow = 35;
  const [expanded, setExpanded] = useState({});
  const tableRef = useRef(null);
  const toggleExpand = (index) => {
    // Update the expanded state based on the current value
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  const handleNoteClose = () => setNoteShow(false);

  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get("", "", flag, call_id);
  }, []);

  const search_data = () => {
    const flag = "2";
    const call_id = "0";
    master_data_get(startDate, endDate, flag, call_id);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("search_option", selectedValue);
    fd.append("search_data", document.getElementById("search_data").value);
    await server_post_data(bad_bus_search_api, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.bad_bus_searcch);
          setfilteredData(Response.data.bad_bus_searcch);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleShow = (data_call, click_type, index) => {
    master_data_get_ajax(data_call.contact_no, data_call.bb_id, 2, data_call);
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
          setNoteShow(true);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      $("#add_note_to_guest").val("");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccess(Response.data.message);
            handleNoteClose();
            empty_form(form_data);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };

  const handleSelect = (event) => {
    setSelectedValue(event.target.value);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const renderPaginationItems = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPageCount; i++) {
      pageNumbers.push(i);
    }

    if (totalPageCount <= 5) {
      return pageNumbers.map((number) => (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          // onClick={() => paginate(number)}
          onClick={() => handlePageClick(number)}
        >
          {number}
        </Pagination.Item>
      ));
    } else {
      const delta = 2;
      const left = currentPage - delta;
      const right = currentPage + delta + 1;
      let pages = [];
      let isEllipsisShown = false;

      for (let i = 1; i <= totalPageCount; i++) {
        if (i === 1 || i === totalPageCount || (i >= left && i < right)) {
          pages.push(i);
        } else if (!isEllipsisShown) {
          pages.push(-1); // -1 indicates ellipsis
          isEllipsisShown = true;
        }
      }

      return pages.map((number, index) => {
        if (number === -1) {
          return <Pagination.Ellipsis key={index} />;
        }
        return (
          <Pagination.Item
            key={index}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        );
      });
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head"></div>

            <div className="page_body">
              <div className="analytics">
                <div className="analytics_container mt-2">
                  <div className="viewStaff_head viewStaff_head2">
                    <div className="row m-0">
                      <div className="col-lg-2 col-sm-4 bottomAlgin">
                        <label className="labelView">Start Date</label>
                        <div className="person__calenderFrame_image image_icon_position1 ">
                          <input
                            id="startDate"
                            type="date"
                            className="form-control  input_field_custom4"
                            defaultValue={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={computeTodayDate()}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-4 bottomAlgin">
                        <label className="labelView">End Date</label>
                        <div className="person__calenderFrame_image image_icon_position1 ">
                          <input
                            id="endDate"
                            type="date"
                            className="form-control  input_field_custom4"
                            defaultValue={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            max={computeTodayDate()}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-4 bottomAlgin">
                        <div className="inputDiv2">
                          <label
                            className="labelPointer"
                            htmlFor="selectFilter"
                          >
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
                            placeholder="Search"
                          />
                          <button
                            type="button"
                            className="btnSearch"
                            onClick={() => search_data()}
                          >
                            Search
                          </button>
                        </div>
                      </div>

                      <div
                        className="col-xl-3 col-md-4"
                        style={{ marginLeft: "auto", marginRight: "0" }}
                      >
                        <div className="inputDiv2">
                          <label
                            className="labelPointer"
                            htmlFor="selectFilter"
                          >
                            <img src={FilterIcon} alt="Barley's Dashboard" />
                          </label>
                          <input
                            type="text"
                            placeholder="Search Feedback"
                            value={searchfilter}
                            onInput={handleIaphabetnumberChange}
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="analyticsCardsContainer">
                    <div className="feedBackTable">
                      <div className="feedBackTable_container feedBackTable_container2">
                        <h5>Feedbacks</h5>

                        <table
                          id="myTable"
                          className="display table"
                          ref={tableRef}
                        >
                          <thead>
                            <tr>
                              <th scope="col" className="th3">
                                Name
                              </th>
                              <th scope="col">Contact No</th>
                              <th scope="col">Feedback</th>
                              <th className="th4"></th>
                            </tr>
                            <tr style={{ height: "25px" }}></tr>
                          </thead>
                          <tbody>
                            {currentItems.map((item, index) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td className="th3">
                                    <div className="recentANme">
                                      <img
                                        src={MsgBox}
                                        alt="Barley's Dashboard"
                                      />
                                      <div>
                                        <p>{item.name_user}</p>
                                        <p>{item.entry_date}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentContact">
                                      <p>{item.contact_no}</p>
                                      <p>{item.email}</p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentFeedback">
                                      <p>
                                        {expanded[index]
                                          ? item.msg
                                          : item.msg.slice(
                                              0,
                                              initialCharsToShow
                                            )}
                                        {!expanded[index] &&
                                          item.msg.length >
                                            initialCharsToShow &&
                                          "..."}
                                      </p>
                                      {item.msg.length > initialCharsToShow && (
                                        <div className="recentFeedbackBtn">
                                          <p
                                            className="show-more"
                                            onClick={() => toggleExpand(index)}
                                          >
                                            {expanded[index]
                                              ? "Show Less"
                                              : "Show More"}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  <td className="th4">
                                    <div className="recentReservBtns">
                                      <button
                                        className="mb-2"
                                        onClick={() =>
                                          handleShow(item, "", index)
                                        }
                                      >
                                        <p>Add Note</p>
                                        <img
                                          src={MsgBox2}
                                          alt="Barley's Dashboard"
                                        />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCallClick(item.contact_no)
                                        }
                                      >
                                        <p>Contact Now</p>
                                        <img
                                          src={CallBtn}
                                          alt="Barley's Dashboard"
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  style={{ height: "1rem", boxShadow: "none" }}
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
                        <Pagination>
                          <div className="paginationContainer">
                            <div className="nxtBttnTble">
                              {!searchfilter && currentPage !== 1 ? (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    setCurrentPage((prev) =>
                                      prev > 1 ? prev - 1 : prev
                                    )
                                  }
                                >
                                  Previous
                                </button>
                              ) : null}
                            </div>
                            <div className="d-flex gap-2">
                              {renderPaginationItems()}
                            </div>
                            {!searchfilter && (
                              <div className="nxtBttnTble">
                                <button
                                  className="btn btn-primary"
                                  disabled={currentPage === totalPageCount}
                                  onClick={() =>
                                    setCurrentPage((prev) =>
                                      prev < totalPageCount ? prev + 1 : prev
                                    )
                                  }
                                >
                                  Next
                                </button>
                              </div>
                            )}
                          </div>
                        </Pagination>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={noteShow}
        className="releaseModal"
        centered
        onHide={handleNoteClose}
      >
        <Modal.Header
          style={{ border: "none", paddingBottom: "0" }}
          closeButton
        ></Modal.Header>
        <Modal.Body className="releaseModalBody notesDoby">
          <div className="booking-container">
            <div className="guest-details">
              <div className="guest-name-wrapper">
                <div className="guest-name">{SelectedData.name_user}</div>
                <div className="guest-name">{SelectedData.email}</div>
                <div className="guest-name">{SelectedData.contact_no}</div>
              </div>
            </div>
            <div className="additional-info addtional_notes_css">
              {SelectedDataDetails.length > 0 && (
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
                      {SelectedDataDetails.map((note, indexsss) => (
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
                            <div className="note-item">{note.note_details}</div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="add-notes-button2">
                <img
                  src={OrngMsg}
                  alt="Add notes icon"
                  className="add-notes-icon"
                />

                <form id="notes_data_search_form_data">
                  <input
                    className="w-100 form-control py-0 trio_mandatory h-26px"
                    type="text"
                    name="add_note_to_guest"
                    id="add_note_to_guest"
                    minLength={4}
                    maxLength={100}
                    placeholder="Type your note..."
                  />
                  <input
                    className="w-100 hidden"
                    type="text"
                    name="feed_back_id"
                    defaultValue={SelectedData.bb_id}
                    minLength={4}
                    maxLength={100}
                  />
                  <input
                    className="w-100 hidden"
                    type="text"
                    name="guest_mobile_no"
                    defaultValue={SelectedData.contact_no}
                    minLength={4}
                    maxLength={100}
                  />
                  <input
                    className="w-100 hidden"
                    type="text"
                    name="guest_email"
                    defaultValue={SelectedData.email}
                    minLength={4}
                    maxLength={100}
                  />
                  <input
                    className="w-100 hidden"
                    type="text"
                    name="guest_name"
                    defaultValue={SelectedData.name_user}
                    minLength={4}
                    maxLength={100}
                  />
                </form>
                <button
                  className="ad"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "notes_data_search_form_data",
                      insert_note_from_feedback
                    )
                  }
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewFeedback;
