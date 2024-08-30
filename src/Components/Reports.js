import React, { useState } from "react";
import Header from "./Header";
import "./Css/Reports.css";
import ReservationReport from "./ReservationReport";
import SalesReport from "./SalesReport";
import GuestReport from "./GuestReports";

function Report() {
  const [reservation, setreservation] = useState(true);
  const [sales, setsales] = useState(false);
  // const [guest, setguest] = useState(false);

  const toggleTabs = (Tab) => {
    setreservation(Tab === "Reservation");
    setsales(Tab === "Sales");
    // setguest(Tab === "Guest");
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="calendertabs mt-2">
                <div
                  className="calendertabs_container gap-0"
                  style={{ border: "none" }}
                >
                  <div
                    className={`reportTabs ${
                      reservation ? "selectedReports" : ""
                    }`}
                    onClick={() => toggleTabs("Reservation")}
                  >
                    <p>Reservation</p>
                  </div>
                  <div
                    className={`reportTabs ${sales ? "selectedReports" : ""}`}
                    onClick={() => toggleTabs("Sales")}
                  >
                    <p>Sales Report</p>
                  </div>
                  {/* <div
                    className={`reportTabs ${guest ? "selectedReports" : ""}`}
                    onClick={() => toggleTabs("Guest")}
                  >
                    <p>Guest Report</p>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="page_body px-2 py-1">
              {reservation && <SalesReport />}
              {sales && <ReservationReport />}
              {/* {guest && <GuestReport />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
