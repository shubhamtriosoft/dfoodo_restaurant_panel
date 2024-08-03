import { useEffect, useState } from "react";
import { fabric } from "fabric";
import back_reservation from "../assets/back_reservation.png";
import SearchIcon from "../assets/searchNew1.svg";
import PersonWB from "../assets/personWB.svg";
import DoneGreen from "../assets/doneGreen.svg";
import OrngMsg from "../assets/orngMsg.svg";
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
} from "../ServiceConnection/serviceconnection.js";
import {
  computeTodayDate,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  inputdateformateChange,
  formatTimeintotwodigit,
  make_image_from_letter,
  handleNumbersDecimalChange,
  handleAlphabetsNumberWithoutSpaceChange,
} from "../CommonJquery/CommonJquery.js";
import { Modal, Button } from "react-bootstrap";
import { AllotcateArea_text } from "../CommonJquery/WebsiteText.js";

let canvas;
let PersonWantToSeat = 5;
let PersonWantToSeat_seated = PersonWantToSeat;
let SelectedTablePersonCount = 0;
export default function AllotcateArea() {
  let reservation_date = computeTodayDate();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [SelectedTableForBooking, setSelectedTableForBooking] = useState([]);
  const [TotalReservationList, setTotalReservationList] = useState([]);
  const [TotalReservationListPerson, setTotalReservationListPerson] =
    useState(0);
  const [TotalReservationListNext, setTotalReservationListNext] = useState([]);
  const [TotalReservationListNextPerson, setTotalReservationListNextPerson] =
    useState(0);
  const [TotalReservationListConfirm, setTotalReservationListConfirm] =
    useState([]);
  const [
    TotalReservationListConfirmPerson,
    setTotalReservationListConfirmPerson,
  ] = useState(0);
  const [TotalReservationListCurrent, setTotalReservationListCurrent] =
    useState([]);
  const [
    TotalReservationListCurrentPerson,
    setTotalReservationListCurrentPerson,
  ] = useState(0);
  const [filteredData, setfilteredData] = useState([]);
  const [FloorList, setFloorList] = useState([]);
  const [SelectedFloorList, setSelectedFloorList] = useState([]);
  const [SelectedReservationBooking, setSelectedReservationBooking] = useState(
    []
  );
  const [TotalTable, setTotalTable] = useState(0);
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);

  const [TotalCombinationTable, setTotalCombinationTable] = useState([]);

  const [AreaID, setAreaID] = useState("");
  useEffect(() => {}, [SelectedTableForBooking]);

  useEffect(() => {
    master_data_get_mananegement(reservation_date);

    return () => {};
  }, []);

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
    fd.append("reservation_date", "0");
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
          setSelectedReservationBooking(
            Response.data.message.data_dining_area5[0]
          );
          PersonWantToSeat =
            Response.data.message.data_dining_area5[0].no_of_guest;
          PersonWantToSeat_seated =
            Response.data.message.data_dining_area5[0].no_of_guest;
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
          setTotalReservationList(Response.data.message.data_reservation_data);
          setfilteredData(Response.data.message.data_reservation_data);
          setFloorList(Response.data.message.data_floor_list);
          if (Response.data.message.data_floor_list.length > 0) {
            setSelectedFloorList(
              Response.data.message.data_floor_list[0].primary_id
            );
          }
          let totalperson = 0;
          let totalpersonconfirm = 0;
          Response.data.message.data_reservation_data.forEach((subObj) => {
            console.log();
            totalperson += subObj.no_of_guest;
            if (subObj.booking_status === 1) {
              totalpersonconfirm += subObj.no_of_guest;
            }
          });
          setTotalReservationListPerson(totalperson);
          setTotalReservationListConfirmPerson(totalpersonconfirm);
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };

  const handleClose1 = () => setModalShow1(false);
  const handleClose = () => setModalShow(false);
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
        show_msg: "No Show Table",
        button_name: "No Show",
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
        show_msg: "Accept Table",
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
        booking_status: "1",
        guest_name: data_call.guest_name,
        show_msg: "Decline Table",
        button_name: "Decline",
        edit_click: false,
        button_name_next: "Cancel",
        button_class: "",
        comfirm_booking: false,
      });
      setModalShow(true);
    } else if (click_type === "selecttable") {
      setSelectedData(data_call);
      master_data_get("", "", "3", SelectedFloorList, data_call.primary_id);
    } else if (click_type === "realeasetable") {
      console.log(data_call);
      setSelectedData(data_call);
      setModalShow1(true);
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
    setAllActive(TabId === "All");
    setNextActive(TabId === "Next");
    setConfirmActive(TabId === "Confirm");
    setCurrentActive(TabId === "Current");
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
  return (
    <div>
      <div className="overlayNew"></div>
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="row m-0">
        <div className="col-sm-8">
          {/* {SelectedReservationBooking && (
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
          )} */}

          <canvas id="canvas" width={757} height={581} />
        </div>
        <div className="col-sm-4 paddingLeft0 max_height_500px">
          <div className="editNewAreaSidebar editNewAreaSidebarAllot ">
            <div className="Righ-side-bar">
              <div className="right">
                <div className="Allotefilter">
                  <h6>{AllotcateArea_text.filters_text}</h6>
                  <div className="filterHead">
                    <div className="filterDiv1">
                      <select>
                        <option value="To Confirm">
                          {AllotcateArea_text.to_confirm}
                        </option>
                        <option value="To Confirm">
                          {AllotcateArea_text.Current}
                        </option>
                        <option value="To Confirm">
                          {AllotcateArea_text.Arrived}
                        </option>
                        <option value="To Confirm">
                          {AllotcateArea_text.No_show}
                        </option>
                      </select>
                    </div>
                    <div className="filterDiv1">
                      <input type="text" placeholder="Search Guest" />
                      <img src={SearchIcon} alt="Barley's Dashboard" />
                    </div>
                  </div>
                  {/* <div className="filterBody">
                    <div className="row m-0 p-0">
                      <div className="col-md-6 mb-1 p-0">
                        <div
                          className={`rsrvFilterTab ${
                            allActive ? "rsrvFilterTabActive" : ""
                          }`}
                          onClick={() => toggleActiveFilter("All")}
                        >
                          <p>All (39P)</p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1">
                        <div
                          className={`rsrvFilterTab ${
                            nextActive ? "rsrvFilterTabActive" : ""
                          }`}
                          onClick={() => toggleActiveFilter("Next")}
                        >
                          <p>Next (39P)</p>
                        </div>
                      </div>
                      <div className="col-md-6 p-0">
                        <div
                          className={`rsrvFilterTab ${
                            confirmActive ? "rsrvFilterTabActive" : ""
                          }`}
                          onClick={() => toggleActiveFilter("Confirm")}
                        >
                          <p>To confirm (10P)</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className={`rsrvFilterTab ${
                            currentActive ? "rsrvFilterTabActive" : ""
                          }`}
                          onClick={() => toggleActiveFilter("Current")}
                        >
                          <p>Current (3P)</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                <div className="resrvList">
                  <div className="resrvListContainer">
                    <ul>
                      {filteredData.map((option, index) => (
                        <li className="resrvListItemList" key={index}>
                          <div className="col-xl-10 m-auto">
                            <div className="resrvListItem">
                              <img
                                src={make_image_from_letter(option.guest_name)}
                                alt="Barley's Dashboard"
                              />
                              <div className="resrvListDetails">
                                <h6>{option.guest_name}</h6>
                                <div className="resrvListDetailsText">
                                  <p>
                                    {inputdateformateChange(option.book_date)}{" "}
                                    at{" "}
                                    {formatTimeintotwodigit(option.book_time)}{" "}
                                    for
                                  </p>
                                  <p>{option.no_of_guest}P</p>
                                </div>
                                <div className="historyTableRowText historyActions">
                                  <div className="historyActionsBtns mb-2">
                                    {option.booking_status === 0 && (
                                      <button
                                        className="acceptResrv Accept_Reservation"
                                        onClick={(e) =>
                                          handleShow(option, "accepts")
                                        }
                                      >
                                        {AllotcateArea_text.accept}
                                      </button>
                                    )}
                                    {option.booking_status === 1 &&
                                      (SelectedReservationBooking &&
                                      PersonWantToSeat_seated < 1 &&
                                      SelectedReservationBooking.primary_id ===
                                        option.primary_id ? (
                                        <button
                                          className="arrivedResrv Select_Table"
                                          onClick={(e) =>
                                            handleShow(option, "confirmation")
                                          }
                                        >
                                          {AllotcateArea_text.confirm}
                                        </button>
                                      ) : (
                                        <button
                                          className="arrivedResrv Select_Table"
                                          onClick={(e) =>
                                            handleShow(option, "selecttable")
                                          }
                                        >
                                          {AllotcateArea_text.Select_Table}
                                        </button>
                                      ))}

                                    {option.booking_status === 2 && (
                                      <button
                                        className="cancelRsrv Release_Table"
                                        onClick={(e) =>
                                          handleShow(option, "realeasetable")
                                        }
                                      >
                                        {AllotcateArea_text.release}
                                      </button>
                                    )}

                                    {option.booking_status === 0 && (
                                      <button
                                        className="noShowActiveResrv"
                                        onClick={(e) =>
                                          handleShow(option, "decline")
                                        }
                                      >
                                        {AllotcateArea_text.decline}
                                      </button>
                                    )}

                                    {option.booking_status !== 0 &&
                                      option.booking_status !== 4 &&
                                      option.booking_status !== 3 &&
                                      option.booking_status !== 5 && (
                                        <button
                                          className="noShowActiveResrv"
                                          onClick={(e) =>
                                            handleShow(option, "no_show")
                                          }
                                        >
                                          {AllotcateArea_text.No_show}
                                        </button>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
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
                Release Table <span>&nbsp;{SelectedData.table_code_names}</span>
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
          <Button className="editNowBtn Edit_Now" onClick={handleClose1}>
            <label style={{ cursor: "pointer" }}>Cancel</label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
