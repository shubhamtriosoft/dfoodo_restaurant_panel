import React, { useState, useEffect } from "react";
import "./Css/Header.css";
import "./Css/Loading.css";
import { Dropdown } from "primereact/dropdown";
import NewLogo from "../assets/BarleysFoodFactory.png";
import DashboardImgBlack from "../assets/dashboardNew.svg";
import CalendarImg from "../assets/calendarWhite.svg";
import Dummy from "../assets/dummyprofile.png";
import Orders from "../assets/OrderDiscussion.png";
import Noti from "../assets/notification.png";
import Settings from "../assets/Process.png";
import DownArrow from "../assets/chevron-down-svgrepo-com.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../CommonJquery/CommonJquery.js";
import {
  retrieveData,
  removeData,
} from "../LocalConnection/LocalConnection.js";
function Header({ isSidebarOpen }) {
  const [selectedOption, setSelectedOption] = useState("Gothenburg Outlet");
  const options = [
    { label: "Gothenburg Outlet", value: "Gothenburg Outlet" },
    { label: "Gothenburg Outlet ", value: "Gothenburg Outlet " },
    { label: "Gothenburg Outlet ", value: "Gothenburg Outlet " },
  ];

  useEffect(() => {
    const retrivemsg = retrieveData("session_msg");
    if (
      retrivemsg !== "" &&
      retrivemsg !== null &&
      retrivemsg !== "0" &&
      retrivemsg !== "1"
    ) {
      handleSuccess(retrivemsg, 1);
    }
  }, []);

  const sidebarOpen = isSidebarOpen;

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid nav_container p-0">
          <div className="lg_header">
            {!sidebarOpen && (
              <a className="navbar-brand" href="#">
                <div className="headerLogo">
                  <div className="headerLogo_contaienr">
                    <img src={NewLogo} alt="Barley's Dashboard" />
                  </div>
                </div>
              </a>
            )}
            <span className="bTnAndProfile">
              <span className="dropdownSelect d-flex d-lg-none">
                <Dropdown
                  value={selectedOption}
                  options={options}
                  onChange={(e) => setSelectedOption(e.value)}
                  placeholder="Select an option"
                />
              </span>
              <span className="bTnAndProfileLeft">
                <span className="profileLink nav-link active d-flex d-lg-none">
                  <img src={Dummy} alt="Barley's Dashboard" />
                  <div className="dropdown profileDropdown">
                    <div
                      className="profileBtnToggle dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span>
                        <h6>Mr. Ashutosh</h6>
                        <p>Owners</p>
                      </span>
                      <img src={DownArrow} alt="Barley's Dashboard" />
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Profile Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </span>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </span>
            </span>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* <span className="dropdownSelect d-lg-flex d-none">
              <Dropdown
                value={selectedOption}
                options={options}
                onChange={(e) => setSelectedOption(e.value)}
                placeholder="Select an option"
              />
            </span> */}
            <span className="accesibilities">
              <button>
                <img src={DashboardImgBlack} alt="Barley's Dashboard" />
              </button>
              <button>
                <img src={CalendarImg} alt="Barley's Dashboard" />
              </button>
            </span>
            <ul className="navbar-nav">
              <li className="nav-item d-lg-flex d-none">
                <span className="profileLink nav-link active">
                  <img src={Dummy} alt="Barley's Dashboard" />
                  <div className="dropdown profileDropdown">
                    <div
                      className="profileBtnToggle dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span>
                        <h6>Mr. Ashutosh</h6>
                        <p>Owners</p>
                      </span>
                      <img src={DownArrow} alt="Barley's Dashboard" />
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Profile Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </span>
              </li>
              <li className="nav-item">
                <a className="nav-link headerIcons" href="#">
                  <img src={Orders} alt="Barley's Dashboard" />
                  <p className="d-flex d-lg-none">Orders</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link headerIcons pl-0" href="#">
                  <img src={Noti} alt="Barley's Dashboard" />
                  <p className="d-flex d-lg-none">Notifications</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link headerIcons settingHeader" href="#">
                  <img src={Settings} alt="Barley's Dashboard" />
                  <p className="d-flex d-lg-none">Setting</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
}

export default Header;
