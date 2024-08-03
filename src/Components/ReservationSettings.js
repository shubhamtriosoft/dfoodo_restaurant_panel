import React, { useState, useEffect } from "react";
import BeforeTime from "../assets/device_reset.svg";
import InfoIcon from "../assets/(i).png";
import {
  Open_Menu_text,
  CreateStaffRightText,
} from "../CommonJquery/WebsiteText";
import {
  handleNumbersChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccess,
  handleError,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_general_Settings,
  get_all_ReservationSetting,
} from "../ServiceConnection/serviceconnection.js";
function ReservationSettings() {
  const [activeSlotsTime, setActiveSlotsTime] = useState(false);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [dynaicimage, setDynaicimage] = useState(null);
  const [reservationsettings, setreservationsettings] = useState(null); // State to hold calendar data
  const toggleTimeSlots = () => {
    setActiveSlotsTime(!activeSlotsTime);
  };

  useEffect(() => {
    const master_data_get = async () => {
      setshowLoaderAdmin(true);
      const fd = new FormData();
      await server_post_data(get_all_ReservationSetting, fd)
        .then((Response) => {
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            setreservationsettings(Response.data.message.data[0]);
            if (Response.data.message.data[0].booking_slot_interval == 30) {
              setActiveSlotsTime(false);
            } else {
              setActiveSlotsTime(true);
            }
            console.log(Response.data.message);
          }

          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
        });
    };
    master_data_get();
  }, []);

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      let time_slot_minutes = 15;
      if (activeSlotsTime == false) {
        time_slot_minutes = 30;
      } else {
        time_slot_minutes = 15;
      }
      fd_from.append("booking_slot_interval", time_slot_minutes);
      fd_from.append("flag", "3");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccess(Response.data.message);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };
  return (
    <div className="resrvtionSettings">
      <div className="resrvtionSettingsContainer">
        <form className="createForm" id="createForm">
          {/* <div className="col-lg-10"> */}
          <div className="row m-0">
            <div className="col-md-3">
              <label className="settingsLael">
                <span>Per Day Maximum Seat *</span>
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  type="button"
                  title={`It allows you to specify the maximum number of seats available for booking per day.`}
                >
                  <img src={InfoIcon} alt="Barley's Dashboard" />
                </button>
              </label>
              <div className="Reservationicoon image_icon_position1">
                <input
                  type="text"
                  name="per_day_maximum"
                  placeholder={"Per Day Maximum Seat"}
                  maxLength={3}
                  minLength={1}
                  className="form-control trio_mandatory input_field_custom2 "
                  onInput={(e) => handleNumbersChange(e)}
                  defaultValue={
                    reservationsettings
                      ? reservationsettings["per_day_maximum"]
                      : ""
                  }
                />
                <span className="condition_error"></span>
              </div>
            </div>

            <div className="col-md-3">
              <label className="settingsLael">
                <span>Approval Person Limit *</span>
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  type="button"
                  title={`Enter the maximum number of person required no approval from admin`}
                >
                  <img src={InfoIcon} alt="Barley's Dashboard" />
                </button>
              </label>
              <div className="IconContact image_icon_position1">
                <input
                  type="text"
                  name="approval_person_limit"
                  placeholder={"Approval Person Limit *"}
                  maxLength={3}
                  minLength={1}
                  className="form-control trio_mandatory input_field_custom2 "
                  onInput={(e) => handleNumbersChange(e)}
                  defaultValue={
                    reservationsettings
                      ? reservationsettings["approval_person_limit"]
                      : ""
                  }
                />
                <span className="condition_error"></span>
              </div>
            </div>
            <div className="col-md-3">
              <label className="settingsLael">
                <span>Booking Cutoff Time *</span>
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  type="button"
                  title={`Set the deadline for making bookings. Any requests submitted after this time will not be accepted.`}
                >
                  <img src={InfoIcon} alt="Barley's Dashboard" />
                </button>
              </label>
              <div className="BeforeTime image_icon_position1">
                <input
                  type="text"
                  name="before_booking_min"
                  placeholder={"Booking Cutoff Time *"}
                  maxLength={3}
                  minLength={1}
                  className="form-control trio_mandatory input_field_custom2 "
                  onInput={(e) => handleNumbersChange(e)}
                  defaultValue={
                    reservationsettings
                      ? reservationsettings["before_booking_min"]
                      : ""
                  }
                />
                <span className="condition_error"></span>
              </div>
            </div>
            <div className="col-md-3">
              <label className="settingsLael">
                <span>Table Turnover Time *</span>
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  htmlFor="top"
                  type="button"
                  title={`Specify the duration for each table's occupancy. Once this time elapses, the table will be available for the next booking.`}
                >
                  <img src={InfoIcon} alt="Barley's Dashboard" />
                </button>
              </label>
              <div className="BeforeTime image_icon_position1">
                <input
                  type="text"
                  name="table_turnover"
                  placeholder={"Table Turnover Time *"}
                  maxLength={3}
                  minLength={1}
                  className="form-control trio_mandatory input_field_custom2 "
                  onInput={(e) => handleNumbersChange(e)}
                  defaultValue={
                    reservationsettings
                      ? reservationsettings["table_turnover"]
                      : ""
                  }
                />
                <span className="condition_error"></span>
              </div>
            </div>
            {/* </div> */}
            <div className="manageByslot">
              <div className="row m-0">
                <div className="col-md-4">
                  <div className="manageByslotContainer">
                    <p>
                      Manage Reservations with <br /> Time Slots of:
                    </p>
                    <div className="timeSlotsTab">
                      <div
                        className={`timeSlots ${
                          activeSlotsTime ? "activeSlotsTime" : ""
                        }`}
                        onClick={toggleTimeSlots}
                      >
                        15 Minutes
                      </div>
                      <div
                        className={`timeSlots ${
                          activeSlotsTime ? "" : "activeSlotsTime"
                        }`}
                        onClick={toggleTimeSlots}
                      >
                        30 Minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="saveFormBtns ">
              <button className="btnCancel" type="hidden">
                Cancel
              </button>
              <button
                className="Create_Right_Btn btnSave"
                type="button"
                onClick={() =>
                  handleSaveChangesdynamic(
                    "createForm",
                    save_update_general_Settings
                  )
                }
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationSettings;
