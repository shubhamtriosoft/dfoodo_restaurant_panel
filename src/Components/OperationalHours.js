import React, { useState, useEffect } from "react";
import BorderedGlobe from "../assets/borderedGlobe2.svg";
import BorderedOn from "../assets/on1.svg";
import CrossedGlobe from "../assets/crossedGlobe.svg";
import Watch from "../assets/watchBordered.svg";
import CrossedOn from "../assets/crossedON.svg";
import AddIcon from "../assets/addIcon.png";
import PrevArrow from "../assets/previousArrow.png";
import NextArrow from "../assets/nextArrow.png";
import DeleteIcon from "../assets/newDelet.svg";
import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader.js";
import $ from "jquery";
import {
  server_post_data,
  view_week_all_timing,
  save_update_week_timing,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  handleSuccessSession,
  handleSuccess,
} from "../CommonJquery/CommonJquery";
import { useLocation } from "react-router-dom";

function OperationalTimingsPage({ startDate, setStartDate, handleClose }) {
  const location = useLocation();
  const [selectedInterval, setSelectedInterval] = useState(15);
  const [WeekData, setWeekData] = useState("");
  const [timeList, setTimeList] = useState([]);
  const [isOnlineOn, setIsOnlineOn] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  // const [isSpecialOnlineOn, setIsSpecialOnlineOn] = useState(false);
  const [isSpecialOnlineOn, setIsSpecialOnlineOn] = useState(
    new Array(timeList.length).fill(false)
  );
  const [isRestroOpen, setIsRestroOpen] = useState(false);
  const [isRestroOpeninside, setIsRestroOpeninside] = useState([]);
  const [dataloop, setdataloop] = useState([]);
  const [dayData, setdayData] = useState([]);

  const [dataloopindex, setdataloopindex] = useState(1);
  const [dataloopdetails, setdataloopdetails] = useState([]);
  const [timeRows, setTimeRows] = useState([{ id: 1 }]);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const [isWeekOnlineChecked, setIsWeekOnlineChecked] = useState([]);
  const [isWeekCloseChecked, setIsWeekCloseChecked] = useState([]);

  useEffect(() => {
    //console.log(startDate);
    master_data_get(startDate);
  }, [startDate]);

  const master_data_get = async (startDate) => {
    setshowLoaderAdmin(true);
    await server_post_data(view_week_all_timing, null)
      .then((Response) => {
        //console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          /// console.log(Response.data.message);
          if (Response.data.message.data_timedata.length > 0) {
            setdataloop(Response.data.message.data_timedata);
            setWeekData(Response.data.message.week_days_show);
            console.log(Response.data.message.week_days_show);
            const dayEntries = Response.data.message.week_days_show;

            const dayDatas = dayEntries.map((entry) => {
              const day = entry.week_name;
              const value = entry.online_booking_status === 0 ? "1" : "0"; // Assuming online_booking_status of 0 means false and 1 means true
              const isChecked = value === "0"; // Use strict equality for comparison
              // Update state based on the day's value
              setIsWeekOnlineChecked((prevState) => ({
                ...prevState,
                [day]: isChecked,
              }));
              return { day, value };
            });

            const dayDatas2 = dayEntries.map((entry) => {
              const day = entry.week_name;
              const value = entry.start_stop_status === 0 ? "1" : "0"; // Assuming start_stop_status of 0 means false and 1 means true
              const isChecked = value === "0"; // Use strict equality for comparison
              // Update state based on the day's value
              setIsWeekCloseChecked((prevState) => ({
                ...prevState,
                [day]: isChecked,
              }));
              return { day, value };
            });

            const daysloop = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];
            const dayValuePairs = daysloop.map((day, index) => {
              return { day: day, value: index };
            });

            setdayData(dayValuePairs); // Assuming you still want to set dayData

            setdataloopdetails(Response.data.message.data_timedatadetails);
            setdataloopindex(Response.data.message.data_timedata.length);
            setSelectedInterval(Response.data.message.time_slot_minutes);

            const checkedValues = Response.data.message.data_timedata.map(
              (item) => (item.checked ? true : false)
            );
            setIsChecked(checkedValues);
          }
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const deletenewrow = () => {
    $(".timeRow" + selectedRow).remove();
    setModalShow1(false);
  };
  const handleClose1 = () => setModalShow1(false);
  const handleShow1 = (index) => {
    setModalShow1(true);
    setSelectedRow(index);
  };

  const addnewrow = (indxbtn) => {
    console.log(indxbtn);
    const htmlelement = $(".timeRow" + indxbtn).html();
    const forhtml = $(".Add_time_row" + indxbtn).attr("forhtml");
    //console.log(htmlelement);
    setdataloopindex(dataloopindex + 1);
    //$('.mainhd').append('<div className=timeRow'+dataloopindex+'>'+htmlelement+'</div>');

    const newRow = $(
      `<div class="timeRow${dataloopindex} timeRow "  id="timeRow${dataloopindex}">${htmlelement}</div>`
    );
    //$(".mainhd").append(newRow);
    $(".weekdayDiv" + forhtml).append(newRow);
    $(".timeRow" + dataloopindex)
      .find(".accordion-button")
      .attr("data-bs-target", `#panelsStayOpen-collapseOne${dataloopindex}`);
    $(".timeRow" + dataloopindex)
      .find(".accordion-button")
      .attr("aria-controls", `#panelsStayOpen-collapseOne${dataloopindex}`);
    $(".timeRow" + dataloopindex)
      .find(".accordion-collapse")
      .attr("id", `panelsStayOpen-collapseOne${dataloopindex}`);

    $(".timeRow" + dataloopindex)
      .find(".timeli")
      .addClass("timeli_hide");
    $(".timeRow" + dataloopindex)
      .find(".guest_arrival" + indxbtn)
      .removeClass("guest_arrival" + indxbtn)
      .addClass("guest_arrival" + dataloopindex);
    $(".timeRow" + dataloopindex)
      .find(".Add_time_row" + indxbtn)
      .removeClass("Add_time_row" + indxbtn)
      .addClass("Add_time_row" + dataloopindex)
      .remove();
    $(".timeRow" + dataloopindex)
      .find(".Delete_time_row" + indxbtn)
      .removeClass("Delete_time_row" + indxbtn)
      .removeClass("hidden")
      .addClass("Delete_time_row" + dataloopindex)
      .show()
      .on("click", function (e) {
        handleShow1(dataloopindex);
      });
    $(".timeRow" + dataloopindex)
      .find(".start_time" + indxbtn)
      .removeClass("start_time" + indxbtn)
      .addClass("start_time" + dataloopindex)
      .each(function () {
        $(this).on("input", function (e) {
          generateTimings(dataloopindex);
        });
      });
    $(".timeRow" + dataloopindex)
      .find(".end_time" + indxbtn)
      .removeClass("end_time" + indxbtn)
      .addClass("end_time" + dataloopindex)
      .each(function () {
        $(this).on("input", function (e) {
          generateTimings(dataloopindex);
        });
      });
    isChecked[dataloopindex] = false;
    $(".timeRow" + dataloopindex)
      .find(".hidden-checkbox" + indxbtn)
      .removeClass("hidden-checkbox" + indxbtn)
      .addClass("hidden-checkbox" + dataloopindex)
      .attr("id", "time_checkbox" + dataloopindex)
      .prop("checked", isChecked[dataloopindex])
      .each(function () {
        $(this).on("change", function (e) {
          handleCheckboxChange(e, dataloopindex);
          ///console.log(e);
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".checkbox-labelTiming")
      .attr("for", "time_checkbox" + dataloopindex);

    $(".timeRow" + dataloopindex)
      .find(".discount_input_head" + indxbtn)
      .removeClass("discount_input_head" + indxbtn)
      .addClass("discount_input_head" + dataloopindex)
      .each(function () {
        $(this).on("blur", function (e) {
          discount_totl_st_chng(e, dataloopindex, "discount", "default");
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".total_seat_input_head" + indxbtn)
      .removeClass("total_seat_input_head" + indxbtn)
      .addClass("total_seat_input_head" + dataloopindex)
      .each(function () {
        $(this).on("blur", function (e) {
          discount_totl_st_chng(e, dataloopindex, "total_seat", "default");
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".discount_input" + indxbtn)
      .removeClass("discount_input" + indxbtn)
      .addClass("discount_input" + dataloopindex)
      .each(function () {
        $(this).on("blur", function (e) {
          discount_totl_st_chng(e, dataloopindex, "discount", "inside_input");
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".total_seat_input" + indxbtn)
      .removeClass("total_seat_input" + indxbtn)
      .addClass("total_seat_input" + dataloopindex)
      .each(function () {
        $(this).on("blur", function (e) {
          discount_totl_st_chng(e, dataloopindex, "total_seat", "inside_input");
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".Online_Booking_Off")
      .each(function () {
        const buttonElement = $(this);
        const forAttr = buttonElement.attr("for");
        let key = `${dataloopindex}_${forAttr}`;
        let old_key = `${indxbtn}_${forAttr}`;
        buttonElement.attr(
          "title",
          !isSpecialOnlineOn[key] ? "Online Booking ON" : "Online Booking Off"
        );

        buttonElement
          .find(".BorderedGlobe")
          .removeClass(`BorderedGlobe_${old_key} normal_hide`)
          .addClass(`BorderedGlobe_${key}`);
        buttonElement
          .find(".CrossedGlobe")
          .removeClass(`CrossedGlobe_${old_key}`)
          .addClass(`CrossedGlobe_${key} normal_hide`);
        buttonElement
          .find(".online_input_insde")
          .removeClass(`online_input_insde${old_key}`)
          .addClass(`online_input_insde${key}`)
          .val(isSpecialOnlineOn[key]);

        buttonElement.on("click", function (e) {
          handleSpecialHrBooking(dataloopindex, forAttr, 1);
        });
      });

    $(".timeRow" + dataloopindex)
      .find(".Close_Restaurant")
      .each(function () {
        const buttonElement = $(this);
        const forAttr = buttonElement.attr("for");

        let key = `${dataloopindex}_${forAttr}`;
        let old_key = `${indxbtn}_${forAttr}`;
        buttonElement.attr(
          "title",
          !isRestroOpeninside[key] ? "Close Restaurant" : "Open Restaurant"
        );

        buttonElement
          .find(".Restro_onbtn_insde")
          .removeClass(`Restro_onbtn_insde${old_key} normal_hide`)
          .addClass(`Restro_onbtn_insde${key}`);
        buttonElement
          .find(".Restro_closebtn_insde")
          .removeClass(`Restro_closebtn_insde${old_key}`)
          .addClass(`Restro_closebtn_insde${key} normal_hide`);
        buttonElement
          .find(".Restro_input_insde")
          .removeClass(`Restro_input_insde${old_key}`)
          .addClass(`Restro_input_insde${key}`)
          .val(isRestroOpeninside[key]);

        buttonElement.on("click", function (e) {
          handleRestroOpenInside(dataloopindex, forAttr, 1);
        });
      });
  };

  const handleDeleteRow = (id) => {
    setTimeRows(timeRows.filter((row) => row.id !== id));
  };

  const generateTableTimings = () => {
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

  const TabletimingsList = generateTableTimings();

  const generateTimings = (indxbtn) => {
    console.log(indxbtn);
    let start_time = document.querySelector(".start_time" + indxbtn).value;
    let end_time = document.querySelector(".end_time" + indxbtn).value;
    const start = new Date(`2000-01-01 ${start_time}`);
    const end = new Date(`2000-01-01 ${end_time}`);

    const newTimeList = [];

    while (start < end) {
      let formattedTime = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      formattedTime = formattedTime.replace(/^24/, "00");
      newTimeList.push(formattedTime);
      start.setMinutes(start.getMinutes() + selectedInterval);
    }

    let selectElement = $(".guest_arrival" + indxbtn);
    selectElement.empty(); //clear dropdown
    $(".timeRow" + indxbtn)
      .find(".timeli")
      .addClass("timeli_hide");
    let lstarrivllp = newTimeList.length - 4;
    const lstarrivllparray = [];

    for (let i = 0; i < newTimeList.length; i++) {
      $(".timeRow" + indxbtn)
        .find("." + newTimeList[i].replace(":", "_"))
        .removeClass("timeli_hide");
      if (i >= lstarrivllp) {
        lstarrivllparray.push(newTimeList[i]);
        selectElement.append(
          $("<option>", {
            value: newTimeList[i],
            text: newTimeList[i],
            selected: true,
          })
        );
      }
    }

    $(
      '[data-bs-target="#panelsStayOpen-collapseOne' + indxbtn + '"]'
    ).removeClass("collapsed");
    $("#panelsStayOpen-collapseOne" + indxbtn).addClass("show");
  };

  const discount_totl_st_chng = (event, indxbtn, flty, place) => {
    event.target.value = event.target.value.slice(0, 10).replace(/[^0-9]/g, "");
    if (event.target.value === "") {
      if (flty == "discount") {
        event.target.value = 0;
      } else {
        event.target.value = 0;
      }
    }
    if (place == "default") {
      if ($("#time_checkbox" + indxbtn).prop("checked") == true) {
        if (flty == "discount") {
          if (event.target.value < 0 || event.target.value == "") {
            event.target.value = 0;
            $(".discount_input" + indxbtn).val(0);
          }
          $(".discount_input" + indxbtn).val(event.target.value);
        } else {
          if (event.target.value < 1 || event.target.value == "") {
            event.target.value = 1;
            $(".total_seat_input" + indxbtn).val(1);
          }
          $(".total_seat_input" + indxbtn).val(event.target.value);
        }
      } else {
        if (flty == "discount") {
          if (event.target.value < 0 || event.target.value == "") {
            event.target.value = 0;
          }
        } else {
          if (event.target.value < 1 || event.target.value == "") {
            event.target.value = 1;
          }
        }
      }
    } else {
      if (flty == "discount") {
        if (event.target.value < 0 || event.target.value == "") {
          event.target.value = 0;
        }
      } else {
        if (event.target.value < 1 || event.target.value == "") {
          event.target.value = 1;
        }
      }
    }
  };

  const handleCheckboxChange = (event, indxbtn) => {
    let flgvl = 0;
    const disval = $(".discount_input_head" + indxbtn);
    const ttlstin = $(".total_seat_input_head" + indxbtn);
    if (event.target.checked == true) {
      if (disval.val() < 0 || disval.val() == "") {
        $(".hidden-checkbox" + indxbtn).prop("checked", false);
        disval.addClass("emptyInputError");
        flgvl = 1;
      } else {
        disval.removeClass("emptyInputError");
      }
      if (ttlstin.val() < 1 || ttlstin.val() == "") {
        $(".hidden-checkbox" + indxbtn).prop("checked", false);
        ttlstin.addClass("emptyInputError");
        flgvl = 1;
      } else {
        ttlstin.removeClass("emptyInputError");
      }
      if (flgvl == 0) {
        $(".discount_input" + indxbtn).val(disval.val());
        $(".total_seat_input" + indxbtn).val(ttlstin.val());
      }
    }

    if (flgvl == 0) {
      const updatedChecked = [...isChecked];
      updatedChecked[indxbtn] = event.target.checked;
      disval.removeClass("emptyInputError");
      ttlstin.removeClass("emptyInputError");
      setIsChecked(updatedChecked);
    }
  };

  const handleCheckboxWeekChange = (event, indxbtn) => {
    console.log(indxbtn);
    setIsWeekOnlineChecked((prevState) => {
      const updatedChecked = { ...prevState };
      updatedChecked[indxbtn] = !updatedChecked[indxbtn];
      return updatedChecked;
    });
  };

  const handleCheckboxWeekCloseChange = (event, indxbtn) => {
    console.log(indxbtn);
    setIsWeekCloseChecked((prevState) => {
      const updatedChecked = { ...prevState };
      updatedChecked[indxbtn] = !updatedChecked[indxbtn];
      const elements = document.querySelectorAll(
        ".weekdayDiv" + indxbtn + " .timeRow"
      );
      elements.forEach((element) => {
        if (!updatedChecked[indxbtn]) {
          element.classList.remove("unclickable");
        } else {
          element.classList.add("unclickable");
        }
      });
      return updatedChecked;
    });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    const for_duplicate = [];
    const timeary = [];
    const week_online_data = [];
    const week_close_data = [];
    let count_array = 0;
    let vaild_data_one = 0;
    let vaild_data_three = 0;
    $(".emptyInputError").removeClass("emptyInputError");
    $(".online_input_insde_main").each(function (index) {
      week_online_data[$(this).attr("dayattr")] =
        $(this).val() === "true" ? "1" : "0";
      week_close_data[$(this).attr("dayattr")] =
        $(".Restro_input_insde" + $(this).attr("dayattr") + "_main").val() ===
        "true"
          ? "1"
          : "0";
    });
    $(".mainhd")
      .find(".timeRow")
      .each(function (index) {
        if (!$(this).hasClass("unclickable")) {
          const each_slot_timing = $(this).attr("id");
          const dayname = $(this).find(".dayname").val();
          if (!for_duplicate[dayname]) {
            for_duplicate[dayname] = [];
          }
          if (!timeary[dayname]) {
            timeary[dayname] = [];
          }

          for_duplicate[dayname][each_slot_timing] = [];
          timeary[dayname][each_slot_timing] = [];
          timeary[dayname][each_slot_timing]["timing"] = [];
          timeary[dayname][each_slot_timing]["discount"] = [];
          timeary[dayname][each_slot_timing]["total_seat"] = [];
          timeary[dayname][each_slot_timing]["online_restro"] = [];
          timeary[dayname][each_slot_timing]["onoff_restro"] = [];

          const idv = each_slot_timing.split("timeRow");
          if (Number(count_array) < Number(idv[1])) {
            count_array = idv[1];
          }
          console.log(idv[1]);
          timeary[dayname][each_slot_timing]["default_discount"] = $(
            ".discount_input_head" + idv[1]
          ).val();
          timeary[dayname][each_slot_timing]["guest_arrival"] = $(
            ".guest_arrival" + idv[1]
          ).val();
          timeary[dayname][each_slot_timing]["default_total_seat"] = $(
            ".total_seat_input_head" + idv[1]
          ).val();
          if (
            $(".online_input_insde" + idv[1] + "_top").val() === "undefined" ||
            $(".online_input_insde" + idv[1] + "_top").val() === ""
          ) {
            timeary[dayname][each_slot_timing]["default_online_restro"] =
              "false";
          } else {
            timeary[dayname][each_slot_timing]["default_online_restro"] = $(
              ".online_input_insde" + idv[1] + "_top"
            ).val();
          }

          if (
            $(".Restro_input_insde" + idv[1] + "_top").val() === "undefined" ||
            $(".Restro_input_insde" + idv[1] + "_top").val() === ""
          ) {
            timeary[dayname][each_slot_timing]["default_onoff_restro"] =
              "false";
          } else {
            timeary[dayname][each_slot_timing]["default_onoff_restro"] = $(
              ".Restro_input_insde" + idv[1] + "_top"
            ).val();
          }

          timeary[dayname][each_slot_timing]["default_apply_same_checkbox"] =
            isChecked[idv[1]]; //apply the same value checkbox
          timeary[dayname][each_slot_timing]["start_time"] = $(
            ".start_time" + idv[1]
          ).val();
          timeary[dayname][each_slot_timing]["end_time"] = $(
            ".end_time" + idv[1]
          ).val();

          if (
            $(".start_time" + idv[1]).val() == $(".end_time" + idv[1]).val() ||
            $(".start_time" + idv[1]).val() > $(".end_time" + idv[1]).val()
          ) {
            $(".start_time" + idv[1]).addClass("emptyInputError");
            $(".end_time" + idv[1]).addClass("emptyInputError");
            vaild_data_three = 1;
          }

          $(this)
            .find(".timeli")
            .each(function () {
              if (!$(this).hasClass("timeli_hide")) {
                const timeval = $(this).find(".timing_input").val();
                const tmtre = $(this);
                //const tmtre = $('.'+timeval.replace(":", "_"));
                //console.log(tmtre.attr('key'))
                const discount_input_lp = tmtre
                  .find(".discount_input" + idv[1])
                  .val();
                const total_seat_input_lp = tmtre
                  .find(".total_seat_input" + idv[1])
                  .val();
                if (discount_input_lp < 0 || discount_input_lp == "") {
                  tmtre
                    .find(".discount_input" + idv[1])
                    .addClass("emptyInputError");
                  vaild_data_one = 1;
                }
                if (total_seat_input_lp < 1 || total_seat_input_lp == "") {
                  tmtre
                    .find(".total_seat_input" + idv[1])
                    .addClass("emptyInputError");
                  vaild_data_one = 1;
                }

                timeary[dayname][each_slot_timing]["timing"].push(timeval);
                timeary[dayname][each_slot_timing]["discount"].push(
                  discount_input_lp
                );
                timeary[dayname][each_slot_timing]["total_seat"].push(
                  total_seat_input_lp
                );

                if (
                  tmtre.find(".online_input_insde").val() === "undefined" ||
                  tmtre.find(".online_input_insde").val() === ""
                ) {
                  timeary[dayname][each_slot_timing]["online_restro"].push(
                    "false"
                  );
                } else {
                  timeary[dayname][each_slot_timing]["online_restro"].push(
                    tmtre.find(".online_input_insde").val()
                  );
                }

                if (
                  tmtre.find(".Restro_input_insde").val() === "undefined" ||
                  tmtre.find(".Restro_input_insde").val() === ""
                ) {
                  timeary[dayname][each_slot_timing]["onoff_restro"].push(
                    "false"
                  );
                } else {
                  timeary[dayname][each_slot_timing]["onoff_restro"].push(
                    tmtre.find(".Restro_input_insde").val()
                  );
                }

                for_duplicate[dayname][each_slot_timing].push(timeval);
              }
            });
        }
      });

    const hasDuplicates = (array) => {
      const set = new Set(array);
      return set.size !== array.length;
    };
    let duplicate_have = "";
    let vaild_data_two = 0;
    for (const day in for_duplicate) {
      const allTimeSlots = Object.values(for_duplicate[day]).flat();

      if (hasDuplicates(allTimeSlots)) {
        //console.log(`Duplicates found for ${day}: ${allTimeSlots}`);
        duplicate_have = duplicate_have + "," + day;
        vaild_data_two = 1;
      }
    }

    let error_empty = "";
    if (vaild_data_two == 1) {
      handleError(
        "Duplicate Time Slot Find For " + duplicate_have.substring(1)
      );
    } else if (vaild_data_one == 1) {
      handleError("Please Fill the mandatory field");
    } else if (vaild_data_three == 1) {
      handleError("Please Check Start Time and End Time");
    } else {
      setshowLoaderAdmin(true);
      let fd_from = new FormData();

      [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].forEach((day) => {
        let data_make = -1;
        for (let q = 0; q <= count_array; q++) {
          try {
            let data_get = timeary[day]["timeRow" + q];
            if (data_get) {
              data_make++;
              let j = data_make;
              let ssss = data_get["default_total_seat"];
              fd_from.append(day + "default_total_seat" + j, ssss);
              fd_from.append(
                day + "default_discount" + j,
                data_get["default_discount"]
              );
              fd_from.append(day + "start_time" + j, data_get["start_time"]);
              fd_from.append(day + "end_time" + j, data_get["end_time"]);
              fd_from.append(
                day + "guest_arrival" + j,
                data_get["guest_arrival"]
              );

              let online_booking_status =
                data_get["default_online_restro"] === "true" ? "1" : "0";

              fd_from.append(
                day + "online_booking_status" + j,
                online_booking_status
              );

              let start_stop_status =
                data_get["default_onoff_restro"] === "true" ? "1" : "0";

              fd_from.append(day + "start_stop_status" + j, start_stop_status);
              let timing_loop = timeary[day]["timeRow" + q]["timing"];
              let discount_loop = timeary[day]["timeRow" + q]["discount"];
              let online_loop = timeary[day]["timeRow" + q]["online_restro"];
              let onoff_loop = timeary[day]["timeRow" + q]["onoff_restro"];
              let total_seat_loop = timeary[day]["timeRow" + q]["total_seat"];
              fd_from.append(day + "time_loop_count" + j, timing_loop.length);
              if (timing_loop.length == 0) {
                error_empty = day;
              }
              for (let k = 0; k < timing_loop.length; k++) {
                fd_from.append(
                  day + "start_time_loop" + j + "" + k,
                  timing_loop[k]
                );
                fd_from.append(
                  day + "discount_loop" + j + "" + k,
                  discount_loop[k]
                );
                let online_booking_status =
                  online_loop[k] === "true" ? "1" : "0";
                fd_from.append(
                  day + "online_loop" + j + "" + k,
                  online_booking_status
                );
                let onoff_loop_status = onoff_loop[k] === "true" ? "1" : "0";
                fd_from.append(
                  day + "onoff_loop" + j + "" + k,
                  onoff_loop_status
                );
                fd_from.append(
                  day + "total_seat_loop" + j + "" + k,
                  total_seat_loop[k]
                );
              }
            }
          } catch (err) {
            //error handling
          }
        }
        fd_from.append(day + "total_timing_add", data_make);
      });

      for (const [key, value] of Object.entries(week_online_data)) {
        fd_from.append("week_online_data_" + key, value);
      }

      for (const [key, value] of Object.entries(week_close_data)) {
        fd_from.append("week_close_data_" + key, value);
      }

      for (const pair of fd_from.entries()) {
        //  console.log(pair[0] + ": " + pair[1]);
      }
      if (error_empty !== "") {
        handleError("please fill mandatory field (" + error_empty + ")");
        setshowLoaderAdmin(false);
      } else {
        await server_post_data(url_for_save, fd_from)
          .then((Response) => {
            setshowLoaderAdmin(false);
            if (Response.data.error) {
              handleError(Response.data.message);
            } else {
              if (location.pathname.includes("/System_Settings")) {
                handleSuccess(Response.data.message);
              } else {
                handleSuccessSession(
                  Response.data.message,
                  "/Reservation_Calendar"
                );
              }
            }
          })
          .catch((error) => {
            handleError("network");
            setshowLoaderAdmin(false);
          });
      }
    }
  };

  const handleOnlineBooking = () => {
    setIsOnlineOn(!isOnlineOn);
  };

  const handleSpecialHrBooking = (index, indexi, from_where = 0) => {
    setIsSpecialOnlineOn((prevState) => {
      const updatedState = { ...prevState };
      const keyim = `${index}_${indexi}`;
      if (from_where == 0) {
        //if added new field with plus icon
        if (!updatedState.hasOwnProperty(keyim)) {
          console.log($(".online_input_insde" + keyim).val());
          if ($(".online_input_insde" + keyim).val() === "true") {
            console.log("not come in true");
            updatedState[keyim] = false;
          } else {
            updatedState[keyim] = true;
          }
          $(".online_input_insde" + keyim).remove();
          $(".Online_Booking_Off_inside" + keyim).append(
            `<input type="hidden" class="online_input_insde online_input_insde${keyim}" value="${isSpecialOnlineOn[keyim]}">`
          );
        } else {
          updatedState[keyim] = !updatedState[keyim];
        }
      } else {
        updatedState[keyim] = !updatedState[keyim];
      }
      if (updatedState[keyim] == true) {
        $(".BorderedGlobe_" + keyim).addClass("normal_hide");
        $(".CrossedGlobe_" + keyim).removeClass("normal_hide");
        $(".online_input_insde" + keyim).val(true);
      } else {
        console.log(keyim);
        $(".BorderedGlobe_" + keyim).removeClass("normal_hide");
        $(".CrossedGlobe_" + keyim).addClass("normal_hide");
        $(".online_input_insde" + keyim).val(false);
      }
      return updatedState;
    });
  };

  const handleRestroOpenInside = (index, indexi, from_where = 0) => {
    setIsRestroOpeninside((prevState) => {
      const updatedState = { ...prevState };
      const keyim = `${index}_${indexi}`;
      if (from_where == 0) {
        //if added new field with plus icon
        if (!updatedState.hasOwnProperty(keyim)) {
          console.log($(".Restro_input_insde" + keyim).val());
          if ($(".Restro_input_insde" + keyim).val() === "true") {
            console.log("not come in true");
            updatedState[keyim] = false;
          } else {
            updatedState[keyim] = true;
          }
          $(".Restro_input_insde" + keyim).remove();
          $(".Close_Restaurant_inside" + keyim).append(
            `<input type="hidden" class="Restro_input_insde Restro_input_insde${keyim}" value="${isRestroOpeninside[keyim]}">`
          );
        } else {
          updatedState[keyim] = !updatedState[keyim];
        }
      } else {
        updatedState[keyim] = !updatedState[keyim];
      }
      if (updatedState[keyim] == true) {
        $(".Restro_onbtn_insde" + keyim).addClass("normal_hide");
        $(".Restro_closebtn_insde" + keyim).removeClass("normal_hide");
        $(".Restro_input_insde" + keyim).val(true);
      } else {
        console.log(keyim);
        $(".Restro_onbtn_insde" + keyim).removeClass("normal_hide");
        $(".Restro_closebtn_insde" + keyim).addClass("normal_hide");
        $(".Restro_input_insde" + keyim).val(false);
      }
      return updatedState;
    });
  };

  const handleRestroOpen = () => {
    setIsRestroOpen(!isRestroOpen);
  };

  const incrementDate = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 1);
    setStartDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 1);
    setStartDate(newDate);
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Handle the case when date is undefined
    }
    const options = { weekday: "long", day: "numeric", month: "long" };
    const formattedDate = date.toLocaleString(undefined, options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  const checkboxValues = [false, false, false];

  const [specailHours, setSpecialHours] = useState(false);
  const [operationalHours, setOperationalHours] = useState(true);

  const toggleSpecailHours = (TabId) => {
    setOperationalHours(TabId === "1");
    setSpecialHours(TabId === "2");
  };

  return (
    <div>
      {showLoaderAdmin && (
        <Loader />
      )}
      <div
        className={`${
          location.pathname.includes("/System_Settings") ? "HiddenDiv" : " "
        }`}
      >
        <h5>Special Operational Hour</h5>
        <div className="modalDatePicker">
          <img
            src={PrevArrow}
            onClick={decrementDate}
            alt="Barley's Dashboard"
          />
          <div className="person__calenderFrame_image image_icon_date">
            <input
              id="startDate"
              type="date"
              className="form-control  input_field_custom1 input_field_date"
              defaultValue={formatDate(startDate)}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <img
            src={NextArrow}
            onClick={incrementDate}
            alt="Barley's Dashboard"
          />
        </div>
      </div>
      <div className="timeEditTable">
        <div className="timeEditTable-container">
          <div className="mt-4">
            <div className="mainhd">
              {dayData.map((dayvl, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`weekdayDiv weekdayDiv${dayvl.day}`}
                >
                  <div className="weekdayOpenCLose">
                    <h6 className="weekdayHead"> {dayvl.day} </h6>
                    <div className="col-md-2">
                      <div
                        className="onlineImg selectGuestArrival"
                        style={{
                          paddingLeft: "16px",
                        }}
                      >
                        <button
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          htmlFor={dayIndex}
                          title={` Online Booking Off`}
                          className={`Online_Booking_Off  `}
                          onClick={(e) => {
                            handleCheckboxWeekChange(e, dayvl.day);
                          }}
                        >
                          <img
                            src={BorderedGlobe}
                            alt="Barley's Dashboard"
                            className={`BorderedGlobe_${
                              dayvl.day
                            }_main BorderedGlobe ${
                              isWeekOnlineChecked[dayvl.day]
                                ? "normal_hide"
                                : ""
                            }`}
                          />
                          <img
                            src={CrossedGlobe}
                            alt="Barley's Dashboard"
                            className={`CrossedGlobe_${
                              dayvl.day
                            }_main CrossedGlobe ${
                              !isWeekOnlineChecked[dayvl.day]
                                ? "normal_hide"
                                : ""
                            }`}
                          />
                          <input
                            type="hidden"
                            dayattr={`${dayvl.day}`}
                            defaultValue={`${isWeekOnlineChecked[dayvl.day]}`}
                            className={`online_input_insde${dayvl.day}_main online_input_insde online_input_insde_main`}
                          />
                        </button>

                        <button
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          htmlFor={dayIndex}
                          title={` Open Restaurant `}
                          className={`Close_Restaurant `}
                          onClick={(e) => {
                            handleCheckboxWeekCloseChange(e, dayvl.day);
                          }}
                        >
                          <img
                            src={BorderedOn}
                            alt="Barley's Dashboard"
                            className={`Restro_onbtn_insde${
                              dayvl.day
                            }_main Restro_onbtn_insde ${
                              isWeekCloseChecked[dayvl.day] ? "normal_hide" : ""
                            }`}
                          />

                          <img
                            src={CrossedOn}
                            alt="Barley's Dashboard"
                            className={`Restro_closebtn_insde${
                              dayvl.day
                            }_main Restro_closebtn_insde ${
                              !isWeekCloseChecked[dayvl.day]
                                ? "normal_hide"
                                : ""
                            }`}
                          />

                          <input
                            type="hidden"
                            dayattr={`${dayvl.day}`}
                            defaultValue={`${isWeekCloseChecked[dayvl.day]}`}
                            className={`Restro_input_insde Restro_input_insde${dayvl.day}_main Restro_input_insde_main`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    let index_for_first = -1;
                    let index_first = -1;
                    return dataloop.map((itemlist, index) => {
                      if (itemlist.week_name === dayvl.day) {
                        index_for_first = index;
                        let end_time = itemlist.end_time.substring(
                          0,
                          itemlist.end_time.length - 3
                        );
                        let start_time = itemlist.start_time.substring(
                          0,
                          itemlist.start_time.length - 3
                        );
                        let last_arrival_time =
                          itemlist.last_arrival_time.substring(
                            0,
                            itemlist.last_arrival_time.length - 3
                          );
                        let online_booking_status_top =
                          itemlist.online_booking_status === 1 ? true : false;
                        let start_stop_status_top =
                          itemlist.start_stop_status === 1 ? true : false;

                        index_first++;
                        return (
                          <div
                            className={`timeRow timeRow${index} ${
                              isWeekCloseChecked[dayvl.day] ? "unclickable" : ""
                            }`}
                            id={`timeRow${index}`}
                          >
                            <input
                              type="hidden"
                              className={`dayname dayname${index}`}
                              value={`${dayvl.day}`}
                            />
                            <div className="row m-0">
                              <div className="col-md-11 paddingRight0">
                                <div className="timingsRowBodyContainer">
                                  <div
                                    className="accordion"
                                    id="accordionPanelsStayOpenExample"
                                  >
                                    <div className="accordion-item">
                                      <div className="timingsRowBody accordion-header">
                                        <div className="row m-0">
                                          <div className="col-md-4">
                                            <div className="timings_inputs">
                                              <div className="textDeco">
                                                <button
                                                  className="accordion-button collapsed"
                                                  type="button"
                                                  data-bs-toggle="collapse"
                                                  data-bs-target={`#panelsStayOpen-collapseOne${index}`}
                                                  aria-expanded="false"
                                                  aria-controls={`#panelsStayOpen-collapseOne${index}`}
                                                ></button>
                                                <div className="txt">
                                                  <label>Open at</label>
                                                  <select
                                                    type="time"
                                                    name="name"
                                                    className={`start_time${index}`}
                                                    onChange={(e) => {
                                                      generateTimings(index);
                                                    }}
                                                    defaultValue={start_time}
                                                  >
                                                    {TabletimingsList.length >
                                                      0 &&
                                                      TabletimingsList.map(
                                                        (timenx, indexio) => (
                                                          <option
                                                            value={timenx}
                                                            key={indexio}
                                                          >
                                                            {timenx}
                                                          </option>
                                                        )
                                                      )}
                                                  </select>
                                                </div>
                                                <div className="txtt2">
                                                  <label>Closed at</label>
                                                  <select
                                                    type="time"
                                                    name="name"
                                                    className={`end_time${index}`}
                                                    defaultValue={end_time}
                                                    onChange={(e) => {
                                                      generateTimings(index);
                                                    }}
                                                  >
                                                    {TabletimingsList.length >
                                                      0 &&
                                                      TabletimingsList.map(
                                                        (timenx, indexio) => (
                                                          <option
                                                            value={timenx}
                                                            key={indexio}
                                                          >
                                                            {timenx}
                                                          </option>
                                                        )
                                                      )}
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                            <div>
                                              <div className="no_prsnl_id p-0">
                                                <div className="rememberMe">
                                                  <input
                                                    type="checkbox"
                                                    id={`time_checkbox${index}`}
                                                    className={`hidden-checkbox hidden-checkbox${index}`}
                                                    checked={isChecked[index]}
                                                    onChange={(e) => {
                                                      handleCheckboxChange(
                                                        e,
                                                        index
                                                      );
                                                    }}
                                                  />
                                                  <label
                                                    htmlFor={`time_checkbox${index}`}
                                                    className="checkbox-labelTiming labelCheckbox"
                                                  >
                                                    Apply the same value for All
                                                    Timeslots
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-2">
                                            <div className="discountinput">
                                              <input
                                                type="text"
                                                minLength={1}
                                                maxLength={2}
                                                className={`discount_input_head${index} discount_input_head`}
                                                defaultValue={
                                                  itemlist.per_discount_main
                                                }
                                                onBlur={(e) => {
                                                  discount_totl_st_chng(
                                                    e,
                                                    index,
                                                    "discount",
                                                    "default"
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-2">
                                            <div className="discountinput">
                                              <input
                                                type="text"
                                                minLength={1}
                                                maxLength={3}
                                                className={`total_seat_input_head${index} total_seat_input_head`}
                                                defaultValue={
                                                  itemlist.per_day_maximum
                                                }
                                                onBlur={(e) => {
                                                  discount_totl_st_chng(
                                                    e,
                                                    index,
                                                    "total_seat",
                                                    "default"
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-2">
                                            <div className="onlineImg selectGuestArrival">
                                              <select
                                                className={`guest_arrival${index}`}
                                                defaultValue={last_arrival_time}
                                              >
                                                <option
                                                  value={`${last_arrival_time}`}
                                                >
                                                  {last_arrival_time}
                                                </option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-md-2">
                                            <div className="onlineImg selectGuestArrival">
                                              <button
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="left"
                                                htmlFor="top"
                                                title={`${
                                                  !isSpecialOnlineOn[
                                                    index + "_top"
                                                  ]
                                                    ? "Online Booking On "
                                                    : "Online Booking Off"
                                                }`}
                                                className={`Online_Booking_Off Online_Booking_Off_inside${index}_top `}
                                                onClick={() =>
                                                  handleSpecialHrBooking(
                                                    index,
                                                    "top"
                                                  )
                                                }
                                              >
                                                <img
                                                  src={BorderedGlobe}
                                                  alt="Barley's Dashboard"
                                                  className={`BorderedGlobe_${index}_top BorderedGlobe ${
                                                    online_booking_status_top
                                                      ? "normal_hide"
                                                      : ""
                                                  }`}
                                                />
                                                <img
                                                  src={CrossedGlobe}
                                                  alt="Barley's Dashboard"
                                                  className={`CrossedGlobe_${index}_top CrossedGlobe ${
                                                    !online_booking_status_top
                                                      ? "normal_hide"
                                                      : ""
                                                  }`}
                                                />
                                                <input
                                                  type="hidden"
                                                  defaultValue={`${online_booking_status_top}`}
                                                  className={`online_input_insde${index}_top online_input_insde`}
                                                />
                                              </button>

                                              <button
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="left"
                                                htmlFor="top"
                                                title={`${
                                                  !isRestroOpeninside[
                                                    index + "_top"
                                                  ]
                                                    ? "Close Restaurant"
                                                    : "Open Restaurant"
                                                }`}
                                                className={`Close_Restaurant Close_Restaurant_inside${index}_top`}
                                                onClick={() =>
                                                  handleRestroOpenInside(
                                                    index,
                                                    "top"
                                                  )
                                                }
                                              >
                                                <img
                                                  src={BorderedOn}
                                                  alt="Barley's Dashboard"
                                                  className={`Restro_onbtn_insde${index}_top Restro_onbtn_insde ${
                                                    start_stop_status_top
                                                      ? "normal_hide"
                                                      : ""
                                                  }`}
                                                />

                                                <img
                                                  src={CrossedOn}
                                                  alt="Barley's Dashboard"
                                                  className={`Restro_closebtn_insde${index}_top Restro_closebtn_insde ${
                                                    !start_stop_status_top
                                                      ? "normal_hide"
                                                      : ""
                                                  }`}
                                                />

                                                <input
                                                  type="hidden"
                                                  value={`${start_stop_status_top}`}
                                                  className={`Restro_input_insde Restro_input_insde${index}_top`}
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        id={`panelsStayOpen-collapseOne${index}`}
                                        className="accordion-collapse collapse"
                                      >
                                        <div className="accordion-body timeDropdownBody">
                                          {TabletimingsList.length > 0 && (
                                            <ul>
                                              {TabletimingsList.map(
                                                (time, indexi) => {
                                                  const backendData =
                                                    dataloopdetails[
                                                      itemlist.primary_id
                                                    ];
                                                  //console.log('Backend Data:', backendData);
                                                  const backendTime =
                                                    backendData
                                                      ? backendData.find(
                                                          (backend_time) =>
                                                            backend_time.start_time.substring(
                                                              0,
                                                              5
                                                            ) === time
                                                        )
                                                      : undefined;
                                                  ///console.log("Matching Backend Time:",itemlist);
                                                  //console.log(backendTime);
                                                  const dis_vl = backendTime
                                                    ? backendTime.per_discount
                                                    : "";
                                                  const seat_vl = backendTime
                                                    ? backendTime.per_day_maximum_particular
                                                    : "";
                                                  const hdsh = backendTime
                                                    ? backendTime.per_day_maximum_particular
                                                    : "timeli_hide";

                                                  let online_booking_status_inside =
                                                    backendTime
                                                      ? backendTime.online_booking_time_status ===
                                                        1
                                                        ? true
                                                        : false
                                                      : false;

                                                  let start_stop_status_inside =
                                                    backendTime
                                                      ? backendTime.start_stop_time_status ===
                                                        1
                                                        ? true
                                                        : false
                                                      : false;

                                                  /*  isSpecialOnlineOn[index + "_" + indexi] = backendTime
                                                      ? backendTime.online_booking_time_status === 1
                                                        ? true
                                                        : false
                                                      : false;


                                                      isRestroOpeninside[index + "_" + indexi] = backendTime
                                                      ? backendTime.start_stop_time_status === 1
                                                        ? true
                                                        : false
                                                      : false; */

                                                  return (
                                                    <li
                                                      key={indexi}
                                                      className={`timeli ${time.replace(
                                                        ":",
                                                        "_"
                                                      )} ${hdsh}`}
                                                    >
                                                      <div className="timeSlotsDiv">
                                                        <div className="row m-0">
                                                          <div className="col-md-4">
                                                            <div className="timeSlot">
                                                              <img
                                                                src={Watch}
                                                                alt="Barley's Dashboard"
                                                              />
                                                              <p>
                                                                {time}
                                                                <input
                                                                  type="hidden"
                                                                  value={time}
                                                                  className="timing_input"
                                                                />
                                                              </p>
                                                            </div>
                                                          </div>
                                                          <div
                                                            className="col-md-2"
                                                            style={{
                                                              paddingLeft:
                                                                "2px",
                                                            }}
                                                          >
                                                            <div className="discountinput">
                                                              <input
                                                                type="text"
                                                                minLength={1}
                                                                maxLength={2}
                                                                className={`discount_input${index} discount_input`}
                                                                onBlur={(e) => {
                                                                  discount_totl_st_chng(
                                                                    e,
                                                                    index,
                                                                    "discount",
                                                                    "inside_input"
                                                                  );
                                                                }}
                                                                defaultValue={
                                                                  dis_vl
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2">
                                                            <div className="discountinput">
                                                              <input
                                                                type="text"
                                                                minLength={1}
                                                                maxLength={3}
                                                                className={`total_seat_input${index} total_seat_input`}
                                                                onBlur={(e) => {
                                                                  discount_totl_st_chng(
                                                                    e,
                                                                    index,
                                                                    "total_seat",
                                                                    "inside_input"
                                                                  );
                                                                }}
                                                                defaultValue={
                                                                  seat_vl
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2">
                                                            <div
                                                              className="onlineImg selectGuestArrival"
                                                              style={{
                                                                paddingLeft:
                                                                  "12px",
                                                              }}
                                                            >
                                                              <select className="opacity0">
                                                                <option>
                                                                  Last
                                                                  Resrvation
                                                                  Time
                                                                </option>
                                                              </select>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2">
                                                            <div
                                                              className="onlineImg selectGuestArrival"
                                                              style={{
                                                                paddingLeft:
                                                                  "16px",
                                                              }}
                                                            >
                                                              <button
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="left"
                                                                htmlFor={indexi}
                                                                title={`${
                                                                  !isSpecialOnlineOn[
                                                                    index +
                                                                      "_" +
                                                                      indexi
                                                                  ]
                                                                    ? "Online Booking On "
                                                                    : "Online Booking Off"
                                                                }`}
                                                                className={`Online_Booking_Off Online_Booking_Off_inside${index}_${indexi} `}
                                                                onClick={() =>
                                                                  handleSpecialHrBooking(
                                                                    index,
                                                                    indexi
                                                                  )
                                                                }
                                                              >
                                                                <img
                                                                  src={
                                                                    BorderedGlobe
                                                                  }
                                                                  alt="Barley's Dashboard"
                                                                  className={`BorderedGlobe_${index}_${indexi} BorderedGlobe ${
                                                                    online_booking_status_inside
                                                                      ? "normal_hide"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <img
                                                                  src={
                                                                    CrossedGlobe
                                                                  }
                                                                  alt="Barley's Dashboard"
                                                                  className={`CrossedGlobe_${index}_${indexi} CrossedGlobe ${
                                                                    !online_booking_status_inside
                                                                      ? "normal_hide"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <input
                                                                  type="hidden"
                                                                  defaultValue={`${online_booking_status_inside}`}
                                                                  className={`online_input_insde online_input_insde${index}_${indexi} `}
                                                                />
                                                              </button>

                                                              <button
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="left"
                                                                htmlFor={indexi}
                                                                title={`${
                                                                  !isRestroOpeninside[
                                                                    index +
                                                                      "_" +
                                                                      indexi
                                                                  ]
                                                                    ? "Close Restaurant"
                                                                    : "Open Restaurant"
                                                                }`}
                                                                className={`Close_Restaurant Close_Restaurant_inside${index}_${indexi}`}
                                                                onClick={() =>
                                                                  handleRestroOpenInside(
                                                                    index,
                                                                    indexi
                                                                  )
                                                                }
                                                              >
                                                                <img
                                                                  src={
                                                                    BorderedOn
                                                                  }
                                                                  alt="Barley's Dashboard"
                                                                  className={`Restro_onbtn_insde${index}_${indexi} Restro_onbtn_insde ${
                                                                    start_stop_status_inside
                                                                      ? "normal_hide"
                                                                      : ""
                                                                  }`}
                                                                />

                                                                <img
                                                                  src={
                                                                    CrossedOn
                                                                  }
                                                                  alt="Barley's Dashboard"
                                                                  className={`Restro_closebtn_insde${index}_${indexi} Restro_closebtn_insde ${
                                                                    !start_stop_status_inside
                                                                      ? "normal_hide"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <input
                                                                  type="hidden"
                                                                  value={`${start_stop_status_inside}`}
                                                                  className={`Restro_input_insde Restro_input_insde${index}_${indexi}`}
                                                                />
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="addTimingRowContainer">
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    forhtml={dayvl.day}
                                    title="Add Time Row"
                                    className={`AddTimeRow Add_time_row Add_time_row${index} ${
                                      index_first !== 0 ? "hidden" : "visible"
                                    }`}
                                    onClick={(e) => {
                                      addnewrow(index);
                                    }}
                                  >
                                    <img
                                      src={AddIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Delete Time Row"
                                    className={`AddTimeRow deletetimeRow Delete_time_row Delete_time_row${index} ${
                                      index_first === 0 ? "hidden" : "visible"
                                    }`}
                                    onClick={(e) => {
                                      handleShow1(index);
                                    }}
                                  >
                                    <img
                                      src={DeleteIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    });
                  })()}
                </div>
              ))}
            </div>
            {location.pathname.includes("/System_Settings") ? (
              <div className="specialModalFooter specialModalFooter2 col-md-11">
                <Button
                  className="cancelSpecialTimeBtn Cancel_Special_Time"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className="saveSpecialTimeBtn Save_Special_Time"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "formsavetimining",
                      save_update_week_timing
                    )
                  }
                >
                  Save
                </Button>
              </div>
            ) : (
              <Modal.Footer className="specialModalFooter col-md-11">
                <Button
                  className="cancelSpecialTimeBtn Cancel_Special_Time"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className="saveSpecialTimeBtn Save_Special_Time"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "formsavetimining",
                      save_update_week_timing
                    )
                  }
                >
                  Save
                </Button>
              </Modal.Footer>
            )}
          </div>
        </div>
        <Modal
          show={modalShow1}
          className="confirmModal confirmModal2"
          centered
          onHide={handleClose1}
        >
          <Modal.Header
            className="confirmModalHeader"
            closeButton
          ></Modal.Header>
          <Modal.Body className="confirmBody">
            {/* <img src={DeactiIcon} alt="Barley's Dashboard" /> */}
            <p className="modalText">
              Are you Sure You want to Delete This Row?
            </p>
          </Modal.Body>
          <Modal.Footer className="confirmModalFooter">
            <Button className={`closeConfirmBtn`} onClick={handleClose1}>
              Cancel
            </Button>
            <Button
              className={`confirmDeBtn Confirm_Deactive`}
              onClick={deletenewrow}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default OperationalTimingsPage;
