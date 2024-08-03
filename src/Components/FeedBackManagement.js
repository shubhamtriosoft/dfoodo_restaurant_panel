import React, { useEffect, useState, useRef } from "react";
import { Pagination } from "react-bootstrap";
import Header from "./Header";
import Loader from "./Loader.js";
import Google from "../assets/google.svg";
import Trip from "../assets/Tripadvisor.svg";
import "./Css/Analytics.css";
import dropdown from "../assets/arrow_drop_down_24px.svg";
import Chart from "react-apexcharts";
import StarFilled from "../assets/kid_star.svg";
import Star from "../assets/kid_starBlack.svg";
import HalfStar from "../assets/kid_starBlackHalf.svg";
import MsgBox from "../assets/3p.svg";
import MsgBox2 from "../assets/msgbox2.svg";
import CallBtn from "../assets/phone_forwarded.svg";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Modal } from "react-bootstrap";
import OrngMsg from "../assets/orngMsg.svg";
import userIcn from "../assets/person_pin_circle.svg";
import $ from "jquery";
import {
  server_post_data,
  feedback_dashboard_view,
  insert_note_from_feedback,
  get_all_notes_by_id,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  handleCallClick,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  inputdateformateChange,
  formatTimeFormatcustom,
  handleSuccess,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
import html2canvas from "html2canvas";
import { options_select_drop_feedback } from "./../CommonJquery/WebsiteText";
function FeedBackManagement() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [TatalPlusData, setTatalPlusData] = useState([]);
  const [TotalGoogleRating, setTotalGoogleRating] = useState(0);
  const [TotalGoogleUserRating, setTotalGoogleUserRating] = useState(0);
  const [TotalTripRating, setTotalTripRating] = useState(0);
  const [TotalTripUserRating, setTotalTripUserRating] = useState(0);
  const [TotalReviewPositive, setTotalReviewPositive] = useState();
  const [xAxisCategories, setXAxisCategories] = useState([]);
  const [PositiveData, setPositiveData] = useState([]);
  const [NegativeData, setNegativeData] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [TotalReviewNagative, setTotalReviewNagative] = useState();
  const [customDateActive, setCustomDateActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState(options_select_drop_feedback[0]);
  const [noteShow, setNoteShow] = useState(false);
  const [SelectedData, setSelectedData] = useState([]);
  const [SelectedDataDetails, setSelectedDataDetails] = useState([]);
  // Set initial state using useState hook
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const handleDownloadButtonClick = () => {
    html2canvas(document.body).then((canvas) => {
      const link = document.createElement("a");
      link.download = "feedback.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };
  const handleNoteClose = () => setNoteShow(false);
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
      $("#add_note_to_guest").val();
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

  const series = [
    Number(TatalPlusData.negetive_review),
    Number(TatalPlusData.positive_review),
  ];
  const optionsRadial2 = {
    chart: {
      type: "donut",
    },
    labels: ["Negative Feedback", "Positive Feedback"],
    colors: ["#fd5344", "#3aa148"],
    legend: {
      show: false,
    },
    annotations: {
      center: {
        text: "Center Text",
        style: {
          fontSize: "20px",
          color: "#000", // Color of the center text
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const seriesBar = [
    {
      name: "Positive",
      data: PositiveData,
    },
    {
      name: "Negative",
      data: NegativeData,
    },
  ];
  const optionsBar = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%", // Adjust the width of the bars
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["#67D880", "#FF6464"],
      opacity: 1,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xAxisCategories,
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      show: false, // Hide legends
    },
  };

  const initialCharsToShow = 35;
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    // Update the expanded state based on the current value
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get("", "", flag, call_id, selected.value);
  }, []);

  const tableRef = useRef(null);

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    select_type
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    const current_date = new Date(); // Initialize current_date with the current date
    if (select_type === "today") {
      start_date = start_date_fn(current_date);
      end_date = end_date_fn(current_date);
    } else if (select_type === "last_7_days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      start_date = start_date_fn(sevenDaysAgo);
      end_date = end_date_fn(current_date);
    } else if (select_type === "this_month") {
      const firstDayOfMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + 1,
        0
      );
      start_date = start_date_fn(firstDayOfMonth);
      end_date = end_date_fn(lastDayOfMonth);
    } else if (select_type === "last_month") {
      const firstDayOfLastMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth(),
        0
      );
      start_date = start_date_fn(firstDayOfLastMonth);
      end_date = end_date_fn(lastDayOfLastMonth);
    } else if (select_type === "this_year") {
      const firstDayOfYear = new Date(current_date.getFullYear(), 0, 1);
      start_date = start_date_fn(firstDayOfYear);
      end_date = end_date_fn(current_date);
    }

    function start_date_fn(start_date) {
      // Formatting start date
      const start_year = start_date.getFullYear();
      const start_month = (start_date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const start_day = start_date.getDate().toString().padStart(2, "0");
      return `${start_year}-${start_month}-${start_day}`;
    }

    function end_date_fn(end_date) {
      // Formatting end date
      const end_year = end_date.getFullYear();
      const end_month = (end_date.getMonth() + 1).toString().padStart(2, "0");
      const end_day = end_date.getDate().toString().padStart(2, "0");
      return `${end_year}-${end_month}-${end_day}`;
    }

    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("select_type", select_type);
    await server_post_data(feedback_dashboard_view, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.bad_bus_search);
          setTotalGoogleUserRating(
            Response.data.rating_google.result.user_ratings_total
          );
          setTotalGoogleRating(Response.data.rating_google.result.rating);
          setTotalTripUserRating(Response.data.user_ratings_total_trip);
          setTotalTripRating(Response.data.rating_trip);
          const categories = Response.data.view_data.map(
            (item) => item.todisplay
          );
          setXAxisCategories(categories);
          let total_card_possitive = 0;
          let total_card_nagitive = 0;
          const positive_list = Response.data.view_data.map((posnegObj) => {
            let have_data = 0;
            let total_count = 0; // Initialize total_count to 0

            Response.data.positive_data.forEach((subObj) => {
              const trimmedEntryDate = subObj.entry_date2.replace(/^0+/, "");
              const trimmedToCheck = posnegObj.tocheck.replace(/^0+/, "");
              if (String(trimmedEntryDate) === String(trimmedToCheck)) {
                total_count = subObj.total_count; // Assign total_count if entry_date2 matches
                total_card_possitive += Number(total_count);
                have_data = 1;
              }
            });

            return have_data ? total_count : 0; // Return total_count if have_data is 1, otherwise return 0
          });
          setPositiveData(positive_list);
          console.log(positive_list);

          const negative_list = Response.data.view_data.map((posnegObj) => {
            let have_data = 0;
            let total_count = 0; // Initialize total_count to 0

            Response.data.nagitive_data.forEach((subObj) => {
              const trimmedEntryDate = subObj.entry_date2.replace(/^0+/, "");
              const trimmedToCheck = posnegObj.tocheck.replace(/^0+/, "");
              if (String(trimmedEntryDate) === String(trimmedToCheck)) {
                total_count = subObj.total_count; // Assign total_count if entry_date2 matches
                total_card_nagitive += Number(total_count);
                have_data = 1;
              }
            });

            return have_data ? total_count : 0; // Return total_count if have_data is 1, otherwise return 0
          });

          setNegativeData(negative_list);
          console.log(negative_list);

          setTatalPlusData(Response.data.busniess_plus_min[0]);
          let total_positive = 0;
          let total_nagitive = 0;
          Response.data.positive_data.forEach((subObj) => {
            total_positive += Number(subObj.total_count);
          });
          Response.data.nagitive_data.forEach((subObj) => {
            total_nagitive += Number(subObj.total_count);
          });

          let array_data = {
            negetive_review: total_card_nagitive,
            positive_review: total_card_possitive,
          };
          setTatalPlusData(array_data);

          setTotalReviewPositive(total_positive);
          setTotalReviewNagative(total_nagitive);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const select_dropdown = (itemsdata) => {
    setIsSelected(itemsdata);
    setIsActive(!isActive);

    if (itemsdata.datepicker_show) {
      setCustomDateActive(true);
    } else {
      setCustomDateActive(false);
      master_data_get("", "", "1", "", itemsdata.value);
    }
  };

  const search_data = () => {
    master_data_get(startDate, endDate, "1", "", selected.value);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = editStaffData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPageCount = Math.ceil(editStaffData.length / itemsPerPage);

  const paginate = (pageNumber) => {
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
          onClick={() => paginate(number)}
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

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="analyticsHead">
                <div className="analyticFIlter">
                  <div className="col-xl-10">
                    <div className="row m-0">
                      <div className="col-md-4">
                        <div className="dropdownCustom" ref={dropdownRef}>
                          <div
                            onClick={(e) => {
                              setIsActive(!isActive);
                            }}
                            className="dropdownCustom-btn"
                          >
                            Period: {selected.label}
                            <span
                              className={
                                isActive
                                  ? "fas fa-caret-up"
                                  : "fas fa-caret-down"
                              }
                            >
                              <img src={dropdown} alt="Barley's Dashboard" />
                            </span>
                          </div>
                          <div
                            className="dropdownCustom-content"
                            style={{ display: isActive ? "block" : "none" }}
                          >
                            {options_select_drop_feedback.map(function (
                              items,
                              index
                            ) {
                              return (
                                <div
                                  onClick={(e) => {
                                    select_dropdown(items);
                                  }}
                                  className="itemDrop"
                                  key={index}
                                >
                                  {items.label}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {customDateActive && (
                        <>
                          <div className="col-md-3 bottomAlgin">
                            <div className="person__calenderFrame_image image_icon_position1 ">
                              <input
                                id="startDate"
                                type="date"
                                placeholder="From Date"
                                defaultValue={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control  input_field_custom4 backcolorWhite"
                                max={computeTodayDate()}
                              />
                            </div>
                          </div>
                          <div className="col-md-3 bottomAlgin">
                            <div className="person__calenderFrame_image image_icon_position1 ">
                              <input
                                id="endDate"
                                type="date"
                                placeholder="To Date"
                                defaultValue={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-control  input_field_custom4 backcolorWhite"
                                max={computeTodayDate()}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="downloadBtnAna">
                              <button onClick={() => search_data()}>
                                Search
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="downloadBtnAna">
                  <button onClick={handleDownloadButtonClick}>Download</button>
                </div>
              </div>
            </div>

            <div className="page_body">
              <div className="analytics">
                <div className="analytics_container">
                  <div className="analyticsCardsContainer">
                    <div className="analyticsCardsRow analyticsCardsRow3">
                      <div className="analyticsCard analyticsCard3">
                        <img
                          className="tripLogo"
                          src={Google}
                          alt="Barley's Dashboard"
                        />
                        <div className="googleRatings">
                          <div className="ratingStars">
                            <h4 className="m-0">{TotalGoogleRating}</h4>
                            <div>
                              {parseFloat(TotalGoogleRating) > 0.0 &&
                                parseFloat(TotalGoogleRating) < 1.0 && (
                                  <>
                                    {parseFloat(TotalGoogleRating) < 0.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalGoogleRating) > 1.0 &&
                                parseFloat(TotalGoogleRating) < 2.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalGoogleRating) < 1.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalGoogleRating) > 2.0 &&
                                parseFloat(TotalGoogleRating) < 3.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalGoogleRating) < 2.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalGoogleRating) > 3.0 &&
                                parseFloat(TotalGoogleRating) < 4.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalGoogleRating) < 3.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalGoogleRating) >= 4.0 && (
                                <>
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  {parseFloat(TotalGoogleRating) < 4.5 ? (
                                    <img
                                      src={HalfStar}
                                      alt="Barley's Dasboard"
                                    />
                                  ) : (
                                    <img
                                      src={HalfStar}
                                      alt="Barley's Dasboard"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <p>Review: {TotalGoogleUserRating}</p>
                        </div>
                      </div>
                      <div className="analyticsCard analyticsCard3">
                        <img
                          className="tripLogo"
                          src={Trip}
                          alt="Barley's Dashboard"
                        />
                        <div className="googleRatings">
                          <div className="ratingStars">
                            <h4 className="m-0">{TotalTripRating}</h4>
                            <div>
                              {parseFloat(TotalTripRating) > 0.0 &&
                                parseFloat(TotalTripRating) < 1.0 && (
                                  <>
                                    {parseFloat(TotalTripRating) < 0.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalTripRating) > 1.0 &&
                                parseFloat(TotalTripRating) < 2.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalTripRating) < 1.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalTripRating) > 2.0 &&
                                parseFloat(TotalTripRating) < 3.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalTripRating) < 2.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalTripRating) > 3.0 &&
                                parseFloat(TotalTripRating) < 4.0 && (
                                  <>
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    <img
                                      src={StarFilled}
                                      alt="Barley's Dasboard"
                                    />
                                    {parseFloat(TotalTripRating) < 3.5 ? (
                                      <img
                                        src={HalfStar}
                                        alt="Barley's Dasboard"
                                      />
                                    ) : (
                                      <img src={Star} alt="Barley's Dasboard" />
                                    )}
                                    <img src={Star} alt="Barley's Dasboard" />
                                  </>
                                )}
                              {parseFloat(TotalTripRating) >= 4.0 && (
                                <>
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  <img
                                    src={StarFilled}
                                    alt="Barley's Dasboard"
                                  />
                                  {parseFloat(TotalTripRating) < 4.5 ? (
                                    <img
                                      src={HalfStar}
                                      alt="Barley's Dasboard"
                                    />
                                  ) : (
                                    <img
                                      src={HalfStar}
                                      alt="Barley's Dasboard"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <p>Review: {TotalTripUserRating}</p>
                        </div>
                      </div>
                      {/* <div className="analyticsCard analyticsCard3 hidden">
                        <div
                          id="TA_cdsratingsonlywide946"
                          className="TA_cdsratingsonlywide"
                        >
                          
                          <ScriptTag
                            async
                            src="https://www.jscache.com/wejs?wtype=cdsratingsonlywide&amp;uniq=946&amp;locationId=9752556&amp;"
                            onLoad={() =>
                              console.log("TripAdvisor script loaded")
                            }
                            onError={() =>
                              console.error("Failed to load TripAdvisor script")
                            }
                          />
                        </div>
                      </div> */}
                      <div className="analyticsCard colorCard5">
                        <p>Total Feedback</p>
                        <h5>
                          {Number(TatalPlusData.positive_review) +
                            Number(TatalPlusData.negetive_review)}
                        </h5>
                      </div>
                      <div className="analyticsCard colorCard6">
                        <p>Negative Feedback </p>
                        <h5>{Number(TatalPlusData.negetive_review)}</h5>
                      </div>
                      <div className="analyticsCard colorCard7">
                        <p>Positive Feedback</p>
                        <h5>
                          {(() => {
                            // Assuming TatalPlusData.positive_review and TatalPlusData.negetive_review are strings
                            // Convert them to numbers using parseFloat
                            var positiveReview = parseFloat(
                              TatalPlusData.positive_review
                            );
                            var negativeReview = parseFloat(
                              TatalPlusData.negetive_review
                            );

                            // Check if the conversion was successful and neither positiveReview nor negativeReview is NaN
                            if (
                              !isNaN(positiveReview) &&
                              !isNaN(negativeReview)
                            ) {
                              // Perform the calculation
                              var totalReviews =
                                positiveReview + negativeReview;

                              // Check if totalReviews is not zero to avoid division by zero
                              if (totalReviews !== 0) {
                                var percentage = Math.round(
                                  (positiveReview * 100) / totalReviews
                                );

                                // Check if the result is valid
                                if (!isNaN(percentage)) {
                                  return percentage + "%"; // Return the percentage
                                } else {
                                  return "0%"; // Return 0% if total reviews are zero
                                }
                              } else {
                                return "0%"; // Return 0% if total reviews are zero
                              }
                            } else {
                              return "0%"; // Return 0% if total reviews are zero
                            }
                          })()}
                        </h5>
                      </div>
                    </div>
                    <div className="bargrapgh">
                      <div className="row m-0 p-0">
                        <div className="col-md-8">
                          <div className="bargrapgh_container">
                            <div className="revenueGraph">
                              <Chart
                                options={optionsBar}
                                series={seriesBar}
                                type="bar"
                                height={350}
                              />
                            </div>
                            <div className="bargrapghTextRow">
                              <div className="col-md-6">
                                <div className="bargrapghCard negetiveFeed">
                                  <p>Negative Feedback</p>
                                  <h5>{TotalReviewNagative}</h5>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="bargrapghCard positiveFeed">
                                  <p>Positive Feedback</p>
                                  <h5>{TotalReviewPositive}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="radilaGraph">
                            <div className="bargrapgh_container mx-0">
                              <div className="radilaGraph_container">
                                {/* <Doughnut data={dataRadial} options={optionsRadial} /> */}
                                <div className="donut-container">
                                  <Chart
                                    options={optionsRadial2}
                                    series={series}
                                    type="donut"
                                    className="donutStyle"
                                  />
                                  <div className="centerText text-center">
                                    Review <br /> Summary
                                  </div>
                                </div>
                              </div>
                              <div className="progressBAr">
                                {/* <div className="proBar proBar2 m-3">
                                  <div className="row m-0 p-0">
                                    <div className="col-md-11 flexALingCen">
                                      <ProgressBar
                                        style={{
                                          borderRadius: "35px",
                                          height: "10px",
                                        }}
                                        variant="success"
                                        now={
                                          Number(
                                            TatalPlusData.positive_review
                                          ) +
                                          Number(TatalPlusData.negetive_review)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-1 p-0">
                                      <p>
                                        {Number(TatalPlusData.positive_review) +
                                          Number(TatalPlusData.negetive_review)}
                                      </p>
                                    </div>
                                  </div>
                                </div> */}
                                <div className="proBar proBar2 m-3">
                                  <div className="row m-0 p-0">
                                    <div className="col-md-11 flexALingCen">
                                      <ProgressBar
                                        style={{
                                          borderRadius: "35px",
                                          height: "10px",
                                        }}
                                        variant="info"
                                        now={Number(
                                          TatalPlusData.negetive_review
                                        )}
                                      />
                                    </div>
                                    <div className="col-md-1 p-0">
                                      <p>
                                        {Number(TatalPlusData.negetive_review)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="proBar proBar2 m-3">
                                  <div className="row m-0 p-0">
                                    <div className="col-md-11 flexALingCen">
                                      <ProgressBar
                                        style={{
                                          borderRadius: "35px",
                                          height: "10px",
                                        }}
                                        variant="warning"
                                        now={Number(
                                          TatalPlusData.positive_review
                                        )}
                                      />
                                    </div>
                                    <div className="col-md-1 p-0">
                                      <p>
                                        {Number(TatalPlusData.positive_review)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="feedBackTable">
                      <div className="feedBackTable_container feedBackTable_container2">
                        <h5>Reservations</h5>
                        <div className="tableResponsive">
                          <div className="tableResponsive_container">
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
                                  <th scope="col">Contact No.</th>
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
                                          {item.msg.length >
                                            initialCharsToShow && (
                                            <div className="recentFeedbackBtn">
                                              <p
                                                className="show-more"
                                                onClick={() =>
                                                  toggleExpand(index)
                                                }
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
                                      style={{
                                        height: "1rem",
                                        boxShadow: "none",
                                      }}
                                    ></tr>
                                  </React.Fragment>
                                ))}
                                {editStaffData.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="text_align_center"
                                    >
                                      No Results Found
                                    </td>{" "}
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <Pagination>
                          <div className="paginationContainer">
                            <div className="nxtBttnTble">
                              {!currentItems && currentPage !== 1 ? (
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
                            {!currentItems && (
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
                    className="w-100 trio_mandatory form-control h-26px"
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
export default FeedBackManagement;
