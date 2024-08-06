import React, { useState, useEffect, useRef } from "react";
import "./Css/Header.css";
import "./Css/Loading.css";
import logicn from "../assets/profileseticn.svg";
import profileseticn from "../assets/logoutIcn.svg";
import { Modal, Button } from "react-bootstrap";
import DashboardImgBlack from "../assets/dashboarddd.svg";
import CalendarImg from "../assets/calndr.svg";
import AddIcon from "../assets/plusE.svg";
import Walking from "../assets/walkMen.svg";
import OpenMenu from "../assets/menu_openWHite.svg";
import Dummy from "../assets/DummyNew.png";
import Analytics from "../assets/download.svg";
import Noti from "../assets/notiBlack.svg";
import SearchIcon from "../assets/megnfineSearc.svg";
import NotificationBar from "./NotificationBar.js";
import DownArrow from "../assets/dropArrowWHite.svg";
import SearchImg from "../assets/searchBlackHead.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleLinkClick,
  handleSuccess,
  inputdateformateChangeyear,
  handleError,
} from "../CommonJquery/CommonJquery.js";
import {
  server_post_data,
  get_all_searchmaster,
} from "../ServiceConnection/serviceconnection.js";
import {
  retrieveData,
  removeData,
} from "../LocalConnection/LocalConnection.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { firebaseService } from "../FirebaseConnection/FirebaseService"; // Adjust the path as needed
import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";
import SideBar from "./SideBar.js";
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [options, setoptions] = useState([]);
  const [notificationsCount, setnotificationsCount] = useState(0);
  const admin_name_with_gender = retrieveData("admin_name_with_gender");
  const designation_name = retrieveData("designation_name");
  const admin_image = retrieveData("admin_image");
  const restaurant_name = retrieveData("restaurant_name");
  const restaurant_image = retrieveData("restaurant_image");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const retrivemsg = retrieveData("session_msg");
    const retrievedDataFind = retrieveData("admin_name_with_gender");
    if (
      retrievedDataFind === "null" ||
      retrievedDataFind === null ||
      retrievedDataFind === "1"
    ) {
      // navigate("/");
    }
    if (
      retrivemsg !== "" &&
      retrivemsg !== null &&
      retrivemsg !== "0" &&
      retrivemsg !== "1"
    ) {
      handleSuccess(retrivemsg, 1);
    }
    checkTime();
  }, []);

  useEffect(() => {
    master_data_get();
  }, [notificationsCount]);

  /////////////////////// Firebase Notification Start ///////////////////
  const [shownotification, setshownotification] = useState(false);
  const db = getFirestore();
  const collectionRef = doc(db, "notification_start", "always_update_data");

  // Set up Firestore listener to listen for changes in the document
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (
          data.data_update === 1 &&
          !shownotification &&
          !location.pathname.includes("/Dashboard")
        ) {
          await updateDoc(collectionRef, { data_update: 0 });
          handleSuccess("new_book");
          master_data_get();
          setshownotification(true);
        }
      }
    });

    // Cleanup function to unsubscribe from Firestore listener
    return () => unsubscribe();
  }, []); // Ensure useEffect runs only once on component mount

  // Reset shownotification after a certain period of time
  useEffect(() => {
    const resetNotification = () => {
      if (shownotification) {
        setTimeout(() => {
          setshownotification(false);
        }, 1000);
      }
    };

    resetNotification();
    return () => clearTimeout(resetNotification);
  }, [shownotification]);
  /////////////////////// Firebase Notification Close ///////////////////

  //sidebar open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sideBarRef = useRef(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //notification sidebaar
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleNotificationClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      isNotificationOpen
    ) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleNotificationClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleNotificationClickOutside);
    };
  }, [isNotificationOpen]);

  const notificationRef = useRef(null);

  const checkTime = () => {
    try {
      let now = new Date();
      let hr = now.getHours();
      let min = now.getMinutes();
      let seconds = now.getSeconds();
      let hours = document.querySelector(".hours");
      let minutes = document.querySelector(".minutes");

      if (hr < 10) {
        hr = "0" + hr;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (hours && minutes) {
        hours.textContent = hr + " : ";
        minutes.textContent = min;
      }

      // Calculate remaining seconds until the next minute
      let remainingSeconds = 59 - seconds;

      if (Number(remainingSeconds) < 2) {
        remainingSeconds = 60;
      }

      // Set the interval based on remaining seconds
      setTimeout(checkTime, remainingSeconds * 1000);
    } catch (err) {
      console.log(err);
    }
  };
  const logoutpopup = () => {
    setShowModal(false);
    removeData();
    navigate("/");
  };

  const handleSearchButtonClick = () => {
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      const searchHistory = JSON.parse(storedSearchHistory);
      setSearchResults(searchHistory.slice(-5));
    } else {
      setSearchResults([]);
    }
    setIsSearchActive(true);
  };

  const master_data_get = async () => {
    const fd = new FormData();
    fd.append("flag", "1");
    await server_post_data(get_all_searchmaster, fd)
      .then((Response) => {
        // console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setoptions(Response.data.message.data_search);
          setnotificationsCount(
            Response.data.message.data_reservation_data.length
          );
        }
      })
      .catch((error) => {
        handleError("network");
      });
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const filteredResults = options.filter(
        (option) =>
          option.master_name.toLowerCase().includes(value.toLowerCase()) ||
          option.master_value
            .toLowerCase()
            .split(",") // Split the value string by commas
            .some((subValue) => subValue.trim().includes(value.toLowerCase())) // Check if any substring matches the search term
      );
      setSearchResults(filteredResults);
    }
    setIsSearchActive(true);
  };

  const handleSearchResultClick = (result) => {
    const storedSearchHistory = localStorage.getItem("searchHistory");
    let searchHistory = storedSearchHistory
      ? JSON.parse(storedSearchHistory)
      : [];
    const index = searchHistory.findIndex(
      (item) => item.master_url === result.master_url
    );
    if (index !== -1) {
      searchHistory.splice(index, 1);
    }
    searchHistory = [result, ...searchHistory.slice(0, 4)];

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    window.location.href = window.location.origin + "/" + result.master_url;
  };

  const headSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headSearchRef.current &&
        !headSearchRef.current.contains(event.target)
      ) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headSearchRef]);

  const [imageSrc, setImageSrc] = useState(admin_image);
  const handleImageError = () => {
    setImageSrc(Dummy);
  };

  /******* Upper Search Close**********/
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid nav_container p-0">
          <div className="navbar-collapse" id="navbarNav">
            <span className="accesibilities">
              <div
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                htmlFor="top"
                title={`Open`}
                className={`menuOpenClose `}
                onClick={toggleSidebar}
                style={{ paddingLeft: "0" }}
              >
                <img src={OpenMenu} alt="Barley's Dashboard" />
              </div>
              <div className="accesibilitiesIcons">
                <Link
                  rel="noopener"
                  onClick={() => handleLinkClick("/Dashboard")}
                >
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    htmlFor="top"
                    title={`Dashboard`}
                    className={` ${
                      location.pathname === "/Dashboard"
                        ? "selectedHeadBtn"
                        : ""
                    } `}
                  >
                    <img src={DashboardImgBlack} alt="Barley's Dashboard" />
                  </button>
                </Link>
                <Link
                  rel="noopener"
                  onClick={() => handleLinkClick("/Reservation_Calendar")}
                >
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    htmlFor="top"
                    title={`Reservation Management`}
                    className={` ${
                      location.pathname === "/Reservation_Calendar"
                        ? "selectedHeadBtn"
                        : ""
                    } `}
                  >
                    <img src={CalendarImg} alt="Barley's Dashboard" />
                  </button>
                </Link>
              </div>
              <Link
                rel="noopener"
                onClick={() => handleLinkClick("/Create_Reservation")}
              >
                <button
                  className={` rsrvHeadBtn ${
                    location.pathname === "/Create_Reservation"
                      ? "selectedHeadBtn"
                      : ""
                  } `}
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  title={`Create Reservation`}
                >
                  <img src={AddIcon} alt="Barley's Dashboard" />
                  <p
                    className={` ${
                      location.pathname === "/Create_Reservation"
                        ? "showOnActive"
                        : "hideAfter1150"
                    }`}
                  >
                    RESERVATION
                  </p>
                </button>
              </Link>
              <Link
                rel="noopener"
                onClick={() => handleLinkClick("/Create_WalkIn")}
              >
                <button
                  className={` rsrvHeadBtn ${
                    location.pathname === "/Create_WalkIn"
                      ? "selectedHeadBtn"
                      : ""
                  } `}
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  title={`Create Walk-In Reservation`}
                >
                  <img src={Walking} alt="Barley's Dashboard" />
                  <p
                    className={` ${
                      location.pathname === "/Create_WalkIn"
                        ? "showOnActive"
                        : "hideAfter1150"
                    }`}
                  >
                    WALK-IN
                  </p>
                </button>
              </Link>
              {!isSearchActive && (
                <div
                  className="accesibilitiesIcons"
                  ref={headSearchRef}
                  onClick={handleSearchButtonClick}
                >
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    htmlFor="top"
                    title={`Search`}
                    onClick={() => setIsSearchActive(true)}
                  >
                    <img
                      style={{ width: "27px" }}
                      src={SearchIcon}
                      alt="Barley's Dashboard"
                    />
                  </button>
                </div>
              )}
              {isSearchActive && (
                <div className="headSearch" ref={headSearchRef}>
                  <div className="headSearchInput">
                    <img src={SearchImg} alt="Barley's Dashboard" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={`searchDropdownBox ${
                      isSearchActive && searchResults.length > 0 ? "" : "d-none"
                    }`}
                  >
                    <ul>
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          onClick={() => handleSearchResultClick(result)}
                        >
                          {result.master_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </span>
            <ul className="navbar-nav">
              <li className="nav-item">
                <div className="timeANdDateHead">
                  <p className="dateHeadb">{inputdateformateChangeyear("")}</p>
                  <p>
                    <span className="hours">0</span>
                    <span className="minutes">0</span>
                  </p>
                </div>
              </li>
              <Link rel="noopener" onClick={() => handleLinkClick("/Manuals")}>
                <li className="nav-item">
                  <div className="accesibilities">
                    <button
                      className={` rsrvHeadBtn ${
                        location.pathname === "/Manuals"
                          ? "selectedHeadBtn"
                          : ""
                      } `}
                    >
                      <p>HELP</p>
                    </button>
                  </div>
                </li>
              </Link>
              <li className="nav-item">
                <span className="profileLink nav-link active paddRight0">
                  <img
                    style={{ borderRadius: "10px" }}
                    src={admin_image}
                    onError={(e) => (e.target.src = Dummy)}
                    alt="Barley's Dashboard"
                  />
                  <div className="dropdown profileDropdown">
                    <div
                      className="profileBtnToggle dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span>
                        <h6>{restaurant_name}</h6>
                        <p>
                          {admin_name_with_gender}({designation_name})
                        </p>
                      </span>
                      <img
                        className="togglePBTN"
                        src={DownArrow}
                        alt="Barley's Dashboard"
                      />
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          rel="noopener"
                          className="dropdown-item"
                          onClick={() => handleLinkClick("/Profile_Settings")}
                        >
                          {" "}
                          <div className="profilOuticn">
                            <img
                              className="profilimg"
                              src={profileseticn}
                              alt="img"
                            ></img>
                            My Profile
                          </div>
                        </Link>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          onClick={() => openModal()}
                        >
                          <div className="logOuticn">
                            <img
                              className="logOutimg"
                              src={logicn}
                              alt="img"
                            ></img>
                            Logout
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </span>
              </li>
              <li className="nav-item">
                <div className="saparatorDiv"></div>
              </li>
              <Link
                rel="noopener"
                onClick={() => handleLinkClick("/Analytics")}
              >
                <li className="nav-item">
                  <div className="accesibilities">
                    <div className="accesibilitiesIcons">
                      <button
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        htmlFor="top"
                        title={`Analytics`}
                        className={` ${
                          location.pathname === "/Analytics"
                            ? "selectedHeadBtn"
                            : ""
                        } `}
                      >
                        <img src={Analytics} alt="Barley's Dashboard" />
                      </button>
                    </div>
                  </div>
                </li>
              </Link>
              <li className="nav-item">
                <div className="accesibilities">
                  <div className="accesibilitiesIcons">
                    <button
                      onClick={toggleNotification}
                      className="noticountsets"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      htmlFor="top"
                      title={`Notifications`}
                    >
                      <img src={Noti} alt="Barley's Dashboard" />
                      {notificationsCount > 0 && (
                        <>
                          {notificationsCount > 9 ? (
                            <span>
                              9
                              <span style={{ backgroundColor: "transparent" }}>
                                &nbsp;+
                              </span>
                            </span>
                          ) : (
                            <span>{notificationsCount}</span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Body className="modal_body">
          <div className="success_img d-flex justify-content-center">
            {/* ... Modal content goes here ... */}
          </div>

          <p>Are you sure you want to Logout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="logoutYesBtn" onClick={logoutpopup}>
            Yes
          </Button>
          <Button className="logoutNoBtn" onClick={closeModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />

      <div ref={sideBarRef}>
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="notification-component" ref={notificationRef}>
        {isNotificationOpen && (
          <NotificationBar toggleNotification={toggleNotification} />
        )}
      </div>
    </div>
  );
}

export default Header;
