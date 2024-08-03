import React, { useState } from "react";
import Header from "./Header";
import Faqs from "./Faqs";
import UserManual from "./UserManual";

function Manuals() {
  const [calendarTab, setCalendarTab] = useState(true);
  const [historyTab, setHistoryTab] = useState(false);

  const toggleTabs = (Tab) => {
    if (Tab === "Calender") {
      window.location.reload();
    }
    setCalendarTab(Tab === "Calender");
    setHistoryTab(Tab === "History");
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
              {/* <div className="tabsBtn">
                {calendarTab && (
                  <Link to="/Add_Faq">
                    <button
                      type="button"
                      className="btnAddStaff darkBg add_FAQ"
                    >
                      Add FAQ
                    </button>
                  </Link>
                )}
                {historyTab && (
                  <button
                    type="button"
                    className="btnAddStaff darkBg add_User_Manual"
                  >
                    Add User Manual
                  </button>
                )}
              </div> */}
            </div>

            <div className="page_body">
              {calendarTab && <Faqs />}
              {historyTab && <UserManual />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Manuals;
