import React, { useEffect, useState } from "react";
import "./Css/Settings.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Open_Menu_text } from "./../CommonJquery/WebsiteText";
import TimingsPage from "./SpecialHrsTimings";
import GeneralSettings from "./GeneralSettings";
import ReservationSettings from "./ReservationSettings";
import IntegrationSettings from "./IntegrationSettings";
import OperationalTimingsPage from "./OperationalHours";

function SystemSettings() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [generalSettin, setGeneralSettin] = useState(true);
  const [reservSettin, setReservSettin] = useState(false);
  const [openHrsSettin, setOpenHrsSettin] = useState(false);
  const [integrationSettin, setIntegrationSettin] = useState(false);

  const toggleSettingsBar = (TabId) => {
    setGeneralSettin(TabId === "1");
    setReservSettin(TabId === "2");
    setOpenHrsSettin(TabId === "3");
    setIntegrationSettin(TabId === "4");
  };

  const [specailHours, setSpecialHours] = useState(false);
  const [operationalHours, setOperationalHours] = useState(true);
  const [startDate, setStartDate] = useState();
  const toggleSpecailHours = (TabId) => {
    setOperationalHours(TabId === "1");
    setSpecialHours(TabId === "2");
  };
  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              {/* <div className="pageNameDiv">
                <p>System Settings</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div> */}
              <div className="settingsTabs">
                <div className="settingsTabs_container">
                  <ul>
                    <li
                      className={`${generalSettin ? "currentTab" : ""}`}
                      onClick={() => toggleSettingsBar("1")}
                    >
                      <div className="setTab">
                        <p>GENERAL SETTING</p>
                      </div>
                    </li>
                    <li className={`${reservSettin ? "currentTab" : ""}`}>
                      <div
                        className="setTab"
                        onClick={() => toggleSettingsBar("2")}
                      >
                        <p>RESERVATION SETTING</p>
                      </div>
                    </li>
                    <li className={`${openHrsSettin ? "currentTab" : ""}`}>
                      <div
                        className="setTab"
                        onClick={() => toggleSettingsBar("3")}
                      >
                        <p>OPERATIONAL HOURS</p>
                      </div>
                    </li>
                    <li className={`${integrationSettin ? "currentTab" : ""}`}>
                      <div
                        className="setTab"
                        onClick={() => toggleSettingsBar("4")}
                      >
                        <p>INTEGRATION SETTING</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="page_body container-lg">
              <div className="settingstabsContainer">
                {generalSettin && <GeneralSettings />}
                {reservSettin && <ReservationSettings />}
                {openHrsSettin && (
                  <>
                    <div className=" timingsRowHead timingsRowHead2 pt-3">
                      <div className="col-md-11">
                        <div className="row m-0">
                          <div className="col-md-4">
                            <div className="hourSettingsTabs">
                              <p
                                onClick={() => toggleSpecailHours("1")}
                                className={`opHours ${
                                  operationalHours ? "spHours" : " "
                                }`}
                              >
                                Operational Hours
                              </p>
                              <p
                                onClick={() => toggleSpecailHours("2")}
                                className={`opHours ${
                                  specailHours ? "spHours" : " "
                                }`}
                              >
                                Special Hours
                              </p>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <p>Discount (%)</p>
                          </div>
                          <div className="col-md-2">
                            <p>Total Seat</p>
                          </div>

                          <div className="col-md-3">
                            <p>Last Kitchen Time</p>
                          </div>
                          <div className="col-md-1">
                            <p>Availablity</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {operationalHours && <OperationalTimingsPage />}
                    {specailHours && (
                      <TimingsPage
                        startDate={startDate}
                        setStartDate={setStartDate}
                        handleClose={null}
                      />
                    )}
                  </>
                )}
                {integrationSettin && <IntegrationSettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
