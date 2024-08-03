import React, { useState, useEffect } from "react";
import {
  Open_Menu_text,
  CreateStaffRightText,
} from "../CommonJquery/WebsiteText";
import {
  check_vaild_save,
  combiled_form_data,
  handleSuccess,
  handleError,
} from "../CommonJquery/CommonJquery";

import {
  server_post_data,
  save_update_general_Settings,
  get_all_ReservationSetting,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import ADdIcon from "../assets/addnew.svg";
import DropFiles from "../assets/dropFiles.png";
import Loader from "./Loader.js";

function GeneralSettings() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [reservationsettings, setreservationsettings] = useState([]); // State to hold calendar data
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [mealData, setmealData] = useState([]);
  const [timingData, settimingData] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);
  const [dynaicimageName, setDynaicimageName] = useState("");
  //const [selectedInterval, setSelectedInterval] = useState(15);
  const [themeSelect, setThemeSelect] = useState(1);
  const handleFileChangedynamic = (keyname) => (event) => {
    const file = event.target.files[0];
    console.log(file);
    setDynaicimageName(file.name);
    let new_file_name = keyname + "_show";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("application/pdf")) {
      alert("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    const minSize = 200 * 1024; // 200KB in bytes

    if (file.size > maxSize) {
      alert("File size exceeds the maximum limit (2MB).");
      event.target.value = "";
      return;
    }

    if (file.size < minSize) {
      alert("File size is below the minimum limit (200KB).");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    // Listen for the 'load' event
    // reader.onload = function () {
    //   alert("File was successfully uploaded.");
    // };
    reader.onload = () => {
      // const img = new Image();
      // img.src = reader.result;

      setDynaicimage((prevImages) => ({
        ...prevImages,
        [keyname]: file,
        [new_file_name]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
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
            console.log(Response.data.message);
            setreservationsettings(Response.data.message.data[0]);
            seteditOldImageData(Response.data.message.data[0].menu_file);
            setDynaicimage({
              event_list_image_show:
                APL_LINK +
                Response.data.message.data_link_image +
                Response.data.message.data[0].menu_file,
            });
            setmealData(Response.data.message.meal_data);
            setThemeSelect(Response.data.message.data[0].theme_select);
            ///settimingData(Response.data.message.timing_data);
            //setSelectedInterval(Response.data.message.time_slot_minutes);
            settimingData(
              generateTableTimings(Response.data.message.time_slot_minutes)
            );
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
    const allMeals = document.querySelectorAll(".mealsTiming .allmeals");
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

        // Check if the current meal overlaps with any other meal
        const overlap = mealsArray.some((otherMeal, otherIndex) => {
          if (index !== otherIndex) {
            const mealsTimingCardBodyScnd = otherMeal.querySelector(
              ".mealsTimingCard_body"
            );
            if (
              mealsTimingCardBodyScnd &&
              !mealsTimingCardBodyScnd.classList.contains("unclickable")
            ) {
              const otherStartTime = timeToMinutes(
                otherMeal.querySelector(".start_time").value
              );
              const otherEndTime = timeToMinutes(
                otherMeal.querySelector(".end_time").value
              );
              return (
                (currentStartTime >= otherStartTime &&
                  currentStartTime < otherEndTime) ||
                (currentEndTime > otherStartTime &&
                  currentEndTime <= otherEndTime) ||
                (currentStartTime <= otherStartTime &&
                  currentEndTime >= otherEndTime)
              );
            }
          }
          return false;
        });

        if (overlap) {
          ovrlp = 1;
          console.log(`Conflict detected at meal ${index + 1}`);
          // Handle conflict (e.g., display an error message, prevent saving)
        }
      }
    });
    if (ovrlp == 1) {
      handleError(`Conflict detected at meal timing`);
      return 0;
    }
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      fd_from.append("old_image_link", editOldImageData);
      fd_from.append("flag", "1");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
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

  const handleThemeSelectChange = (e) => {
    console.log(e.target.value);
    setThemeSelect(e.target.value);
  };

  return (
    <div className="general_Settings">
      {showLoaderAdmin && <Loader />}
      <div className="general_Settings_container">
        <form className="createForm" id="createForm">
          <div className="row m-0">
            <div className="col-lg-5 col-md-6">
              <div className="mealsTiming">
                {mealData.map((meal, index) => (
                  <div className="row m-0 allmeals" key={index} mealkey={index}>
                    <div className="col-xl-10 col-lg-11">
                      <div className="mealsTimingCard">
                        <div className="mealsTimingCard_head">
                          <h6>{meal.name}</h6>
                          <div className="no_prsnl_id p-0">
                            <div className="mealTimeBox">
                              <input
                                type="checkbox"
                                id={`${meal.check_box_name}`}
                                name={`${meal.check_box_name}`}
                                defaultChecked={
                                  meal.check_box_value === 1 && true
                                }
                                value={1}
                                className="hidden-checkbox hidden-checkbox trio_mandatory form-control"
                                onChange={(e) => {
                                  handleCheckboxWeekChange(
                                    e,
                                    meal.check_box_name
                                  );
                                }}
                              />

                              <label
                                htmlFor={`${meal.check_box_name}`}
                                className="checkbox-labelTiming checkbox-labelMeal labelCheckbox"
                              ></label>
                              <span className="condition_error"></span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`mealsTimingCard_body mealsTimingCard_body${
                            meal.check_box_name
                          }  ${
                            meal.check_box_value === 1 ? "" : "unclickable"
                          }`}
                        >
                          <div className="openCloseInp">
                            <p>Open</p>
                            <select
                              name={`${meal.starttime_name}`}
                              className="trio_mandatory form-control input_field_custom1 start_time"
                              defaultValue={meal.starttime_value.substring(
                                0,
                                meal.starttime_value.length - 3
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
                              name={`${meal.endtime_name}`}
                              className="trio_mandatory form-control input_field_custom1 end_time"
                              defaultValue={meal.endtime_value.substring(
                                0,
                                meal.endtime_value.length - 3
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

                    <div className="col-md-1" hidden>
                      <div
                        className={`${
                          index === mealData.length - 1
                            ? "addMeatRow"
                            : "addMeatRowHidden"
                        }`}
                      >
                        <button>
                          <img src={ADdIcon} alt="Barley's Dashboard" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-7 col-md-6">
              <div className="menuTHemeContainer">
                <div className="uplaodfilesDiv">
                  <p>UPLOAD YOUR MENU FILES</p>

                  <div className="menuDropZOne">
                    <div className="menuDropZOne_container">
                      <div className="dropFilesHere">
                        {dynaicimage && dynaicimage.event_list_image_show ? (
                          <img
                            src={dynaicimage.event_list_image_show}
                            onError={(e) => {
                              e.target.src = DropFiles;
                            }}
                            alt="Barley's Dashboard"
                          />
                        ) : (
                          <img src={DropFiles} alt="Barley's Dashboard" />
                        )}
                        <p>Drop Your PDF File here</p>
                        <p>or</p>
                        {/* <p>{dynaicimageName.name}</p> */}
                      </div>
                      <input
                        name="event_list_image"
                        id="event_list_image"
                        type="file"
                        onChange={() =>
                          handleFileChangedynamic("event_list_image")
                        }
                        accept=".pdf"
                        hidden
                      />
                      <label htmlFor="event_list_image">Browse</label>
                    </div>
                  </div>
                </div>
                <div className="saveFormBtns b ">
                  <button className="btnCancel" type="hidden">
                    Cancel
                  </button>
                  <button
                    className="btnSave"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneralSettings;
