import React, { useEffect, useState, useRef } from "react";
import "./Css/Reservations.css";
import Header from "./Header";
import Loader from "./Loader.js";
import { fabric } from "fabric";
import {
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  white_main,
  blocked_main,
  runining_table,
  ready_for_allot,
  selected_table,
  scrollLimitCanvas,
  initialViewportTransform,
  createImageWithTextGroup,
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
import RoundTable2 from "../assets/round2.svg";
import RoundTable3 from "../assets/round3.svg";
import RoundTable4 from "../assets/round4.svg";
import RoundTable6 from "../assets/round6.svg";
import SquareTable2 from "../assets/square2.svg";
import SquareTable4 from "../assets/square4.svg";
import SquareTable6 from "../assets/square6.svg";
import SquareTable8 from "../assets/square8.svg";
import CanvasBackground from "../assets/CanvasBackground.svg";
import {
  handleEmailChange,
  handleNumbersChange,
  handleAphabetsChange,
  handleError,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  formatTimeintotwodigit,
  handleIaphabetnumberChange,
  computeTodayDateCustom,
  inputdateformateChange,
  generateWeekdays,
  computeTodayDate,
  computeTodayDateDatePicker,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  create_table_reservation_staff,
  get_all_timing_date_wise,
  get_all_tablesetup2_for_edit,
} from "../ServiceConnection/serviceconnection.js";
import { useParams, useLocation } from "react-router-dom";
import $ from "jquery";
import { Modal, Button } from "react-bootstrap";
let canvas;
let PersonWantToSeat = 1;
let PersonWantToSeat_seated = PersonWantToSeat;
let SelectedTablePersonCount = 0;
let pet_length = 5;
let child_length = 5;
let guest_length = 7;
let first_time_set = 0;
let tablearrayRED; //code by mk
let reservationTableFree = {}; //code by mk
function CreateReservation() {
  let { reservation_id } = useParams();
  const location = useLocation();
  reservation_id = reservation_id || 0; // If id is undefined, set its value to 0
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
  const [MsgForOff, setMsgForOff] = useState("");
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let today_date = computeTodayDate();
    master_data_get(today_date, 1);
  }, []);

  useEffect(() => {}, [SelectedMealDetails]);
  const handleClose = () => setModalShow(false);
  const master_data_get = async (special_date, click_type_flag) => {
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
          let start_stop_status = 0;
          if (Response.data.message.get_date_off_date.length > 0) {
            start_stop_status =
              Response.data.message.get_date_off_date[0].start_stop_status;
          } else {
            if (Response.data.message.get_date_off_on_day.length > 0) {
              start_stop_status =
                Response.data.message.get_date_off_on_day[0].start_stop_status;
            }
          }
          setMsgForOff(Response.data.message.msg_for_no_show_admin);

          const nextWeekdays = generateWeekdays();
          const nextDigits = generateDigits();

          const check_date_present_or_not = nextWeekdays.filter((data) => {
            return data.day_yy_mm_dd === special_date;
          });
          setDigits(nextDigits);
          setWeekdays(nextWeekdays);
          if (check_date_present_or_not.length === 0) {
            setAddCustomDate(true);
          }
          setselecteddate(special_date);
          if (
            Response.data.message.data_timedata.length > 0 &&
            start_stop_status === 0
          ) {
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
            if (
              Response.data.message.reservation_details.length > 0 &&
              click_type_flag === 1
            ) {
              setselecteddate(show_book_edit);
            }
            console.log(Response.data.message.data_timedatadetails);

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
                    return optionTime >= startTime && optionTime < endTime;
                  });

                if (filterfilteredData.length !== 0) {
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
              setPhone(
                Response.data.message.reservation_details[0].guest_mobile_no
              );
              mealDetailsArray.forEach((meal) => {
                let get_meal_selected = meal.data.timeslot.filter((data) => {
                  return data.start_time === book_time;
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

            if (mealDetailsArray.length > 0) {
              if (Response.data.message.data_floor_data.length > 0) {
                master_data_get_canvas(
                  special_date,
                  book_time,
                  dining_area_id,
                  0
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
      master_data_get(datedata.day_yy_mm_dd, 2);
    } else {
      let data_set = computeTodayDateCustom(datedata);
      setselecteddate(data_set);
      master_data_get(data_set, 2);
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
      person_name.target.value = person_name.target.value.replace(
        /[^0-9]/g,
        ""
      );
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
          data_update_canvas(
            CanvasManupult[item.table_id]["canvas_list"],
            0,
            click_type
          );
          slcttbl = item.table_id;
        });
      }
      if (slcttbl !== primary_id) {
        data_update_canvas(
          CanvasManupult[primary_id]["canvas_list"],
          primary_id,
          click_type
        ); //for selected table
      }
    } else if (click_type === "2") {
      if (SelectedTableForBooking.length > 0) {
        SelectedTableForBooking.forEach((item, i) => {
          data_update_canvas(
            CanvasManupult[item.table_id]["canvas_list"],
            0,
            click_type
          );
        });
      }
      const splitIds = data_call.table_code_ids.split(",");
      splitIds.forEach((id) => {
        data_update_canvas(
          CanvasManupult[id.trim()]["canvas_list"],
          primary_id,
          click_type
        );
      });
    }
  };

  const SelectedChangeChild = (child_name, click_type) => {
    if (click_type === "1") {
      setselectedchild(child_name);
      setAddCustomChild(false);
    } else {
      child_name.target.value = child_name.target.value.replace(/[^0-9]/g, "");
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
      setAddCustomPet(false);
    } else {
      pet_name.target.value = pet_name.target.value.replace(/[^0-9]/g, "");
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
    let vaild_data = check_vaild_save(form_data);
    const isValiddd = isPhoneValid(phone);
    setisValid(isValiddd);
    if (vaild_data && isValiddd) {
      if (location.pathname.includes("/Create_WalkIn")) {
        if (SelectedTableForBooking.length === 0) {
          handleError("Please Select Table For Create Walk In Reservation.");
        } else {
          handleSaveChangesdynamic_final(form_data, url_for_save, call_time);
        }
      } else {
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
              "Do you want to confirm this Reservation without selecting any table",
            button_name: "Confirm",
            button_name_next: "Cancel",
            button_class: "assignModalBtn",
          });
          setModalShow(true);
        } else {
          handleSaveChangesdynamic_final(form_data, url_for_save, call_time);
        }
      }
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

      fd_from.append("dining_area_id", SelectedFloorListID);
      let loop_data = 0;
      Object.entries(reservationTableFree).forEach(([key, value]) => {
        loop_data++;
        fd_from.append("reservation_id_free" + loop_data, key);
      });
      fd_from.append("final_loop_free", loop_data);
      let table_id_dd = "";
      let table_name_dd = "";
      let max_person_dd = 0;
      let min_person_dd = 0;
      let preferred_person_dd = 0;
      let total_table_count = 0;
      if (SelectedTableForBooking.length > 0) {
        let uniqueTableIds = {};
        SelectedTableForBooking.forEach((item, i) => {
          // Add the table_id to the object with a value of true
          uniqueTableIds[item.table_id] = {
            table_id: item.table_id,
            table_name: item.table_name,
            max_person: item.max_person,
            min_person: item.min_person,
            preferred_person: item.preferred_person,
          };
        });

        for (let key in uniqueTableIds) {
          if (uniqueTableIds.hasOwnProperty(key)) {
            total_table_count++;
            table_id_dd += uniqueTableIds[key].table_id + ",";
            table_name_dd += uniqueTableIds[key].table_name + ",";
            max_person_dd += uniqueTableIds[key].max_person;
            min_person_dd += uniqueTableIds[key].min_person;
            preferred_person_dd += uniqueTableIds[key].preferred_person;
          }
        }
        table_id_dd = table_id_dd.slice(0, -1);
        table_name_dd = table_name_dd.slice(0, -1);
      }
      if (Number(max_person_dd) !== 0) {
        if (
          Number(selectedperson) >= Number(min_person_dd) &&
          Number(selectedperson) <= Number(max_person_dd)
        ) {
        } else {
          setshowLoaderAdmin(false);
          handleError("Please Select Table For Reservation.");
          return;
        }
      }
      fd_from.append("total_tablebooking", total_table_count);
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
            data_update_canvas(objectData, 0, "1");
          });
        } else if (obj.type === "table") {
          data_update_canvas(obj, 0, "1");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const data_update_canvas = async (obj, indx = -1, click_from = "1") => {
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
      } else if (subObj.fill === blocked_main && arledy_data) {
        arledy_data = false;
      }
    });
    //console.log(table_id_dd);
    if (arledy_data) {
      //code by mk
      setSelectedTableForBooking((prevState) => {
        const existingIndex = prevState.findIndex(
          (item) => item.table_id === table_id_dd
        );

        if (existingIndex !== -1) {
          let person_count = Number(prevState[existingIndex].preferred_person);
          let person_max_person = Number(prevState[existingIndex].max_person);

          /********** code by mk for red table select start ***********/
          let samegroup = "0";
          let samegroupflg = "0";
          canvas.forEachObject(function (object) {
            try {
              object.getObjects().forEach((subObjchk) => {
                if (
                  tablearrayRED[obj.id] &&
                  tablearrayRED[obj.id].table_ids.includes(object.id)
                ) {
                  if (subObjchk.fill !== white_main) {
                    prevState.forEach((currnttbl) => {
                      if (
                        tablearrayRED[obj.id].table_ids.includes(
                          currnttbl.table_id
                        ) &&
                        currnttbl.table_id !== table_id_dd
                      ) {
                        samegroup = 1;
                      }
                    });
                    if (samegroup === 0) {
                      SvgColorChange(subObjchk, ready_for_allot, () => {
                        subObjchk.set({ fill: ready_for_allot });
                        canvas.renderAll(); // Render the canvas after all objects are processed
                        samegroupflg = 1;
                        reservationTableFree[tablearrayRED[obj.id].booking_id] =
                          "";
                      });
                    }
                  }
                }
              });
            } catch (err) {
              //err
            }
          });
          /********** code by mk for red table select close ***********/

          SelectedTablePersonCount =
            Number(SelectedTablePersonCount) - person_count;
          PersonWantToSeat_seated =
            Number(PersonWantToSeat_seated) + person_max_person;
          // Update existing array
          const newState = [...prevState];
          newState.splice(existingIndex, 1); // Remove the existing item
          obj.getObjects().forEach((subObj) => {
            if (subObj.fill !== white_main) {
              if (samegroupflg == 1) {
                console.log("hii2");
                //code by mk red

                console.log("shubham jain 2");
                SvgColorChange(subObj, ready_for_allot, () => {
                  subObj.set({ fill: ready_for_allot });
                  canvas.renderAll(); // Render the canvas after all objects are processed
                });
              } else {
                console.log("shubham jain 3");
                SvgColorChange(subObj, tableFill_main, () => {
                  subObj.set({ fill: tableFill_main });
                  canvas.renderAll(); // Render the canvas after all objects are processed
                });
              }
            }
          });

          canvas.renderAll();
          return newState;
        } else {
          //for plus add table
          if (Number(PersonWantToSeat_seated) > 0 || click_from === "2") {
            /********** code by mk for red table select start ***********/
            let samegroup = 0;
            canvas.forEachObject(function (object) {
              try {
                object.getObjects().forEach((subObjchk) => {
                  if (
                    tablearrayRED[obj.id] &&
                    tablearrayRED[obj.id].table_ids.includes(object.id)
                  ) {
                    if (subObjchk.fill !== white_main) {
                      prevState.forEach((currnttbl) => {
                        if (
                          tablearrayRED[obj.id].table_ids.includes(
                            currnttbl.table_id
                          )
                        ) {
                          samegroup = 1;
                        }
                      });
                      if (samegroup === 0) {
                        SvgColorChange(subObjchk, tableFill_main, () => {
                          canvas.renderAll(); // Render the canvas after all objects are processed
                          reservationTableFree[
                            tablearrayRED[obj.id].booking_id
                          ] = tablearrayRED[obj.id].table_ids; //free the table of other resrvtion
                          subObjchk.set({ fill: tableFill_main }); //free the table grey color
                        });
                      }
                    }
                  }
                });
              } catch (err) {
                //err
              }
            });
            console.log(reservationTableFree);
            /********** code by mk for red table select start ***********/

            SelectedTablePersonCount =
              Number(SelectedTablePersonCount) + preferred_person_dd;
            PersonWantToSeat_seated =
              Number(PersonWantToSeat_seated) - max_person_dd;
            obj.getObjects().forEach((subObj) => {
              if (subObj.fill !== white_main) {
                SvgColorChange(subObj, selected_table, () => {
                  canvas.renderAll(); // Render the canvas after all objects are processed
                  subObj.set({ fill: selected_table });
                });
              }
            });

            canvas.renderAll();
            return [...prevState, ...arraysToAdd];
          } else {
            canvas.renderAll(); // Render the canvas after all objects are processed
            return prevState;
          }
        }
      });
    }
  };

  const SvgColorChange = (subObj, new_color_code, callback) => {
    // Modify the SVG source with the new color
    const modifiedSVG = subObj.OriginalSrc.replace(
      /fill="[^"]*"/g,
      `fill="${new_color_code}"`
    );

    subObj.OriginalSrcChange = modifiedSVG;

    // Create a new image from the modified SVG data
    const newImgElement = new Image();

    // Create a Blob from the modified SVG data and convert to a URL
    const blob = new Blob([modifiedSVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    newImgElement.src = url;

    newImgElement.onload = function () {
      // Update the object with the new image
      subObj.setElement(newImgElement);

      // Force re-render the object and canvas
      subObj.set({ dirty: true });
      canvas.renderAll(); // Render the canvas after the image is applied

      // Clean up
      URL.revokeObjectURL(url);

      if (callback) {
        callback(); // Call the callback after the image is loaded
      }
    };

    newImgElement.onerror = function (err) {
      console.error("Error loading image:", err); // Debug
    };
  };

  const initCanvas = (all_table_list) => {
    try {
      canvas = new fabric.Canvas("canvas", {
        fireRightClick: true, // <-- enable firing of right click events
        fireMiddleClick: true, // <-- enable firing of middle click events
        stopContextMenu: true, // <--  prevent context menu from showing
      });
      //canvas.backgroundColor = backgroundColor_main;
      //code by mk
      fabric.Image.fromURL(
        CanvasBackground,
        function (img) {
          // Ensure the image is loaded correctly
          if (img) {
            // Set the image origin to the top of the canvas
            img.set({
              originX: "left",
              originY: "top",
            });

            // Create a pattern from the image
            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(img);
            patternSourceCanvas.setDimensions({
              width: img.width,
              height: img.height,
            });

            // Apply the pattern as the background of the main canvas
            canvas.setBackgroundColor(
              {
                source: patternSourceCanvas.getElement(),
                repeat: "repeat",
              },
              canvas.renderAll.bind(canvas)
            );
          } else {
            console.error(
              "Failed to load background image from URL:",
              CanvasBackground
            );
          }
        },
        {
          crossOrigin: "anonymous", // Ensure CORS settings are correct if needed
        }
      );
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

          // Calculate the new position, limiting if necessary
          let newX = canvas.viewportTransform[4] + deltaX;
          let newY = canvas.viewportTransform[5] + deltaY;

          // Limit the scrolling
          newX = Math.min(
            0 + scrollLimitCanvas,
            Math.max(canvas.getWidth() - canvas.width - scrollLimitCanvas, newX)
          );
          newY = Math.min(
            0 + scrollLimitCanvas,
            Math.max(
              canvas.getHeight() - canvas.height - scrollLimitCanvas,
              newY
            )
          );

          // Apply the new position
          canvas.relativePan(
            new fabric.Point(
              newX - canvas.viewportTransform[4],
              newY - canvas.viewportTransform[5]
            )
          );
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
    let table_type_with_chair = objectData.table_type_with_chair;
    let o;
    let chair_img;
    let min;
    let max;
    let preferred;
    let height;
    let width;
    console.log(table_type_with_chair);
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
      canvas.add(o);
      setCanvasManupult((prevState) => {
        if (prevState != null) {
          return {
            ...prevState,
            [number_table]: { canvas_list: o, table_name: number_table_with_t },
          };
        } else {
          return {
            [number_table]: { canvas_list: o, table_name: number_table_with_t },
          };
        }
      });
    } else if (table_type === "rect") {
      if (table_type_with_chair == "square_table_two") {
        chair_img = SquareTable2;
        width = 60;
        height = 70;
      } else if (table_type_with_chair == "square_table_four") {
        chair_img = SquareTable4;
        width = 80;
        height = 75;
      } else if (table_type_with_chair == "square_table_six") {
        chair_img = SquareTable6;
        width = 105;
        height = 70;
      } else if (table_type_with_chair == "square_table_eight") {
        chair_img = SquareTable8;
        width = 120;
        height = 70;
      } else {
        chair_img = SquareTable6;
        width = 105;
        height = 70;
      }
      createImageWithTextGroup(
        left_po,
        top_po,
        width,
        height,
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
        selected_canvas,
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
          setCanvasManupult((prevState) => {
            if (prevState != null) {
              return {
                ...prevState,
                [number_table]: {
                  canvas_list: group,
                  table_name: number_table_with_t,
                },
              };
            } else {
              return {
                [number_table]: {
                  canvas_list: o,
                  table_name: number_table_with_t,
                },
              };
            }
          });
        })
        .catch((err) => {
          console.error("Failed to create group:", err);
        });
    } else if (table_type === "circle") {
      height = 90;
      width = 90;
      if (table_type_with_chair == "round_table_two") {
        chair_img = RoundTable2;
      } else if (table_type_with_chair == "round_table_three") {
        chair_img = RoundTable3;
      } else if (table_type_with_chair == "round_table_four") {
        chair_img = RoundTable4;
      } else if (table_type_with_chair == "round_table_six") {
        chair_img = RoundTable6;
      } else {
        chair_img = RoundTable6;
      }

      console.log("yes come");
      console.log(chair_img);
      //return
      createImageWithTextGroup(
        left_po,
        top_po,
        width,
        height,
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
        "circle",
        true,
        already_book,
        type_name,
        selected_canvas,
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
          setCanvasManupult((prevState) => {
            if (prevState != null) {
              return {
                ...prevState,
                [number_table]: {
                  canvas_list: group,
                  table_name: number_table_with_t,
                },
              };
            } else {
              return {
                [number_table]: {
                  canvas_list: o,
                  table_name: number_table_with_t,
                },
              };
            }
          });
        })
        .catch((err) => {
          console.error("Failed to create group:", err);
        });

      //canvas.add(o);
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
        already_book,
        type_name,
        selected_canvas,
        "",
        table_type_with_chair
      );
      canvas.add(o);
      setCanvasManupult((prevState) => {
        if (prevState != null) {
          return {
            ...prevState,
            [number_table]: { canvas_list: o, table_name: number_table_with_t },
          };
        } else {
          return {
            [number_table]: { canvas_list: o, table_name: number_table_with_t },
          };
        }
      });
    }
  };

  const master_data_get_canvas = async (
    booking_date,
    booking_time,
    floor_id,
    person_seat
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    setTotalCombinationFiterTable(null);
    fd.append("booking_date", booking_date);
    fd.append("reservation_date", booking_date);
    fd.append("booking_time", booking_time);
    fd.append("dining_area_id", floor_id);
    fd.append("call_id", floor_id);
    fd.append("reservation_id", reservation_id);
    fd.append("flag", "3");
    await server_post_data(get_all_tablesetup2_for_edit, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (canvas) {
            canvas.dispose();
          }
          setSelectedFloorListID(
            Response.data.message.data_dining_area2[0].primary_id
          ); //code by mk
          let table_ids = "";
          if (Response.data.message.data_dining_area5.length > 0) {
            table_ids =
              Response.data.message.data_dining_area5[0].table_code_ids;
            if (person_seat === 0) {
              PersonWantToSeat =
                Response.data.message.data_dining_area5[0].no_of_guest;
              PersonWantToSeat_seated =
                Response.data.message.data_dining_area5[0].no_of_guest;
            }
          }
          const tableIds = [];
          const tableNameSet = new Set();
          const tableIdsRED = {}; //code by mk

          Response.data.message.data_dining_area7.forEach((subObj) => {
            if (
              subObj.table_code_names !== undefined &&
              subObj.table_code_names !== "" &&
              subObj.table_code_names !== null
            ) {
              //console.log(subObj.table_code_ids);
              //console.log(subObj.table_code_names);
              const tableDataArray = subObj.table_code_ids.split(",");
              const tableNameArray = subObj.table_code_names.split(",");
              const table_ids_array = table_ids
                .split(",")
                .map((item, index) => {
                  return Number(item);
                });
              for (let i = 0; i < tableDataArray.length; i++) {
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
                    if (!table_ids_array.includes(Number(tableId))) {
                      //code by mk avoid the current reservation table
                      //console.log(tableId);
                      tableIdsRED[tableId] = {
                        //code by mk
                        table_ids: subObj.table_code_ids,
                        Table_names: subObj.table_code_names,
                        booking_id: subObj.primary_id,
                        single_multi: tableDataArray.length,
                      };
                    }
                  }
                }
              }
            }
          });
          console.log(Response.data.message);
          tablearrayRED = tableIdsRED; //code by mk
          console.log(tableIdsRED);

          Response.data.message.data_dining_area.forEach((subObj) => {
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
              } else if (filtered.length === 1) {
                subObj.already_book = filtered[0].booking_status;
              } else {
                subObj.already_book = 0;
              }
            }
          });
          let filter_data = Response.data.message.data_dining_area.filter(
            (patient) => {
              return table_ids.split(",").includes(String(patient.primary_id));
            }
          );

          if (filter_data.length > 0) {
            filter_data.forEach(function (patient) {
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

          const combinedData = Response.data.message.free_table;
          const filteredDatashow = combinedData.filter((row) => {
            return (
              row.max_person >= PersonWantToSeat &&
              row.min_person <= PersonWantToSeat
            );
          });
          initCanvas(Response.data.message.data_dining_area);

          setTotalCombinationFiterTable(filteredDatashow);
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

  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}

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
                          {/*  */}
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
                                      minDate={computeTodayDateDatePicker()}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        SelectedChangeDate(e, "2")
                                      }
                                      placeholderText="Select Date"
                                      dateFormat="E MMM d"
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
                            <h5>{MsgForOff}</h5>
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
                                      maxLength={3}
                                      defaultValue={selectedperson}
                                      name="custom_person_count"
                                      onBlur={(e) =>
                                        SelectedChangePerson(e, "2")
                                      }
                                      placeholder="No. of Person"
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
                                        maxLength={3}
                                        defaultValue={selectedchild}
                                        name="custom_child_count"
                                        onBlur={(e) =>
                                          SelectedChangeChild(e, "2")
                                        }
                                        placeholder="No. of Child"
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
                                        maxLength={3}
                                        defaultValue={selectedpet}
                                        name="custom_pet_count"
                                        onChange={(e) =>
                                          SelectedChangePet(e, "2")
                                        }
                                        placeholder="No. of Pets"
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
                                  } else {
                                    // Add a default return statement here
                                    return null; // or any other default value
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
                                    className=" trio_mandatory form-control"
                                    // onInput={handleAphabetsChange}
                                    type="text"
                                    minLength={3}
                                    maxLength={30}
                                    name="guest_name"
                                    id="guest_name"
                                    placeholder="Full Name*"
                                    defaultValue={
                                      ReservationDetails.guest_name || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                                <div className="col-xl-12 col-md-6 interPhoneInput">
                                  {/* se */}
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
                                    className="trio_email  form-control"
                                    onInput={(e) => handleEmailChange(e)}
                                    type="text"
                                    id="guest_email"
                                    minLength={3}
                                    maxLength={100}
                                    defaultValue={
                                      ReservationDetails.guest_email || ""
                                    }
                                    name="guest_email"
                                    placeholder="Email "
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
                                    placeholder="Restaurant Note"
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
                            <h6 style={{ textDecoration: "underline" }}>
                              Select Table
                            </h6>
                            {/* <div className="tableStatusContainer">
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
                            </div> */}
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
                                      } else {
                                        // Add a default return statement here
                                        return null; // or any other default value
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
              <p>
                {SelectedData.no_of_guest}{" "}
                {SelectedData.no_of_guest > 1 ? "PERSON" : "PERSON"}{" "}
              </p>
              <p>
                {SelectedData.no_of_child}{" "}
                {SelectedData.no_of_child > 1 ? "CHILDREN" : "CHILD"}
              </p>
              <p>
                {SelectedData.no_of_pets}{" "}
                {SelectedData.no_of_pets > 1 ? "PETS" : "PET"}{" "}
              </p>
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
