import { useEffect, useState, useCallback, useMemo } from "react";
import { fabric } from "fabric";
import back_reservation from "../assets/back_reservation.png";
import DoneGreen from "../assets/doneGreen.svg";
import OrngMsg from "../assets/orngMsg.svg";
import LeftArrow from "../assets/lrgy.svg";
import RightArrow from "../assets/rightArwD.svg";
import PrintList from "../assets/printList.svg";
import SearchMenu from "../assets/manage_search.svg";
import FIlter from "../assets/filteMixer.svg";
import CircleInfo from "../assets/infoCircle.svg";
import MsgBox from "../assets/orngMsg.svg";
import Person from "../assets/personform.svg";
import Child from "../assets/greyChild.svg";
import Pet from "../assets/greypets.svg";
import PersonY from "../assets/account_circle.svg";
import ChildY from "../assets/escalator_warning.svg";
import PetY from "../assets/pets.svg";
import Timetable from "../assets/time_tableGrey.svg";
import { Dropdown } from "primereact/dropdown";
import {
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  white_main,
  blocked_main,
  runining_table,
  walking_table,
  selected_table,
} from "../CommonJquery/TableAssignment.js";
import {
  server_post_data,
  get_all_table_position,
  allot_table_to_reservation,
  get_all_reservation_date,
  update_action_reservation,
  table_release_from_reservation,
  get_reservation_by_mobile_no,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import {
  computeTodayDate,
  computeTodayDateCustom,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  inputdateformateChange,
  formatTimeintotwodigit,
  formatTimeFormatcustom,
  handleNumbersDecimalChange,
  handleAlphabetsNumberWithoutSpaceChange,
  handleLinkClick,
  handleNumbersChange,
  inputdateformateChangeyear,
  handleIaphabetnumberChange,
} from "../CommonJquery/CommonJquery.js";
import { Modal, Button } from "react-bootstrap";
import Header from "./Header";
import Loader from "./Loader.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import searchIcn from "../assets/searchgreeey.svg";
import searchIcn2 from "../assets/searchOrang.svg";
import userIcn from "../assets/usericn.svg";
import "./Css/Dashboard.css";

let canvas;
let PersonWantToSeat = 5;
let PersonWantToSeat_seated = PersonWantToSeat;
let SelectedTablePersonCount = 0;

function Dashboard() {
  let reservation_date = computeTodayDate();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [SelectedTableForBooking, setSelectedTableForBooking] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [TotalReservationList, setTotalReservationList] = useState([]);
  const [TotalReservationListFull, setTotalReservationListFull] = useState([]);
  const [ReservationListSearch, setReservationListSearch] = useState([]);
  const [
    TotalReservationListOngoingPerson,
    setTotalReservationListOngoingPerson,
  ] = useState(0);
  const [TotalReservationListPerson, setTotalReservationListPerson] =
    useState(0);
  const [
    TotalReservationListNoShowPerson,
    setTotalReservationListNoShowPerson,
  ] = useState(0);
  const [TotalReservationListNextPerson, setTotalReservationListNextPerson] =
    useState(0);
  const [filteredData, setfilteredData] = useState([]);
  const [FloorList, setFloorList] = useState([]);
  const [SelectedFloorListID, setSelectedFloorListID] = useState([]);
  const [SelectedReservationBooking, setSelectedReservationBooking] = useState(
    []
  );
  const [TotalTable, setTotalTable] = useState(0);
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [infoShow, setInfoShow] = useState(false);
  const [noteShow, setNoteShow] = useState(false);
  const [noteShow2, setNoteShow2] = useState(false);
  const [startDate, setStartDate] = useState(reservation_date);
  const [TotalCombinationTable, setTotalCombinationTable] = useState([]);

  const [AreaID, setAreaID] = useState("");
  useEffect(() => {}, [SelectedTableForBooking]);
  useEffect(() => {}, [filteredData]);

  useEffect(() => {
    master_data_get_mananegement(reservation_date);

    return () => {};
  }, []);

  const SelectedFloorDate = (datedata) => {
    setSelectedFloorListID(datedata);
    console.log("change floor");
  };
  const SelectedDateChange = (datedata, click_type) => {
    let change_date = reservation_date;
    if (click_type === "normal") {
      change_date = computeTodayDateCustom(datedata, 0);
    } else if (click_type === "min") {
      change_date = computeTodayDateCustom(startDate, -1);
    } else if (click_type === "plus") {
      change_date = computeTodayDateCustom(startDate, 1);
    } else if (click_type === "now") {
      change_date = computeTodayDate();
    }
    reservation_date = change_date;
    setStartDate(change_date);
    master_data_get_mananegement(change_date);
  };

  const updateSelectedObjectDetails = (obj) => {
    try {
      if (obj) {
        obj.setControlsVisibility({
          mtr: false, // Rotation control
        });
        console.log(obj.type);
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

  const data_update_canvas = async (obj) => {
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
      if (
        (subObj.fill === runining_table && arledy_data) ||
        subObj.fill === blocked_main
      ) {
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
            return [...prevState, ...arraysToAdd];
          } else {
            return prevState;
          }
        }
      });
      console.log(PersonWantToSeat, preferred_person_dd);
    }
  };

  const initCanvas = (all_table_list) => {
    try {
      canvas = new fabric.Canvas("canvas");
      canvas.backgroundColor = backgroundColor_main;
      canvas.setBackgroundColor(
        {
          source: back_reservation,
          repeat: "repeat",
          backgroundImageStretch: true, // Stretch the background image to cover the canvas
        },
        canvas.renderAll.bind(canvas)
      );
      all_table_list.forEach((objectData) => {
        createFabricObject(objectData);
      });
      // Render all objects on the main canvas
      canvas.renderAll();
      canvas.on("mouse:down", function (e) {
        const target = e.target;
        if (target) {
          updateSelectedObjectDetails(target);
        }
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
    let selected_canvas = "";
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
        type_name
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
        false,
        0,
        type_name,
        selected_canvas
      );
      canvas.add(o);
    }
  };

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    reservation_id
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("reservation_id", reservation_id);
    fd.append("reservation_date", reservation_date);
    if (canvas) {
      canvas.dispose();
    }
    await server_post_data(get_all_table_position, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setAreaID(Response.data.message.data_dining_area2[0].primary_id);

          setTotalTable(Response.data.message.data_dining_area.length);

          const tableIds = [];
          const tableNameSet = new Set();
          Response.data.message.data_dining_area7.forEach((subObj) => {
            if (
              subObj.table_code_names !== undefined &&
              subObj.table_code_names !== "" &&
              subObj.table_code_names !== null
            ) {
              const tableDataArray = subObj.table_code_ids.split(",");
              const tableNameArray = subObj.table_code_names.split(",");

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
                  }
                }
              }
            }
          });

          Response.data.message.data_dining_area.forEach((subObj) => {
            const filtered = tableIds.filter((patient) => {
              return patient.table_id === subObj.primary_id;
            });
            if (filtered.length == 1) {
              subObj.already_book = filtered[0].booking_status;
            } else {
              subObj.already_book = 0;
            }
          });
          if (Response.data.message.data_dining_area5.length > 0) {
            setSelectedReservationBooking(
              Response.data.message.data_dining_area5[0]
            );
            PersonWantToSeat =
              Response.data.message.data_dining_area5[0].no_of_guest;
            PersonWantToSeat_seated =
              Response.data.message.data_dining_area5[0].no_of_guest;
          }

          setTotalCombinationTable(Response.data.message.data_dining_area1);
          setTotalReservationList(Response.data.message.data_dining_area7);
          initCanvas(Response.data.message.data_dining_area);
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };
  const master_data_get_mananegement = async (reservation_date) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("reservation_date", reservation_date);
    await server_post_data(get_all_reservation_date, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setTotalReservationListFull(
            Response.data.message.data_reservation_data
          );
          setfilteredData(Response.data.message.data_reservation_data);
          setFloorList(Response.data.message.data_floor_list);
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
          let dining_area_id = 0;
          if (Response.data.message.data_floor_list.length > 0) {
            dining_area_id =
              Response.data.message.data_floor_list[0].primary_id;
          }
          let totalperson = 0;
          let totalpersonnoshow = 0;
          let totalpersonongoing = 0;
          Response.data.message.data_reservation_data.forEach((subObj) => {
            totalperson += subObj.no_of_guest;

            if (subObj.booking_status === 2) {
              totalpersonongoing += subObj.no_of_guest;
            }
            if (subObj.booking_status === 4) {
              totalpersonnoshow += subObj.no_of_guest;
            }
          });
          setSelectedFloorListID(dining_area_id);
          setTotalReservationListPerson(totalperson);
          setTotalReservationListOngoingPerson(totalpersonongoing);
          setTotalReservationListNoShowPerson(totalpersonnoshow);
          setTotalReservationListNextPerson(totalperson);
          master_data_get("", "", "3", dining_area_id, "0");
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };
  const master_data_get_search = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd = combiled_form_data(form_data, null);

      await server_post_data(url_for_save, fd)
        .then((Response) => {
          setshowLoaderAdmin(false);
          console.log(Response);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            setReservationListSearch(
              Response.data.message.data_reservation_data
            );
            setsStaffImageLinkData(
              APL_LINK + Response.data.message.data_link_image
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const handleClose1 = () => setModalShow1(false);
  const handleClose = () => setModalShow(false);
  const handleInfoClose = () => setInfoShow(false);
  const handleNoteClose = () => setNoteShow(false);
  const handleNoteClose2 = () => {
    setNoteShow2(false);
  };
  const handleInfoShow = () => setInfoShow(true);
  const handleShow = (data_call, click_type) => {
    if (click_type === "confirmation") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "4",
        guest_name: data_call.guest_name,
        edit_click: false,
        show_msg: "Do You Want To Confirm This Booking",
        button_name: "Confirm",
        button_name_next: "Cancel",
        button_class: "assignModalBtn",
        comfirm_booking: true,
      });
      setModalShow(true);
    } else if (click_type === "no_show") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "4",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to mark this reservation as No Show?",
        button_name: "No Show",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    }else if (click_type === "revive") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "1",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to re-schedule this table?",
        button_name: "Reschedule",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "dispute") {
      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        book_date: data_call.book_date,
        booking_status: "8",
        edit_click: false,
        guest_name: data_call.guest_name,
        show_msg: "Do you want to Dispute this table?",
        button_name: "Dispute",
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "accepts") {
      console.log(data_call);
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
      setModalShow(true);
    } else if (click_type === "decline") {
      console.log(data_call);
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
      setModalShow(true);
    } else if (click_type === "selecttable") {
      setSelectedData(data_call);
      master_data_get("", "", "3", SelectedFloorListID, data_call.primary_id);
    } else if (click_type === "realeasetable") {
      console.log(data_call);
      setSelectedData(data_call);
      setModalShow1(true);
    } else if (click_type === "msgshow") {
      console.log(data_call);
      setSelectedData(data_call);
      setNoteShow2(true);
    } else if (click_type === "infoshow") {
      console.log(data_call);
      setSelectedData(data_call);
      setInfoShow(true);
    } else if (click_type === "edit_reservation") {
      handleLinkClick("edit_Reservation/" + data_call.primary_id);
    }
  };

  const handleActiveDeactive = () => {
    if (SelectedData.comfirm_booking) {
      handleSaveChangesdynamic(null, allot_table_to_reservation);
    } else {
      master_data_action_update(
        SelectedData.primary_id,
        SelectedData.booking_status
      );
    }
  };

  const master_data_action_update = async (reservation_id, booking_status) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("reservation_id", reservation_id);
    fd.append("booking_status", booking_status);
    await server_post_data(update_action_reservation, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          master_data_get_mananegement(reservation_date);
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    if (canvas) {
      let vaild_data = true;
      if (form_data !== null) {
        vaild_data = check_vaild_save(form_data);
      }

      if (vaild_data) {
        setshowLoaderAdmin(true);
        let fd_from = new FormData();
        if (form_data !== null) {
          fd_from = combiled_form_data(form_data, null);
        }
        console.log(SelectedReservationBooking);
        fd_from.append("total_tablebooking", SelectedTableForBooking.length);
        fd_from.append("reservation_id", SelectedReservationBooking.primary_id);
        fd_from.append("dining_area_id", AreaID);
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
          fd_from.append("table_id_dd", table_id_dd);
          fd_from.append("table_name_dd", table_name_dd);
          fd_from.append("max_person_dd", max_person_dd);
          fd_from.append("min_person_dd", min_person_dd);
          fd_from.append("preferred_person_dd", preferred_person_dd);
          fd_from.append("available_online_dd", "0");
          fd_from.append("priority_level_dd", "0");
          await server_post_data(url_for_save, fd_from)
            .then((Response) => {
              setshowLoaderAdmin(false);
              if (Response.data.error) {
                handleError(Response.data.message);
              } else {
                handleSuccessSession(Response.data.message, "/allot_table");
              }
            })
            .catch((error) => {
              setshowLoaderAdmin(false);
              handleError("network");
            });
        }
      }
    }
  };

  const handleSaveChangesdynamic_relase = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    console.log(vaild_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("reservation_id", SelectedData.primary_id);

      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleClose1();
            handleSuccessSession(Response.data.message, "/allot_table");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const [allActive, setAllActive] = useState(true);
  const [nextActive, setNextActive] = useState(false);
  const [confirmActive, setConfirmActive] = useState(false);
  const [currentActive, setCurrentActive] = useState(false);

  const toggleActiveFilter = (TabId) => {
    if (TabId === "ALL") {
      setfilteredData(TotalReservationListFull);
    } else if (TabId === "NEXT") {
      setfilteredData(TotalReservationListFull);
    } else if (TabId === "ONGOING") {
      const data_filter = TotalReservationListFull.filter((row) => {
        return row.booking_status === 2;
      });
      setfilteredData(data_filter);
    } else if (TabId === "NOSHOW") {
      const data_filter = TotalReservationListFull.filter((row) => {
        return row.booking_status === 4;
      });

      setfilteredData(data_filter);
    }
    setAllActive(TabId === "ALL");
    setNextActive(TabId === "NEXT");
    setConfirmActive(TabId === "ONGOING");
    setCurrentActive(TabId === "NOSHOW");
  };

  // useEffect(() => {
  //   const handleItemClick = (event) => {
  //     console.log("handleItemClick");
  //     $(".overlayNew").addClass("displayBlock");
  //     const selectedItem = $(event.currentTarget);
  //     selectedItem.addClass("selected");
  //     $(".tableStatusContainer").addClass("selected");
  //   };

  //   const hideOverlay = () => {
  //     $(".overlayNew").removeClass("displayBlock");
  //     const selectedItem = $(".resrvListItemList.selected");
  //     if (selectedItem.length > 0) {
  //       selectedItem.removeClass("selected");
  //     }
  //   };

  //   $(".resrvListItemList").on("click", handleItemClick);
  //   $(".overlayNew").on("click", hideOverlay);

  //   // Cleanup
  //   return () => {
  //     $(".resrvListItemList").off("click", handleItemClick);
  //     $(".overlayNew").off("click", hideOverlay);
  //   };
  // }, []);

  // Notes Script
  const [state, setState] = useState({
    showBookingDetails: false,
    showAddNote: true,
    noteText: "",
    notes: [],
    additionalInfoStyle: {
      backgroundColor: "#F3F3F3",
      boxShadow: "none",
    },
  });

  const getCurrentTime = useMemo(() => {
    return () => {
      const now = new Date();
      const date = `${now.getDate()}th. ${now.toLocaleString("default", {
        month: "short",
      })} ${now.getFullYear()}`;
      const time = `${now.getHours()}:${
        now.getMinutes() < 10 ? "0" : ""
      }${now.getMinutes()}`;
      return { date, time };
    };
  }, []);

  const handleAddNoteClick = () => {
    setState((prevState) => ({ ...prevState, showAddNote: true }));
  };

  const handleNoteInputChange = (e) => {
    setState((prevState) => ({ ...prevState, noteText: e.target.value }));
  };

  const handleAddNote = useCallback(() => {
    if (state.noteText.trim() !== "") {
      const currentTime = getCurrentTime(); // Get the current time object
      const newNote = {
        text: state.noteText,
        timing: [currentTime.date, currentTime.time], // Combine date and time
        staffName: "Ashutosh",
      };
      console.log(newNote.timing);
      setState((prevState) => ({
        ...prevState,
        notes: [...prevState.notes, newNote],
        noteText: "",
        showAddNote: false,
        additionalInfoStyle: {
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
      }));
    }
  }, [state, getCurrentTime]);

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="page_body">
              <div className="overlayNew"></div>
              {showLoaderAdmin && (
                <>
                  <div className="loading_overlay"></div>
                  <div className="loading_website">
                    <div className="loading_website-inner"></div>
                  </div>
                </>
              )}
              <div className="row m-0">
                <div className="col-sm-7">
                  <div className="canvasHead">
                    <button onClick={() => setNoteShow(true)}>+ NOTE</button>

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
                  {SelectedReservationBooking && (
                    <div className="tableStatusContainer">
                      <div className="tableStatusDiv">
                        <div className="tableStatusColor blankTable"></div>
                        <p>20 Blank Table</p>
                      </div>
                      <div className="tableStatusDiv">
                        <div className="tableStatusColor blockTable"></div>
                        <p>20 Block Table</p>
                      </div>
                      <div className="tableStatusDiv">
                        <div className="tableStatusColor runningTable"></div>
                        <p>20 Running Table</p>
                      </div>
                      <div className="tableStatusDiv">
                        <div className="tableStatusColor walkInTable"></div>
                        <p>01 Walk in</p>
                      </div>
                    </div>
                  )}

                  <canvas id="canvas" width={757} height={581} />
                </div>
                <div className="col-sm-5 paddingLeft0 max_height_500px">
                  <div className="dateChangeFilter">
                    <div className="dateChangeFilterContaiern">
                      <img
                        onClick={() => SelectedDateChange("", "min")}
                        src={LeftArrow}
                        alt="Barley's Dashboard"
                      />
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          SelectedDateChange(date, "normal");
                        }}
                        dateFormat="EEE dd MMM, yyyy"
                      />
                      <img
                        onClick={() => SelectedDateChange("", "plus")}
                        src={RightArrow}
                        alt="Barley's Dashboard"
                      />
                    </div>
                    <div className="gotoday">
                      <p onClick={() => SelectedDateChange("", "now")}>TODAY</p>
                    </div>
                  </div>
                  <div className="editNewAreaSidebar editNewAreaSidebarAllot h-100">
                    <div className="Righ-side-bar">
                      <div className="right">
                        <div>
                          <div className=" filterBodyDashB">
                            <div className="filterBodyDashBActions">
                              <div
                                className={`rsrvFilterTab ${
                                  allActive ? "rsrvFilterTabActive" : ""
                                }`}
                                onClick={() => toggleActiveFilter("ALL")}
                              >
                                <p>ALL</p>
                                <p className="p_count">
                                  ({TotalReservationListPerson}P)
                                </p>
                              </div>

                              <div
                                className={`rsrvFilterTab ${
                                  nextActive ? "rsrvFilterTabActive" : ""
                                }`}
                                onClick={() => toggleActiveFilter("NEXT")}
                              >
                                <p>NEXT</p>
                                <p className="p_count">
                                  ({TotalReservationListNextPerson}P)
                                </p>
                              </div>

                              <div
                                className={`rsrvFilterTab ${
                                  confirmActive ? "rsrvFilterTabActive" : ""
                                }`}
                                onClick={() => toggleActiveFilter("ONGOING")}
                              >
                                <p>ONGOING</p>
                                <p className="p_count">
                                  ({TotalReservationListOngoingPerson}P)
                                </p>
                              </div>

                              <div
                                className={`rsrvFilterTab ${
                                  currentActive ? "rsrvFilterTabActive" : ""
                                }`}
                                onClick={() => toggleActiveFilter("NOSHOW")}
                              >
                                <p>NOSHOW</p>
                                <p className="p_count">
                                  ({TotalReservationListNoShowPerson}P)
                                </p>
                              </div>
                            </div>
                            <div className="filkterActions">
                              <button>
                                <img
                                  src={SearchMenu}
                                  alt="Barley's Dashboard"
                                />
                              </button>

                              <div className="dropdown profileDropdown">
                                <div
                                  className="profileBtnToggle dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <img src={FIlter} alt="Barley's Dashboard" />
                                </div>
                                <ul className="dropdown-menu">
                                  <li></li>
                                  <li>
                                    <a className="dropdown-item">TO CONFIRM </a>
                                    <a className="dropdown-item">TO ARIVAL</a>
                                    <a className="dropdown-item">CANCEL</a>
                                    <a className="dropdown-item">DECLINE</a>
                                  </li>
                                </ul>
                              </div>

                              <button>
                                <img src={PrintList} alt="Barley's Dashboard" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="resrvList">
                          <div className="resrvListContainer">
                            <ul>
                              {filteredData.map((option, index) => {
                                const options_set =
                                  option.booking_status === 0
                                    ? [
                                        { label: "Accept ", value: "accepts" },
                                        { label: "Decline ", value: "decline" },
                                        {
                                          label: "EDIT ",
                                          value: "edit_reservation",
                                        },
                                      ]
                                    : option.booking_status === 1
                                    ? [
                                        {
                                          label: "Arrived ",
                                          value: "selecttable",
                                        },
                                        { label: "No Show ", value: "no_show" },
                                        {
                                          label: "EDIT ",
                                          value: "edit_reservation",
                                        },
                                      ]
                                    : option.booking_status === 2
                                    ? [
                                        {
                                          label: "Released  ",
                                          value: "realeasetable",
                                        },
                                        { label: "Cancel ", value: "cancel" },
                                        {
                                          label: "EDIT ",
                                          value: "edit_reservation",
                                        },
                                      ]
                                    : option.booking_status === 4
                                    ? [
                                        {
                                          label: "Revive",
                                          value: "revive",
                                        },
                                        { label: "Dispute", value: "dispute" },
                                      ]
                                    : [];

                                const selecteddata =
                                  option.booking_status === 0
                                    ? "SELECT"
                                    : option.booking_status === 1
                                    ? "CONFIRM"
                                    : option.booking_status === 2
                                    ? "SEATED"
                                    : option.booking_status === 3
                                    ? "RELEASED"
                                    : option.booking_status === 4
                                    ? "NO SHOW"
                                    : "SELECT";

                                return (
                                  <li key={index}>
                                    <div className="resrvDashList d-xl-flex d-none">
                                      <div className="d-flex">
                                        <div className="resrvDashTIme">
                                          <p>
                                            {formatTimeintotwodigit(
                                              option.book_time
                                            )}
                                          </p>
                                        </div>
                                        <div className="rsrvDashStat_COntainer">
                                          <div className="rsrvDashStat">
                                            {option.booking_status === 0 && (
                                              <>
                                                <h6>{option.guest_name}</h6>
                                                <p>To Confirm</p>
                                              </>
                                            )}

                                            {option.booking_status === 1 && (
                                              <>
                                                <h6 className="personArrive">
                                                  {option.guest_name}
                                                </h6>
                                                <p className="personArrive">
                                                  To Arrive
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 2 && (
                                              <>
                                                <h6 className="personRelease">
                                                  {option.guest_name}
                                                </h6>
                                                <p className="personRelease">
                                                  To Release
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 4 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  {option.guest_name}
                                                </h6>
                                                <p className="personNoShow">
                                                  No Show
                                                </p>
                                              </>
                                            )}
                                            {option.guest_status === 1 && (
                                              <p className="personTag">VIP</p>
                                            )}
                                          </div>
                                          <p>
                                            {option !== null &&
                                            option.table_code_names !==
                                              undefined &&
                                            option.table_code_names !== "" &&
                                            option.table_code_names !== null
                                              ? option.table_code_names.replace(
                                                  /,/g,
                                                  "+"
                                                )
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="rsrvDashActions">
                                        <div className="rsrvDashActionstop">
                                          <div className="countContainer">
                                            <div className="countContainerItem">
                                              <img
                                                style={{ width: "0.7rem" }}
                                                src={Person}
                                                alt="Barley's Dashboard"
                                              />
                                              <p>{option.no_of_guest}P</p>
                                            </div>
                                            <div className="countContainerItem">
                                              <img
                                                src={Child}
                                                alt="Barley's Dashboard"
                                              />
                                              <p>{option.no_of_child}</p>
                                            </div>
                                            <div className="countContainerItem">
                                              <img
                                                style={{ width: "0.8rem" }}
                                                src={Pet}
                                                alt="Barley's Dashboard"
                                              />
                                              <p>{option.no_of_pets}</p>
                                            </div>
                                          </div>
                                          <div className="actionsBtns">
                                            <button
                                              onClick={(e) =>
                                                handleShow(option, "msgshow")
                                              }
                                            >
                                              <img
                                                src={MsgBox}
                                                alt="Barley's Dashboard"
                                              />
                                            </button>
                                            <button
                                              onClick={(e) =>
                                                handleShow(option, "infoshow")
                                              }
                                            >
                                              <img
                                                src={CircleInfo}
                                                alt="Barley's Dashboard"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="rsrvDashActionsBottom mt-1">
                                          <Dropdown
                                            options={options_set}
                                            onChange={(e) => {
                                              handleShow(option, e.value);
                                            }}
                                            placeholder={selecteddata}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="resrvDashList d-xl-none">
                                      <div className="d-flex w-100">
                                        <div className="resrvDashTIme">
                                          <p>
                                            {formatTimeintotwodigit(
                                              option.book_time
                                            )}
                                          </p>
                                        </div>
                                        <div className="rsrvDashStat_COntainer w-100">
                                          <div className="rsrvDashStat">
                                            <div className="d-flex justify-content-between w-100 gap-2">
                                              {option.booking_status === 0 && (
                                                <>
                                                  <h6>{option.guest_name}</h6>
                                                  <p>To Confirm</p>
                                                </>
                                              )}

                                              {option.booking_status === 1 && (
                                                <>
                                                  <h6 className="personArrive">
                                                    {option.guest_name}
                                                  </h6>
                                                  <p className="personArrive">
                                                    To Arrive
                                                  </p>
                                                </>
                                              )}
                                              {option.booking_status === 2 && (
                                                <>
                                                  <h6 className="personRelease">
                                                    {option.guest_name}
                                                  </h6>
                                                  <p className="personRelease">
                                                    To Release
                                                  </p>
                                                </>
                                              )}
                                              {option.booking_status === 4 && (
                                                <>
                                                  <h6 className="personNoShow">
                                                    {option.guest_name}
                                                  </h6>
                                                  <p className="personNoShow">
                                                    No Show
                                                  </p>
                                                </>
                                              )}
                                              {option.guest_status === 1 && (
                                                <p className="personTag">VIP</p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="countContainer justify-content-between w-100 my-1">
                                            <div className="d-flex gap-2">
                                              <div className="countContainerItem">
                                                <img
                                                  style={{ width: "0.7rem" }}
                                                  src={Person}
                                                  alt="Barley's Dashboard"
                                                />
                                                <p>{option.no_of_guest}P</p>
                                              </div>
                                              <div className="countContainerItem">
                                                <img
                                                  src={Child}
                                                  alt="Barley's Dashboard"
                                                />
                                                <p>{option.no_of_child}</p>
                                              </div>
                                              <div className="countContainerItem">
                                                <img
                                                  style={{ width: "0.8rem" }}
                                                  src={Pet}
                                                  alt="Barley's Dashboard"
                                                />
                                                <p>{option.no_of_pets}</p>
                                              </div>
                                            </div>
                                            <div className="actionsBtns">
                                              <button>
                                                <img
                                                  src={MsgBox}
                                                  alt="Barley's Dashboard"
                                                />
                                              </button>
                                              <button onClick={handleInfoShow}>
                                                <img
                                                  src={CircleInfo}
                                                  alt="Barley's Dashboard"
                                                />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center">
                                            <p>
                                              {" "}
                                              {option !== null &&
                                              option.table_code_names !==
                                                undefined &&
                                              option.table_code_names !== "" &&
                                              option.table_code_names !== null
                                                ? option.table_code_names.replace(
                                                    /,/g,
                                                    "+"
                                                  )
                                                : ""}
                                            </p>
                                            <div className="rsrvDashActionsBottom">
                                              <Dropdown
                                                options={options_set}
                                                onChange={(e) => {
                                                  handleShow(option, e.value);
                                                }}
                                                placeholder={selecteddata}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
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
                      BOOKING DATE :{" "}
                      {inputdateformateChange(SelectedData.book_date)}
                    </p>
                    <p>
                      BOOKING TIME :{" "}
                      {formatTimeintotwodigit(SelectedData.book_time)}
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
              {/* Info Modal Pop-up */}
              <Modal
                show={infoShow}
                className="releaseModal"
                centered
                size="lg"
                onHide={handleInfoClose}
              >
                <Modal.Header className="releaseModalHeader"></Modal.Header>
                <Modal.Body className="releaseModalBody">
                  <div className="infoDetalisCOntainer">
                    <div className="infoTIme">
                      <img src={Timetable} alt="Barley's Dashboard" />
                      <p>{formatTimeintotwodigit(SelectedData.book_time)}</p>
                    </div>
                    <div className="infoDetalis">
                      <div className="infoDetalisHead">
                        <p>
                          Booking Date{" "}
                          {inputdateformateChange(SelectedData.entry_date)}
                        </p>
                        <p>
                          Reservation Date{" "}
                          {inputdateformateChange(SelectedData.book_date)}
                        </p>
                      </div>
                      <div className="infoDetalisBody">
                        <p>ID : {SelectedData.counter_invoice}</p>
                        <div className="infoDetalisStatsContainer">
                          <div className="infoDetalisStats">
                            <p className="infoDetalisNaam">
                              {SelectedData.guest_name}
                            </p>
                            {SelectedData.customer_new_old === 0 && (
                              <p className="statusName personTag">NEW</p>
                            )}
                            {SelectedData.booking_status === 0 && (
                              <>
                                <p className="statusName toConfirmTag">
                                  To Confirm
                                </p>
                              </>
                            )}

                            {SelectedData.booking_status === 1 && (
                              <>
                                <p className="statusName personArrive">
                                  To Arrive
                                </p>
                              </>
                            )}
                            {SelectedData.booking_status === 2 && (
                              <>
                                <p className="statusName personRelease">
                                  To Release
                                </p>
                              </>
                            )}
                            {SelectedData.booking_status === 4 && (
                              <>
                                <p className="statusName personNoShow">
                                  No Show
                                </p>
                              </>
                            )}
                            {SelectedData.guest_status === 1 && (
                              <p className="personTag">VIP</p>
                            )}
                          </div>
                          <div className="releaseModalHeadRight">
                            <img src={OrngMsg} alt="Barley's Dashboard" />
                          </div>
                        </div>
                        <p>Contact No.: {SelectedData.guest_mobile_no}</p>
                        <p>{SelectedData.guest_email}</p>
                        <p>
                          Table No.
                          {SelectedData !== null &&
                          SelectedData.table_code_names !== undefined &&
                          SelectedData.table_code_names !== "" &&
                          SelectedData.table_code_names !== null
                            ? SelectedData.table_code_names.replace(/,/g, "+")
                            : ""}
                        </p>

                        <div className="countContainer countModalContainer">
                          <div className="countContainerItem countContainerModalItem">
                            <img src={PersonY} alt="Barley's Dashboard" />
                            <p>{SelectedData.no_of_guest}P</p>
                          </div>
                          <div className="countContainerItem countContainerModalItem">
                            <img src={ChildY} alt="Barley's Dashboard" />
                            <p>{SelectedData.no_of_child} Child</p>
                          </div>
                          <div className="countContainerItem countContainerModalItem">
                            <img src={PetY} alt="Barley's Dashboard" />
                            <p>{SelectedData.no_of_pets} Pet</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className="releaseModalFooter"></Modal.Footer>
              </Modal>

              {/* Modal Notes */}
              <Modal
                show={noteShow}
                className="releaseModal"
                centered
                onHide={handleNoteClose}
              >
                <Modal.Header
                  style={{ border: "none", paddingBottom: "0" }}
                  closeButton
                ></Modal.Header>
                <Modal.Body className="releaseModalBody notesDoby">
                  <div className="booking-container">
                    <div className="guest-mobile-input">
                      <form id="notes_data_search">
                        <div className="input-wrapper w-100">
                          <img
                            src={searchIcn}
                            alt="Guest icon"
                            className="guest-icon"
                          />
                          <label
                            htmlFor="guestMobileInput"
                            className="input-label visually-hidden"
                          >
                            Enter Guest Mobile No.
                          </label>
                          <input
                            minLength={4}
                            maxLength={15}
                            className="trio_no trio_mandatory form-control input-label "
                            onInput={(e) => handleNumbersChange(e)}
                            name="guest_mobile_no"
                            placeholder="Enter Guest Mobile No."
                          />
                          <span className="condition_error"></span>
                        </div>
                      </form>

                      <img
                        src={searchIcn2}
                        alt="Search icon"
                        className="search-icon"
                        onClick={() =>
                          master_data_get_search(
                            "notes_data_search",
                            get_reservation_by_mobile_no
                          )
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    {ReservationListSearch.length > 0 && (
                      <>
                        <div className="booking-details">
                          <div className="booking-details-label">
                            <label>Booking Details</label>{" "}
                            <p>
                              {" "}
                              ID:{ReservationListSearch[0].counter_invoice}
                            </p>
                          </div>
                          <div className="booking-info">
                            <div className="booking-date">
                              {inputdateformateChangeyear(
                                ReservationListSearch[0].book_date
                              )}
                            </div>
                            <div className="booking-time">
                              Booking Time :
                              {formatTimeintotwodigit(
                                ReservationListSearch[0].book_time
                              )}
                            </div>
                            <div className="table-number">
                              {" "}
                              {ReservationListSearch[0] !== null &&
                              ReservationListSearch[0].table_code_names !==
                                undefined &&
                              ReservationListSearch[0].table_code_names !==
                                "" &&
                              ReservationListSearch[0].table_code_names !== null
                                ? ReservationListSearch[0].table_code_names.replace(
                                    /,/g,
                                    "+"
                                  )
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="guest-details">
                          <div className="guest-name-wrapper">
                            <div className="guest-name">
                              {ReservationListSearch[0].guest_name}
                            </div>

                            <div className="guest-count">
                              <p>
                                {ReservationListSearch[0].no_of_guest} Person
                              </p>
                              <p>
                                {" "}
                                {ReservationListSearch[0].no_of_child} Children
                              </p>
                              <p>{ReservationListSearch[0].no_of_pets} Pets</p>
                            </div>
                          </div>
                        </div>

                        <div className="additional-info addtional_notes_css">
                          {ReservationListSearch[0]
                            .reservationnotesinformation &&
                            ReservationListSearch[0].reservationnotesinformation
                              .length > 0 && (
                              <div className="info-header">
                                <div className="info_header_container">
                                  <div>
                                    <img
                                      src={OrngMsg}
                                      alt="Calendar icon"
                                      className="calendar-icon"
                                    />
                                  </div>
                                  <div className="w-100">
                                    {ReservationListSearch[0]
                                      .reservationnotesinformation &&
                                      ReservationListSearch[0].reservationnotesinformation.map(
                                        (note, indexsss) => (
                                          <>
                                            <div
                                              key={indexsss}
                                              className="info-header-left"
                                            >
                                              <div className="staff-info">
                                                <img
                                                  src={
                                                    StaffImageLinkData +
                                                    note.staff_image
                                                  }
                                                  onError={(e) =>
                                                    (e.target.src = userIcn)
                                                  }
                                                  alt="Staff avatar"
                                                  className="staff-avatar"
                                                />
                                                <div className="staff-name">
                                                  {note.staff_name}
                                                </div>
                                              </div>
                                              <div className="booking-datetime">
                                                {inputdateformateChange(
                                                  note.entry_date
                                                )}{" "}
                                                <span
                                                  style={{
                                                    color:
                                                      "rgba(245, 134, 52, 1)",
                                                  }}
                                                >
                                                  I
                                                </span>{" "}
                                                {formatTimeFormatcustom(
                                                  note.entry_date
                                                )}{" "}
                                              </div>
                                            </div>
                                            <div className="info-header-right">
                                              <div className="note-item">
                                                {note.note_details}
                                              </div>
                                            </div>
                                          </>
                                        )
                                      )}
                                    <div className="add-notes-button2">
                                      <img
                                        src={userIcn}
                                        alt="Add notes icon"
                                        className="add-notes-icon"
                                      />
                                      <form id="notes_data_search_form_data">
                                        <input
                                          className="w-100"
                                          type="text"
                                          name="add_note_to_guest"
                                          minLength={4}
                                          maxLength={100}
                                          onInput={handleIaphabetnumberChange}
                                          placeholder="Type your note..."
                                        />
                                        <input
                                          className="w-100 hidden"
                                          type="text"
                                          name="guest_mobile_no"
                                          defaultValue={
                                            ReservationListSearch[0]
                                              .guest_mobile_no
                                          }
                                          minLength={4}
                                          maxLength={100}
                                        />
                                      </form>
                                      <button
                                        className="ad"
                                        type="button"
                                        onClick={() =>
                                          master_data_get_search(
                                            "notes_data_search_form_data",
                                            get_reservation_by_mobile_no
                                          )
                                        }
                                      >
                                        <div className="add-notes-text">
                                          Add Notes
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          {ReservationListSearch[0]
                            .reservationnotesinformation &&
                            ReservationListSearch[0].reservationnotesinformation
                              .length === 0 && (
                              <div className="add-notes-button2">
                                <img
                                  src={OrngMsg}
                                  alt="Add notes icon"
                                  className="add-notes-icon"
                                />

                                <form id="notes_data_search_form_data">
                                  <input
                                    className="w-100"
                                    type="text"
                                    name="add_note_to_guest"
                                    minLength={4}
                                    maxLength={100}
                                    onInput={handleIaphabetnumberChange}
                                    placeholder="Type your note..."
                                  />
                                  <input
                                    className="w-100 hidden"
                                    type="text"
                                    name="guest_mobile_no"
                                    defaultValue={
                                      ReservationListSearch[0].guest_mobile_no
                                    }
                                    minLength={4}
                                    maxLength={100}
                                  />
                                </form>
                                <button
                                  className="ad"
                                  onClick={() =>
                                    master_data_get_search(
                                      "notes_data_search_form_data",
                                      get_reservation_by_mobile_no
                                    )
                                  }
                                >
                                  ADD
                                </button>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </Modal.Body>
              </Modal>
              {/*print modal*/}
              <Modal
                show={noteShow2}
                className="releaseModal"
                centered
                onHide={handleNoteClose2}
              >
                <Modal.Header
                  style={{ border: "none", paddingBottom: "0" }}
                  closeButton
                ></Modal.Header>
                <Modal.Body className="releaseModalBody notesDoby">
                  <div className="booking-container">
                    <>
                      <div className="booking-details">
                        <div className="booking-details-label">
                          <label>Booking Details</label>{" "}
                          <p> ID:{SelectedData.counter_invoice}</p>
                        </div>
                        <div className="booking-info">
                          <div className="booking-date">
                            {inputdateformateChange(SelectedData.book_date)}
                          </div>
                          <div className="booking-time">
                            Booking Time :{" "}
                            {formatTimeintotwodigit(SelectedData.book_time)}
                          </div>
                          <div className="table-number">
                            {SelectedData !== null &&
                            SelectedData.table_code_names !== undefined &&
                            SelectedData.table_code_names !== "" &&
                            SelectedData.table_code_names !== null
                              ? SelectedData.table_code_names.replace(/,/g, "+")
                              : ""}
                          </div>
                        </div>
                      </div>

                      <div className="guest-details">
                        <div className="guest-name-wrapper">
                          <div className="guest-name">
                            {SelectedData.guest_name}
                          </div>

                          <div className="guest-count">
                            <p>{SelectedData.no_of_guest} Person</p>
                            <p> {SelectedData.no_of_child} Children</p>
                            <p>{SelectedData.no_of_pets} Pets</p>
                          </div>
                        </div>
                      </div>
                      {SelectedData.reservationnotesinformation &&
                        SelectedData.reservationnotesinformation.length > 0 && (
                          <div className="additional-info addtional_notes_css">
                            <div className="info-header">
                              <div className="info_header_container">
                                <div>
                                  <img
                                    src={OrngMsg}
                                    alt="Calendar icon"
                                    className="calendar-icon"
                                  />
                                </div>

                                <div className="w-100">
                                  {SelectedData.reservationnotesinformation &&
                                    SelectedData.reservationnotesinformation.map(
                                      (note, indexsss) => (
                                        <>
                                          <div
                                            key={indexsss}
                                            className="info-header-left"
                                          >
                                            <div className="staff-info">
                                              <img
                                                src={
                                                  StaffImageLinkData +
                                                  note.staff_image
                                                }
                                                onError={(e) =>
                                                  (e.target.src = userIcn)
                                                }
                                                alt="Staff avatar"
                                                className="staff-avatar"
                                              />
                                              <div className="staff-name">
                                                {note.staff_name}
                                              </div>
                                            </div>
                                            <div className="booking-datetime">
                                              {inputdateformateChange(
                                                note.entry_date
                                              )}{" "}
                                              <span
                                                style={{
                                                  color:
                                                    "rgba(245, 134, 52, 1)",
                                                }}
                                              >
                                                I
                                              </span>{" "}
                                              {formatTimeFormatcustom(
                                                note.entry_date
                                              )}{" "}
                                            </div>
                                          </div>
                                          <div className="info-header-right">
                                            <div className="note-item">
                                              {note.note_details}
                                            </div>
                                          </div>
                                        </>
                                      )
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </>
                  </div>
                </Modal.Body>
              </Modal>
              <Modal
                show={modalShow1}
                className="releaseModal"
                centered
                onHide={handleClose1}
              >
                <Modal.Header className="releaseModalHeader"></Modal.Header>
                <Modal.Body className="releaseModalBody">
                  <div className="releaseModalHead">
                    <div className="releaseModalHeadLeft">
                      <img src={DoneGreen} alt="Barley's Dashboard" />
                      <h5>
                        Release Table{" "}
                        <span>&nbsp;{SelectedData.table_code_names}</span>
                      </h5>
                    </div>
                    <div className="releaseModalHeadRight">
                      <img src={OrngMsg} alt="Barley's Dashboard" />
                    </div>
                  </div>
                  <div className="releaseModalDetails">
                    <h5>{SelectedData.guest_name}</h5>
                    <p>
                      BOOKING DATE :{" "}
                      {inputdateformateChange(SelectedData.book_date)}
                    </p>
                    <p>
                      BOOKING TIME :{" "}
                      {formatTimeintotwodigit(SelectedData.book_time)}
                    </p>
                    <div className="countOfGuests">
                      <p>{SelectedData.no_of_guest} PERSON</p>
                      <p>{SelectedData.no_of_child} CHILDS</p>
                      <p>{SelectedData.no_of_pets} PETS</p>
                    </div>
                  </div>
                  <form id="update_realse_data">
                    <div className="update_realse_dataContainer">
                      <div className="inpContainer m-0">
                        <div className="resturant_icon image_icon_position image_icon_position1">
                          <input
                            type="text"
                            id="payout_amt"
                            name="payout_amt"
                            tabIndex="1"
                            placeholder={"Enter Bill Amount"}
                            minLength={3}
                            maxLength={10}
                            className="  form-control  input_field_custom1 "
                            onInput={handleNumbersDecimalChange}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                      <div className="inpContainer m-0">
                        <div className="resturant_icon image_icon_position image_icon_position1">
                          <input
                            type="text"
                            id="invoice_no_bill"
                            name="invoice_no_bill"
                            tabIndex="1"
                            placeholder={"Enter Invoice No Bill"}
                            minLength={3}
                            maxLength={30}
                            className="  form-control  input_field_custom1 "
                            onInput={handleAlphabetsNumberWithoutSpaceChange}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer className="releaseModalFooter">
                  <Button
                    className="releaseModalBtn Release_Table"
                    onClick={() =>
                      handleSaveChangesdynamic_relase(
                        "update_realse_data",
                        table_release_from_reservation
                      )
                    }
                  >
                    RELEASE TABLE
                  </Button>
                  <Button
                    className="editNowBtn Edit_Now"
                    onClick={handleClose1}
                  >
                    <label style={{ cursor: "pointer" }}>Cancel</label>
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
