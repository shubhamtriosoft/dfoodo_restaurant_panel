import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import DoneGreen from "../assets/doneGreen.svg";
import OrngMsg from "../assets/orngMsg.svg";
import LeftArrow from "../assets/lrgy.svg";
import RightArrow from "../assets/rightArwD.svg";
import PrintList from "../assets/printOrang2.svg";
import SearchMenu from "../assets/manage_search.svg";
import SearchImg from "../assets/searchBlackHead.svg";
import FIlter from "../assets/filteMixer.svg";
import CircleInfo from "../assets/infoCircle.svg";
import EditBlack from "../assets/editBlack.svg";
import refreashAuto from "../assets/autoRefreash.svg";
import MsgBox from "../assets/orngMsg.svg";
import Person from "../assets/personform.svg";
import Child from "../assets/greyChild.svg";
import Pet from "../assets/greypets.svg";
import PersonY from "../assets/account_circle.svg";
import ChildY from "../assets/escalator_warning.svg";
import PetY from "../assets/pets.svg";
import Timetable from "../assets/time_tableGrey.svg";
import { Dropdown } from "primereact/dropdown";
import html2canvas from "html2canvas";
import BorderedGlobe from "../assets/language02.svg";
import BorderedOn from "../assets/power_settings_new02.svg";
import CrossedGlobe from "../assets/crossedGlobe02.svg";
import CrossedOn from "../assets/offPowe.svg";
import Focus from "../assets/focus.png";
import $ from "jquery";
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
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  createImageWithTextGroup,
  white_main,
  blocked_main,
  runining_table,
  ready_for_allot,
  selected_table,
  scrollLimitCanvas,
  initialViewportTransform,
} from "../CommonJquery/TableAssignment.js";
import {
  server_post_data,
  get_all_table_position2,
  allot_table_to_reservation,
  get_all_reservation_date,
  get_all_reservation_date_notification,
  update_action_reservation,
  table_release_from_reservation,
  get_reservation_by_mobile_no,
  update_calender_seat_status,
  check_no_show_review,
  get_all_notes_by_id,
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
  inputdateformateChangeyear,
  handleSuccess,
  computeFutureDate,
} from "../CommonJquery/CommonJquery.js";
import { Modal, Button } from "react-bootstrap";
import Header from "./Header";
import Loader from "./Loader.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import searchIcn from "../assets/searchgreeey.svg";
import searchIcn2 from "../assets/searchOrang.svg";
import userIcn from "../assets/person_pin_circle.svg";
import "./Css/Dashboard.css";
import { firebaseService } from "../FirebaseConnection/FirebaseService"; // Adjust the path as needed
import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { retrieveData } from "../LocalConnection/LocalConnection.js";
let canvas;
let PersonWantToSeat = 0;
let PersonWantToSeat_seated = PersonWantToSeat;
let SelectedTablePersonCount = 0;
let select_option_str = "";
let tablearrayRED; //code by mk
let reservationTableFree = {}; //code by mk
function Dashboard() {
  const default_restaurant_id = retrieveData("default_restaurant_id");
  let reservation_date = computeTodayDate();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [SelectedTableForBooking, setSelectedTableForBooking] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [TotalReservationListFull, setTotalReservationListFull] = useState([]);
  const [ShowHideOption, setShowHideOption] = useState(0);
  const [TotalReservationListRequest, setTotalReservationListRequest] =
    useState([]);
  const [ReservationListSearch, setReservationListSearch] = useState([]);
  const [NotAllowMin, setNotAllowMin] = useState(15);
  const [NoShowMin, setNoShowMin] = useState(30);
  const [nonotessearch, setnonotessearch] = useState("");
  const [total_start_stop_status_status, settotal_start_stop_status_status] =
    useState(BorderedGlobe);
  const [
    total_start_stop_status_status_data,
    settotal_start_stop_status_status_data,
  ] = useState("on");
  const [
    total_online_booking_status_status_data,
    settotal_online_booking_status_status_data,
  ] = useState("on");
  const [total_online_booking_status, settotal_online_booking_status] =
    useState(BorderedOn);
  const [searchfilter, setSearchFilter] = useState("");
  const admin_image = retrieveData("admin_image");
  const [
    TotalReservationListOngoingPerson,
    setTotalReservationListOngoingPerson,
  ] = useState(0);
  const [SelectedDataDetails, setSelectedDataDetails] = useState([]);
  const [TotalReservationListPerson, setTotalReservationListPerson] =
    useState(0);
  const [selectedSuggestionset, setSelectedSuggestionset] = useState(-1); // State to keep track of selected suggestion

  const [
    TotalReservationListNoShowPerson,
    setTotalReservationListNoShowPerson,
  ] = useState(0);
  const [
    TotalReservationListRequestPerson,
    setTotalReservationListRequestPerson,
  ] = useState(0);
  const [TotalReservationListNextPerson, setTotalReservationListNextPerson] =
    useState(0);
  const [filteredData, setfilteredData] = useState([]);
  const [filteredDataPre, setfilteredDataPre] = useState([]);
  const [FloorList, setFloorList] = useState([]);
  const [SelectedFloorListID, setSelectedFloorListID] = useState([]);
  const [SelectedReservationBooking, setSelectedReservationBooking] = useState(
    []
  );
  const [CanvasManupult, setCanvasManupult] = useState([]);
  const [BlankTotalTable, setBlankTotalTable] = useState(0);
  const [RunningTotalTable, setRunningTotalTable] = useState(0);
  const [ReservedTotalTable, setReservedTotalTable] = useState(0);
  const [BlockTotalTable, setBlockTotalTable] = useState(0);
  const [SelectedData, setSelectedData] = useState([]);

  const [allActive, setAllActive] = useState(true);
  const [nextActive, setNextActive] = useState(false);
  const [confirmActive, setConfirmActive] = useState(false);
  const [currentActive, setCurrentActive] = useState(false);
  const [currentActiveRequest, setCurrentActiveRequest] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [infoShow, setInfoShow] = useState(false);
  const [noteShow, setNoteShow] = useState(false);
  const [noteShow2, setNoteShow2] = useState(false);
  const [startDate, setStartDate] = useState(reservation_date);
  const [TotalCombinationTable, setTotalCombinationTable] = useState([]);

  const [isSearchlist, setSearchlist] = useState(-1);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [AreaID, setAreaID] = useState("");
  const [ReservationId, setReservationId] = useState(""); //code by mk

  const [showModalCalender, setShowModalCalender] = useState(false);
  const [testshowdata, settestshowdata] = useState({
    show_text: "",
    click_type: "",
    booking_status: "",
    special_date: "",
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef(null);
  const lastZoom = useRef(1);

  useEffect(() => {}, [SelectedTableForBooking]);
  useEffect(() => {}, [filteredData]);
  useEffect(() => {}, [SelectedData]);
  useEffect(() => {}, [startDate]);
  useEffect(() => {}, [SelectedFloorListID]);
  useEffect(() => {}, [isSearchlist]);
  useEffect(() => {}, [
    BlankTotalTable,
    RunningTotalTable,
    ReservedTotalTable,
    BlockTotalTable,
  ]);
  useEffect(() => {
    master_data_get_mananegement(reservation_date);

    return () => {};
  }, []);

  useEffect(() => {
    //code by mk for showing suggetion
    let selectcomb = "";
    let table_name_show = "";

    if (SelectedTableForBooking.length > 0) {
      SelectedTableForBooking.forEach((item, i) => {
        selectcomb += item.table_id + ","; //make list of selected table
        table_name_show += item.table_name + "+"; //make list of selected table
      });
      selectcomb = selectcomb.slice(0, -1); //for trim last ,
      table_name_show = table_name_show.slice(0, -1); //for trim last ,
    }

    let show_text = "Table Sug.";
    const sortAndStringify = (arr) => arr.split(",").sort().join(",");
    if (TotalCombinationTable != null) {
      TotalCombinationTable.forEach((patient, i) => {
        if (
          sortAndStringify(patient.table_code_ids) ===
          sortAndStringify(selectcomb)
        ) {
          show_text =
            patient.table_code.replace(/,/g, "+") +
            " " +
            patient.min_person +
            "-" +
            patient.max_person +
            "P";
        }
      });
    }
    setSelectedSuggestionset(show_text);
  }, [SelectedTableForBooking]);

  const openModalCalender = (data_call, click_type, on_off) => {
    let show_text_data = "";
    let booking_status = "0";
    if (click_type === "1") {
      if (on_off === "on") {
        show_text_data = `Are you sure want to Stop Online Booking?`;
        booking_status = "1";
      } else {
        show_text_data = `Are you sure want to Start Online Booking?`;
        booking_status = "0";
      }
    } else if (click_type === "2") {
      if (on_off === "on") {
        show_text_data = `Are you sure you want to close the restaurant?`;
        booking_status = "1";
      } else {
        show_text_data = `Are you sure you want to Open the restaurant?`;
        booking_status = "0";
      }
    }
    settestshowdata({
      show_text: show_text_data,
      click_type: click_type,
      booking_status: booking_status,
      special_date: data_call.dateString,
    });

    setShowModalCalender(true);
  };

  const closeModalCalender = () => {
    setShowModalCalender(false);
  };

  const close_popup_update_query = () => {
    master_data_action_update_Calender(
      testshowdata.special_date,
      testshowdata.click_type,
      testshowdata.booking_status
    );
  };

  const master_data_action_update_Calender = async (
    special_date,
    click_type,
    booking_status
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("special_date", $("#reservation_date_make").val());
    fd.append("click_type", click_type);
    fd.append("booking_status", booking_status);
    await server_post_data(update_calender_seat_status, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          closeModalCalender();
          handleSuccess(Response.data.message);
          if (click_type === "1") {
            if (Number(booking_status) === 1) {
              settotal_start_stop_status_status(CrossedGlobe);
              settotal_start_stop_status_status_data("off");
            } else {
              settotal_start_stop_status_status(BorderedGlobe);
              settotal_start_stop_status_status_data("on");
            }
          }
          if (click_type === "2") {
            if (Number(booking_status) === 1) {
              settotal_online_booking_status(CrossedOn);
              settotal_online_booking_status_status_data("off");
            } else {
              settotal_online_booking_status(BorderedOn);
              settotal_online_booking_status_status_data("on");
            }
          }
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const SelectedFloorDate = (datedata) => {
    setSelectedFloorListID(datedata);
    master_data_get("", "", "3", datedata, "0");
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

    let click_yes = true;

    // if (click_type === "min") {
    //   const date1 = new Date();
    //   date1.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC
    //   const date2 = new Date(change_date);
    //   date2.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    //   if (date1 > date2) {
    //     click_yes = false;
    //   }
    // }
    if (change_date === computeTodayDate()) {
      $("#today_text_show").addClass("primarycode");
      $("#today_text_show").removeClass("graycode");
    } else {
      $("#today_text_show").removeClass("primarycode");
      $("#today_text_show").addClass("graycode");
    }
    if (click_yes) {
      reservation_date = change_date;
      setStartDate(change_date);
      $("#reservation_date_make").val(change_date);
      master_data_get_mananegement(change_date);
    }
  };

  const selectfromsuggestion = (data_call, click_type, primary_id, indx) => {
    //code by mk
    let slcttbl = "";
    if (click_type === "1") {
      if (SelectedTableForBooking.length > 0) {
        SelectedTableForBooking.forEach((item, i) => {
          //for unselected table
          console.log(CanvasManupult[item.table_id]);
          data_update_canvas(
            CanvasManupult[item.table_id]["canvas_list"],
            0,
            click_type
          );
          slcttbl = item.table_id;
        });
      }
      if (slcttbl != primary_id) {
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

  const printpage = () => {
    const sectionToPrint = document.getElementById("sectionToPrint");

    html2canvas(sectionToPrint).then((canvas_dd) => {
      // Convert the captured section to an image URL
      const imgUrl = canvas_dd.toDataURL("image/png");
      let printWindow;
      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Create a new window to print the image
        printWindow = window.open("");
        printWindow.document.write(
          `<img src="${imgUrl}" style="width:100%;"/>`
        );
        printWindow.document.close();

        // Trigger the print dialog
        printWindow.print();

        // Remove the image from the new window after printing
        printWindow.addEventListener("afterprint", () => {
          printWindow.close();
        });
      };
      img.src = imgUrl;
      img.style.width = "100%";
      img.style.display = "none"; // Hide the image element
      document.body.appendChild(img); // Append the image to load it
    });
  };
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
    //return 0;
    let split_data = obj.globalCompositeOperation.split("@@@");
    let table_id_dd = Number(split_data[0]);
    let table_name_dd = obj._objects[1].text;
    let available_online_dd = split_data[1];
    let min_person_dd = Number(split_data[2]);
    let preferred_person_dd = Number(split_data[3]);
    let max_person_dd = Number(split_data[4]);
    let priority_level_dd = split_data[5];
    //return 0;
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
                        currnttbl.table_id != table_id_dd
                      ) {
                        samegroup = 1;
                      }
                    });
                    if (samegroup == 0) {
                      console.log("shubham jain 1");
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

          obj.getObjects().forEach(async (subObj) => {
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

          //canvas.renderAll();
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
                      if (samegroup == 0) {
                        console.log("shubham jain 4");
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
            /********** code by mk for red table select start ***********/

            SelectedTablePersonCount =
              Number(SelectedTablePersonCount) + preferred_person_dd;
            PersonWantToSeat_seated =
              Number(PersonWantToSeat_seated) - max_person_dd;
            obj.getObjects().forEach((subObj) => {
              if (subObj.fill !== white_main) {
                console.log("shubham jain 6");
                SvgColorChange(subObj, selected_table, () => {
                  canvas.renderAll(); // Render the canvas after all objects are processed
                  subObj.set({ fill: selected_table });
                });
              }
            });
            canvas.renderAll(); // Render the canvas after all objects are processed
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
      let canvasSize = {
        width: 1200,
        height: 700,
      };
      // canvas container dimensions
      let containerSize = {
        width: document.getElementById("canvas-container").offsetWidth,
        height: document.getElementById("canvas-container").offsetHeight,
      };
      canvas.setDimensions(containerSize);
      // how you want to handle your zoom is really application dependant.
      let scaleRatio =
        Math.min(
          containerSize.width / canvasSize.width,
          containerSize.height / canvasSize.height
        ) + 0.3;
      canvas.setZoom(scaleRatio);
      canvas.selection = false;
      canvas.renderAll();
      canvas.on("mouse:down", function (e) {
        const target = e.target;
        isDragging.current = true;
        const pointer = canvas.getPointer(e.e);
        dragStart.current = { x: pointer.x, y: pointer.y };
        if (e.button === 1) {
          // console.log("left click");
        }
        if (encodeURI.button === 2) {
          console.log("middle click");
        }
        if (e.button === 3) {
          console.log("right click");
        }
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

      canvas.on("touch:gesture", (event) => {
        event.preventDefault();

        if (event.e.touches && event.e.touches.length === 2) {
          const touch1 = event.e.touches[0];
          const touch2 = event.e.touches[1];
          const distance = Math.sqrt(
            (touch1.clientX - touch2.clientX) ** 2 +
              (touch1.clientY - touch2.clientY) ** 2
          );

          if (initialPinchDistance.current === null) {
            initialPinchDistance.current = distance;
          } else {
            const zoomFactor = distance / initialPinchDistance.current;
            canvas.zoomToPoint(
              { x: event.self.x, y: event.self.y },
              lastZoom.current * zoomFactor
            );
          }
        }
      });

      canvas.on("touch:drag", (options) => {
        if (options.e.touches && options.e.touches.length === 1) {
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
  function resetCanvasPosition() {
    canvas.viewportTransform = initialViewportTransform;
    canvas.requestRenderAll();
  }

  const plus_min_canvas = (action) => {
    let delta;
    if (action === "plus") {
      delta = 100; // Or any positive value to signify zooming in
    } else {
      delta = -100; // Or any negative value to signify zooming out
    }

    const zoom = canvas.getZoom();
    let newZoom = zoom;

    if (delta > 0) {
      newZoom *= 0.999 ** delta;
    } else {
      newZoom /= 0.999 ** Math.abs(delta);
    }

    // Adjust zoom limits
    if (newZoom > 1.2) newZoom = 1.2;
    if (newZoom < 0.8) newZoom = 0.8;

    canvas.zoomToPoint(
      { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 },
      newZoom
    );
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
          canvas.add(group);
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
          canvas.add(group);
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

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    reservation_id,
    arrived_click = 0
  ) => {
    setshowLoaderAdmin(true);
    PersonWantToSeat = 0;
    PersonWantToSeat_seated = 0;
    SelectedTablePersonCount = 0;
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);

    fd.append("reservation_date", reservation_date);
    if ($(".canvasColumn").hasClass("selectedOverlay")) {
      //code by mk
      console.log(ReservationId);
      if (ReservationId) {
        fd.append("reservation_id", ReservationId);
      } else {
        fd.append("reservation_id", reservation_id);
      }
      if (arrived_click == 1) {
        call_id = 0;
      }
    } else {
      fd.append("reservation_id", reservation_id);
    }
    fd.append("call_id", call_id);
    if (canvas) {
      canvas.dispose();
    }
    setSelectedTableForBooking([]);
    setCanvasManupult(null);
    // call_id = 2;
    setTotalCombinationTable(null);
    await server_post_data(get_all_table_position2, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_dining_area2.length > 0) {
            setAreaID(Response.data.message.data_dining_area2[0].primary_id);
            setSelectedFloorListID(
              Response.data.message.data_dining_area2[0].primary_id
            ); //code by mk
          }
          let table_ids = "";
          let block_table = 0;
          let blank_table = 0;
          let running_table = 0;
          let reseved_table = 0;
          if (Response.data.message.data_dining_area5.length > 0) {
            setSelectedReservationBooking(
              Response.data.message.data_dining_area5[0]
            );
            table_ids =
              Response.data.message.data_dining_area5[0].table_code_ids;
            PersonWantToSeat =
              Response.data.message.data_dining_area5[0].no_of_guest;
            PersonWantToSeat_seated =
              Response.data.message.data_dining_area5[0].no_of_guest;
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
          //console.log(Response.data.message);
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
              } else if (filtered.length == 1) {
                subObj.already_book = filtered[0].booking_status;

                if (parseInt(filtered[0].booking_status) === 2) {
                  running_table++;
                } else if (parseInt(filtered[0].booking_status) === 1) {
                  reseved_table++;
                }
              } else {
                if (parseInt(subObj.current_status) === 1) {
                  block_table++;
                } else {
                  blank_table++;
                }

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

          setBlankTotalTable(blank_table);
          setBlockTotalTable(block_table);
          setRunningTotalTable(running_table);
          setReservedTotalTable(reseved_table);
          const bloock_table = Response.data.message.data_dining_area.filter(
            (optiondddd) => 1 === optiondddd.current_status
          );

          const combinedData = Response.data.message.free_table;
          const filteredDatashow = combinedData.filter((row) => {
            return (
              row.max_person >= PersonWantToSeat &&
              row.min_person <= PersonWantToSeat
            );
          });

          setTotalCombinationTable(filteredDatashow);

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
          setTotalReservationListRequest(
            Response.data.message.data_reservation_next
          );
          setShowHideOption(Response.data.message.show_hide_option);

          if (Number(Response.data.message.online_booking_status) === 1) {
            settotal_online_booking_status(CrossedOn);
            settotal_online_booking_status_status_data("off");
          } else {
            settotal_online_booking_status(BorderedOn);
            settotal_online_booking_status_status_data("on");
          }
          if (Number(Response.data.message.total_start_stop_status) === 1) {
            settotal_start_stop_status_status(CrossedGlobe);
            settotal_start_stop_status_status_data("off");
          } else {
            settotal_start_stop_status_status(BorderedGlobe);
            settotal_start_stop_status_status_data("on");
          }
          setNotAllowMin(Response.data.message.allow_booking_min);
          setNoShowMin(Response.data.message.no_show_booking_min);
          setfilteredData(Response.data.message.data_reservation_data);
          setfilteredDataPre(Response.data.message.data_reservation_data);
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
          let totalpersonext = 0;
          let totalpersonnoshow = 0;
          let totalpersonongoing = 0;
          let totalpersonrequested = 0;
          Response.data.message.data_reservation_data.forEach((subObj) => {
            totalperson += subObj.no_of_guest;

            if (subObj.booking_status === 2) {
              totalpersonongoing += subObj.no_of_guest;
            }
            if (subObj.booking_status === 4) {
              totalpersonnoshow += subObj.no_of_guest;
            }
            const currentTime = new Date();
            const current_date = new Date();
            const timeParts = subObj.book_time.split(":");
            const bookTimeToday = new Date(
              current_date.getFullYear(),
              current_date.getMonth(),
              current_date.getDate(),
              parseInt(timeParts[0]),
              parseInt(timeParts[1]),
              parseInt(timeParts[2])
            );
            if (
              subObj.booking_status !== 2 &&
              subObj.booking_status !== 4 &&
              currentTime.getTime() <= bookTimeToday.getTime()
            ) {
              totalpersonext += subObj.no_of_guest;
            }
          });
          Response.data.message.data_reservation_next.forEach((subObj) => {
            totalpersonrequested += subObj.no_of_guest;
          });

          //setSelectedFloorListID(dining_area_id); //this not work
          setTotalReservationListPerson(totalperson);
          setTotalReservationListOngoingPerson(totalpersonongoing);
          setTotalReservationListNoShowPerson(totalpersonnoshow);
          setTotalReservationListRequestPerson(totalpersonrequested);
          setTotalReservationListNextPerson(totalpersonext);
          master_data_get("", "", "3", dining_area_id, "0");
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };
  const master_data_get_search = async (
    form_data,
    url_for_save,
    notes_add = 0
  ) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd = combiled_form_data(form_data, null);
      $("#add_note_to_guest").val("");
      if (notes_add != 0) {
        const msgIcon = document.querySelector(".msgicon" + notes_add);
        if (msgIcon) {
          msgIcon.classList.remove("hidden");
        }
      }
      await server_post_data(url_for_save, fd)
        .then((Response) => {
          setshowLoaderAdmin(false);
          console.log(Response.data.message.data_reservation_data);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            setsStaffImageLinkData(
              APL_LINK + Response.data.message.data_link_image
            );
            if (Response.data.message.data_reservation_data.length == 0) {
              setnonotessearch("No Result Found");
              setReservationListSearch("");
            } else {
              setReservationListSearch(
                Response.data.message.data_reservation_data
              );
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const master_data_get_search_mutiple_card = async (
    url_for_save,
    id_click
  ) => {
    setshowLoaderAdmin(true);
    let fd = new FormData();
    fd.append("guest_mobile_no", id_click);
    fd.append("by_id", id_click);
    //return 0;
    await server_post_data(url_for_save, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
          if (Response.data.message.data_reservation_data.length == 0) {
            setnonotessearch("No Result Found");
            setReservationListSearch("");
          } else {
            setReservationListSearch(
              Response.data.message.data_reservation_data
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };

  /////////////////////// Firebase Notification Start ///////////////////
  const [shownotification, setshownotification] = useState(false);
  const db = getFirestore();
  const collectionRef = doc(db, "notification_start", "always_update_data"+default_restaurant_id);

  // Set up Firestore listener to listen for changes in the document
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.data_update === 1 && !shownotification) {
          await updateDoc(collectionRef, { data_update: 0 });
          handleSuccess("new_book");
          let data_get = $("#reservation_date_make").val();
          master_data_get_mananegement_refresh(data_get);
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

  const master_data_get_mananegement_refresh = async (reservation_datedddd) => {
    const fd = new FormData();

    fd.append("reservation_date", reservation_datedddd);
    await server_post_data(get_all_reservation_date_notification, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_reservation_data.length > 0) {
            setTotalReservationListFull((prevData) => [
              Response.data.message.data_reservation_data[0],
              ...prevData,
            ]);
            setfilteredData((prevData) => [
              Response.data.message.data_reservation_data[0],
              ...prevData,
            ]);
            setfilteredDataPre((prevData) => [
              Response.data.message.data_reservation_data[0],
              ...prevData,
            ]);
          }
          setTotalReservationListRequest(
            Response.data.message.data_reservation_next
          );
          let totalpersonrequested = 0;
          Response.data.message.data_reservation_next.forEach((subObj) => {
            totalpersonrequested += subObj.no_of_guest;
          });
          setTotalReservationListRequestPerson(totalpersonrequested);
        }
      })
      .catch((error) => {
        handleError("network");
      });
  };

  const handleClose1 = () => setModalShow1(false);
  const handleClose = (click_type) => {
    if (SelectedData.edit_click && click_type === 1) {
      handleLinkClick("edit_Reservation/" + SelectedData.primary_id);
    } else {
      setModalShow(false);
    }
  };
  const handleInfoClose = () => setInfoShow(false);
  const handleNoteClose = () => {
    setNoteShow(false);
    setnonotessearch("");
    setReservationListSearch("");
  };
  const handleNoteClose2 = () => {
    setNoteShow2(false);
  };
  const handleShow = (data_call, click_type, index) => {
    if (click_type === "confirmation") {
      let table_name_dd = "";
      let uniqueTableIds = {};
      SelectedTableForBooking.forEach((item, i) => {
        // Add the table_id to the object with a value of true
        uniqueTableIds[item.table_id] = {
          table_name: item.table_name,
        };
      });

      for (let key in uniqueTableIds) {
        if (uniqueTableIds.hasOwnProperty(key)) {
          table_name_dd += uniqueTableIds[key].table_name + ",";
        }
      }
      table_name_dd = table_name_dd.slice(0, -1);

      setSelectedData({
        primary_id: data_call.primary_id,
        no_of_child: data_call.no_of_child,
        no_of_guest: data_call.no_of_guest,
        no_of_pets: data_call.no_of_pets,
        book_time: data_call.book_time,
        counter_invoice: data_call.counter_invoice,
        book_date: data_call.book_date,
        booking_status: "4",
        guest_name: data_call.guest_name,
        table_code_names: table_name_dd,
        edit_click: false,
        show_msg: "Confirm Booking",
        button_name: "Confirm",
        button_name_next: "Cancel",
        button_class: "assignModalBtn",
        comfirm_booking: true,
      });
      handleItemClick(index);
      setModalShow(true);
    } else if (click_type === "msgshow") {
      master_data_get_ajax(
        data_call.guest_mobile_no,
        data_call.primary_id,
        1,
        data_call
      );
    } else if (click_type === "infoshow") {
      setSelectedData(data_call);
      setInfoShow(true);
    } else if (click_type === "edit_reservation") {
      handleLinkClick("edit_Reservation/" + data_call.primary_id);
    } else {
      setshowLoaderAdmin(true);
      let fd = new FormData();
      fd.append("reservation_id", data_call.primary_id);
      fd.append("click_type", click_type);
      server_post_data(check_no_show_review, fd)
        .then((Response) => {
          console.log(Response.data.extra_data);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
            setTotalReservationListFull((prevState) => {
              // Find the index of the item to be updated
              const index = prevState.findIndex(
                (item) => item.primary_id === data_call.primary_id
              );

              // If the item with the given ID exists
              if (index !== -1) {
                // Create a copy of the previous state array
                const updatedState = [...prevState];

                // Update the particular value
                updatedState[index] = {
                  ...updatedState[index],
                  booking_status: Response.data.extra_data, // Replace 'particularProperty' with the property you want to update
                  no_show_status: Response.data.no_show_status, // Replace 'particularProperty' with the property you want to update
                  table_code_names: Response.data.table_code_names, // Replace 'particularProperty' with the property you want to update
                };

                // Return the updated state
                return updatedState;
              }

              // If the item with the given ID does not exist, return the previous state unchanged
              return prevState;
            });
            setfilteredData((prevState) => {
              // Find the index of the item to be updated
              const index = prevState.findIndex(
                (item) => item.primary_id === data_call.primary_id
              );

              // If the item with the given ID exists
              if (index !== -1) {
                // Create a copy of the previous state array
                const updatedState = [...prevState];

                // Update the particular value
                updatedState[index] = {
                  ...updatedState[index],
                  booking_status: Response.data.extra_data, // Replace 'particularProperty' with the property you want to update
                  no_show_status: Response.data.no_show_status, // Replace 'particularProperty' with the property you want to update
                  table_code_names: Response.data.table_code_names, // Replace 'particularProperty' with the property you want to update
                };

                // Return the updated state
                return updatedState;
              }

              // If the item with the given ID does not exist, return the previous state unchanged
              return prevState;
            });
            setfilteredDataPre((prevState) => {
              // Find the index of the item to be updated
              const index = prevState.findIndex(
                (item) => item.primary_id === data_call.primary_id
              );

              // If the item with the given ID exists
              if (index !== -1) {
                // Create a copy of the previous state array
                const updatedState = [...prevState];

                // Update the particular value
                updatedState[index] = {
                  ...updatedState[index],
                  booking_status: Response.data.extra_data, // Replace 'particularProperty' with the property you want to update
                  no_show_status: Response.data.no_show_status, // Replace 'particularProperty' with the property you want to update
                  table_code_names: Response.data.table_code_names, // Replace 'particularProperty' with the property you want to update
                };

                // Return the updated state
                return updatedState;
              }

              // If the item with the given ID does not exist, return the previous state unchanged
              return prevState;
            });
          } else {
            if (click_type === "no_show") {
              setSelectedData({
                primary_id: data_call.primary_id,
                no_of_child: data_call.no_of_child,
                no_of_guest: data_call.no_of_guest,
                no_of_pets: data_call.no_of_pets,
                counter_invoice: data_call.counter_invoice,
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
            } else if (click_type === "cancel") {
              setSelectedData({
                primary_id: data_call.primary_id,
                no_of_child: data_call.no_of_child,
                no_of_guest: data_call.no_of_guest,
                no_of_pets: data_call.no_of_pets,
                counter_invoice: data_call.counter_invoice,
                book_time: data_call.book_time,
                book_date: data_call.book_date,
                booking_status: "6",
                edit_click: false,
                guest_name: data_call.guest_name,
                show_msg: "Do you want to mark this reservation as Cancel?",
                button_name: "Yes",
                button_name_next: "No",
                button_class: "",
                comfirm_booking: false,
              });
              setModalShow(true);
            } else if (click_type === "revive") {
              setSelectedData({
                primary_id: data_call.primary_id,
                no_of_child: data_call.no_of_child,
                no_of_guest: data_call.no_of_guest,
                counter_invoice: data_call.counter_invoice,
                no_of_pets: data_call.no_of_pets,
                book_time: data_call.book_time,
                book_date: data_call.book_date,
                booking_status: "1",
                edit_click: false,
                guest_name: data_call.guest_name,
                show_msg: "Do you want to Revive this reservation?",
                button_name: "Revive",
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
                counter_invoice: data_call.counter_invoice,
                no_of_pets: data_call.no_of_pets,
                book_time: data_call.book_time,
                book_date: data_call.book_date,
                booking_status: "8",
                edit_click: false,
                guest_name: data_call.guest_name,
                show_msg: "Do you want to mark this reservation as Dispute?",
                button_name: "Dispute",
                button_name_next: "Cancel",
                button_class: "",
                comfirm_booking: false,
              });
              setModalShow(true);
            } else if (click_type === "accepts") {
              setSelectedData({
                primary_id: data_call.primary_id,
                no_of_child: data_call.no_of_child,
                no_of_guest: data_call.no_of_guest,
                counter_invoice: data_call.counter_invoice,
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
              setSelectedData({
                primary_id: data_call.primary_id,
                no_of_child: data_call.no_of_child,
                no_of_guest: data_call.no_of_guest,
                counter_invoice: data_call.counter_invoice,
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
              handleItemClick(index);
              setSelectedData(data_call);
              setReservationId(data_call.primary_id); //code by mk
              master_data_get(
                "",
                "",
                "3",
                SelectedFloorListID,
                data_call.primary_id,
                1
              );
            } else if (click_type === "reassigntable") {
              select_option_str = click_type;
              //code by mk
              handleItemClick(index);
              setSelectedData(data_call);
              setReservationId(data_call.primary_id); //code by mk
              master_data_get(
                "",
                "",
                "3",
                SelectedFloorListID,
                data_call.primary_id,
                1
              );
            } else if (click_type === "realeasetable") {
              setSelectedData(data_call);
              setModalShow1(true);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
          handleError("network");
        });
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
    fd.append("select_option_str", select_option_str);
    await server_post_data(update_action_reservation, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose(0);
          let data_get = $("#reservation_date_make").val();
          master_data_get_mananegement(data_get);
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
        // setshowLoaderAdmin(true);
        let fd_from = new FormData();
        if (form_data !== null) {
          fd_from = combiled_form_data(form_data, null);
        }

        fd_from.append("reservation_id", SelectedReservationBooking.primary_id);
        fd_from.append("dining_area_id", AreaID);
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
          fd_from.append("table_id_dd", table_id_dd);
          fd_from.append("total_tablebooking", total_table_count);
          fd_from.append("table_name_dd", table_name_dd);
          fd_from.append("max_person_dd", max_person_dd);
          fd_from.append("min_person_dd", min_person_dd);
          fd_from.append("preferred_person_dd", preferred_person_dd);
          fd_from.append("select_option_str", select_option_str);
          fd_from.append("available_online_dd", "0");
          fd_from.append("priority_level_dd", "0");
          await server_post_data(url_for_save, fd_from)
            .then((Response) => {
              setshowLoaderAdmin(false);
              if (Response.data.error) {
                handleError(Response.data.message);
              } else {
                handleSuccessSession(Response.data.message, "/Dashboard");
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
            handleSuccessSession(Response.data.message, "/Dashboard");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };

  const toggleActiveFilter = (TabId) => {
    setSearchlist(-1);
    if (TabId === "ALL") {
      setfilteredData(TotalReservationListFull);
      setfilteredDataPre(TotalReservationListFull);
    } else if (TabId === "NEXT") {
      const currentTime = new Date();
      const data_filter = TotalReservationListFull.filter((row) => {
        const current_date = new Date();
        const timeParts = row.book_time.split(":");
        const bookTimeToday = new Date(
          current_date.getFullYear(),
          current_date.getMonth(),
          current_date.getDate(),
          parseInt(timeParts[0]),
          parseInt(timeParts[1]),
          parseInt(timeParts[2])
        );
        return (
          row.booking_status !== 2 &&
          row.booking_status !== 4 &&
          currentTime.getTime() <= bookTimeToday.getTime()
        );
      });

      setfilteredData(data_filter);
      setfilteredDataPre(data_filter);
    } else if (TabId === "ONGOING") {
      const data_filter = TotalReservationListFull.filter((row) => {
        return row.booking_status === 2;
      });
      setfilteredData(data_filter);
      setfilteredDataPre(data_filter);
    } else if (TabId === "NOSHOW") {
      const data_filter = TotalReservationListFull.filter((row) => {
        return row.booking_status === 4;
      });

      setfilteredData(data_filter);
      setfilteredDataPre(data_filter);
    } else if (TabId === "REQUEST") {
      setfilteredData(TotalReservationListRequest);
      setfilteredDataPre(TotalReservationListRequest);
    }
    setAllActive(TabId === "ALL");
    setNextActive(TabId === "NEXT");
    setConfirmActive(TabId === "ONGOING");
    setCurrentActive(TabId === "NOSHOW");
    setCurrentActiveRequest(TabId === "REQUEST");
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchFilter(searchValue);
    setSearchlist(-1);
    // Filter table data based on search value
    let filteredDatashow = filteredDataPre.filter((row) => {
      return Object.values(row).some((value) => {
        if (value !== null && value !== undefined) {
          // Add null check here
          return (
            typeof value === "string"
              ? value.toLowerCase()
              : value.toString().toLowerCase()
          ).includes(searchValue.toLowerCase());
        }
        return false;
      });
    });
    if (currentActiveRequest) {
      filteredDatashow = TotalReservationListRequest.filter((row) => {
        return Object.values(row).some((value) => {
          if (value !== null && value !== undefined) {
            // Add null check here
            return (
              typeof value === "string"
                ? value.toLowerCase()
                : value.toString().toLowerCase()
            ).includes(searchValue.toLowerCase());
          }
          return false;
        });
      });
    }

    setfilteredData(filteredDatashow);
  };

  const handleSearchlist = (searchValue) => {
    // Filter table data based on search value
    setSearchlist(searchValue);
    let filteredDatashow = [];
    if (searchValue != -1) {
      //code by mk
      filteredDatashow = filteredDataPre.filter((row) => {
        return row.booking_status === searchValue;
      });
    } else {
      //code by mk
      filteredDatashow = filteredDataPre;
    }

    if (currentActiveRequest) {
      if (searchValue != -1) {
        //code by mk
        filteredDatashow = TotalReservationListRequest.filter((row) => {
          return row.booking_status === searchValue;
        });
      } else {
        //code by mk
        filteredDatashow = TotalReservationListRequest;
      }
    }

    setfilteredData(filteredDatashow);
  };

  const toggleSearchBar = () => {
    setIsSearchActive(!isSearchActive);
  };

  const headSearchRef = useRef(null);

  const master_data_get_ajax = async (
    guest_mobile_no,
    reservation_id,
    flag,
    data_call
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("guest_mobile_no", guest_mobile_no);
    fd.append("reservation_id", reservation_id);
    fd.append("flag", flag);
    await server_post_data(get_all_notes_by_id, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setSelectedData(data_call);
          setSelectedDataDetails(Response.data.message.guest_data_data);
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
          setNoteShow2(true);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

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

  const [listIndex, setListIndex] = useState("");

  const handleItemClick = (index) => {
    //for overlay highlight the reservation when table select/reassign
    if (listIndex !== "") {
      $(`.rervItems${listIndex}`).removeClass("selectedOverlay");
    }
    setListIndex(index);
    $(`.rervItems${index}`).addClass("selectedOverlay");
    $(".overlayNew").addClass("displayBlock");
    $(".canvasColumn").addClass("selectedOverlay");
    $(".canvasFoot").addClass("hidden");
    $(".magnifireDiv").addClass("hidden");
  };

  const hideOverlay = () => {
    $(`.rervItems${listIndex}`).removeClass("selectedOverlay");
    $(".overlayNew").removeClass("displayBlock");
    $(".canvasColumn").removeClass("selectedOverlay");
    $(".canvasFoot").removeClass("hidden");
    $(".magnifireDiv").removeClass("hidden");
    setSelectedReservationBooking({
      primary_id: 0,
      booking_status: -1,
    });
    setReservationId(""); //code by mk
    setSelectedFloorListID(FloorList[0].primary_id); //code by mk set default dining id again
    master_data_get("", "no_Call_loadser", "3", FloorList[0].primary_id, "0");
  };
  const handleFormSubmitNotesFirst = (event, id) => {
    event.preventDefault();
    master_data_get_search(
      "notes_data_search_form_data_first",
      get_reservation_by_mobile_no,
      id
    );
  };

  const handleFormSubmitNotesSecond = (event, id) => {
    event.preventDefault();
    master_data_get_search(
      "notes_data_search_form_data_second",
      get_reservation_by_mobile_no,
      id
    );
  };
  const handleDropdownChange = (selectedOption) => {
    console.log(selectedOption);
    if (selectedOption) {
      const index = selectedOption.value;
      setSelectedSuggestionset(index);
      const item = TotalCombinationTable[index];
      let click_type = "1";
      click_type = item.single_combine === 1 ? "2" : "1";
      selectfromsuggestion(item, click_type, item.primary_id, index);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    master_data_get_search("notes_data_search", get_reservation_by_mobile_no);
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div
            className="page_content_container"
            // style={{ overflow: "hidden" }}
          >
            <Header />
            <div className="page_body p-0 py-1" id="sectionToPrint">
              <div
                className={`overlayNew  ${
                  SelectedData.booking_status === 1 &&
                  SelectedReservationBooking &&
                  SelectedReservationBooking.primary_id ===
                    SelectedData.primary_id
                    ? "displayBlock"
                    : ""
                }`}
                onClick={() => hideOverlay()}
              ></div>
              {/* {showLoaderAdmin && <Loader />} */}
              <div className="row m-0">
                <div
                  className={` col-sm-7 canvasColumn ${
                    SelectedData.booking_status === 1 &&
                    SelectedReservationBooking &&
                    SelectedReservationBooking.primary_id ===
                      SelectedData.primary_id
                      ? "selectedOverlay"
                      : ""
                  }`}
                >
                  <div className="canvasHead selected">
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
                    <div className="tableStatusContainer_wrapper">
                      <div className="tableStatusContainer selected">
                        <div className="tableStatusDiv">
                          <div className="tableStatusColor blankTable"></div>
                          <p>{BlankTotalTable} Blank</p>
                        </div>
                        <div className="tableStatusDiv">
                          <div className="tableStatusColor blockTable"></div>
                          <p>{BlockTotalTable} Block</p>
                        </div>
                        <div className="tableStatusDiv">
                          <div className="tableStatusColor ReservedTable"></div>
                          <p>{ReservedTotalTable} Reserved</p>
                        </div>
                        <div className="tableStatusDiv">
                          <div className="tableStatusColor RunningTable"></div>
                          <p>{RunningTotalTable} Running</p>
                        </div>
                      </div>
                      <div className="magnifireDiv">
                        <div
                          className="plusMinusDiv plusMinusDivAdd"
                          onClick={() => plus_min_canvas("min")}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          htmlFor="top"
                          title={`Zoon-In Dining Area`}
                        >
                          <p>+</p>
                        </div>
                        <div
                          className="plusMinusDiv plusMinusDivCenter"
                          onClick={() => resetCanvasPosition()}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          htmlFor="top"
                          title={`Normal Position`}
                        >
                          <p>
                            {" "}
                            <img src={Focus} alt="Barleys Dashbaord" />
                          </p>
                        </div>
                        <div
                          className="plusMinusDiv plusMinusDivRem"
                          onClick={() => plus_min_canvas("plus")}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          htmlFor="top"
                          title={`Zoon-Out Dining Area`}
                        >
                          <p>-</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="selected" id="canvas-container">
                    <canvas id="canvas" height={581} />
                  </div>

                  <div className="canvasFoot">
                    <button
                      className="editFloorBtnCanva"
                      onClick={() =>
                        handleLinkClick(
                          "/Edit_Floor_Plan/" + SelectedFloorListID
                        )
                      }
                    >
                      <p>Edit Floor</p>
                      <img src={EditBlack} alt="Barley's Dashboard" />
                    </button>
                    <button
                      className="autoRefreash"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      htmlFor="top"
                      onClick={() => handleLinkClick("")}
                      title={`Window Refresh`}
                    >
                      <img src={refreashAuto} alt="Barley's Dashboard" />
                    </button>
                  </div>
                </div>
                <div className="col-sm-5 paddingLeft0 max_height_500px">
                  <div className="dateChangeFilter">
                    <div className="dateChangeFilterContaiern">
                      <img
                        onClick={() => {
                          SelectedDateChange("", "min");
                        }}
                        src={LeftArrow}
                        alt="Barley's Dashboard"
                      />
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          SelectedDateChange(date, "normal");
                        }}
                        // minDate={computeTodayDate()}
                        // maxDate={computeFutureDate()}
                        dateFormat="EEE dd MMM, yyyy"
                      />
                      <input
                        type="text"
                        id="reservation_date_make"
                        value={startDate}
                        hidden
                      />
                      <img
                        onClick={() => {
                          SelectedDateChange("", "plus");
                        }}
                        src={RightArrow}
                        alt="Barley's Dashboard"
                      />
                    </div>
                    <div className="gotoday">
                      <div className="gotodayContainer">
                        <p
                          onClick={() => SelectedDateChange("", "now")}
                          className="primarycode"
                          id="today_text_show"
                        >
                          TODAY
                        </p>
                        <button
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Online Booking Off"
                          className="Online_Booking_On"
                          onClick={() =>
                            openModalCalender(
                              "",
                              "1",
                              total_start_stop_status_status_data
                            )
                          }
                        >
                          <img
                            src={total_start_stop_status_status}
                            alt="Barley's Dashboard"
                          />
                        </button>
                        <button
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Restaurant Open"
                          className="Restaurant_Open"
                          onClick={() =>
                            openModalCalender(
                              "",
                              "2",
                              total_online_booking_status_status_data
                            )
                          }
                        >
                          <img
                            src={total_online_booking_status}
                            alt="Barley's Dashboard"
                          />
                        </button>
                      </div>
                      <button
                        onClick={(e) => printpage()}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        htmlFor="top"
                        title={`Print`}
                      >
                        <img src={PrintList} alt="Barley's Dashboard" />
                      </button>
                    </div>
                  </div>
                  <div className="editNewAreaSidebar editNewAreaSidebarAllot h-90">
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
                                <p>ON-GOING</p>
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
                                <p>NO SHOW</p>
                                <p className="p_count">
                                  ({TotalReservationListNoShowPerson}P)
                                </p>
                              </div>
                              <div
                                className={`rsrvFilterTab ${
                                  currentActiveRequest
                                    ? "rsrvFilterTabActive"
                                    : ""
                                }`}
                                onClick={() => toggleActiveFilter("REQUEST")}
                              >
                                <p>REQUEST</p>
                                <p className="p_count">
                                  ({TotalReservationListRequestPerson}P)
                                </p>
                              </div>
                            </div>
                            <div className="filkterActions">
                              {!isSearchActive && (
                                <>
                                  <button
                                    ref={headSearchRef}
                                    onClick={toggleSearchBar}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Search Reservations`}
                                  >
                                    <img
                                      src={SearchMenu}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>

                                  <div
                                    className="dropdown profileDropdown"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Filter Reservations`}
                                  >
                                    <div
                                      className="profileBtnToggle dropdown-toggle"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <img
                                        src={FIlter}
                                        alt="Barley's Dashboard"
                                      />
                                    </div>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <a
                                          className={`dropdown-item ${
                                            isSearchlist === -1 ? "active" : ""
                                          }`}
                                          onClick={(e) => handleSearchlist(-1)}
                                        >
                                          All{" "}
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className={`dropdown-item ${
                                            isSearchlist === 0 ? "active" : ""
                                          }`}
                                          onClick={(e) => handleSearchlist(0)}
                                        >
                                          TO CONFIRM{" "}
                                        </a>
                                        <a
                                          className={`dropdown-item ${
                                            isSearchlist === 1 ? "active" : ""
                                          }`}
                                          onClick={(e) => handleSearchlist(1)}
                                        >
                                          TO ARIVAL
                                        </a>
                                        <a
                                          className={`dropdown-item ${
                                            isSearchlist === 4 ? "active" : ""
                                          }`}
                                          onClick={(e) => handleSearchlist(4)}
                                        >
                                          No Show
                                        </a>
                                        <a
                                          className={`dropdown-item ${
                                            isSearchlist === 2 ? "active" : ""
                                          }`}
                                          onClick={(e) => handleSearchlist(2)}
                                        >
                                          SEATED
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </>
                              )}

                              {isSearchActive && (
                                <div className="headSearch">
                                  <div
                                    className="headSearchInput"
                                    ref={headSearchRef}
                                  >
                                    <img
                                      src={SearchImg}
                                      alt="Barley's Dashboard"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Search"
                                      value={searchfilter}
                                      onChange={handleSearch}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="resrvList">
                          <div className="resrvListContainer">
                            <ul>
                              {filteredData.map((option, index) => {
                                let options_set =
                                  option.booking_status === 0
                                    ? [
                                        { label: "ACCEPT ", value: "accepts" },
                                        { label: "DECLINE ", value: "decline" },
                                        { label: "CANCEL ", value: "cancel" },
                                      ]
                                    : option.booking_status === 1
                                    ? [
                                        {
                                          label: "ARRIVED ",
                                          value: "selecttable",
                                        },
                                        { label: "NO SHOW ", value: "no_show" },
                                        {
                                          label: "EDIT ",
                                          value: "edit_reservation",
                                        },
                                        { label: "CANCEL ", value: "cancel" },
                                        {
                                          label: "REASSIGN ",
                                          value: "reassigntable",
                                        },
                                      ]
                                    : option.booking_status === 2
                                    ? [
                                        {
                                          label: "RELEASED  ",
                                          value: "realeasetable",
                                        },
                                        { label: "CANCEL ", value: "cancel" },
                                        {
                                          label: "REASSIGN ",
                                          value: "reassigntable",
                                        },
                                      ]
                                    : option.booking_status === 4
                                    ? [
                                        {
                                          label: "REVIVE",
                                          value: "revive",
                                        },
                                        { label: "DISPUTE", value: "dispute" },
                                      ]
                                    : [];

                                let selecteddata =
                                  option.booking_status === 0
                                    ? "SELECT"
                                    : option.booking_status === 1
                                    ? "CONFIRMED"
                                    : option.booking_status === 2
                                    ? "SEATED"
                                    : option.booking_status === 3
                                    ? "RELEASED"
                                    : option.booking_status === 4
                                    ? "NO SHOW"
                                    : option.booking_status === 5
                                    ? "DECLINED"
                                    : option.booking_status === 6
                                    ? "CANCELLED"
                                    : option.booking_status === 7
                                    ? "REASSIGN"
                                    : option.booking_status === 8
                                    ? "DISPUTE"
                                    : "SELECT";

                                if (option.no_show_status === 2) {
                                  selecteddata = "NO SHOW";
                                  options_set = [];
                                }

                                if (ShowHideOption === 1) {
                                  options_set = [];
                                }

                                return (
                                  <li
                                    className={`rervItems${index}`}
                                    key={index}
                                    onClick={() => {
                                      if (
                                        option.booking_status === 1 &&
                                        SelectedReservationBooking &&
                                        SelectedReservationBooking.primary_id ===
                                          option.primary_id
                                      ) {
                                        handleItemClick(index);
                                      }
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {/* <div className="resrvDashList d-xl-flex d-none"> */}
                                    <div className="resrvDashList">
                                      <div className="d-flex">
                                        <div className="resrvDashTIme">
                                          <p className="timeResrvs">
                                            {formatTimeintotwodigit(
                                              option.book_time
                                            )}
                                          </p>
                                        </div>
                                        <div className="rsrvDashStat_COntainer">
                                          <div className="rsrvDashStat rsrvDashStatTag">
                                            {option.booking_status === 0 && (
                                              <>
                                                <h6>
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p>To Confirm</p>
                                              </>
                                            )}

                                            {option.booking_status === 1 && (
                                              <>
                                                <h6 className="personArrive">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personArrive">
                                                  To Arrive
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 2 && (
                                              <>
                                                <h6 className="personRelease">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personRelease">
                                                  To Release
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 3 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personNoShow">
                                                  Complete
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 4 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personNoShow">
                                                  No Show
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 5 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personNoShow">
                                                  Decline
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 6 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                                <p className="personNoShow">
                                                  Cancel
                                                </p>
                                              </>
                                            )}
                                            {option.booking_status === 7 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                              </>
                                            )}
                                            {option.booking_status === 8 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                              </>
                                            )}
                                            {option.booking_status === 9 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                              </>
                                            )}
                                            {option.booking_status === 10 && (
                                              <>
                                                <h6 className="personNoShow">
                                                  <span className="long-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      12
                                                    )}
                                                  </span>
                                                  <span className="short-name">
                                                    {option.guest_name.slice(
                                                      0,
                                                      6
                                                    )}
                                                    ...
                                                  </span>
                                                </h6>
                                              </>
                                            )}
                                            {option.guest_status === 1 && (
                                              <p className="personTag">VIP</p>
                                            )}
                                            {option.customer_new_old === 0 && (
                                              <p className="personTag">NEW</p>
                                            )}
                                            {option.show_tag_book !== "" && (
                                              <p className="personTag">
                                                {option.show_tag_book}
                                              </p>
                                            )}
                                          </div>
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
                                          </div>
                                        </div>
                                      </div>

                                      <div className="rsrvDashActions">
                                        <div className="actionsRightNew d-flex align-items-center gap-2 justify-content-end">
                                          <p
                                            className={`selecttable${option.primary_id}`}
                                          >
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
                                          <div className="actionsBtns">
                                            <button
                                              onClick={(e) =>
                                                handleShow(
                                                  option,
                                                  "msgshow",
                                                  index
                                                )
                                              }
                                              className={`${
                                                option.note_intruction === 0
                                                  ? "hidden"
                                                  : ""
                                              } msgicon${option.primary_id}`}
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="bottom"
                                              htmlFor="top"
                                              title={`Suggestions`}
                                            >
                                              <img
                                                src={MsgBox}
                                                alt="Barley's Dashboard"
                                              />
                                            </button>

                                            <button
                                              onClick={(e) =>
                                                handleShow(
                                                  option,
                                                  "infoshow",
                                                  index
                                                )
                                              }
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="bottom"
                                              htmlFor="top"
                                              title={`Booking Details`}
                                            >
                                              <img
                                                src={CircleInfo}
                                                alt="Barley's Dashboard"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                        {TotalCombinationTable != null && (
                                          <div className="rsrvDashActionsBottom mt-1">
                                            {(option.booking_status === 1 ||
                                              option.booking_status === 2) &&
                                            SelectedReservationBooking &&
                                            SelectedReservationBooking.primary_id ===
                                              option.primary_id ? (
                                              <div className="confirmBtnANdDrop">
                                                <div>
                                                  <Dropdown
                                                    options={TotalCombinationTable.map(
                                                      (area, index) => ({
                                                        label:
                                                          area.table_code.replace(
                                                            /,/g,
                                                            "+"
                                                          ) +
                                                          " " +
                                                          area.min_person +
                                                          "-" +
                                                          area.max_person +
                                                          "P",
                                                        value: index,
                                                      })
                                                    )}
                                                    className={`float_right_table`}
                                                    table_code_ids={`${
                                                      option.table_code_ids
                                                        ? option.table_code_ids
                                                        : option.primary_id
                                                    }`}
                                                    onChange={
                                                      handleDropdownChange
                                                    }
                                                    value={
                                                      selectedSuggestionset
                                                    }
                                                    placeholder={
                                                      selectedSuggestionset
                                                    }
                                                  />
                                                </div>
                                                <div>
                                                  {(option.booking_status ===
                                                    1 ||
                                                    option.booking_status ===
                                                      2) &&
                                                  SelectedReservationBooking &&
                                                  PersonWantToSeat_seated < 1 &&
                                                  SelectedReservationBooking.primary_id ===
                                                    option.primary_id ? (
                                                    <button
                                                      className="arrivedResrv Select_Table"
                                                      onClick={(e) =>
                                                        handleShow(
                                                          option,
                                                          "confirmation",
                                                          index
                                                        )
                                                      }
                                                    >
                                                      Confirm
                                                    </button>
                                                  ) : null}
                                                </div>
                                              </div>
                                            ) : (
                                              <Dropdown
                                                className={`${
                                                  options_set.length === 0
                                                    ? "pointerNone"
                                                    : ""
                                                }`}
                                                options={options_set}
                                                onChange={(e) => {
                                                  handleShow(
                                                    option,
                                                    e.value, //when click on Arrived
                                                    index
                                                  );
                                                }}
                                                placeholder={selecteddata}
                                              />
                                            )}
                                          </div>
                                        )}
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
                className="releaseModal modalzindex"
                centered
                onHide={(e) => handleClose(0)}
              >
                <Modal.Header className="releaseModalHeader"></Modal.Header>
                <Modal.Body className="releaseModalBody">
                  <p> ID:{SelectedData.counter_invoice}</p>
                  <div className="releaseModalHead">
                    <div className="releaseModalHeadLeft align-items-start">
                      <img
                        style={{ paddingTop: "0.2rem" }}
                        src={DoneGreen}
                        alt="Barley's Dashboard"
                      />
                      <h5>
                        <span>&nbsp;{SelectedData.show_msg}</span>
                      </h5>
                    </div>
                    {/* <div className="releaseModalHeadRight">
                      <img src={OrngMsg} alt="Barley's Dashboard" />
                    </div> */}
                  </div>
                  <div className="releaseModalDetails">
                    <h5>{SelectedData.guest_name}</h5>
                    <p className="redtext">{SelectedData.table_code_names}</p>
                    <p>
                      BOOKING DATE :{" "}
                      {inputdateformateChange(SelectedData.book_date)}
                    </p>
                    <p>
                      BOOKING TIME :{" "}
                      {formatTimeintotwodigit(SelectedData.book_time)}
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

                  <Button
                    className="editNowBtn Edit_Now"
                    onClick={(e) => handleClose(1)}
                  >
                    <label style={{ cursor: "pointer" }}>
                      {SelectedData.button_name_next}
                    </label>
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* Info Modal Pop-up */}
              <Modal
                show={infoShow}
                className="releaseModal modalzindex"
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
                          Booking Date:{" "}
                          {inputdateformateChange(SelectedData.entry_date)}
                        </p>
                        <p>
                          Reservation Date:{" "}
                          {inputdateformateChange(SelectedData.book_date)}
                        </p>
                      </div>
                      <div className="infoDetalisBody">
                        <p className="mb-2">
                          ID : {SelectedData.counter_invoice}
                        </p>
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
                          {/* <div className="releaseModalHeadRight">
                            <img src={OrngMsg} alt="Barley's Dashboard" />
                          </div> */}
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
                            <p>{SelectedData.no_of_guest} PERSON</p>
                          </div>
                          <div className="countContainerItem countContainerModalItem">
                            <img src={ChildY} alt="Barley's Dashboard" />
                            <p>
                              {SelectedData.no_of_child}{" "}
                              {SelectedData.no_of_child > 1
                                ? "CHILDREN"
                                : "CHILD"}
                            </p>
                          </div>
                          <div className="countContainerItem countContainerModalItem">
                            <img src={PetY} alt="Barley's Dashboard" />
                            <p>
                              {SelectedData.no_of_pets}{" "}
                              {SelectedData.no_of_pets > 1 ? "PETS" : "PET"}{" "}
                            </p>
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
                className="releaseModal modalzindex"
                centered
                onHide={handleNoteClose}
                dialogClassName="modal-dialog-scrollable"
              >
                <Modal.Header
                  style={{ border: "none", paddingBottom: "0" }}
                  closeButton
                ></Modal.Header>
                <Modal.Body className="releaseModalBody notesDoby">
                  <div className="booking-container">
                    <div className="guest-mobile-input">
                      <form id="notes_data_search" onSubmit={handleFormSubmit}>
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
                            Enter Guest Mobile No. ID, Email ID
                          </label>
                          <input
                            minLength={4}
                            maxLength={500}
                            className=" trio_mandatory form-control input-label "
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

                    {ReservationListSearch.length == 1 ? (
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
                                {ReservationListSearch[0].no_of_child}{" "}
                                {ReservationListSearch[0].no_of_child > 1
                                  ? "Children"
                                  : "Child"}
                              </p>
                              <p>
                                {ReservationListSearch[0].no_of_pets}{" "}
                                {ReservationListSearch[0].no_of_pets > 1
                                  ? "Pets"
                                  : "Pet"}
                              </p>
                            </div>
                            <div className="guest-name">
                              {ReservationListSearch[0].reservation_description}
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
                                        src={admin_image}
                                        onError={(e) =>
                                          (e.target.src = userIcn)
                                        }
                                        alt="Add notes icon"
                                        className="add-notes-icon"
                                      />
                                      <form
                                        id="notes_data_search_form_data_second"
                                        onSubmit={(event) =>
                                          handleFormSubmitNotesSecond(
                                            event,
                                            ReservationListSearch[0].primary_id
                                          )
                                        }
                                      >
                                        <input
                                          className="w-100"
                                          type="text"
                                          name="add_note_to_guest"
                                          id="add_note_to_guest"
                                          minLength={4}
                                          maxLength={100}
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
                                        <input
                                          className="w-100 hidden"
                                          type="text"
                                          name="primary_id"
                                          defaultValue={
                                            ReservationListSearch[0].primary_id
                                          }
                                          minLength={4}
                                          maxLength={100}
                                        />
                                        <button
                                          type="submit"
                                          style={{ display: "none" }}
                                        />
                                      </form>
                                      <button
                                        className="ad"
                                        type="button"
                                        onClick={() =>
                                          master_data_get_search(
                                            "notes_data_search_form_data_second",
                                            get_reservation_by_mobile_no,
                                            ReservationListSearch[0].primary_id
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

                                <form
                                  id="notes_data_search_form_data_first"
                                  onSubmit={(event) =>
                                    handleFormSubmitNotesFirst(
                                      event,
                                      ReservationListSearch[0].primary_id
                                    )
                                  }
                                >
                                  <input
                                    className="w-100"
                                    type="text"
                                    name="add_note_to_guest"
                                    id="add_note_to_guest"
                                    minLength={4}
                                    maxLength={100}
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
                                  <input
                                    className="w-100 hidden"
                                    type="text"
                                    name="primary_id"
                                    defaultValue={
                                      ReservationListSearch[0].primary_id
                                    }
                                    minLength={4}
                                    maxLength={100}
                                  />
                                  <button
                                    type="submit"
                                    style={{ display: "none" }}
                                  />
                                </form>
                                <button
                                  className="ad"
                                  onClick={() =>
                                    master_data_get_search(
                                      "notes_data_search_form_data_first",
                                      get_reservation_by_mobile_no,
                                      ReservationListSearch[0].primary_id
                                    )
                                  }
                                >
                                  ADD
                                </button>
                              </div>
                            )}
                        </div>
                      </>
                    ) : ReservationListSearch.length > 1 ? (
                      <div>
                        {" "}
                        {ReservationListSearch.map((data_come, indexsss) => (
                          <div
                            className="add-notes-button3 row"
                            onClick={() =>
                              master_data_get_search_mutiple_card(
                                get_reservation_by_mobile_no,
                                data_come.counter_invoice
                              )
                            }
                          >
                            <div
                              className="booking-details-label"
                              key={indexsss}
                            >
                              <label>Booking Details</label>{" "}
                              <p> ID:{data_come.counter_invoice}</p>
                            </div>
                            <div className="guest-details">
                              <div className="guest-name-wrapper">
                                <div className="d-flex w-100 justify-content-between">
                                  <div>
                                    <div className="guest-name">
                                      {data_come.guest_name}
                                    </div>
                                    <div className="guest-count">
                                      <p>{data_come.no_of_guest} Person</p>
                                      <p>
                                        {data_come.no_of_child}{" "}
                                        {data_come.no_of_child > 1
                                          ? "Children"
                                          : "Child"}
                                      </p>
                                      <p>
                                        {data_come.no_of_pets}{" "}
                                        {data_come.no_of_pets > 1
                                          ? "Pets"
                                          : "Pet"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="booking-info">
                                    <div className="booking-date">
                                      {inputdateformateChangeyear(
                                        data_come.book_date
                                      )}
                                    </div>
                                    <div className="booking-time">
                                      Booking Time :
                                      {formatTimeintotwodigit(
                                        data_come.book_time
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="guest-name">
                                  {data_come.reservation_description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>{nonotessearch}</div>
                    )}
                  </div>
                </Modal.Body>
              </Modal>
              {/*print modal*/}
              <Modal
                show={noteShow2}
                className="releaseModal modalzindex"
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
                            <p>
                              {" "}
                              {SelectedData.no_of_child}{" "}
                              {SelectedData.no_of_child > 1
                                ? "Children"
                                : "Child"}
                            </p>
                            <p>
                              {SelectedData.no_of_pets}{" "}
                              {SelectedData.no_of_pets > 1 ? "Pets" : "Pet"}
                            </p>
                          </div>
                          <div className="guest-name">
                            {SelectedData.reservation_description}
                          </div>
                        </div>
                      </div>
                      {SelectedDataDetails &&
                        SelectedDataDetails.length > 0 && (
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
                                  {SelectedDataDetails &&
                                    SelectedDataDetails.map(
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
                className="releaseModal modalzindex"
                centered
                onHide={handleClose1}
              >
                <Modal.Header className="releaseModalHeader"></Modal.Header>
                <Modal.Body className="releaseModalBody">
                  <p> ID:{SelectedData.counter_invoice}</p>
                  <div className="releaseModalHead">
                    <div className="releaseModalHeadLeft">
                      <img src={DoneGreen} alt="Barley's Dashboard" />
                      <h5>
                        Release Table
                        <span>&nbsp;{SelectedData.table_code_names}</span>
                      </h5>
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
                  <form id="update_realse_data">
                    <div className="update_realse_dataContainer">
                      <div className="inpContainer m-0">
                        <div className=" image_icon_position image_icon_position1">
                          <input
                            type="text"
                            id="payout_amt"
                            name="payout_amt"
                            tabIndex="1"
                            placeholder={"Enter Bill Amount"}
                            minLength={3}
                            maxLength={10}
                            className="  form-control  input_field_custom1 "
                            style={{ paddingLeft: "1rem" }}
                            onInput={handleNumbersDecimalChange}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                      <div className="inpContainer m-0">
                        <div className=" image_icon_position image_icon_position1">
                          <input
                            type="text"
                            id="invoice_no_bill"
                            name="invoice_no_bill"
                            tabIndex="1"
                            placeholder={"Enter Invoice No Bill"}
                            minLength={3}
                            maxLength={30}
                            style={{ paddingLeft: "1rem" }}
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

              <Modal
                show={showModalCalender}
                onHide={closeModalCalender}
                centered
                backdrop="static"
              >
                <Modal.Body className="modal_body">
                  <p>{testshowdata.show_text}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="logoutYesBtn"
                    onClick={close_popup_update_query}
                  >
                    Yes
                  </Button>
                  <Button className="logoutNoBtn" onClick={closeModalCalender}>
                    No
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
