import React, { useState } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import ReservationCalendar from "./ReservationCalendar";
import ReservationHistory from "./ReservationHistory";

function ViewReservationCalendar() {
  const [calendarTab, setCalendarTab] = useState(true);
  const [historyTab, setHistoryTab] = useState(false);

  const toggleTabs = (Tab) => {
    if (Tab === "Calender") {
      window.location.reload();
    }
    setCalendarTab(Tab === "Calender");
    setHistoryTab(Tab === "History");
  };

  const [sharedValue, setSharedValue] = useState(null);

  const updateSharedValue = (value) => {
    setSharedValue(value);
    setHistoryTab("History");
    setCalendarTab(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="calendertabs">
                <div className="calendertabs_container">
                  <div
                    className={`calendertabsBtn ${
                      calendarTab ? "activeCalendarTab" : ""
                    }`}
                    onClick={() => toggleTabs("Calender")}
                  >
                    <p>Calendar</p>
                  </div>
                  <div
                    className={`calendertabsBtn ${
                      historyTab ? "activeCalendarTab" : ""
                    }`}
                    onClick={() => toggleTabs("History")}
                  >
                    <p>Details</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="page_body px-2 py-1">
              {calendarTab && (
                <ReservationCalendar updateSharedValue={updateSharedValue} />
              )}
              {historyTab && <ReservationHistory sharedValue={sharedValue} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewReservationCalendar;
