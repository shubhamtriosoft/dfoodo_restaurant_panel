import React, { useEffect, useState, useRef } from "react";
import "./Css/Reservations.css";
import Header from "./Header";
import Loader from "./Loader.js";
import { fabric } from "fabric";
import back_reservation from "../assets/back_reservation.png";
import {
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  white_main,
  blocked_main,
  runining_table,
  walking_table,
  ready_for_allot,
  selected_table,
} from "../CommonJquery/TableAssignment.js";
import Calendar from "../assets/calendarGrey2.svg";
import Person from "../assets/personform.svg";
import Clids from "../assets/escalator_warning1.svg";
import Pet from "../assets/greypets.svg";
import Watch from "../assets/hours24.svg";
import Alarm from "../assets/alram23.svg";
import AddBtn from "../assets/addNewInput.svg";
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInput } from "react-international-phone";
import { Dropdown } from "primereact/dropdown";
import "react-international-phone/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  handleEmailChange,
  handleNumbersChange,
  handleAphabetsChange,
  handleError,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  computeTodayDate,
  formatTimeintotwodigit,
  handleIaphabetnumberChange,
  computeTodayDateCustom,
  inputdateformateChange,
  generateWeekdays,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  create_table_reservation_staff,
  get_all_timing_date_wise,
  get_all_table_position2,
} from "../ServiceConnection/serviceconnection.js";
import { useParams, useLocation } from "react-router-dom";
import $ from "jquery";
import { Modal, Button } from "react-bootstrap";
let canvas;
let PersonWantToSeat = 1;
let PersonWantToSeat_seated = PersonWantToSeat;
let SelectedTablePersonCount = 0;
let week_length = 7;
let pet_length = 5;
let child_length = 5;
let guest_length = 7;
let first_time_set = 0;
let table_ids = "";
function CreateReservation() {
  let { reservation_id } = useParams();
  const location = useLocation();
  reservation_id = reservation_id || 0; // If id is undefined, set its value to 0
  const today = new Date();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [digits, setDigits] = useState([]);
  const [phone, setPhone] = useState("");
  const [isValid, setisValid] = useState(true);
  const [addCustomDate, setAddCustomDate] = useState(false);
  const [addCustomPersons, setAddCustomPersons] = useState(false);
  const [addCustomChild, setAddCustomChild] = useState(false);
  const [addCustomPet, setAddCustomPet] = useState(false);
  const [MealDetails, setMealDetails] = useState([]);
  const [SelectMealTimeDetails, setSelectMealTimeDetails] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selecteddate, setselecteddate] = useState();
  const [selectedperson, setselectedperson] = useState(PersonWantToSeat);
  const [selectedchild, setselectedchild] = useState(0);
  const [selectedpet, setselectedpet] = useState(0);
  const [SelectedMealDetails, setSelectedMealDetails] = useState([]);
  const [SelectedTimeDetails, setSelectedTimeDetails] = useState([]);
  const [CanvasManupult, setCanvasManupult] = useState([]);
  const [SelectedTableForBooking, setSelectedTableForBooking] = useState([]);
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [ReservationDetails, setReservationDetails] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);

  const [FloorList, setFloorList] = useState([]);
  const [SelectedFloorListID, setSelectedFloorListID] = useState([]);

  const [TotalCombinationTable, setTotalCombinationTable] = useState([]);
  const [TotalCombinationFiterTable, setTotalCombinationFiterTable] = useState(
    []
  );

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef(null);
  const lastZoom = useRef(1);

  let class_hidden = "";
  if (location.pathname.includes("/Create_WalkIn")) {
    class_hidden = "hidden";
  }

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    master_data_get(computeTodayDate());
  }, []);

  useEffect(() => {}, [SelectedMealDetails]);
  const handleClose = () => setModalShow(false);
  const master_data_get = async (special_date) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("special_date", special_date);
    fd.append("reservation_id", reservation_id);
    fd.append("click_time", first_time_set);

    await server_post_data(get_all_timing_date_wise, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_timedata.length > 0) {
            const elements = document.getElementsByClassName("datenotfound");
            for (let i = 0; i < elements.length; i++) {
              elements[i].style.display = "";
            }

            const elements2 =
              document.getElementsByClassName("datenotfoundshow");
            for (let i = 0; i < elements2.length; i++) {
              elements2[i].style.display = "none";
            }

            let dining_area_id = 0;
            let filteredDataByMealId = {};
            let book_time;
            let no_of_guest = PersonWantToSeat;
            let no_of_child = 0;
            let no_of_pets = 0;

            if (Response.data.message.data_floor_data.length > 0) {
              dining_area_id =
                Response.data.message.data_floor_data[0].primary_id;
            }
            setFloorList(Response.data.message.data_floor_data);
            let show_book_edit = "";
            if (Response.data.message.reservation_details.length > 0) {
              show_book_edit =
                Response.data.message.reservation_details[0].book_date;
            }

            Response.data.message.meal_data.forEach((meal) => {
              //code by mk
              if (meal.check_box_value === 1) {
                //only active is come
                const filterfilteredData =
                  Response.data.message.data_timedatadetails.filter((row) => {
                    // Retrieve start and end time for the current meal
                    const SelectedMealDetails_starttime_value =
                      meal.starttime_value;
                    const SelectedMealDetails_endtime_value =
                      meal.endtime_value;
                    const option_start_time = row.start_time;

                    // Parse time strings into Date objects
                    const startTime = new Date(
                      `1970-01-01T${SelectedMealDetails_starttime_value}`
                    );
                    const endTime = new Date(
                      `1970-01-01T${SelectedMealDetails_endtime_value}`
                    );
                    const optionTime = new Date(
                      `1970-01-01T${option_start_time}`
                    );

                    // Compare time values
                    return optionTime >= startTime && optionTime <= endTime;
                  });

                if (filterfilteredData.length != 0) {
                  //if any array is empty so remove it
                  filteredDataByMealId[meal.id] = {
                    meal_type: meal,
                    timeslot: filterfilteredData,
                  };
                }
              }
            });
            const mealDetailsArray = Object.keys(filteredDataByMealId).map(
              (mealId) => ({
                id: mealId,
                data: filteredDataByMealId[mealId],
              })
            );

            if (
              (Response.data.message.reservation_details.length > 0 &&
                first_time_set === 0) ||
              special_date === show_book_edit
            ) {
              ///edit
              first_time_set++;
              setReservationDetails(
                Response.data.message.reservation_details[0]
              );
              if (
                Response.data.message.reservation_details[0].dining_area_id > 0
              ) {
                dining_area_id =
                  Response.data.message.reservation_details[0].dining_area_id;
              }

              book_time =
                Response.data.message.reservation_details[0].book_time;
              special_date =
                Response.data.message.reservation_details[0].book_date;
              no_of_pets =
                Response.data.message.reservation_details[0].no_of_pets;
              no_of_child =
                Response.data.message.reservation_details[0].no_of_child;
              no_of_guest =
                Response.data.message.reservation_details[0].no_of_guest;
              table_ids =
                Response.data.message.reservation_details[0].table_code_ids;
              setPhone(
                Response.data.message.reservation_details[0].guest_mobile_no
              );

              mealDetailsArray.forEach((meal) => {
                let get_meal_selected = meal.data.timeslot.filter((data) => {
                  return (
                    data.start_time ===
                    Response.data.message.reservation_details[0].book_time
                  );
                });
                if (get_meal_selected.length > 0) {
                  setSelectedMealDetails(meal.data.meal_type);
                  setSelectedTimeDetails(get_meal_selected[0]);
                  setSelectMealTimeDetails(meal.data.timeslot);
                }
              });
            } else {
              if (location.pathname.includes("/Create_WalkIn")) {
                if (mealDetailsArray.length > 0) {
                  setSelectedMealDetails(mealDetailsArray[0].data.meal_type);
                }
                if (Response.data.message.data_timedatadetails.length > 0) {
                  setSelectedTimeDetails(
                    Response.data.message.data_timedatadetails[0]
                  );
                  setSelectMealTimeDetails(
                    Response.data.message.data_timedatadetails
                  );
                  book_time =
                    Response.data.message.data_timedatadetails[0].start_time;
                }
              } else {
                if (mealDetailsArray.length > 0) {
                  setSelectedMealDetails(mealDetailsArray[0].data.meal_type);
                  setSelectedTimeDetails(mealDetailsArray[0].data.timeslot[0]);
                  setSelectMealTimeDetails(mealDetailsArray[0].data.timeslot);
                  book_time = mealDetailsArray[0].data.timeslot[0].start_time;
                }
              }
            }

            setMealDetails(mealDetailsArray);
            setSelectedFloorListID(dining_area_id);
            setselecteddate(special_date);
            if (no_of_guest > guest_length) {
              setAddCustomPersons(true);
            }
            if (no_of_child > child_length) {
              setAddCustomChild(true);
            }
            if (no_of_pets > pet_length) {
              setAddCustomPet(true);
            }
            setselectedperson(no_of_guest);
            setselectedchild(no_of_child);
            setselectedpet(no_of_pets);
            const nextWeekdays = generateWeekdays();
            const nextDigits = generateDigits();

            const check_date_present_or_not = nextWeekdays.filter((data) => {
              return data.day_yy_mm_dd === special_date;
            });
            if (check_date_present_or_not.length == 0) {
              setAddCustomDate(true);
            }

            setDigits(nextDigits);
            setWeekdays(nextWeekdays);

            if (Response.data.message.data_floor_data.length > 0) {
              master_data_get_canvas(
                special_date,
                book_time,
                dining_area_id,
                PersonWantToSeat
              );
            }
          } else {
            const elements = document.getElementsByClassName("datenotfound");
            for (let i = 0; i < elements.length; i++) {
              elements[i].style.display = "none";
            }
            const elements2 =
              document.getElementsByClassName("datenotfoundshow");
            for (let i = 0; i < elements2.length; i++) {
              elements2[i].style.display = "";
            }
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

  // select date

  const SelectedChangeDate = (datedata, click_type) => {
    if (click_type === "1") {
      setselecteddate(datedata.day_yy_mm_dd);
      setAddCustomDate(false);
      master_data_get(datedata.day_yy_mm_dd);
    } else {
      let data_set = computeTodayDateCustom(datedata);
      setselecteddate(data_set);
      master_data_get(data_set);
    }
  };
  const SelectedFloorDate = (datedata) => {
    setSelectedFloorListID(datedata);
    master_data_get_canvas(
      selecteddate,
      SelectedTimeDetails.start_time,
      datedata,
      PersonWantToSeat
    );
  };

  const SelectedChangePerson = (person_name, click_type) => {
    let person_seat = 0;
    if (click_type === "1") {
      setselectedperson(person_name);
      PersonWantToSeat = person_name;
      PersonWantToSeat_seated = person_name;
      person_seat = person_name;
      setAddCustomPersons(false);
    } else {
      if (person_name.target.value === "") {
        person_name.target.value = 1;
      } else if (Number(person_name.target.value) < 1) {
        person_name.target.value = 1;
      }
      setselectedperson(person_name.target.value);
      person_seat = person_name.target.value;
      PersonWantToSeat = person_name.target.value;
      PersonWantToSeat_seated = person_name.target.value;
    }

    canvas.renderAll();
    table_ids = "";
    master_data_get_canvas(
      selecteddate,
      SelectedTimeDetails.start_time,
      SelectedFloorListID,
      person_seat
    );
  };

  useEffect(() => {
    //code by mk
    let tableCodeIds = [];
    let selectcomb = "";
    const floatRightTables_unselect =
      document.querySelectorAll(".float_right_table");
    floatRightTables_unselect.forEach((table) => {
      table.textContent = "Select";
      tableCodeIds.push(table.getAttribute("table_code_ids"));
    });

    if (SelectedTableForBooking.length > 0) {
      SelectedTableForBooking.forEach((item, i) => {
        selectcomb += item.table_id + ","; //make list of selected table
      });
      selectcomb = selectcomb.slice(0, -1); //for trim last ,
    }
    const sortAndStringify = (arr) => arr.split(",").sort().join(",");
    const floatRightTables_select =
      document.querySelectorAll(".float_right_table");
    floatRightTables_select.forEach((table) => {
      const tableCodeIdsAttr = table.getAttribute("table_code_ids");

      // Sort and stringify both selectcomb and tableCodeIdsAttr
      const sortedSelectcomb = sortAndStringify(selectcomb);
      const sortedTableCodeIdsAttr = sortAndStringify(tableCodeIdsAttr);

      if (sortedSelectcomb === sortedTableCodeIdsAttr) {
        table.textContent = "Selected";
      }
    });
  }, [SelectedTableForBooking]);

  const selectfromsuggestion = (data_call, click_type, primary_id, indx) => {
    //code by mk
    let slcttbl = "";
    if (click_type === "1") {
      if (SelectedTableForBooking.length > 0) {
        SelectedTableForBooking.forEach((item, i) => {
          //for unselected table
          data_update_canvas(CanvasManupult[item.table_id]["canvas_list"]);
          slcttbl = item.table_id;
        });
      }
      if (slcttbl != primary_id) {
        data_update_canvas(
          CanvasManupult[primary_id]["canvas_list"],
          primary_id
        ); //for selected table
      }
    } else if (click_type === "2") {
      if (SelectedTableForBooking.length > 0) {
        SelectedTableForBooking.forEach((item, i) => {
          data_update_canvas(CanvasManupult[item.table_id]["canvas_list"]);
        });
      }
      const splitIds = data_call.table_code_ids.split(",");
      splitIds.forEach((id) => {
        data_update_canvas(
          CanvasManupult[id.trim()]["canvas_list"],
          primary_id
        );
      });
    }
  };

  const SelectedChangeChild = (child_name, click_type) => {
    if (click_type === "1") {
      setselectedchild(child_name);
      setAddCustomChild(false);
    } else {
      if (child_name.target.value === "") {
        child_name.target.value = 1;
      } else if (Number(child_name.target.value) < 1) {
        child_name.target.value = 1;
      }
      setselectedchild(child_name.target.value);
    }
  };

  const SelectedChangeMealDetail = (pet_name, timelist, click_type) => {
    if (click_type === "1") {
      setSelectedMealDetails(pet_name);
      setSelectMealTimeDetails(timelist);
      if (timelist.length > 0) {
        SelectedChangeTimeDetail(timelist[0], "1");
      }
    }
  };

  const SelectedChangePet = (pet_name, click_type) => {
    if (click_type === "1") {
      setselectedpet(pet_name);
    } else {
      if (pet_name.target.value === "") {
        pet_name.target.value = 1;
      } else if (Number(pet_name.target.value) < 1) {
        pet_name.target.value = 1;
      }
      setselectedpet(pet_name.target.value);
    }
  };

  const SelectedChangeTimeDetail = (time_name, click_type) => {
    if (click_type === "1") {
      setSelectedTimeDetails(time_name);
      master_data_get_canvas(
        selecteddate,
        time_name.start_time,
        SelectedFloorListID,
        PersonWantToSeat
      );
    }
  };

  const addCutomDateInput = () => {
    setAddCustomDate(true);
    setselecteddate("");
  };

  const addCustomPersonsInput = () => {
    setAddCustomPersons(true);
    setselectedperson("");
  };

  const addCustomChildInput = () => {
    setAddCustomChild(true);
    setselectedchild("");
  };

  const addCustomPetInput = () => {
    setAddCustomPet(true);
    setselectedpet("");
  };

  
  const generateDigits = () => {
    return Array.from({ length: guest_length }, (_, i) => i + 1);
  };

  const handleSaveChangesdynamic = async (
    form_data,
    url_for_save,
    call_time
  ) => {
    if (SelectedTableForBooking.length === 0) {
      setSelectedData({
        no_of_child: selectedchild,
        no_of_guest: selectedperson,
        no_of_pets: selectedpet,
        book_time: SelectedTimeDetails.start_time,
        book_date: selecteddate,
        guest_name: $("#guest_name").val(),
        guest_mobile: phone.replace(/\+/g, ""),
        tablelist: "",
        show_msg: "",
        call_time: 0,
        show_msg_final:
          "Do you want to Confirm this Booking Without Select Table ?",
        button_name: "Confirm",
        button_name_next: "Cancel",
        button_class: "assignModalBtn",
      });
      setModalShow(true);
    } else {
      handleSaveChangesdynamic_final(form_data, url_for_save, call_time);
    }
  };

  const handleSaveChangesdynamic_final = async (
    form_data,
    url_for_save,
    call_time
  ) => {
    let vaild_data = check_vaild_save(form_data);
    const isValiddd = isPhoneValid(phone);
    setisValid(isValiddd);

    if (vaild_data && isValiddd) {
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("left_position", "");
      setshowLoaderAdmin(true);
      fd_from.append("reservation_id", reservation_id);
      fd_from.append("guest_mobile_no", phone.replace(/\+/g, ""));
      fd_from.append("book_date", selecteddate);
      fd_from.append("call_time", call_time);
      fd_from.append(
        "operational_time_detail_id",
        SelectedTimeDetails.primary_id
      );
      fd_from.append(
        "operational_booking_time",
        SelectedTimeDetails.start_time
      );
      if (class_hidden === "hidden") {
        fd_from.append("booking_type", "0");
      } else {
        fd_from.append("booking_type", "1");
      }
      fd_from.append("realtime", "0");
      fd_from.append("no_of_guest", selectedperson);
      fd_from.append("no_of_child", selectedchild);
      fd_from.append("no_of_pets", selectedpet);
      fd_from.append("total_tablebooking", SelectedTableForBooking.length);
      fd_from.append("dining_area_id", SelectedFloorListID);
      let table_id_dd = "";
      let table_name_dd = "";
      let max_person_dd = 0;
      let min_person_dd = 0;
      let preferred_person_dd = 0;
      if (SelectedTableForBooking.length > 0) {
        SelectedTableForBooking.forEach((item, i) => {
          if (SelectedTableForBooking.length == i + 1) {
            table_id_dd = table_id_dd + item.table_id;
            table_name_dd = table_name_dd + item.table_name;
          } else {
            table_id_dd = table_id_dd + item.table_id + ",";
            table_name_dd = table_name_dd + item.table_name + ",";
          }

          max_person_dd = max_person_dd + item.max_person;
          min_person_dd = min_person_dd + item.min_person;
          preferred_person_dd = preferred_person_dd + item.preferred_person;
        });
      }
      fd_from.append("table_id_dd", table_id_dd);
      fd_from.append("table_name_dd", table_name_dd);
      fd_from.append("max_person_dd", max_person_dd);
      fd_from.append("min_person_dd", min_person_dd);
      fd_from.append("preferred_person_dd", preferred_person_dd);
      fd_from.append("available_online_dd", "0");
      fd_from.append("priority_level_dd", "0");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          // if (Response.data.error && Response.data.call_time !== "error") {
          //   setSelectedData({
          //     no_of_child: selectedchild,
          //     no_of_guest: selectedperson,
          //     no_of_pets: selectedpet,
          //     book_time: SelectedTimeDetails.start_time,
          //     book_date: selecteddate,
          //     guest_name: $("#guest_name").val(),
          //     guest_mobile: phone.replace(/\+/g, ""),
          //     tablelist: table_name_dd,
          //     show_msg: Response.data.message,
          //     call_time: Response.data.call_time,
          //     show_msg_final: "Do you want to Confirm this Booking ?",
          //     button_name: "Confirm",
          //     button_name_next: "Cancel",
          //     button_class: "assignModalBtn",
          //   });
          //   setModalShow(true);
          // } else {
          //   handleSuccessSession(
          //     Response.data.message,
          //     "/Create_Reservation"
          //   );
          // }
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            if (location.pathname.includes("/Create_WalkIn")) {
              handleSuccessSession(Response.data.message, "/Create_WalkIn");
            } else if (location.pathname.includes("/Create_Reservation")) {
              handleSuccessSession(
                Response.data.message,
                "/Create_Reservation"
              );
            } else {
              handleSuccessSession(Response.data.message, "/Dashboard");
            }
          }

          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const openCustomDatePicker = (customDatePickerInput_id) => {
    document.getElementById(customDatePickerInput_id).focus();
  };

  // canvas data

  const updateSelectedObjectDetails = (obj) => {
    try {
      if (obj) {
        obj.setControlsVisibility({
          mtr: false, // Rotation control
        });

        if (obj.type === "activeSelection") {
          obj._objects.forEach((objectData, index) => {
            data_update_canvas(objectData);
          });
        } else if (obj.type === "table") {
          data_update_canvas(obj);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const data_update_canvas = async (obj, indx = -1) => {
    let split_data = obj.globalCompositeOperation.split("@@@");
    let table_id_dd = Number(split_data[0]);
    let table_name_dd = obj._objects[1].text;
    let available_online_dd = split_data[1];
    let min_person_dd = Number(split_data[2]);
    let preferred_person_dd = Number(split_data[3]);
    let max_person_dd = Number(split_data[4]);
    let priority_level_dd = split_data[5];

    const arraysToAdd = [
      {
        table_id: table_id_dd,
        table_name: table_name_dd,
        available_online: available_online_dd,
        min_person: min_person_dd,
        preferred_person: preferred_person_dd,
        max_person: max_person_dd,
        priority_level: priority_level_dd,
      },
    ];

    let arledy_data = true;
    await obj.getObjects().forEach((subObj) => {
      if (subObj.fill === runining_table && arledy_data) {
        arledy_data = false;
      } else if (subObj.fill === ready_for_allot && arledy_data) {
        arledy_data = false;
      } else if (subObj.fill === blocked_main && arledy_data) {
        arledy_data = false;
      }
    });
    if (arledy_data) {
      setSelectedTableForBooking((prevState) => {
        const existingIndex = prevState.findIndex(
          (item) => item.table_id === table_id_dd
        );

        if (existingIndex !== -1) {
          let person_count = Number(prevState[existingIndex].preferred_person);
          let person_max_person = Number(prevState[existingIndex].max_person);
          SelectedTablePersonCount =
            Number(SelectedTablePersonCount) - person_count;
          PersonWantToSeat_seated =
            Number(PersonWantToSeat_seated) + person_max_person;
          // Update existing array
          const newState = [...prevState];
          newState.splice(existingIndex, 1); // Remove the existing item
          obj.getObjects().forEach((subObj) => {
            if (subObj.fill !== white_main) {
              subObj.set({ fill: tableFill_main });
            }
          });
          canvas.renderAll();
          return newState;
        } else {
          if (Number(PersonWantToSeat_seated) > 0) {
            SelectedTablePersonCount =
              Number(SelectedTablePersonCount) + preferred_person_dd;
            PersonWantToSeat_seated =
              Number(PersonWantToSeat_seated) - max_person_dd;
            obj.getObjects().forEach((subObj) => {
              if (subObj.fill !== white_main) {
                subObj.set({ fill: selected_table });
              }
            });
            canvas.renderAll();
            return [...prevState, ...arraysToAdd];
          } else {
            return prevState;
          }
        }
      });
    }
  };

  const initCanvas = (all_table_list) => {
    try {
      canvas = new fabric.Canvas("canvas");
      canvas.backgroundColor = backgroundColor_main;
      all_table_list.forEach((objectData) => {
        createFabricObject(objectData);
      });
      // Render all objects on the main canvas
      canvas.forEachObject(function (object) {
        // Set selectable property to false
        object.selectable = false;
      });
      canvas.selection = false;
      canvas.renderAll();
      canvas.on("mouse:down", function (e) {
        const target = e.target;
        isDragging.current = true;
        const pointer = canvas.getPointer(e.e);
        dragStart.current = { x: pointer.x, y: pointer.y };
        if (target) {
          updateSelectedObjectDetails(target);
        }
      });
      canvas.on("mouse:up", () => {
        isDragging.current = false;
        initialPinchDistance.current = null;
        lastZoom.current = canvas.getZoom();
      });

      canvas.on("mouse:move", (options) => {
        if (isDragging.current) {
          const pointer = canvas.getPointer(options.e);
          const deltaX = pointer.x - dragStart.current.x;
          const deltaY = pointer.y - dragStart.current.y;
          canvas.relativePan(new fabric.Point(deltaX, deltaY));
        }
      });
      canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 1.2) zoom = 1.2;
        if (zoom < 0.8) zoom = 0.8;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    } catch (error) {
      console.error("Error loading canvas ddd data:", error.message);
    }
  };

  const createFabricObject = (objectData) => {
    const left_po = parseFloat(objectData.left_position);
    const top_po = parseFloat(objectData.top_position);

    const number_table_with_t = objectData.table_code;
    const scaleX_position = parseFloat(objectData.scalex_position);
    const scaley_position = parseFloat(objectData.scaley_position);
    const blocked_status = objectData.fill_position;
    let number_table = Number(objectData.primary_id);
    let available_online = objectData.available_online;
    let min_person = objectData.min_person;
    let preferred_person = objectData.preferred_person;
    let max_person = objectData.max_person;
    let priority_level = objectData.priority_level;
    let table_type = objectData.table_type;
    let angle_position = objectData.angle_position;
    let already_book = objectData.already_book;
    let type_name = objectData.special_feature;
    let selected_canvas = objectData.selected_canvas;
    let o;

    if (table_type === "counter") {
      o = addCircleTriangle(
        left_po,
        top_po,
        180,
        60,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        angle_position,
        blocked_status,
        available_online,
        min_person,
        preferred_person,
        max_person,
        priority_level,
        "counter",
        true,
        already_book,
        type_name,
        selected_canvas
      );
      o.selectable = false;
      canvas.add(o);
    } else if (table_type === "rect") {
      o = addCircleTriangle(
        left_po,
        top_po,
        50,
        60,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        angle_position,
        blocked_status,
        available_online,
        min_person,
        preferred_person,
        max_person,
        priority_level,
        "square_table",
        true,
        already_book,
        type_name,
        selected_canvas
      );
      o.selectable = false;
      canvas.add(o);
    } else if (table_type === "circle") {
      o = addCircleTriangle(
        left_po,
        top_po,
        0,
        0,
        30,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        angle_position,
        blocked_status,
        available_online,
        min_person,
        preferred_person,
        max_person,
        priority_level,
        "circle",
        true,
        already_book,
        type_name,
        selected_canvas
      );
      o.selectable = false;
      canvas.add(o);
    } else {
      o = addCircleTriangle(
        left_po,
        top_po,
        0,
        0,
        30,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        angle_position,
        blocked_status,
        available_online,
        min_person,
        preferred_person,
        max_person,
        priority_level,
        table_type,
        true,
        0,
        type_name,
        selected_canvas
      );
      canvas.add(o);
    }
    setCanvasManupult((prevState) => ({
      ...prevState,
      [number_table]: { canvas_list: o, table_name: number_table_with_t },
    }));
  };

  const master_data_get_canvas = async (
    booking_date,
    booking_time,
    floor_id,
    person_seat
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    setTotalCombinationTable(null);
    setTotalCombinationFiterTable(null);
    fd.append("booking_date", booking_date);
    fd.append("reservation_date", booking_date);
    fd.append("booking_time", booking_time);
    fd.append("dining_area_id", floor_id);
    fd.append("reservation_id", reservation_id);
    await server_post_data(get_all_table_position2, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          const tableIds = [];
          const tableNameSet = new Set();
          Response.data.message.data_reservation.forEach((subObj) => {
            let table_code_ids = subObj.table_code_ids + ",0";
            let table_code_names = subObj.table_code_names + ",0";
            const tableDataArray = table_code_ids.split(",");
            const tableNameArray = table_code_names.split(",");
            for (let i = 0; i < tableDataArray.length - 1; i++) {
              if (tableNameArray[i]) {
                const tableId = tableDataArray[i].trim();
                const tableName = tableNameArray[i].trim();
                if (!tableNameSet.has(tableName)) {
                  tableIds.push({
                    table_id: Number(tableId),
                    Table_name: tableName,
                    booking_status: subObj.booking_status,
                  });
                  tableNameSet.add(tableName);
                }
              }
            }
          });

          if (Response.data.message.reservation_data_edit.length > 0) {
            table_ids =
              Response.data.message.reservation_data_edit[0].table_code_ids;
          }

          Response.data.message.data_tabledata.forEach((subObj) => {
            const filtered = tableIds.filter((patient) => {
              return patient.table_id === subObj.primary_id;
            });

            if (
              subObj.table_type === "circle" ||
              subObj.table_type === "triangle" ||
              subObj.table_type === "square_table" ||
              subObj.table_type === "rect"
            ) {
              subObj.selected_canvas = "";
              if (
                table_ids.split(",").includes(String(subObj.primary_id)) &&
                table_ids !== ""
              ) {
                subObj.selected_canvas = "yes";
              } else if (filtered.length == 1) {
                subObj.already_book = filtered[0].booking_status;
              } else {
                subObj.already_book = 0;
              }
            }
          });

          if (canvas) {
            canvas.dispose();
          }

          Response.data.message.data_tablecombition.forEach((subObj) => {
            const filtered = tableIds.filter((patient) => {
              return subObj.table_code_ids.includes(patient.table_id);
            });
            if (filtered.length == 1) {
              subObj.already_book = "1";
            } else {
              subObj.already_book = "0";
            }
          });
          const bloock_table = Response.data.message.data_tabledata.filter(
            (optiondddd) => 1 === optiondddd.current_status
          );
          const combinedData = Response.data.message.data_tabledata
            .filter(
              (subObjData) =>
                subObjData.table_code !== "undefined" &&
                subObjData.table_type !== "pillar" &&
                subObjData.table_type !== "decorative" &&
                subObjData.table_type !== "decorative" &&
                subObjData.table_type !== "counter"
            )
            .map((subObjData) => {
              const filteredData = tableIds.filter(
                (patient) => patient.table_id === subObjData.primary_id
              );
              let alreadyBookData =
                filteredData.length === 1 ? filteredData[0].booking_status : 0;

              if (subObjData.current_status === 1) {
                alreadyBookData = 1;
              }
              return { ...subObjData, already_book: alreadyBookData };
            })
            .concat(
              Response.data.message.data_tablecombition.map((subObjComb) => {
                const filteredComb = tableIds.filter((patient) =>
                  subObjComb.table_code_ids.includes(patient.table_id)
                );
                const filteredComb2 = bloock_table.filter((patient) =>
                  subObjComb.table_code_ids.includes(patient.primary_id)
                );
                const alreadyBookComb =
                  filteredComb.length > 0 || filteredComb2.length > 0 ? 1 : 0;

                return { ...subObjComb, already_book: alreadyBookComb };
              })
            );

          let filter_data = Response.data.message.data_tabledata.filter(
            (patient) => {
              return table_ids.split(",").includes(String(patient.primary_id));
            }
          );

          if (filter_data.length > 0) {
            filter_data.map(function (patient) {
              const arraysToAdd = [
                {
                  table_id: patient.primary_id,
                  table_name: patient.table_code,
                  available_online: patient.available_online,
                  min_person: patient.min_person,
                  preferred_person: patient.preferred_person,
                  max_person: patient.max_person,
                  priority_level: patient.priority_level,
                },
              ];
              SelectedTablePersonCount =
                Number(SelectedTablePersonCount) + patient.preferred_person;
              PersonWantToSeat_seated =
                Number(PersonWantToSeat_seated) - patient.max_person;
              setSelectedTableForBooking((prevState) => {
                return [...prevState, ...arraysToAdd];
              });
            });
          }

          let filter_data_combinedData = combinedData.map((subObjData) => {
            let alreadyBookData = subObjData.already_book;
            if (subObjData.table_code_ids === table_ids) {
              alreadyBookData = 0;
            }
            return { ...subObjData, already_book: alreadyBookData };
          });
          console.log(filter_data_combinedData);
          console.log(table_ids);
          let filteredDatashow;
          if (filter_data_combinedData && filter_data_combinedData.length > 0) {
            filteredDatashow = filter_data_combinedData.filter((row) => {
              return (
                row.max_person >= person_seat && row.min_person <= person_seat
              );
            });
          }

          setTotalCombinationFiterTable(filteredDatashow);
          setTotalCombinationTable(filter_data_combinedData);
          initCanvas(Response.data.message.data_tabledata);
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };

  const handleActiveDeactive = () => {
    setModalShow(false);
    handleSaveChangesdynamic_final(
      "CarrerformData",
      create_table_reservation_staff,
      SelectedData.call_time
    );
  };

  const todayDate = new Date();
  const minDate = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000);

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
              <div className="walkInHead">
                <div className="walkInHeading">
                  {location.pathname.includes("/Create_WalkIn") ? (
                    <h5>Create Walk-In</h5>
                  ) : location.pathname.includes("/edit_Reservation") ? (
                    <h5>Edit Reservation</h5>
                  ) : (
                    <h5>Create Reservation</h5>
                  )}
                </div>
              </div>
            </div>

            <div className="page_body container-lg">
              <div className="createReservForm">
                <div className="createReservForm_Container">
                  <div className="col-xl-12 col-lg-11">
                    <div className="row m-0">
                      <div className="col-xl-8">
                        <div className="createReservForm_left">
                          <h6>Reservation details</h6>
                        </div>
                        <div className="createReservForm_fields">
                          <div className={`resrvDate  mt-3 ${class_hidden}`}>
                            <div className="resrvDateImg">
                              <img src={Calendar} alt="Barley's Dashboard" />
                            </div>
                            <div className="resrvDateSelect">
                              <ul>
                                {weekdays.map((weekday, index) => (
                                  <li key={index}>
                                    <div
                                      className={`dateBox ${
                                        selecteddate === weekday.day_yy_mm_dd
                                          ? "selectedFormItems"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        SelectedChangeDate(weekday, "1")
                                      }
                                    >
                                      <p>{weekday.day}</p>
                                      <p>{weekday.date}</p>
                                    </div>
                                  </li>
                                ))}
                                <li
                                  className={`${
                                    addCustomDate ? " " : "hideInput"
                                  }`}
                                >
                                  <div className="customRsrvInput   image_icon_position1 curser_Pointer">
                                    <DatePicker
                                      selected={selecteddate}
                                      name="admin_dob_date"
                                      className="form-control  input_field_custom1  "
                                      id="customDatePickerInput"
                                      onClick={() =>
                                        openCustomDatePicker(
                                          "customDatePickerInput"
                                        )
                                      }
                                      minDate={minDate}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        SelectedChangeDate(e, "2")
                                      }
                                    />
                                    <span className="condition_error"></span>
                                  </div>
                                </li>
                              </ul>
                              <div
                                className={`addInputBtn ${
                                  addCustomDate ? "hideInput" : ""
                                }`}
                                onClick={addCutomDateInput}
                              >
                                <img src={AddBtn} alt="Barley's Dashboard" />
                              </div>
                            </div>
                          </div>
                          <div className="datenotfoundshow">
                            <h5>
                              Restaurant closed today. Sorry for any
                              inconvenience. <span>Thank you</span>!
                            </h5>
                          </div>
                          <div className="resrvDate datenotfound">
                            <div className="resrvDateImg">
                              <img src={Person} alt="Barley's Dashboard" />
                            </div>
                            <div className="resrvDateSelect">
                              <ul>
                                {digits.map((digit, index) => (
                                  <li key={index}>
                                    <div
                                      className={`dateBox ${
                                        selectedperson === digit
                                          ? "selectedFormItems"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        SelectedChangePerson(digit, "1")
                                      }
                                    >
                                      <p>{digit}</p>
                                    </div>
                                  </li>
                                ))}
                                <li
                                  className={`${
                                    addCustomPersons ? " " : "hideInput"
                                  }`}
                                >
                                  <div className="customRsrvInput">
                                    <input
                                      type="text"
                                      minLength={1}
                                      maxLength={3}
                                      value={selectedperson}
                                      onInput={handleNumbersChange}
                                      name="custom_person_count"
                                      onChange={(e) =>
                                        SelectedChangePerson(e, "2")
                                      }
                                    />
                                  </div>
                                </li>
                              </ul>
                              <div
                                className={`addInputBtn ${
                                  addCustomPersons ? "hideInput" : ""
                                }`}
                                onClick={addCustomPersonsInput}
                              >
                                <img src={AddBtn} alt="Barley's Dashboard" />
                              </div>
                            </div>
                          </div>
                          <div className="childANdPetsCOunt datenotfound">
                            <div className="resrvDate">
                              <div className="resrvDateImg">
                                <img src={Clids} alt="Barley's Dashboard" />
                              </div>
                              <div className="resrvDateSelect">
                                <ul>
                                  {Array.from(
                                    { length: child_length },
                                    (_, index) => index + 1
                                  ).map((digit, index) => (
                                    <li key={index}>
                                      <div
                                        className={`dateBox ${
                                          selectedchild === index
                                            ? "selectedFormItems"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          SelectedChangeChild(index, "1")
                                        }
                                      >
                                        <p>{index}</p>
                                      </div>
                                    </li>
                                  ))}
                                  <li
                                    className={`${
                                      addCustomChild ? " " : "hideInput"
                                    }`}
                                  >
                                    <div className="customRsrvInput">
                                      <input
                                        type="text"
                                        minLength={1}
                                        maxLength={3}
                                        value={selectedchild}
                                        name="custom_child_count"
                                        onInput={handleNumbersChange}
                                        onChange={(e) =>
                                          SelectedChangeChild(e, "2")
                                        }
                                      />
                                    </div>
                                  </li>
                                </ul>
                                <div
                                  className={`addInputBtn ${
                                    addCustomChild ? "hideInput" : ""
                                  }`}
                                  onClick={addCustomChildInput}
                                >
                                  <img src={AddBtn} alt="Barley's Dashboard" />
                                </div>
                              </div>
                            </div>
                            <div className="resrvDate">
                              <div className="resrvDateImg petRsrvImg">
                                <img src={Pet} alt="Barley's Dashboard" />
                              </div>
                              <div className="resrvDateSelect">
                                <ul>
                                  {Array.from(
                                    { length: pet_length },
                                    (_, index) => index + 1
                                  ).map((digit, index) => (
                                    <li key={index}>
                                      <div
                                        className={`dateBox ${
                                          selectedpet === index
                                            ? "selectedFormItems"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          SelectedChangePet(index, "1")
                                        }
                                      >
                                        <p>{index}</p>
                                      </div>
                                    </li>
                                  ))}
                                  <li
                                    className={`${
                                      addCustomPet ? " " : "hideInput"
                                    }`}
                                  >
                                    <div className="customRsrvInput">
                                      <input
                                        type="text"
                                        minLength={1}
                                        maxLength={3}
                                        value={selectedpet}
                                        name="custom_pet_count"
                                        onInput={handleNumbersChange}
                                        onChange={(e) =>
                                          SelectedChangePet(e, "2")
                                        }
                                      />
                                    </div>
                                  </li>
                                </ul>
                                <div
                                  className={`addInputBtn ${
                                    addCustomPet ? "hideInput" : ""
                                  }`}
                                  onClick={addCustomPetInput}
                                >
                                  <img src={AddBtn} alt="Barley's Dashboard" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`resrvDate  ${class_hidden} datenotfound`}
                          >
                            <div className="resrvDateImg">
                              <img src={Watch} alt="Barley's Dashboard" />
                            </div>
                            <div className="resrvDateSelect mealReservSelect">
                              <ul>
                                {MealDetails.map((digit, index) => {
                                  //code by mk
                                  return (
                                    <li key={index}>
                                      <div
                                        className={`mealReserv ${
                                          SelectedMealDetails ===
                                          digit.data.meal_type
                                            ? "selectedFormItems"
                                            : ""
                                        }`}
                                        onClick={(e) =>
                                          SelectedChangeMealDetail(
                                            digit.data.meal_type,
                                            digit.data.timeslot,
                                            "1"
                                          )
                                        }
                                      >
                                        <p>{digit.data.meal_type.name}</p>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          <div className={`resrvDate  datenotfound`}>
                            <div className="resrvDateImg">
                              <img src={Alarm} alt="Barley's Dashboard" />
                            </div>
                            <div className="resrvDateSelect timeSlotScrollBAr mealReservSelect">
                              <ul>
                                {SelectMealTimeDetails.map((option, index) => {
                                  let data_loop = formatTimeintotwodigit(
                                    option.start_time
                                  );
                                  if (option.start_stop_time_status === 0) {
                                    return (
                                      <li key={index}>
                                        <div
                                          className={`resrvSlots ${
                                            SelectedTimeDetails === option
                                              ? "selectedFormItems"
                                              : ""
                                          }`}
                                          onClick={(e) =>
                                            SelectedChangeTimeDetail(
                                              option,
                                              "1"
                                            )
                                          }
                                        >
                                          <div className="resrvSltTIme">
                                            <p>{data_loop}</p>
                                          </div>
                                          <div
                                            className={`resrvSltSeats ${
                                              SelectedTimeDetails === option
                                                ? "selectedFormTimeItems"
                                                : ""
                                            }`}
                                          >
                                            <p>
                                              {option.total_seat_book}/
                                              {
                                                option.per_day_maximum_particular
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  }
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4">
                        <form id="CarrerformData">
                          <div className="createReservForm_right datenotfound">
                            <h6>Guest details</h6>
                            <div className="guestDetails">
                              <div className="row m-0">
                                <div className="col-xl-12 col-md-6 interPhoneInput">
                                  <input
                                    className="trio_name trio_mandatory form-control"
                                    onInput={handleAphabetsChange}
                                    type="text"
                                    minLength={3}
                                    maxLength={30}
                                    name="guest_name"
                                    id="guest_name"
                                    placeholder="Full Name"
                                    defaultValue={
                                      ReservationDetails.guest_name || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                                <div className="col-xl-12 col-md-6 interPhoneInput">
                                  <PhoneInput
                                    defaultCountry="se"
                                    value={phone}
                                    onChange={(phone) => setPhone(phone)}
                                    className={!isValid && "show_1px_red"}
                                  />
                                  {!isValid && (
                                    <span className="condition_error">
                                      Phone is not Valid
                                    </span>
                                  )}
                                </div>
                                <div className="col-xl-12 col-md-6 interPhoneInput">
                                  <input
                                    className="trio_email trio_mandatory form-control"
                                    onInput={(e) => handleEmailChange(e)}
                                    type="text"
                                    id="guest_email"
                                    minLength={3}
                                    maxLength={100}
                                    defaultValue={
                                      ReservationDetails.guest_email || ""
                                    }
                                    name="guest_email"
                                    placeholder="Email"
                                  />
                                  <span className="condition_error"></span>
                                </div>
                                <div className="col-xl-12 col-md-12 interPhoneInput">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="reservation_comment"
                                    minLength={3}
                                    maxLength={180}
                                    defaultValue={
                                      ReservationDetails.reservation_description ||
                                      ""
                                    }
                                    onInput={handleIaphabetnumberChange}
                                    name="reservation_comment"
                                    placeholder="Note about the guest"
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="row m-0 datenotfound">
                      <div className="col-lg-8 col-md-8">
                        <div className="row">
                          <div className="tableStatusContainer justify_left col-sm-8">
                            <div className="tableStatusContainer">
                              <div className="tableStatusDiv">
                                <div className="tableStatusColor blankTable"></div>
                                <p>Blank</p>
                              </div>
                              <div className="tableStatusDiv">
                                <div className="tableStatusColor blockTable"></div>
                                <p> Block</p>
                              </div>
                              <div className="tableStatusDiv">
                                <div className="tableStatusColor ReservedTable"></div>
                                <p> Reserved</p>
                              </div>
                              <div className="tableStatusDiv">
                                <div className="tableStatusColor RunningTable"></div>
                                <p> Running</p>
                              </div>
                            </div>
                          </div>
                          <div className="canvasHead justify_right col-sm-4">
                            <Dropdown
                              value={SelectedFloorListID}
                              options={FloorList.map((area) => ({
                                label: area.dining_area_name,
                                value: area.primary_id,
                              }))}
                              onChange={(e) => {
                                SelectedFloorDate(e.value);
                              }}
                              placeholder="Select"
                            />
                          </div>
                        </div>
                        <canvas id="canvas" width={757} height={581} />

                        <div className="saveFormBtns">
                          <button className="btnCancel" type="hidden">
                            Cancel
                          </button>
                          <button
                            className="Create_Reservation btnSave"
                            type="button"
                            onClick={() =>
                              handleSaveChangesdynamic(
                                "CarrerformData",
                                create_table_reservation_staff,
                                0
                              )
                            }
                          >
                            {location.pathname.includes("/Create_WalkIn") ? (
                              <>Create</>
                            ) : location.pathname.includes(
                                "/edit_Reservation"
                              ) ? (
                              <>Update</>
                            ) : (
                              <>Create</>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <form id="CarrerformData">
                          <div className="createReservForm_right">
                            <h6>Table Suggestions</h6>
                            <div className="guestDetails">
                              <div className="row m-0">
                                {TotalCombinationFiterTable !== undefined &&
                                  TotalCombinationFiterTable !== null &&
                                  TotalCombinationFiterTable.map(
                                    (item, index) => {
                                      if (index < 6) {
                                        let data_show = "";
                                        let click_type = "1";
                                        data_show = item.table_code.replace(
                                          /,/g,
                                          "+"
                                        );
                                        click_type = "1";
                                        if (item.single_combine === 1) {
                                          click_type = "2";
                                        }
                                        if (Number(item.already_book) === 0) {
                                          return (
                                            <p
                                              key={index}
                                              className="subheadsBlack p-0"
                                            >
                                              {data_show} ,{" "}
                                              <span>
                                                {item.min_person}-
                                                {item.max_person}P
                                              </span>{" "}
                                              <span
                                                className={`float_right_table`}
                                                table_code_ids={`${
                                                  item.table_code_ids
                                                    ? item.table_code_ids
                                                    : item.primary_id
                                                }`}
                                                onClick={() =>
                                                  selectfromsuggestion(
                                                    item,
                                                    click_type,
                                                    item.primary_id,
                                                    index
                                                  )
                                                }
                                              >
                                                Select
                                              </span>
                                            </p>
                                          );
                                        }
                                      }
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <p>
              <div className="releaseModalHeadLeft">
                <p>
                  <h6>
                    <span>&nbsp;{SelectedData.show_msg}</span>
                  </h6>
                </p>
              </div>
              <div className="releaseModalHeadLeft">
                <p>
                  <h5>
                    <span>&nbsp;{SelectedData.show_msg_final}</span>
                  </h5>
                </p>
              </div>
            </p>
          </div>
          <div className="releaseModalDetails">
            <h5>{SelectedData.guest_name}</h5>
            <h5>{SelectedData.guest_mobile}</h5>
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
    </div>
  );
}

export default CreateReservation;
