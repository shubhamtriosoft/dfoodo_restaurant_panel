import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./Css/Calender.css";
import TimeMer from "../assets/alarm02.svg";
import BorderedGlobe from "../assets/language02.svg";
import BorderedOn from "../assets/power_settings_new02.svg";
import CrossedGlobe from "../assets/crossedGlobe02.svg";
import CrossedOn from "../assets/offPowe.svg";
import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader.js";
import {
  server_post_data,
  view_calender_reservation,
  update_calender_seat_status,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  handleSuccessSession,
} from "../CommonJquery/CommonJquery";
import TimingsPage from "./SpecialHrsTimings.js";
import NextImg from "../assets/nextImg.svg";
import PrevImg from "../assets/prevImg.svg";
let data_load = true;
const ReservationCalendar = ({ updateSharedValue }) => {
  const handleValueChange = (value) => {
    updateSharedValue(value);
  };
  dayjs.extend(weekday);
  dayjs.extend(weekOfYear);

  const [startDate, setStartDate] = useState();
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1; // Month is zero-indexed in dayjs
  const [yearAndMonth, setYearAndMonth] = useState([currentYear, currentMonth]);
  const [yearAndMonthold, setYearAndMonthOld] = useState([
    currentYear,
    currentMonth,
  ]);
  const [calendarData, setCalendarData] = useState(null); // State to hold calendar data
  const [modalShow, setModalShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [testshowdata, settestshowdata] = useState({
    show_text: "",
    click_type: "",
    booking_status: "",
    special_date: "",
  });
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = (e) => {
    setStartDate(e);
    setModalShow(true);
  };

  const openModal = (data_call, click_type, on_off) => {
    let show_text_data = "";
    let booking_status = "0";
    if (click_type === "1") {
      if (on_off === "on") {
        show_text_data = `Are you sure want to Stop Online Reservation?`;
        booking_status = "1";
      } else {
        show_text_data = `Are you sure want to Start Online Reservation?`;
        booking_status = "0";
      }
    } else if (click_type === "2") {
      if (on_off === "on") {
        show_text_data = `Are you sure you want to close the restaurant?`;
        booking_status = "1";
      } else {
        show_text_data = `Are you sure you want to Open the restaurant?`;
        booking_status = "0";
      }
    }
    settestshowdata({
      show_text: show_text_data,
      click_type: click_type,
      booking_status: booking_status,
      special_date: data_call.dateString,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const close_popup_update_query = () => {
    master_data_action_update(
      testshowdata.special_date,
      testshowdata.click_type,
      testshowdata.booking_status
    );
  };

  const master_data_get = async (data_call = "0", year, month) => {
    if (data_load || data_call === "1") {
      data_load = false;
      const firstDate = dayjs(`${year}-${month}-01`)
        .startOf("week")
        .format("YYYY-MM-DD"); // Get the first day of the week containing the 1st day of the month
      const lastDate = dayjs(`${year}-${month}-01`)
        .endOf("month")
        .endOf("week")
        .format("YYYY-MM-DD"); // Get the last day of the week containing the last day of the month

      setshowLoaderAdmin(true);
      const fd = new FormData();
      fd.append("start_date", firstDate);
      fd.append("end_date", lastDate);
      await server_post_data(view_calender_reservation, fd)
        .then((Response) => {
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            setCalendarData(Response.data.message);
          }

          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
        });
    }
  };
  master_data_get("0", yearAndMonth[0], yearAndMonth[1]);

  const master_data_action_update = async (
    special_date,
    click_type,
    booking_status
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("special_date", special_date);
    fd.append("click_type", click_type);
    fd.append("booking_status", booking_status);
    await server_post_data(update_calender_seat_status, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          closeModal();
          handleSuccessSession(Response.data.message, "/Reservation_Calendar");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  function getYearDropdownOptions(currentYear) {
    let minYear = currentYear - 4;
    let maxYear = currentYear + 5;
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
      label: `${minYear + i}`,
      value: minYear + i,
    }));
  }

  function getMonthDropdownOptions() {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: dayjs().month(i).format("MMMM"),
    }));
  }

  function getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

  function createDaysForCurrentMonth(year, month) {
    const numDaysInMonth = getNumberOfDaysInMonth(year, month);
    return Array.from({ length: numDaysInMonth }, (_, i) => {
      const day_make = dayjs(`${year}-${month}-${i + 1}`).format("YYYY-MM-DD");
      const week_id = dayjs(`${year}-${month}-${i + 1}`).day();
      const month_name = dayjs(`${year}-${month}-${i + 1}`).format("MMM");
      const Week_name = dayjs(`${year}-${month}-${i + 1}`).format("dddd");
      let total_seat_data = 0;
      if (calendarData.data_restaurant.length > 0) {
        total_seat_data = calendarData.data_restaurant[0].per_day_maximum;
      }
      const data_present_or_not = calendarData.data_reservation_all
        .filter((optiondddd) => day_make === optiondddd.book_date)
        .map((optiondddd) => optiondddd.count);
      const data_present_or_not1 = calendarData.data_reservation_walk
        .filter((optiondddd) => day_make === optiondddd.book_date)
        .map((optiondddd) => optiondddd.count);
      const data_present_or_not2 = calendarData.result_reservation_person
        .filter((optiondddd) => day_make === optiondddd.book_date)
        .map((optiondddd) => optiondddd.count);
      const check_oqcpancy = calendarData.result_week_occupancy
        .filter((optiondddd) => week_id === optiondddd.week_id)
        .map((optiondddd) => optiondddd.total_per_day_maximum);
      const check_oqcpancy_special = calendarData.result_date_status
        .filter((optiondddd) => day_make === optiondddd.speacial_date)
        .map((optiondddd) => optiondddd.total_per_day_maximum);

      let week_id_dd = week_id - 1;
      if (week_id_dd === -1) {
        week_id_dd = 6;
      }
      const check_online_booking_status = calendarData.all_dates
        .filter((optiondddd) => {
          return (
            week_id_dd === optiondddd.week_id &&
            optiondddd.week_name === Week_name
          );
        })
        .map((optiondddd) => optiondddd.start_stop_status);

      const check_total_start_stop_status = calendarData.all_dates
        .filter(
          (optiondddd) =>
            week_id_dd === optiondddd.week_id &&
            optiondddd.week_name === Week_name
        )
        .map((optiondddd) => optiondddd.online_booking_status);
      const special_check_online_booking_status = calendarData.all_dates
        .filter((optiondddd) => optiondddd.week_name === day_make)
        .map((optiondddd) => optiondddd.start_stop_status);

      const special_check_total_start_stop_status = calendarData.all_dates
        .filter((optiondddd) => optiondddd.week_name === day_make)
        .map((optiondddd) => optiondddd.online_booking_status);

      let all_reservation_show = 0;
      let walk_reservation_show = 0;
      let sum_person_show = 0;
      let max_seat_available = 0;
      let online_booking_status = 0;
      let total_start_stop_status = 0;
      if (data_present_or_not.length > 0) {
        all_reservation_show = data_present_or_not[0]; // Assuming you want the first value if multiple are present
      }
      if (data_present_or_not1.length > 0) {
        walk_reservation_show = data_present_or_not1[0]; // Assuming you want the first value if multiple are present
      }
      if (data_present_or_not2.length > 0) {
        sum_person_show = data_present_or_not2[0]; // Assuming you want the first value if multiple are present
      }
      if (check_oqcpancy.length > 0) {
        max_seat_available = check_oqcpancy[0]; // Assuming you want the first value if multiple are present
      }
      if (check_oqcpancy_special.length > 0) {
        max_seat_available = check_oqcpancy_special[0]; // Assuming you want the first value if multiple are present
      }
      if (total_seat_data > 0) {
        max_seat_available = total_seat_data;
      }
      if (check_online_booking_status.length > 0) {
        online_booking_status = check_online_booking_status[0]; // Assuming you want the first value if multiple are present
      }
      if (check_total_start_stop_status.length > 0) {
        total_start_stop_status = check_total_start_stop_status[0]; // Assuming you want the first value if multiple are present
      }
      if (special_check_online_booking_status.length > 0) {
        online_booking_status = special_check_online_booking_status[0]; // Assuming you want the first value if multiple are present
      }
      if (special_check_total_start_stop_status.length > 0) {
        total_start_stop_status = special_check_total_start_stop_status[0]; // Assuming you want the first value if multiple are present
      }

      return {
        dateString: day_make,
        MonthString: month_name,
        dayOfMonth: i + 1,
        isCurrentMonth: true,
        all_reservation: all_reservation_show, // Assuming you want to include the count in each day object
        walk_reservation: walk_reservation_show, // Assuming you want to include the count in each day object
        person_reservation: sum_person_show, // Assuming you want to include the count in each day object
        max_seat_available: max_seat_available, // Assuming you want to include the count in each day object
        online_booking_status: online_booking_status, // Assuming you want to include the count in each day object
        total_start_stop_status: total_start_stop_status, // Assuming you want to include the count in each day object
      };
    });
  }

  function createDaysForPreviousMonth(year, month) {
    const daysToShow = getWeekday(`${year}-${month}-01`);
    return Array.from({ length: daysToShow }, (_, i) => ({
      dateString: dayjs(
        `${year}-${month - 1}-${
          getNumberOfDaysInMonth(year, month - 1) - daysToShow + i + 1
        }`
      ).format("YYYY-MM-DD"),
      dayOfMonth: getNumberOfDaysInMonth(year, month - 1) - daysToShow + i + 1,
      MonthString: "",
      isCurrentMonth: false,
      isPreviousMonth: true,
      all_reservation: 0, // Assuming you want to include the count in each day object
      walk_reservation: 0, // Assuming you want to include the count in each day object
      person_reservation: 0, // Assuming you want to include the count in each day object
      max_seat_available: 0, // Assuming you want to include the count in each day object
      online_booking_status: 0, // Assuming you want to include the count in each day object
      total_start_stop_status: 0, // Assuming you want to include the count in each day object
    }));
  }

  function createDaysForNextMonth(year, month) {
    const daysToShow =
      6 - getWeekday(`${year}-${month}-${getNumberOfDaysInMonth(year, month)}`);
    return Array.from({ length: daysToShow }, (_, i) => ({
      dateString: dayjs(`${year}-${month + 1}-${i + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: i + 1,
      MonthString: "",
      isCurrentMonth: false,
      isNextMonth: true,
      all_reservation: 0, // Assuming you want to include the count in each day object
      walk_reservation: 0, // Assuming you want to include the count in each day object
      person_reservation: 0, // Assuming you want to include the count in each day object
      max_seat_available: 0, // Assuming you want to include the count in each day object
      online_booking_status: 0, // Assuming you want to include the count in each day object
      total_start_stop_status: 0, // Assuming you want to include the count in each day object
    }));
  }

  function getWeekday(dateString) {
    return dayjs(dateString).weekday();
  }

  function isWeekendDay(dateString) {
    return [6, 0].includes(getWeekday(dateString));
  }

  Calendar.propTypes = {
    className: PropTypes.string,
    yearAndMonth: PropTypes.arrayOf(PropTypes.number).isRequired,
    onYearAndMonthChange: PropTypes.func.isRequired,
    renderDay: PropTypes.func,
  };
  CalendarDayHeader.propTypes = {
    calendarDayObject: PropTypes.object.isRequired,
  };

  function Calendar({
    className = "",
    onYearAndMonthChange,
    renderDay = () => null,
  }) {
    const [year, month] = yearAndMonth;
    const today = dayjs();
    if (yearAndMonth !== yearAndMonthold) {
      setYearAndMonthOld(yearAndMonth);
      master_data_get("1", yearAndMonth[0], yearAndMonth[1]);
    }

    let currentMonthDays = createDaysForCurrentMonth(year, month);
    let previousMonthDays = createDaysForPreviousMonth(year, month);
    let nextMonthDays = createDaysForNextMonth(year, month);
    let calendarGridDayObjects = [
      ...previousMonthDays,
      ...currentMonthDays,
      ...nextMonthDays,
    ];

    const handleMonthNavBackButtonClick = () => {
      let nextYear = year;
      let nextMonth = month - 1;
      if (nextMonth === 0) {
        nextMonth = 12;
        nextYear = year - 1;
      }
      onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthNavForwardButtonClick = () => {
      let nextYear = year;
      let nextMonth = month + 1;
      if (nextMonth === 13) {
        nextMonth = 1;
        nextYear = year + 1;
      }
      onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthSelect = (evt) => {
      let nextYear = year;
      let nextMonth = parseInt(evt.target.value, 10);
      onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleYearSelect = (evt) => {
      let nextMonth = month;
      let nextYear = parseInt(evt.target.value, 10);
      onYearAndMonthChange([nextYear, nextMonth]);
    };

    return (
      <div className={classNames("calendar-root", className)}>
        <div className="calenderBar pt-4">
          <div className="navigation-header dateContainer">
            <div className="month-nav-arrow-buttons">
              <button onClick={handleMonthNavBackButtonClick}>
                <img src={PrevImg} alt="Barley's Dashboard" />
              </button>
            </div>
            <select
              className="month-select"
              value={month}
              onChange={handleMonthSelect}
            >
              {getMonthDropdownOptions().map(({ label, value }) => (
                <option value={value} key={value}>
                  {label.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="month-nav-arrow-buttons">
              <button onClick={handleMonthNavForwardButtonClick}>
                <img src={NextImg} alt="Barley's Dashboard" />
              </button>
            </div>
            <select
              className="year-select"
              value={year}
              onChange={handleYearSelect}
            >
              {getYearDropdownOptions(year).map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="occypencyDiv">
            <div className="occypencyDivContainer">
              <div className="occupencyItem">
                <div className="inside_occupencyItem">
                  <p>Occupancy:</p>
                  <div>
                    <p>0%</p>
                    <div className="occupencyColor"></div>
                  </div>
                </div>
              </div>
              <div className="occupencyItem">
                <p>{">"}25%</p>
                <div className="occupencyColor occupency25Color"></div>
              </div>
              <div className="occupencyItem">
                <p>{">"}50%</p>
                <div className="occupencyColor occupency50Color"></div>
              </div>
              <div className="occupencyItem">
                <p>{">"}75%</p>
                <div className="occupencyColor occupency75Color"></div>
              </div>
              <div className="occupencyItem">
                <p>100%</p>
                <div className="occupencyColor occupency100Color"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="days-of-week">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={classNames("day-of-week-header-cell", {
                "weekend-day": [6, 0].includes(index),
              })}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="days-grid">
          {calendarGridDayObjects.map((day) => {
            const currentDate = dayjs(day.dateString);
            const isToday = currentDate.isSame(today, "day");
            return day.isCurrentMonth ? (
              <div
                key={day.dateString}
                className={classNames("day-grid-item-container", {
                  "weekend-day": isWeekendDay(day.dateString),
                  "current-month": day.isCurrentMonth,
                  todayDate: isToday,
                })}
              >
                <div className="day-content-wrapper">{renderDay(day)}</div>
              </div>
            ) : (
              <div key={day.dateString}></div>
            );
          })}
        </div>
      </div>
    );
  }

  function CalendarDayHeader({ calendarDayObject }) {
    let get_max_dates = Number(calendarDayObject.max_seat_available);
    let get_persectage =
      (Number(calendarDayObject.person_reservation) / get_max_dates) * 100;
    let show_class_color = "";
    if (get_persectage > 25 && get_persectage < 51) {
      show_class_color = "occupency25Color";
    } else if (get_persectage > 50 && get_persectage < 76) {
      show_class_color = "occupency50Color";
    } else if (get_persectage > 76 && get_persectage < 99) {
      show_class_color = "occupency75Color";
    } else if (get_persectage > 98) {
      show_class_color = "occupency100Color";
    }
    let total_start_stop_status_status = BorderedGlobe;
    let total_start_stop_status_status_data = "on";
    let total_start_stop_status = Number(
      calendarDayObject.total_start_stop_status
    );

    if (Number(total_start_stop_status) === 1) {
      total_start_stop_status_status = CrossedGlobe;
      total_start_stop_status_status_data = "off";
    }
    let total_online_booking_status_status_data = "on";
    let total_online_booking_status = BorderedOn;
    let online_booking_status = Number(calendarDayObject.online_booking_status);

    if (Number(online_booking_status) === 1) {
      total_online_booking_status = CrossedOn;
      total_online_booking_status_status_data = "off";
    }
    return (
      <>
        <div className={`day_grid_item_container ${show_class_color}`}>
          <div
            className="day-grid-item-header "
            onClick={() => handleValueChange(calendarDayObject.dateString)}
          >
            <p className="monthnumber">{calendarDayObject.dayOfMonth}</p>
            <p className="monthname">{calendarDayObject.MonthString}</p>
          </div>
          <div className="calenderActionIcons">
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Restaurant Timing"
              className="Restaurant_Timing"
              onClick={(e) => handleShow(calendarDayObject.dateString)}
            >
              <img src={TimeMer} alt="Barley's Dashboard" />
            </button>
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Online Reservation Off"
              className="Online_Booking_On"
              onClick={() =>
                openModal(
                  calendarDayObject,
                  "1",
                  total_start_stop_status_status_data
                )
              }
            >
              <img
                src={total_start_stop_status_status}
                alt="Barley's Dashboard"
              />
            </button>
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Restaurant Open"
              className="Restaurant_Open"
              onClick={() =>
                openModal(
                  calendarDayObject,
                  "2",
                  total_online_booking_status_status_data
                )
              }
            >
              <img src={total_online_booking_status} alt="Barley's Dashboard" />
            </button>
          </div>
        </div>
        <div className="logsOftheDay">
          <div className="logsOftheDay_text">
            <p>Reservation</p>
            <p> {calendarDayObject.all_reservation}</p>
          </div>
          <div className="logsOftheDay_text">
            <p>Walk-In</p>
            <p> {calendarDayObject.walk_reservation}</p>
          </div>
          <div className="logsOftheDay_text">
            <p>Person</p>
            <p> {calendarDayObject.person_reservation}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="reservationCalendar">
      {showLoaderAdmin && (
        <Loader />
      )}
      {calendarData && (
        <Calendar
          yearAndMonth={yearAndMonth}
          onYearAndMonthChange={setYearAndMonth}
          renderDay={(calendarDayObject) => (
            <CalendarDayHeader calendarDayObject={calendarDayObject} />
          )}
        />
      )}

      <Modal
        show={modalShow}
        className="specialModal"
        centered
        size="xl"
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header
          className="specialModalHeader opacity0"
          closeButton
        ></Modal.Header>
        <Modal.Body>
          <TimingsPage
            startDate={startDate}
            setStartDate={setStartDate}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Body className="modal_body">
          <p>{testshowdata.show_text}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="logoutYesBtn" onClick={close_popup_update_query}>
            Yes
          </Button>
          <Button className="logoutNoBtn" onClick={closeModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservationCalendar;
