import React, { useState, useEffect } from "react";
import "./Css/AddStaff.css";
import "react-datepicker/dist/react-datepicker.css";
import { AddStaffPageText } from "./../CommonJquery/WebsiteText";
import ADdIcon from "../assets/addnew.svg";
import {
  handleEmailChange,
  handleNumbersChange,
  handleURLChange,
  handleError,
  check_vaild_save,
  combiled_form_data,
  handleSuccess,
  handleIaphabetnumberChange,
} from "../CommonJquery/CommonJquery";
import Loader from "./Loader.js";
import {
  server_post_data,
  get_all_WebsiteManagement,
  save_update_WebsiteManagement,
} from "../ServiceConnection/serviceconnection.js";
import { useLocation } from "react-router-dom";
function WebRestroInfo() {
  const location = useLocation();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [mealData, setmealData] = useState([]);
  const [timingData, settimingData] = useState([]);

  const generateTableTimings = (selectedInterval) => {
    const Tabletimings = [];
    const startTime = new Date(2000, 0, 1, 0, 0); // Use an arbitrary date with 00:00 time
    const endTime = new Date(2000, 0, 1, 23, 45);

    let current = new Date(startTime);

    while (current <= endTime) {
      let formattedTime = current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      formattedTime = formattedTime.replace(/^24/, "00");
      Tabletimings.push(formattedTime);
      current.setMinutes(current.getMinutes() + selectedInterval);
    }
    console.log(Tabletimings);

    return Tabletimings;
  };
  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    let ovrlp = 0;
    const intervals = [];

    const timeToMinutes = (timeString) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const allMeals = document.querySelectorAll(".allmeals");
    const mealsArray = Array.from(allMeals);
    mealsArray.forEach((meal, index) => {
      const mealsTimingCardBody = meal.querySelector(".mealsTimingCard_body");

      if (
        mealsTimingCardBody &&
        !mealsTimingCardBody.classList.contains("unclickable")
      ) {
        const start_time = meal.querySelector(".start_time").value;

        const end_time = meal.querySelector(".end_time").value;

        const currentStartTime = timeToMinutes(start_time);
        const currentEndTime = timeToMinutes(end_time);
        if (currentStartTime >= currentEndTime) {
          // ovrlp = 1;
        }
      }
    });
    if (ovrlp == 1) {
      handleError(`Conflict detected at Restaurant timing`);
    }
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccess(Response.data.message);
            master_data_get("", "", "1", "");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const handleCheckboxWeekChange = (event, indxbtn) => {
    if (event.target.checked) {
      document
        .querySelector(`.mealsTimingCard_body${indxbtn}`)
        .classList.remove("unclickable");
    } else {
      document
        .querySelector(`.mealsTimingCard_body${indxbtn}`)
        .classList.add("unclickable");
    }
  };

  useEffect(() => {
    master_data_get("", "", "1", "");
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_WebsiteManagement, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_websiteManagement.length > 0) {
            seteditStaffData(Response.data.message.data_websiteManagement[0]);
            setmealData(Response.data.message.data_websiteManagement_timing);
            settimingData(
              generateTableTimings(Response.data.message.time_slot_minutes)
            );
          }
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  return (
    <div className="page_body">
      {showLoaderAdmin && <Loader />}
      <div className="addStaffForms">
        <form id="addNewStaff">
          <div className="personalForm">
            <div className="staffForm_container">
              <div className="row m-0">
                <div className="col-md-12">
                  <div className="addstaffInputs">
                    <div className="row m-0">
                      <div className="col-md-4">
                        <div className="inpContainer">
                          <div className="orange_phone image_icon_position1">
                            <input
                              type="text"
                              name="phone_no"
                              placeholder={AddStaffPageText.Phone_Number}
                              minLength={4}
                              maxLength={10}
                              className="trio_no trio_mandatory form-control input_field_custom2 "
                              onInput={(e) => handleNumbersChange(e)}
                              defaultValue={editStaffData.phone_no || ""}
                            />
                            <span className="condition_error"></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="inpContainer">
                          <div className="orange_phone image_icon_position1">
                            <input
                              type="text"
                              id="other_no"
                              name="other_no"
                              placeholder={AddStaffPageText.Alt_Phone_Number}
                              maxLength={10}
                              minLength={4}
                              className="trio_no  form-control input_field_custom2 "
                              onInput={(e) => handleNumbersChange(e)}
                              defaultValue={editStaffData.other_no || ""}
                            />
                            <span className="condition_error"></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="inpContainer">
                          <div className="ornage_email_image image_icon_position1 ">
                            <input
                              type="text"
                              name="email_id"
                              placeholder="Restaurant Email *"
                              minLength={4}
                              maxLength={72}
                              className="trio_email trio_mandatory form-control  input_field_custom1 "
                              onInput={(e) => handleEmailChange(e)}
                              defaultValue={editStaffData.email_id || ""}
                            />
                            <span className="condition_error"></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="inpContainer ">
                          <div className="image_icon_position1">
                            <textarea
                              type="text"
                              rows="4"
                              name="address"
                              maxLength={250}
                              minLength={5}
                              placeholder="Address 1 *"
                              defaultValue={editStaffData.address || ""}
                              onInput={(e) => handleIaphabetnumberChange(e)}
                              className="trio_mandatory form-control input_field_custom3"
                            ></textarea>
                            <span className="condition_error"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-0">
                <div className="socialdetails">
                  <h5 style={{ paddingLeft: "12px" }}>
                    {AddStaffPageText.Social_media_text}
                  </h5>
                  <div className="row m-0">
                    <div className="col-md-4">
                      <div className="inpContainer">
                        <div className="person__facebook_image image_icon_position1">
                          <input
                            type="text"
                            name="facebook_link"
                            placeholder={AddStaffPageText.facebook_link}
                            maxLength={150}
                            minLength={4}
                            className="form-control input_field_custom2 "
                            onInput={(e) => handleURLChange(e)}
                            defaultValue={editStaffData.facebook_link || ""}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="inpContainer">
                        <div className="person__instagram_image image_icon_position1">
                          <input
                            type="text"
                            name="instragram_link"
                            placeholder={AddStaffPageText.instagram_link}
                            maxLength={150}
                            minLength={4}
                            className="form-control input_field_custom2 "
                            onInput={(e) => handleURLChange(e)}
                            defaultValue={editStaffData.instragram_link || ""}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="inpContainer">
                        <div className="person__linkedin_image image_icon_position1">
                          <input
                            type="text"
                            name="linkedin_link"
                            placeholder={AddStaffPageText.linkedin_link}
                            maxLength={150}
                            minLength={4}
                            className="form-control input_field_custom2 "
                            onInput={(e) => handleURLChange(e)}
                            defaultValue={editStaffData.linkedin_link || ""}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="inpContainer">
                        <div className="person__twitter_image image_icon_position1">
                          <input
                            type="text"
                            name="twitter_link"
                            placeholder={AddStaffPageText.twitter_link}
                            maxLength={150}
                            minLength={4}
                            className="form-control input_field_custom2 "
                            onInput={(e) => handleURLChange(e)}
                            defaultValue={editStaffData.twitter_link || ""}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="inpContainer">
                        <div className="person__snapchat_image image_icon_position1">
                          <input
                            type="text"
                            name="snapchat_link"
                            placeholder={AddStaffPageText.snapchat_link}
                            maxLength={150}
                            minLength={4}
                            className="form-control input_field_custom2 "
                            onInput={(e) => handleURLChange(e)}
                            defaultValue={editStaffData.snapchat_link || ""}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-0">
                <div className="socialdetails">
                  <h5 style={{ paddingLeft: "12px" }}>
                    {AddStaffPageText.websiet_res_timing}
                  </h5>
                  <div className="row m-0 ">
                    {mealData.map((meal, index) => (
                      <div
                        className="col-xl-6 col-lg-6 allmeals"
                        key={index}
                        mealkey={index}
                      >
                        <div className="mealsTimingCard">
                          <div className="mealsTimingCard_head">
                            <h6>{meal.week_name}</h6>
                            <div className="no_prsnl_id p-0">
                              <div className="mealTimeBox">
                                <input
                                  type="checkbox"
                                  id={`${meal.weekday_id_name}`}
                                  name={`${meal.weekday_id_name}`}
                                  defaultChecked={
                                    meal.open_close_status === 0 && true
                                  }
                                  value={0}
                                  className="hidden-checkbox hidden-checkbox trio_mandatory form-control"
                                  onChange={(e) => {
                                    handleCheckboxWeekChange(
                                      e,
                                      meal.weekday_id_name
                                    );
                                  }}
                                />

                                <label
                                  htmlFor={`${meal.weekday_id_name}`}
                                  className="checkbox-labelTiming checkbox-labelMeal labelCheckbox"
                                ></label>
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`mealsTimingCard_body mealsTimingCard_body${
                              meal.weekday_id_name
                            }  ${
                              meal.open_close_status === 0 ? "" : "unclickable"
                            }`}
                          >
                            <div className="openCloseInp">
                              <p>Open</p>
                              <select
                                name={`${meal.start_time_name}`}
                                className="trio_mandatory form-control input_field_custom1 start_time"
                                defaultValue={meal.start_time.substring(
                                  0,
                                  meal.start_time.length - 3
                                )}
                              >
                                {timingData.map((mealtttt, index) => (
                                  <option value={mealtttt}>{mealtttt}</option>
                                ))}
                              </select>
                              <span className="condition_error"></span>
                            </div>
                            <div className="openCloseInp">
                              <p>Close</p>
                              <select
                                name={`${meal.end_time_name}`}
                                className="trio_mandatory form-control input_field_custom1 end_time"
                                defaultValue={meal.end_time.substring(
                                  0,
                                  meal.end_time.length - 3
                                )}
                              >
                                {timingData.map((mealtttt, index) => (
                                  <option value={mealtttt}>{mealtttt}</option>
                                ))}
                              </select>
                              <span className="condition_error"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="saveFormBtns">
                <button
                  className="btnSave"
                  type="button"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "addNewStaff",
                      save_update_WebsiteManagement
                    )
                  }
                >
                  {location.pathname.includes("/Website_Management")
                    ? "Save"
                    : "Update"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WebRestroInfo;
