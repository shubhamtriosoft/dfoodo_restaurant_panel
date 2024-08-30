import React, { useState, useEffect } from "react";
import OpenMenu from "../assets/menu_open.png";
import Dashboard from "../assets/sideDashblack.svg";
import Reservation from "../assets/sideRsrvtnBlack.svg";
import Restro from "../assets/sideRestroBlack.svg";
import Guest from "../assets/sideGuestBlack.svg";
import Analytics from "../assets/sideAnalytisBlack.svg";
import Staff from "../assets/sideStaffBlack.svg";
import Logo from "../assets/logoIcondrak.svg";
import Report from "../assets/sideReportBlack.svg";
import Feedback from "../assets/feedNewIcon1.png";
import HelpSupport from "../assets/sideHelpBlack.svg";
import Setting from "../assets/sideSettingBlack.svg";
import DashboardOrng from "../assets/sideDashOrng.svg";
import ReservationOrng from "../assets/sideRestroOrng.svg";
import RestroOrng from "../assets/sideRestroOrng.svg";
import GuestOrng from "../assets/sideGuestOrng.svg";
import AnalyticsOrng from "../assets/sideAnalyticsOrng.svg";
import StaffOrng from "../assets/sideStaffOrng.svg";
import WebsiteOrng from "../assets/sideWebOrng.svg";
import ReportOrng from "../assets/sideReportOrng.svg";
import FeedbackOrng from "../assets/feedOrgn1.png";
import dropArroww from "../assets/dropArrow.svg";
import dropArrowwOrange from "../assets/dropArrowOrange.svg";
import HelpSupportOrng from "../assets/sideHelpOrng.svg";
import SettingOrng from "../assets/sideSettingOrng.svg";

