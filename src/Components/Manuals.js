import React, { useState } from "react";
import Header from "./Header";
import Faqs from "./Faqs";
import UserManual from "./UserManual";
import Help from "./Help";

function Manuals() {
  const [calendarTab, setCalendarTab] = useState(false);
  const [historyTab, setHistoryTab] = useState(false);
  const [help, sethelp] = useState(true);

  const toggleTabs = (Tab) => {
    
    setCalendarTab(Tab === "Calender");
    setHistoryTab(Tab === "History");
    sethelp(Tab === "help");
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head mb-3">
              <div className="calendertabs">
                <div className="calendertabs_container">
                <div
                    className={`calendertabsBtn width150px ${
                      help ? "activeCalendarTab" : ""
                    }`}
                    onClick={() => toggleTabs("help")}
                  >
                    <p>Support</p>
                  </div>
                  <div
                    className={`calendertabsBtn width150px ${
                      calendarTab ? "activeCalendarTab" : ""
                    }`}
                    onClick={() => toggleTabs("Calender")}
                  >
                    <p>FAQs</p>
                  </div>
                  <div
                    className={`calendertabsBtn width150px ${
                      historyTab ? "activeCalendarTab" : ""
                    }`}
                    onClick={() => toggleTabs("History")}
                  >
                    <p>Knowledge Base</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="page_body">
              {calendarTab && <Faqs />}
              {historyTab && <UserManual />}
              {help && <Help />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Manuals;
