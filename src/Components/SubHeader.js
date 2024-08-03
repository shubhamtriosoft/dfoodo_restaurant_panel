import React from "react";
import HistoryIcon from "../assets/historyIcon.svg";
import Calendar from "../assets/calendar.svg";
import { Link } from "react-router-dom";

function SubHeader() {
  return (
    <div className="sub_header">
      <div className="sub_header_container">
        <div className="sub_header_left">
          <Link to="/Reservation_History">
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Restaurant History"
              className="Restaurant_History"
            >
              <img src={HistoryIcon} alt="Barley's Dashboard" />
            </button>
          </Link>
          <Link to="/Reservation_Calendar">
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Restaurant Calender"
              className="Restaurant_Calender"
            >
              <img src={Calendar} alt="Barley's Dashboard" />
            </button>
          </Link>
        </div>
        <div className="sub_header_right"></div>
      </div>
    </div>
  );
}

export default SubHeader;