import "./Css/SideBar.css";
import { sidebarpagetext, Hide_Menu_text } from "./../CommonJquery/WebsiteText";
import { Link, useLocation } from "react-router-dom";
import {
  retrieveData,
  removeData,
} from "../LocalConnection/LocalConnection.js";
import {
  server_post_data,
  get_all_StaffRights,
} from "../ServiceConnection/serviceconnection.js";
import { handleLinkClick } from "../CommonJquery/CommonJquery";
function SideBar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const access_permission = retrieveData("access_permission");
  const [page_chekt, setPage_chekt] = useState([]);
  const [rightpage, setrightpage] = useState([]);
  const [designationpage, setDesignationPage] = useState([]);
  useEffect(() => {
    master_data_get_staff_right();
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  /******************* this useEffect Staff Right Activity Start****************/
  useEffect(() => {
    //console.log(page_chekt);
    //console.log(designationpage);
    var currentPage = window.location.pathname.split("/").pop();
    var rrr = Triosidebarhideshow(currentPage);
    if (rrr) {
      goback();
    }

    if (page_chekt[currentPage] && page_chekt[currentPage]["insidepage"]) {
      page_chekt[currentPage]["insidepage"].split("/").forEach(function (item) {
        console.log(item);
        const insidePages_vw = item.split("@");
        if (
          designationpage[currentPage] &&
          Object.values(designationpage[currentPage]).includes(
            insidePages_vw[0]
          )
        ) {
          // item is present in the designation so no need to remove
        } else {
          var elementsToRemove = document.querySelectorAll(
            "." + insidePages_vw[0]
          );
          elementsToRemove.forEach(function (element) {
            element.remove(); //remove buttons
          });
        }
      });
    }

    Object.keys(page_chekt).forEach(function (key) {
      var itempi = page_chekt[key].page_url_id;
      if (!designationpage[itempi]) {
        document.querySelectorAll(`li.${itempi}`).forEach(function (element) {
          element.remove();
        });
        document
          .querySelectorAll(`[href="/${itempi}"]`)
          .forEach(function (element) {
            element.remove();
          });
      }
    });
  }, [page_chekt]);

  /******************* this useEffect Staff Right Activity End ****************/

  const master_data_get_staff_right = async () => {
    const fd = new FormData();
    fd.append("flag", "10");
    await server_post_data(get_all_StaffRights, fd)
      .then((Response) => {
        // Assuming Response.data is an array of objects with 'page_url' as key
        Response.data.message.data.forEach(function (item) {
          var idd = item.page_url_id;
          setPage_chekt((prevState) => ({
            ...prevState,
            [idd]: {
              page_url_id: item.page_url_id,
              insidepage: item.insidepage,
            },
          }));
        });
        // Now you have page_chekt object in JavaScript

        const datam = access_permission.split("/");
        const newDataxt = datam.reduce((acc, item, index) => {
          if (item.includes("@")) {
            const [page, ...extras] = item.split("@");
            if (!acc[page]) {
              acc[page] = {};
            }
            extras.forEach((extra, idx) => {
              acc[page][idx] = extra;
            });
          } else {
            acc[item] = { ["class_list"]: "" };
          }
          return acc;
        }, {});
        setDesignationPage(newDataxt);

        if (Response.data.error) {
          //handleError(Response.data.message);
        } else {
          setrightpage(Response.data.message.data);
        }
      })
      .catch((error) => {});
  };

  function Triosidebarhideshow(pagelink) {
    if (designationpage[pagelink]) {
      return ""; // User has access to this page
    } else {
      if (!page_chekt[pagelink]) {
        return ""; // No user right for this page
      } else {
        return "dsplynoe"; // User has no right to access this page
      }
    }
  }

  /********* Current Page redirect Start**********/
  function goback() {
    window.history.back();
  }
  /********* Current Page redirect Close**********/
  return (
    <div className={`sidebar ${isSidebarOpen ? "OpneSidebar" : ""}`}>
      <div className="sidebar_container">
        <div className="sideHeadLogo">
          <a className="navbar-brand" href="#">
            <div className="headerLogo">
              <div className="headerLogo_contaienr">
                <img src={Logo} alt="Barley's Dashboard" />
              </div>
            </div>
          </a>
        </div>
        <div
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          htmlFor="top"
          title={`Hide`}
          className="menuOpenClose"
          onClick={toggleSidebar}
          style={{
            paddingLeft: "0",
            marginLeft: "2rem",
            justifyContent: "flex-start",
          }}
        >
          <img
            style={{ transform: " rotate(0deg)" }}
            src={OpenMenu}
            alt="Barley's Dashboard"
          />
          {/* <p>{Hide_Menu_text}</p> */}
        </div>
        <div className="sidebar_list">
          <ul>
            <Link to="/Dashboard">
              <li className="dashbaord">
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/Dashboard" ? "activeSideItem" : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/Dashboard"
                        ? DashboardOrng
                        : Dashboard
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Dashborard_text}</p>
                </div>
              </li>
            </Link>
            <Link to="/Analytics">
              <li className="analytics">
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/Analytics" ? "activeSideItem" : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/Analytics"
                        ? AnalyticsOrng
                        : Analytics
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Analytics_text}</p>
                </div>
              </li>
            </Link>
            <Link onClick={() => handleLinkClick("/Reservation_Calendar")}>
              <li className={`reservation_mngmt`}>
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/Reservation_Calendar"
                      ? "activeSideItem"
                      : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/Reservation_Calendar"
                        ? ReservationOrng
                        : Reservation
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Rsrvtn_Mngmnt_text}</p>
                </div>
              </li>
            </Link>
            {/* <Link to="/View_Guest">
              <li
                className={`guest_mngmt ${Triosidebarhideshow(
                  "Guest_Management"
                )}`}
              >
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/View_Guest" ? "activeSideItem" : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/View_Guest" ? GuestOrng : Guest
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Guest_Mgmt_text}</p>
                </div>
              </li>
            </Link> */}
            <li className="dropdown sidebarDropdown staff_mngmt">
              <div
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className={`sidebar_list_item dropdown-toggle ${
                  location.pathname === "/View_Staff" ||
                  location.pathname === "/Add_Staff" ||
                  location.pathname === "/View_Staff_Rights" ||
                  location.pathname === "/View_Sub_Rights" ||
                  location.pathname === "/View_Inside_Page_Rights" ||
                  location.pathname === "/Create_Staff_Rights" ||
                  location.pathname === "/Edit_Staff_Rights" ||
                  location.pathname === "/Edit_Sub_Rights" ||
                  location.pathname === "/Create_Inside_Page_Rights" ||
                  location.pathname === "/ViewDesignation" ||
                  location.pathname === "/Add_Designation" ||
                  location.pathname.includes("/edit_staff")
                    ? "activeSideItem"
                    : " "
                }`}
              >
                <img
                  src={
                    location.pathname === "/View_Staff" ||
                    location.pathname === "/Add_Staff" ||
                    location.pathname === "/View_Staff_Rights" ||
                    location.pathname === "/View_Sub_Rights" ||
                    location.pathname === "/View_Inside_Page_Rights" ||
                    location.pathname === "/Create_Staff_Rights" ||
                    location.pathname === "/Edit_Staff_Rights" ||
                    location.pathname === "/Edit_Sub_Rights" ||
                    location.pathname === "/Create_Inside_Page_Rights" ||
                    location.pathname === "/ViewDesignation" ||
                    location.pathname === "/Add_Designation" ||
                    location.pathname.includes("/edit_staff")
                      ? StaffOrng
                      : Staff
                  }
                  alt="Barley's Dashboard"
                />
                <p>{sidebarpagetext.Staff_Mgmt_text}</p>
                <div className="droparrow">
                  <img
                    src={
                      location.pathname === "/View_Staff" ||
                      location.pathname === "/Add_Staff" ||
                      location.pathname === "/View_Staff_Rights" ||
                      location.pathname === "/View_Sub_Rights" ||
                      location.pathname === "/View_Inside_Page_Rights" ||
                      location.pathname === "/Create_Staff_Rights" ||
                      location.pathname === "/Edit_Staff_Rights" ||
                      location.pathname === "/Edit_Sub_Rights" ||
                      location.pathname === "/Create_Inside_Page_Rights" ||
                      location.pathname === "/ViewDesignation" ||
                      location.pathname.includes("/edit_staff")
                        ? dropArrowwOrange
                        : dropArroww
                    }
                    alt="img"
                  ></img>
                </div>
              </div>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/View_Staff">
                    View Staff
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/ViewDesignation">
                    Create Designation
                  </Link>
                </li>
              </ul>
            </li>
            <Link to="/System_Settings">
              <li className="system_settings">
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/System_Settings"
                      ? "activeSideItem"
                      : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/System_Settings"
                        ? SettingOrng
                        : Setting
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Setting_text}</p>
                </div>
              </li>
            </Link>
            <Link to="/View_Reports">
              <li
                className={`reports sidebarDropdown ${Triosidebarhideshow(
                  "Reports"
                )}`}
              >
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/View_Reports"
                      ? "activeSideItem"
                      : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/View_Reports"
                        ? ReportOrng
                        : Report
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>Reports</p>
                </div>
              </li>
            </Link>

            <li className="dropdown sidebarDropdown resraurant_setup">
              <div
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className={`sidebar_list_item ${
                  location.pathname === "/View_Restaurants" ||
                  location.pathname === "/Floor_Plan_Management" ||
                  location.pathname === "/Create_Restaurant" ||
                  location.pathname === "/Create_Floor_Plan" ||
                  location.pathname.includes("Edit_Floor_Plan")
                    ? "activeSideItem"
                    : " "
                }`}
              >
                <img
                  src={
                    location.pathname === "/View_Restaurants" ||
                    location.pathname === "/Floor_Plan_Management" ||
                    location.pathname === "/Create_Restaurant" ||
                    location.pathname === "/Create_Floor_Plan" ||
                    location.pathname.includes("Edit_Floor_Plan")
                      ? RestroOrng
                      : Restro
                  }
                  alt="Barley's Dashboard"
                />
                <p>{sidebarpagetext.Restaurant_Setup_text}</p>
                <div className="droparrow">
                  <img src={dropArroww} alt="img"></img>
                </div>
              </div>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/View_Restaurants">
                    View Restaurants
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/Floor_Plan_Management">
                    Floor Management
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown sidebarDropdown feedback_mngmt">
              <div
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className={`sidebar_list_item ${
                  location.pathname === "/Feedback_Management" ||
                  location.pathname === "/View_Feedbacks"
                    ? "activeSideItem"
                    : " "
                }`}
              >
                <img
                  src={
                    location.pathname === "/Feedback_Management" ||
                    location.pathname === "/View_Feedbacks"
                      ? FeedbackOrng
                      : Feedback
                  }
                  alt="Barley's Dashboard"
                />
                <p>{sidebarpagetext.Feedback_Mngmt}</p>
                <div className="droparrow">
                  <img
                    src={
                      location.pathname === "/Feedback_Management" ||
                      location.pathname === "/View_Feedbacks"
                        ? dropArrowwOrange
                        : dropArroww
                    }
                    alt="img"
                  ></img>
                </div>
              </div>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/Feedback_Management">
                    {sidebarpagetext.Feedback_management_text}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/View_Feedbacks">
                    View Feedbacks
                  </Link>
                </li>
              </ul>
            </li>
            <Link to="/Manuals">
              <li className="Manuals">
                <div
                  className={`sidebar_list_item ${
                    location.pathname === "/Manuals" ? "activeSideItem" : " "
                  }`}
                >
                  <img
                    src={
                      location.pathname === "/Help_And_Support" ||
                      location.pathname === "/FAQs" ||
                      location.pathname === "/Manuals"
                        ? HelpSupportOrng
                        : HelpSupport
                    }
                    alt="Barley's Dashboard"
                  />
                  <p>{sidebarpagetext.Help_Support_text}</p>
                </div>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
