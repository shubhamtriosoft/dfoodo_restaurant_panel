import React, { useState, useEffect } from "react";
import OrngMsg from "../assets/orngMsg.svg";
import bookIcone from "../assets/bookUserr2.png";
import crossNotti from "../assets/crossCnc-icon.svg";
import {
  server_post_data,
  get_all_notification,
  update_notification_status,
  update_action_reservation,
} from "../ServiceConnection/serviceconnection.js";
import {
  inputdateformateChange,
  formatTimeintotwodigit,
  handleLinkClick,
  handleError,
  handleSuccess,
} from "../CommonJquery/CommonJquery";
import { Modal, Button } from "react-bootstrap";
import DoneGreen from "../assets/doneGreen.svg";
import { firebaseService } from "../FirebaseConnection/FirebaseService"; // Adjust the path as needed
import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";
let time_one = true;
const NotificationBar = ({ isOpen, toggleNotification }) => {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [notifications, setnotifications] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    if (time_one) {
      time_one = false;
      master_data_get("", "", "1", "0");
    }
  }, []);

  const hideNotification = (click_type) => {
    let primary_id = click_type;

    master_data_action_update_notification(primary_id, click_type);
  };

  // Get a Firestore instance
  const db = getFirestore();
  // Reference to the collection you want to listen to
  const collectionRef = doc(db, "notification_start", "always_update_data");
  console.log("ddd call data");
  onSnapshot(collectionRef, async (docSnapshot) => {
    if (docSnapshot.exists()) {
      if (docSnapshot.data().data_update === 1) {
        if (time_one) {
          time_one = false;
          const updatedData = {
            data_update: 0,
          };
          await updateDoc(collectionRef, updatedData);

          master_data_get("", "", "1", "0");
        }
      }
    }
  });

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    await server_post_data(get_all_notification, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setnotifications(Response.data.message.data_reservation_data);
        }
        time_one = true;
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        time_one = true;
        setshowLoaderAdmin(false);
      });
  };

  const master_data_action_update_notification = async (
    call_id,
    click_type
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("call_id", call_id);
    fd.append("click_type", click_type);
    await server_post_data(update_notification_status, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (time_one) {
            time_one = false;
            master_data_get("", "", "1", "0");
          }
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleShow = (data_call, click_type) => {
    if (click_type === "accepts") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "1",
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Accept the request?",
        button_name: "Accept",
        edit_click: true,
        button_name_next: "Edit Now",
        button_class: "assignModalBtn",
        comfirm_booking: false,
      });
      master_data_action_update(data_call.primary_id, "1");

      //setModalShow(true);
    } else if (click_type === "decline") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "5",
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Decline the request?",
        button_name: "Decline",
        edit_click: false,
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      master_data_action_update(data_call.primary_id, "5");
      //  setModalShow(true);
    }
  };
  const handleClose = () => {
    if (SelectedData.edit_click) {
      handleLinkClick("edit_Reservation/" + SelectedData.primary_id);
    } else {
      setModalShow(false);
    }
  };

  const handleActiveDeactive = () => {
    console.log("ddd");
    master_data_action_update(
      SelectedData.primary_id,
      SelectedData.booking_status
    );
  };

  const master_data_action_update = async (reservation_id, booking_status) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("reservation_id", reservation_id);
    fd.append("booking_status", booking_status);
    await server_post_data(update_action_reservation, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          if (time_one) {
            time_one = false;
            master_data_get("", "", "1", "0");
          }
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  // const toggleNoti = () => {
  //   setIop
  // }

  return (
    <>
      <div className={`notification-sidebar ${isOpen ? "open" : ""}`}>
        <div className="notificationBar">
          <div className="noti_Text">
            <label>NOTIFICATION</label>
            <div className="closeNoti">
              <button
                onClick={toggleNotification}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                htmlFor="top"
                title={`Close Notification `}
              >
                <img src={crossNotti} alt="img"></img>
              </button>
            </div>
          </div>
          {/* <div className="All_request_Cont">
            <div className="AlL_section onSelectedNoti">
              <button>All</button>
            </div>
            <div className="Request_section">
              <button>Request (0)</button>
            </div>
          </div> */}
          <div className="noticontent">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div className="Notification_hall" key={index}>
                  <div className="grppp">
                    <div className="imgGrP">
                      <button
                        onClick={(e) =>
                          hideNotification(notification.primary_id)
                        }
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        htmlFor="top"
                        title={`Clear Notification `}
                      >
                        <img src={crossNotti} alt="img"></img>
                      </button>
                    </div>

                    <div className="reservastion_rq">
                      <img src={bookIcone} alt="img"></img>
                      <label>Reservation Request</label>
                    </div>
                    <div
                      className="dates_aRriVe"
                      style={{ lineHeight: "normal" }}
                    >
                      <label className="p-0" style={{ lineHeight: "normal" }}>
                        {inputdateformateChange(notification.book_date)} at{" "}
                        {formatTimeintotwodigit(notification.book_time)} for{" "}
                        {notification.no_of_guest}P
                      </label>
                    </div>
                    <div
                      className="Name_aRriVe"
                      style={{ lineHeight: "normal" }}
                    >
                      <span className="p-0" style={{ lineHeight: "normal" }}>
                        {notification.guest_name}
                      </span>
                    </div>
                  </div>
                  {notification.booking_status === 0 && (
                    <div className="accpt_decln_btn">
                      <button
                        className="acceptBtnn"
                        onClick={(e) => handleShow(notification, "accepts")}
                      >
                        ACCEPT
                      </button>
                      <button
                        className="DeclineBtnn"
                        onClick={(e) => handleShow(notification, "decline")}
                      >
                        DECLINE
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no_noti">
                <p>Your Notifications <span>Will Appear Here</span>!</p>
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="Notification_hall  notiConTenr">
              <div className="clearNoti_btn">
                <button
                  className="clearNotiBtn"
                  onClick={(e) => hideNotification(0)}
                >
                  Clear All Notification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        show={modalShow}
        className="releaseModal"
        centered
        onHide={handleClose}
      >
        <Modal.Header className="releaseModalHeader"></Modal.Header>
        <Modal.Body className="releaseModalBody">
          <div className="releaseModalHead">
            <div className="releaseModalHeadLeft">
              <img src={DoneGreen} alt="Barley's Dashboard" />
              <h5>
                <span>&nbsp;{SelectedData.show_msg}</span>
              </h5>
            </div>
            <div className="releaseModalHeadRight">
              <img src={OrngMsg} alt="Barley's Dashboard" />
            </div>
          </div>
          <div className="releaseModalDetails">
            <h5>{SelectedData.guest_name}</h5>
            <p>
              BOOKING DATE : {inputdateformateChange(SelectedData.book_date)}
            </p>
            <p>
              BOOKING TIME : {formatTimeintotwodigit(SelectedData.book_time)}
            </p>
            <div className="countOfGuests">
              <p>{SelectedData.no_of_guest} PERSON</p>
              <p>{SelectedData.no_of_child} CHILDS</p>
              <p>{SelectedData.no_of_pets} PETS</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="releaseModalFooter">
          <Button
            className={`releaseModalBtn ${SelectedData.button_class}`}
            onClick={handleActiveDeactive}
          >
            {SelectedData.button_name}
          </Button>

          <Button className="editNowBtn Edit_Now" onClick={handleClose}>
            <label style={{ cursor: "pointer" }}>
              {SelectedData.button_name_next}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationBar;
