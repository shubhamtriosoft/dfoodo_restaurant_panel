import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import RoundTable2 from "../assets/round2.svg";
import RoundTable3 from "../assets/round3.svg";
import RoundTable4 from "../assets/round4.svg";
import RoundTable6 from "../assets/round6.svg";
import SquareTable2 from "../assets/square2.svg";
import SquareTable4 from "../assets/square4.svg";
import SquareTable6 from "../assets/square6.svg";
import SquareTable8 from "../assets/square8.svg";
import CanvasBackground from "../assets/CanvasBackground.svg";
import pillarIcon from "../assets/pillar.svg";
import decorativeicon from "../assets/decorative.svg";
import Counter from "../assets/counter.svg";
import DoneGreen from "../assets/doneGreen.svg";
import DeletIcon from "../assets/delete.svg";
import Loader from "./Loader.js";
import {
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  createImageWithTextGroup,
  white_main,
  blocked_main,
  deleteImg,
  imgIconRotate,
  borderColor,
  cornerColor,
} from "../CommonJquery/TableAssignment.js";
import {
  server_post_data,
  get_all_table_position,
  sava_update_table_position,
  delete_tablesetup,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleAphabetsChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  handleLinkClick,
} from "../CommonJquery/CommonJquery";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import { useParams, useLocation } from "react-router-dom";
let canvas;
let initialPosition = {
  left: 0,
  top: 0,
};
let mutiplesection_check = false;
export default function CreateDiningArea(CALLID) {
  let MainUpdateData = CALLID.CALLID;
  const location = useLocation();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [tableSelected, setTableSelected] = useState(0);
  const [TotalTable, setTotalTable] = useState(0);
  const [TotalBlockTable, setTotalBlockTable] = useState([]);
  const [TotalCombinationTable, setTotalCombinationTable] = useState([]);
  const [MutipleTableSelected, setMutipleTableSelected] = useState(0);
  const [MutipleTableComId, setMutipleTableComId] = useState(0);
  const [MutipleTableComIdindex, setMutipleTableComIdindex] = useState(0);
  const [MutipleTableName, setMutipleTableName] = useState("");
  const [MutipleTableNameId, setMutipleTableNameId] = useState("");
  const [MutipleAvailableOnline, setMutipleAvailableOnline] = useState(1);
  const [MutipleMinPerson, setMutipleMinPerson] = useState(1);
  const [MutiplePreferredPerson, setMutiplePreferredPerson] = useState(1);
  const [MutipleMaxPerson, setMutipleMaxPerson] = useState(1);
  const [MutiplePriorityPerson, setMutiplePriorityPerson] = useState(1);
  const [AreaName, setAreaName] = useState("");
  const [modalShow1, setModalShow1] = useState(false);
  const [mutiplesection, setmutiplesection] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef(null);
  const lastZoom = useRef(1);

  const editcombination = (index) => {
    console.log(TotalCombinationTable[index]);
    setMutipleTableSelected(TotalCombinationTable[index].total_table_combine);
    setMutipleTableName(TotalCombinationTable[index].table_code);
    setMutipleTableComId(TotalCombinationTable[index].primary_id);
    setMutipleTableNameId(TotalCombinationTable[index].table_code_ids);
    setMutiplePriorityPerson(TotalCombinationTable[index].priority_level);
    setMutipleMaxPerson(TotalCombinationTable[index].max_person);
    setMutipleMinPerson(TotalCombinationTable[index].min_person);
    setMutipleAvailableOnline(TotalCombinationTable[index].available_online);
    setMutiplePreferredPerson(TotalCombinationTable[index].preferred_person);
    setMutipleTableComIdindex(index);
    $("#min_seat_mutiple").val(TotalCombinationTable[index].min_person);
    $("#preferred_seat_mutiple").val(
      TotalCombinationTable[index].preferred_person
    );
    $("#max_seat_mutiple").val(TotalCombinationTable[index].max_person);
    $("#priority_seat_mutiple").val(
      TotalCombinationTable[index].priority_level
    );
    if (TotalCombinationTable[index].available_online === 1) {
      $("#online_status_mutiple").prop("checked", true);
    }
    $("#mutiple_type").val(TotalCombinationTable[index].special_feature);

    setTableSelected(2);
  };

  const addMultipleCombination = () => {
    const arraysToAdd = [
      {
        primary_id: MutipleTableComId,
        table_code: MutipleTableName,
        table_code_ids: MutipleTableNameId,
        available_online: MutipleAvailableOnline,
        min_person: MutipleMinPerson,
        preferred_person: MutiplePreferredPerson,
        max_person: MutipleMaxPerson,
        special_feature: $("#mutiple_type").val(),
        priority_level: MutiplePriorityPerson,
        total_table_combine: MutipleTableSelected,
      },
    ];

    // Check if an array with the same values already exists
    const existingIndex = TotalCombinationTable.findIndex(
      (item) =>
        item.table_code === MutipleTableName &&
        item.table_code_ids === MutipleTableNameId
    );

    if (existingIndex !== -1) {
      // Update the existing array
      setTotalCombinationTable((prevState) => {
        const newState = [...prevState];
        newState[existingIndex] = arraysToAdd[0];
        return newState;
      });
    } else {
      // Add a new array
      setTotalCombinationTable((prevState) => [...prevState, ...arraysToAdd]);
    }
    setTableSelected(0);
    canvas.discardActiveObject();
  };

  const handleTableSelect = () => {
    console.log("new table select");
    setTableSelected(0);
    const tableObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "table");
    const true_block = canvas
      .getObjects()
      .filter((obj) => obj.blocked === true);

    setTotalTable(tableObjects.length);
    setTotalBlockTable(true_block);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  useEffect(() => {
    const start_date = "";
    const end_date = "";
    const flag = "1";
    const call_id = MainUpdateData;
    master_data_get(start_date, end_date, flag, call_id);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);
  useEffect(() => {}, [mutiplesection]);
  useEffect(() => {}, [tableSelected]);
  useEffect(() => {}, [TotalCombinationTable]);

  const updateSelectedObjectDetails = (obj) => {
    console.log("active");
    console.log(obj.type);
    try {
      if (obj) {
        if (obj.type === "activeSelection") {
          let get_table_name = "";
          let get_table_ids = "";
          setTableSelected(2);
          obj.set({
            borderColor: "transparent",
            cornerColor: "transparent",
          });
          canvas.requestRenderAll();
          setMutipleTableSelected(obj._objects.length);
          obj._objects.forEach((objectData, index) => {
            if (obj._objects.length == index + 1) {
              get_table_name += objectData._objects[1].text;
              get_table_ids += objectData.id;
            } else {
              get_table_name += objectData._objects[1].text + ",";
              get_table_ids += objectData.id + ",";
            }
          });
          setMutipleTableName(get_table_name);
          setMutipleTableNameId(get_table_ids);
          setMutipleTableComId(0);
        } else if (obj.type === "image") {
          //code by mk
          if (!mutiplesection) {
            canvas.setActiveObject(obj); //code by mk
          }
        } else if (obj.type === "table") {
          //console.log(obj._objects[1].text);

          setTableSelected(1);
          const max_seat = document.getElementById("max_seat");
          if (max_seat && obj._objects[1].text) {
            if (!mutiplesection_check) {
              canvas.setActiveObject(obj); //code by mk
            }
            const preferred_seat = document.getElementById("preferred_seat");
            const min_seat = document.getElementById("min_seat");
            const block_status = document.getElementById("block_status");
            const online_status = document.getElementById("online_status");
            const table_name = document.getElementById("table_name");
            const priority_seat = document.getElementById("priority_seat");
            const type_save_single =
              document.getElementById("type_save_single");
            table_name.value = obj._objects[1].text.replace("T", "");

            setMutipleTableComId(obj.id);
            let split_data = obj.globalCompositeOperation.split("@@@");
            let available_online = split_data[1];
            let min_person = split_data[2];
            let preferred_person = split_data[3];
            let max_person = split_data[4];
            let priority_level = split_data[5];
            let starnder_type = split_data[6];
            let type_name = split_data[7];
            let prsent_color = split_data[8];
            if (available_online === "0") {
              online_status.checked = false;
            } else {
              online_status.checked = true;
            }

            if (obj.blocked) {
              block_status.checked = true;
            } else {
              block_status.checked = false;
            }
            preferred_seat.value = preferred_person;
            max_seat.value = max_person;
            priority_seat.value = priority_level;
            min_seat.value = min_person;
            type_save_single.value = type_name;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
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
      const true_block = canvas
        .getObjects()
        .filter((obj) => obj.blocked === true);
      setTotalBlockTable(true_block);

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
      // Render all objects on the main canvas
      canvas.renderAll();
      canvas.on("mouse:down", function (e) {
        const target = e.target;
        if (target) {
          updateSelectedObjectDetails(target);
          try {
            if (!mutiplesection) {
              let lefft_icon = target.left;
              let right_icon = target.top;
              if (target.top < 0) {
                right_icon = 0;
              }
              if (lefft_icon > canvas.width - target.width) {
                lefft_icon = canvas.width - target.width;
              }
              if (right_icon > canvas.height - target.height) {
                right_icon = canvas.height - target.height;
              }
              if (lefft_icon < 0) {
                lefft_icon = 0;
              }
              if (right_icon < 0) {
                right_icon = 0;
              }
              initialPosition = {
                left: lefft_icon,
                top: right_icon,
              };
            }
          } catch (err) {
            //rrr
            setTableSelected(0);
          }
        } else {
          setTableSelected(0);
          handleTableSelect();
          if (e.button === 1) {
            console.log("left click");
          } else if (encodeURI.button === 2) {
            console.log("middle click");
          } else if (e.button === 3) {
            isDragging.current = true;
            const pointer = canvas.getPointer(e.e);
            dragStart.current = { x: pointer.x, y: pointer.y };
          }
        }
      });
      canvas.selection = false;

      canvas.on("mouse:up", function (e) {
        const target = e.target;
        isDragging.current = false;
        initialPinchDistance.current = null;
        lastZoom.current = canvas.getZoom();
        if (target) {
          updateSelectedObjectDetails(target);
          if (target && target.type !== "activeSelection") {
            if (target) {
              //updateSelectedObjectDetails(target);
              const position = {
                left: target.left,
                top: target.top,
              };

              if (
                initialPosition &&
                (position.left !== initialPosition.left ||
                  position.top !== initialPosition.top) &&
                !mutiplesection
              ) {
                const overlappingTable = getOverlappingTable(target);

                if (overlappingTable) {
                  target.animate(
                    { left: initialPosition.left, top: initialPosition.top },
                    {
                      duration: 200,
                      onChange: canvas.renderAll.bind(canvas),
                      onComplete: function () {
                        target.setCoords();
                        canvas.renderAll();
                      },
                    }
                  );
                } else {
                  initialPosition = position;
                }
              }
            }
          }
        } else {
          setTableSelected(0);
        }
      });

      canvas.on("object:moving", function (e) {
        checkBoudningBox(e, "moving");
      });
      canvas.on("object:rotating", function (e) {
        checkBoudningBox(e, "rotating");
      });
      canvas.on("object:scaling", function (e) {
        checkBoudningBox(e, "scaling");
      });
      canvas.hoverCursor = "pointer";

      function renderIcon(icon) {
        return function renderIcon(
          ctx,
          left,
          top,
          styleOverride,
          fabricObject
        ) {
          var size = this.cornerSize;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(icon, -size / 2, -size / 2, size, size);
          ctx.restore();
        };
      }

      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteImg),
        cornerSize: 24,
        visible: false,
      });

      function deleteObject(eventData, transform) {
        var target = transform.target;
        var canvas = target.canvas;
        if (target.type) {
          if (
            target.type === "counter" ||
            target.cacheKey === "texture1" ||
            target.type === "image"
          ) {
            //code by mk
            canvas.remove(target);
            //canvas.requestRenderAll();
            canvas.renderAll(); //code by mk
          } else {
            updateSelectedObjectDetails(target);
          }
        }
      }

      fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetX: 0,
        offsetY: -40,
        cursorStyle: "all-scroll",
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: "rotate",
        render: renderIconrotate,
        cornerSize: 38,
        withConnection: true,
      });

      // Defining how the rendering action will be
      function renderIconrotate(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(imgIconRotate, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

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

  function checkBoudningBox(e, object_type) {
    handleTableSelect();
    const obj = e.target;

    if (!obj) {
      return;
    }
    if (!mutiplesection) {
      if (obj.type === "activeSelection") {
        obj.setControlsVisibility({
          mtr: false, // Rotation control
          deleteControl: false, // Hide delete control for groups
        });
        obj.set({
          lockRotation: false,
          lockMovementX: true,
          lockMovementY: true,
        });
      } else if (object_type !== "moving") {
        updateSelectedObjectDetails(obj);
      } else {
        setTableSelected(0);
        obj.setCoords();
        const objBoundingBox = obj.getBoundingRect();
        if (objBoundingBox.top < 0) {
          obj.set("top", 0);
          obj.setCoords();
        }
        if (objBoundingBox.left > canvas.width - objBoundingBox.width) {
          obj.set("left", canvas.width - objBoundingBox.width);
          obj.setCoords();
        }
        if (objBoundingBox.top > canvas.height - objBoundingBox.height) {
          obj.set("top", canvas.height - objBoundingBox.height);
          obj.setCoords();
        }
        if (objBoundingBox.left < 0) {
          obj.set("left", 0);
          obj.setCoords();
        }
      }
    }
  }

  const getOverlappingTable = (targetTable) => {
    return canvas
      .getObjects()
      .find(
        (obj) => obj !== targetTable && targetTable.intersectsWithObject(obj)
      );
  };

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
    let type_name = objectData.special_feature;
    let table_type_with_chair = objectData.table_type_with_chair;
    let selected_canvas = "";
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
        false,
        0,
        type_name,
        selected_canvas
      );
      canvas.add(o);
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
        false,
        0,
        "Standard",
        "",
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
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
        false,
        0,
        "Standard",
        "",
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
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
        false,
        0,
        type_name,
        selected_canvas,
        "",
        table_type_with_chair
      );
      canvas.add(o);
    }
  };

  const getNextTableNumber = () => {
    const tableObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "table");
    const true_block = canvas
      .getObjects()
      .filter((obj) => obj.blocked === true);
    const maxNumber = tableObjects.reduce((max, obj) => {
      const numberWithoutPrefix = obj._objects[1].text.replace(/^T/, ""); // Remove the 'T' prefix
      const numberValue = parseInt(numberWithoutPrefix); // Parse the number as an integer
      return numberValue > max ? numberValue : max;
    }, 0);

    setTotalTable(tableObjects.length);
    setTotalBlockTable(true_block);
    return maxNumber + 1;
  };

  const CreateTable = (table_type_with_chair) => {
    if (!mutiplesection) {
      const number_table = 0;
      const number_table_with_t = "T" + getNextTableNumber();
      const scaleX_position = 1;
      const scaley_position = 1;
      let chair_img;
      let min;
      let max;
      let preferred;
      let height;
      let width;
      if (table_type_with_chair == "square_table_two") {
        chair_img = SquareTable2;
        min = "1";
        preferred = "2";
        max = "2";
        width = 60;
        height = 70;
      } else if (table_type_with_chair == "square_table_four") {
        chair_img = SquareTable4;
        min = "1";
        preferred = "4";
        max = "4";
        width = 80;
        height = 75;
      } else if (table_type_with_chair == "square_table_six") {
        chair_img = SquareTable6;
        min = "1";
        preferred = "6";
        max = "6";
        width = 105;
        height = 70;
      } else if (table_type_with_chair == "square_table_eight") {
        chair_img = SquareTable8;
        min = "1";
        preferred = "8";
        max = "8";
        width = 120;
        height = 70;
      } else {
        chair_img = SquareTable6;
        min = "1";
        preferred = "6";
        max = "6";
        width = 105;
        height = 70;
      }

      createImageWithTextGroup(
        10,
        10,
        width,
        height,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        0,
        "",
        1,
        min,
        preferred,
        max,
        0,
        "square_table",
        false,
        0,
        "Standard",
        "",
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
        })
        .catch((err) => {
          console.error("Failed to create group:", err);
        });
    }
  };
  const CreateRoundTable = (table_type_with_chair) => {
    if (!mutiplesection) {
      const number_table = 0;
      const number_table_with_t = "T" + getNextTableNumber();
      const scaleX_position = 1;
      const scaley_position = 1;
      let chair_img;
      let min;
      let max;
      let preferred;
      let height;
      let width;
      if (table_type_with_chair == "round_table_two") {
        chair_img = RoundTable2;
        min = "1";
        preferred = "2";
        max = "2";
        width = 87;
        height = 85;
      } else if (table_type_with_chair == "round_table_three") {
        chair_img = RoundTable3;
        min = "1";
        preferred = "4";
        max = "4";
        width = 87;
        height = 85;
      } else if (table_type_with_chair == "round_table_four") {
        chair_img = RoundTable4;
        min = "1";
        preferred = "6";
        max = "6";
        width = 87;
        height = 85;
      } else if (table_type_with_chair == "round_table_six") {
        chair_img = RoundTable6;
        min = "1";
        preferred = "8";
        max = "8";
        width = 87;
        height = 85;
      } else {
        chair_img = RoundTable6;
        min = "1";
        preferred = "6";
        max = "6";
        width = 87;
        height = 85;
      }

      createImageWithTextGroup(
        10,
        10,
        width,
        height,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        0,
        "",
        1,
        min,
        preferred,
        max,
        0,
        "circle",
        false,
        0,
        "Standard",
        "",
        chair_img,
        table_type_with_chair
      )
        .then((group) => {
          canvas.add(group).setActiveObject(group);
        })
        .catch((err) => {
          console.error("Failed to create group:", err);
        });
    }
  };
  const CreateBarTable = () => {
    if (!mutiplesection) {
      const number_table = 0;
      const number_table_with_t = "T" + getNextTableNumber();
      const scaleX_position = 1;
      const scaley_position = 1;

      const o = addCircleTriangle(
        0,
        0,
        180,
        60,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        0,
        "",
        1,
        1,
        3,
        6,
        0,
        "counter",
        false,
        0,
        "Standard",
        ""
      );
      canvas.add(o);
      canvas.setActiveObject(o);
    }
  };

  const CreateExtraElement = (icon_name) => {
    const number_table = 0;
    const number_table_with_t = "T" + getNextTableNumber();
    const scaleX_position = 1;
    const scaley_position = 1;
    if (!mutiplesection) {
      const o = addCircleTriangle(
        0,
        0,
        60,
        60,
        0,
        number_table,
        number_table_with_t,
        scaleX_position,
        scaley_position,
        0,
        "",
        1,
        1,
        3,
        6,
        0,
        icon_name,
        false,
        0,
        "Standard",
        ""
      );

      canvas.add(o);
      canvas.setActiveObject(o);
    }
  };
  const RemoveObjectSelected = () => {
    setModalShow1(true);
  };
  const RemoveObjectSelected_final = () => {
    if (MutipleTableComId !== 0 && tableSelected === 2) {
      master_data_action(MutipleTableComId, "1", MutipleTableComIdindex);
    } else if (MutipleTableComId === 0 && tableSelected === 2) {
      setTotalCombinationTable((prevState) => {
        const filteredState = prevState.filter(
          (item) =>
            item.table_code !== MutipleTableName ||
            item.table_code_ids !== MutipleTableNameId
        );

        // Add a new array
        return [...filteredState];
      });

      handleTableSelect();
    } else if (MutipleTableComId !== 0 && tableSelected === 1) {
      master_data_action(MutipleTableComId, "2", "0");
    } else {
      const obj = canvas.getActiveObject();
      try {
        if (obj) {
          let get_table_name = obj._objects[1].text;
          let get_table_ids = obj.id;
          setTotalCombinationTable((prevState) => {
            const filteredState = prevState.filter(
              (item) =>
                !item.table_code.includes(get_table_name) ||
                !item.table_code_ids.includes(get_table_ids)
            );

            // Add a new array
            return [...filteredState];
          });

          obj.remove();
          canvas.remove(obj);
          canvas.discardActiveObject();
          canvas.renderAll();
          handleTableSelect();
        }
      } catch (error) {
        console.log(error);
      }
    }
    setModalShow1(false);
  };
  const backbutton = () => {
    handleTableSelect();
  };

  const master_data_action = async (call_id, flag, index_remove) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("id_for_delete", call_id);
    fd.append("flag", flag);
    await server_post_data(delete_tablesetup, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (flag === "1") {
            setTotalCombinationTable((prevState) => {
              // Filter out the array at the specified index
              const updatedTable = prevState.filter(
                (_, index) => index !== index_remove
              );
              return updatedTable;
            });
            setMutipleTableComIdindex("0");
          } else if (flag === "2") {
            const o = canvas.getActiveObject();
            try {
              if (o) {
                o.remove();
                canvas.remove(o);
                canvas.discardActiveObject();
                canvas.renderAll();
              }
            } catch (error) {
              console.log(error);
            }
          }

          handleTableSelect();
        }
      })
      .catch((error) => {
        setshowLoaderAdmin(false);
      });
  };

  const handleotherinformation = (e, click_type, single_mutiple) => {
    if (canvas) {
      const obj = canvas.getActiveObject();
      if (obj || single_mutiple !== "single") {
        if (single_mutiple === "single") {
          if (obj.type === "table") {
            const max_seat = document.getElementById("max_seat");
            const preferred_seat = document.getElementById("preferred_seat");
            const min_seat = document.getElementById("min_seat");
            if (click_type === "block") {
              obj.blocked = !obj.blocked;
              const isBlocked = obj.blocked;
              const fillColor = isBlocked ? blocked_main : tableFill_main;
              // Set lockMovement properties based on blocked status
              obj.set({
                lockMovementX: isBlocked,
                lockMovementY: isBlocked,
              });

              obj.getObjects().forEach((subObj) => {
                if (subObj.fill !== white_main) {
                  SvgColorChange(subObj, fillColor, () => {
                    subObj.set({ fill: fillColor });
                    subObj.set({ CustomColor: fillColor });

                    let number_table = obj.id;
                    let split_data = obj.globalCompositeOperation.split("@@@");
                    let available_online = split_data[1];
                    let min_person = split_data[2];
                    let preferred_person = split_data[3];
                    let max_person = split_data[4];
                    let priority_level = split_data[5];
                    let starnder_type = split_data[6];
                    let type_name = split_data[7];
                    let prsent_color = fillColor;
                    obj.globalCompositeOperation =
                      number_table +
                      "@@@" +
                      available_online +
                      "@@@" +
                      min_person +
                      "@@@" +
                      preferred_person +
                      "@@@" +
                      max_person +
                      "@@@" +
                      priority_level +
                      "@@@" +
                      starnder_type +
                      "@@@" +
                      type_name +
                      "@@@" +
                      prsent_color;
                  });
                }
              });
            } else if (click_type === "online") {
              let available_online = e.target.checked ? 1 : 0;
              let number_table = obj.id;

              let split_data = obj.globalCompositeOperation.split("@@@");
              let min_person = split_data[2];
              let preferred_person = split_data[3];
              let max_person = split_data[4];
              let priority_level = split_data[5];
              let starnder_type = split_data[6];
              let type_name = split_data[7];
              let prsent_color = split_data[8];
              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;
            } else if (click_type === "type_save") {
              const type_save_single =
                document.getElementById("type_save_single");
              let split_data = obj.globalCompositeOperation.split("@@@");
              let number_table = split_data[0];
              let available_online = split_data[1];
              let min_person = split_data[2];
              let preferred_person = split_data[3];
              let max_person = split_data[4];
              let priority_level = split_data[5];
              let starnder_type = type_save_single.value;
              let type_name = split_data[7];
              let prsent_color = split_data[8];

              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;
            } else if (click_type === "min") {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              if (e.target.value == "0" || e.target.value == "") {
                e.target.value = "1";
              }

              let number_table = obj.id;

              let split_data = obj.globalCompositeOperation.split("@@@");
              let available_online = split_data[1];
              let min_person = e.target.value;
              let preferred_person = split_data[3];
              let max_person = split_data[4];
              let priority_level = split_data[5];
              let starnder_type = split_data[6];
              let type_name = split_data[7];
              let prsent_color = split_data[8];
              if (parseInt(e.target.value) > parseInt(preferred_person)) {
                e.target.value = 1;
              }

              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;
            } else if (click_type === "prefreed") {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              if (e.target.value == "0" || e.target.value == "") {
                e.target.value = "1";
              }
              let number_table = obj.id;

              let split_data = obj.globalCompositeOperation.split("@@@");
              let available_online = split_data[1];
              let min_person = split_data[2];
              let preferred_person = e.target.value;
              let max_person = split_data[4];
              let priority_level = split_data[5];
              let starnder_type = split_data[6];
              let type_name = split_data[7];
              let prsent_color = split_data[8];
              if (parseInt(min_person) > parseInt(e.target.value)) {
                e.target.value = min_seat.value;
              }

              if (parseInt(e.target.value) < parseInt(min_person)) {
                e.target.value = min_seat.value;
              }
              if (parseInt(e.target.value) > parseInt(max_person)) {
                e.target.value = max_person;
              }

              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;

              obj.item(2).set("text", "F-" + preferred_person + "P"); // Assuming p0 is the third item in the group
            } else if (click_type === "max") {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              if (e.target.value == "0" || e.target.value == "") {
                e.target.value = "1";
              }

              let number_table = obj.id;

              let split_data = obj.globalCompositeOperation.split("@@@");
              let available_online = split_data[1];
              let min_person = split_data[2];
              let preferred_person = split_data[3];
              let max_person = e.target.value;
              let priority_level = split_data[5];
              let starnder_type = split_data[6];
              let type_name = split_data[7];
              let prsent_color = split_data[8];
              if (parseInt(e.target.value) < parseInt(min_person)) {
                min_seat.value = "1";
                min_person = min_seat.value;
              }
              if (parseInt(e.target.value) < parseInt(preferred_person)) {
                preferred_seat.value = e.target.value;
                preferred_person = preferred_seat.value;
                obj.item(2).set("text", "F-" + preferred_person + "P"); // Assuming p0 is the third item in the group
              }

              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;
            } else if (click_type === "priority") {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              if (e.target.value === "") {
                e.target.value = "0";
              }
              let make_full = Number(TotalTable + TotalCombinationTable.length);
              if (e.target.value > make_full) {
                e.target.value = make_full;
              }
              let number_table = obj.id;

              let split_data = obj.globalCompositeOperation.split("@@@");
              let available_online = split_data[1];
              let min_person = split_data[2];
              let preferred_person = split_data[3];
              let max_person = split_data[4];
              let priority_level = e.target.value;
              let starnder_type = split_data[6];
              let type_name = split_data[7];
              let prsent_color = split_data[8];
              obj.globalCompositeOperation =
                number_table +
                "@@@" +
                available_online +
                "@@@" +
                min_person +
                "@@@" +
                preferred_person +
                "@@@" +
                max_person +
                "@@@" +
                priority_level +
                "@@@" +
                starnder_type +
                "@@@" +
                type_name +
                "@@@" +
                prsent_color;
            } else if (click_type === "table_type") {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");

              let table_value_t = "T" + e.target.value;
              const tableObject = findTableByNumber(table_value_t);

              if (tableObject) {
                alert("Table No Present");
              } else {
                if (obj) {
                  obj.item(1).set("text", table_value_t); // Assuming T is the second item in the group
                }
              }
            }
          }
          canvas.renderAll();
        } else {
          const max_seat = document.getElementById("max_seat_mutiple");
          const preferred_seat = document.getElementById(
            "preferred_seat_mutiple"
          );
          const min_seat = document.getElementById("min_seat_mutiple");
          if (click_type === "priority") {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value == "0" || e.target.value == "") {
              e.target.value = "0";
            }
            let make_full = Number(TotalTable + TotalCombinationTable.length);
            if (e.target.value > make_full) {
              e.target.value = make_full;
            }
            setMutiplePriorityPerson(e.target.value);
          } else if (click_type === "max") {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value == "0" || e.target.value == "") {
              e.target.value = "1";
            }
            if (parseInt(e.target.value) < parseInt(min_seat.value)) {
              min_seat.value = "1";
              setMutipleMinPerson(min_seat.value);
            }
            if (parseInt(e.target.value) < parseInt(preferred_seat.value)) {
              preferred_seat.value = e.target.value;
              setMutiplePreferredPerson(preferred_seat.value);
            }

            setMutipleMaxPerson(e.target.value);
          } else if (click_type === "prefreed") {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value == "0" || e.target.value == "") {
              e.target.value = "1";
            }

            if (parseInt(min_seat.value) > parseInt(e.target.value)) {
              e.target.value = min_seat.value;
            }

            if (parseInt(e.target.value) < parseInt(min_seat.value)) {
              e.target.value = min_seat.value;
            }
            if (parseInt(e.target.value) > parseInt(max_seat.value)) {
              e.target.value = max_seat.value;
            }

            setMutiplePreferredPerson(e.target.value);
          } else if (click_type === "min") {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value == "0" || e.target.value == "") {
              e.target.value = "1";
            }

            if (parseInt(e.target.value) > parseInt(preferred_seat.value)) {
              e.target.value = 1;
            }
            setMutipleMinPerson(e.target.value);
          } else if (click_type === "online") {
            let available_online = e.target.checked ? 1 : 0;
            setMutipleAvailableOnline(available_online);
          }
        }
      }
    }
  };

  const SvgColorChange = (subObj, new_color_code, callback) => {
    // Modify the SVG source with the new color
    if (subObj.OriginalSrc) {
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
    } else {
      if (callback) {
        callback(); // Call the callback after the image is loaded
      }
    }
  };
  const findTableByNumber = (tableNumber) => {
    return canvas.getObjects().find((obj) => obj.number === tableNumber);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("reservation_id", "0");
    fd.append("reservation_date", "0");
    await server_post_data(get_all_table_position, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_dining_area2.length > 0) {
            setAreaName(
              Response.data.message.data_dining_area2[0].dining_area_name
            );
            setTotalTable(
              Response.data.message.data_dining_area2[0].no_of_table
            );
          }

          setTotalCombinationTable(Response.data.message.data_dining_area1);
          initCanvas(Response.data.message.data_dining_area);
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
        handleError("network");
      });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    if (canvas) {
      let vaild_data = check_vaild_save(form_data);
      if (vaild_data) {
        setshowLoaderAdmin(true);
        const data = canvas.getObjects().map((obj) => {
          return obj.toObject();
        });
        let i = 0;
        let count_value = 0;
        let fd_from = combiled_form_data(form_data, null);
        data.forEach((objectData) => {
          let split_data = objectData.globalCompositeOperation.split("@@@");
          console.log(split_data);
          console.log(objectData);
          i++;
          fd_from.append("left_position" + i, objectData.left);
          fd_from.append("top_position" + i, objectData.top);
          fd_from.append("angle_position" + i, objectData.angle);
          fd_from.append(
            "table_type_with_chair" + i,
            objectData.table_type_with_chair
          );
          try {
            fd_from.append("table_code" + i, objectData.objects[1].text);
            fd_from.append("table_type" + i, objectData.objects[0].type);
            fd_from.append("fill_position" + i, split_data[8]);
            console.log(objectData.objects[0].fill);
            if (objectData.objects[0].type !== "counter") count_value++;
          } catch (err) {
            fd_from.append("table_code" + i, split_data[7]);
            fd_from.append("table_type" + i, split_data[7]);
            fd_from.append("fill_position" + i, "");
          }

          fd_from.append("scalex_position" + i, objectData.scaleX);
          fd_from.append("scaley_position" + i, objectData.scaleY);

          fd_from.append("id_for_update" + i, split_data[0]);
          fd_from.append("available_online" + i, split_data[1]);
          fd_from.append("min_person" + i, split_data[2]);
          fd_from.append("preferred_person" + i, split_data[3]);
          fd_from.append("max_person" + i, split_data[4]);
          fd_from.append("priority_level" + i, split_data[5]);
          fd_from.append("table_type_with_chair" + i, split_data[7]);
          fd_from.append("special_feature" + i, split_data[6]);
        });
        fd_from.append("total_canvas", i);
        fd_from.append("total_canvas_only", count_value);
        fd_from.append("block_color", blocked_main);
        fd_from.append("total_combination_count", TotalCombinationTable.length);
        fd_from.append("main_id", MainUpdateData);
        if (i !== 0) {
          TotalCombinationTable.forEach((item, index) => {
            let i = index + 1;
            fd_from.append("table_code_names" + i, item.table_code);
            fd_from.append("table_code_ids" + i, item.table_code_ids);
            fd_from.append("available_online_combi" + i, item.available_online);
            fd_from.append("min_person_combi" + i, item.min_person);
            fd_from.append("preferred_person_combi" + i, item.preferred_person);
            fd_from.append("max_person_combi" + i, item.max_person);
            fd_from.append("priority_level_combi" + i, item.priority_level);
            fd_from.append("total_table_combine" + i, item.total_table_combine);
            fd_from.append("special_feature_combine" + i, item.special_feature);
          });

          await server_post_data(url_for_save, fd_from)
            .then((Response) => {
              if (Response.data.error) {
                handleError(Response.data.message);
              } else {
                handleSuccessSession(
                  Response.data.message,
                  "/Floor_Plan_Management"
                );
              }
              setshowLoaderAdmin(false);
            })
            .catch((error) => {
              console.log(error);
              setshowLoaderAdmin(false);
              handleError("network");
            });
        } else {
          setshowLoaderAdmin(false);
        }
      }
    }
  };

  const handleClose1 = () => setModalShow1(false);

  const checkuncheckcombition = (e) => {
    setmutiplesection(e.target.checked);
    mutiplesection_check = e.target.checked;
    if (e.target.checked) {
      canvas.selection = true;
      canvas.selectionKey = "shiftKey";

      canvas.forEachObject(function (object) {
        // Set selectable property to false

        if (object.cacheKey) {
          object.set({
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
          });
        } else if (object._objects[0].type === "counter") {
          object.set({
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
          });
        } else {
          object.set({
            lockMovementX: true,
            lockMovementY: true,
          });
        }
      });
    } else {
      canvas.selection = false;
      canvas.forEachObject(function (object) {
        // Set selectable property to false
        if (object.cacheKey) {
          object.set({
            selectable: true,
            lockMovementX: false,
            lockMovementY: false,
          });
        } else if (object._objects[0].type === "counter") {
          object.set({
            selectable: true,
            lockMovementX: false,
            lockMovementY: false,
          });
        } else {
          object.set({
            lockMovementX: false,
            lockMovementY: false,
          });
        }
      });
    }
    canvas.renderAll();
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const popupRef = useRef(null);
  const popupRef2 = useRef(null);
  const squareRef = useRef(null);
  const squareRef2 = useRef(null);

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !squareRef.current.contains(event.target)
    ) {
      setShowPopup(false);
    }
  };

  const handleClickOutside2 = (event) => {
    if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !squareRef2.current.contains(event.target)
    ) {
      setShowPopup2(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside2, true);
    return () => {
      document.removeEventListener("click", handleClickOutside2, true);
    };
  }, []);

  return (
    <div>
      {showLoaderAdmin && <Loader />}
      <div className="row m-0">
        <div className="col-sm-1">
          <div className="addTableBarContainer">
            <h6 className="pt-4 text-center">Table</h6>
            <div className="addTableBar">
              <button className="addCounterBtn bar" onClick={CreateBarTable}>
                <img className="counterImg" src={Counter} alt="Table Icon" />
                <p className="tableNAme">Counter</p>
              </button>
              <button
                className="addroundTable circle"
                onClick={() => setShowPopup2(true)}
                ref={squareRef2}
              >
                <img src={RoundTable2} alt="Table Icon" />
                <div className="tablenameButton">
                  <p className="tableName">Round</p>
                  {showPopup2 && (
                    <div
                      className={`popup tablePop ${
                        showPopup2 ? "popupsHOW" : ""
                      }`}
                      ref={popupRef2}
                    >
                      <button
                        onClick={() => CreateRoundTable("round_table_two")}
                      >
                        <img src={RoundTable2} alt="table-2" />
                      </button>
                      <button
                        onClick={() => CreateRoundTable("round_table_three")}
                      >
                        <img src={RoundTable3} alt="table-2" />
                      </button>
                      <button
                        onClick={() => CreateRoundTable("round_table_four")}
                      >
                        <img src={RoundTable4} alt="table-2" />
                      </button>
                      <button
                        onClick={() => CreateRoundTable("round_table_six")}
                      >
                        <img src={RoundTable6} alt="table-2" />
                      </button>
                    </div>
                  )}
                </div>
              </button>
              <button
                className="addSquareTable rectangle"
                onClick={() => setShowPopup(true)}
                ref={squareRef}
              >
                <div className="pb-1">
                  <img
                    style={{ width: "40px", height: "35px" }}
                    src={SquareTable2}
                    alt="Table Icon"
                  />
                </div>
                <div className="tablenameButton">
                  <p className="tableName">Square</p>
                  {showPopup && (
                    <div
                      className={`popup tablePop ${
                        showPopup ? "popupsHOW" : ""
                      }`}
                      ref={popupRef}
                    >
                      <button onClick={() => CreateTable("square_table_two")}>
                        <img src={SquareTable2} alt="table-2" />
                      </button>
                      <button onClick={() => CreateTable("square_table_four")}>
                        <img src={SquareTable4} alt="table-2" />
                      </button>
                      <button onClick={() => CreateTable("square_table_six")}>
                        <img src={SquareTable6} alt="table-2" />
                      </button>
                      <button onClick={() => CreateTable("square_table_eight")}>
                        <img src={SquareTable8} alt="table-2" />
                      </button>
                    </div>
                  )}
                </div>
              </button>
              <hr
                style={{
                  height: "1px",
                  width: "100%",
                  borderTop: "1px solid #666666",
                }}
              />
              <button
                className="addSquareTable rectangle"
                onClick={() => CreateExtraElement("pillar")}
              >
                <p>Pillar</p>
                <div>
                  <img src={pillarIcon} alt="Pillar Icon" />
                </div>
              </button>
              <button
                className="addSquareTable rectangle"
                onClick={() => CreateExtraElement("decorative")}
              >
                <p>Decorative</p>
                <div>
                  <img src={decorativeicon} alt="Decorative Icon" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="col-sm-7">
          <div className="tableStatusContainer_wrapper">
            <div className="tableStatusContainer justify_right">
              <div className="tableStatusDiv">
                <div className="tableStatusColor blankTable"></div>
                <p>Blank Table</p>
              </div>
              <div className="tableStatusDiv">
                <div className="tableStatusColor blockTable"></div>
                <p>Block Table</p>
              </div>
            </div>
            <div className="magnifireDiv">
              <div
                className="plusMinusDiv plusMinusDivAdd"
                onClick={() => plus_min_canvas("min")}
              >
                <p>+</p>
              </div>
              <div
                className="plusMinusDiv plusMinusDivRem"
                onClick={() => plus_min_canvas("plus")}
              >
                <p>-</p>
              </div>
            </div>
          </div>
          <div className="selected" id="canvas-container">
            <canvas id="canvas" height={550} />
          </div>
          <div>
            <input type="checkbox" onClick={(e) => checkuncheckcombition(e)} />{" "}
            Multiple Selection
          </div>
        </div>
        <div className="col-sm-4 paddingLeft0 max_height_500px">
          <div className="editNewAreaSidebar">
            <div className={`Righ-side-bar ${tableSelected !== 0 && "hidden"}`}>
              <div className="right">
                <div className="Righ-side-bar">
                  <form id="CarrerformData">
                    <div className="right">
                      <div className="tableEditFormHead">
                        <h6 className="subheads">Selection Details</h6>
                      </div>
                      <h5>Area overview</h5>
                      <div className="newTableDetails">
                        <div className="editAreaName">
                          <h6 className="subheads p-0">Area Name</h6>
                          <input
                            className="newAreaName trio_mandatory"
                            type="text"
                            id="dining_area_name"
                            name="dining_area_name"
                            onInput={handleAphabetsChange}
                            minLength={2}
                            maxLength={20}
                            defaultValue={AreaName}
                          />
                          <span className="condition_error"></span>
                        </div>
                        <div className="totaltableDiv">
                          <h6 className="subheads p-0">
                            Total number of Table
                          </h6>
                          <h6 className="totalTableCount p-0">
                            <span>{TotalTable} </span>&nbsp;Table
                          </h6>
                        </div>
                        <div className="totaltableDiv">
                          <h6 className="subheadsBlack p-0">
                            Table Combination
                          </h6>
                          {TotalCombinationTable.length === 0 ? (
                            <h6 className="subheadsBlack p-0">0</h6>
                          ) : (
                            TotalCombinationTable.map((item, index) => (
                              <h6 key={index} className="subheadsBlack p-0">
                                {item.table_code.replace(/,/g, "+")},{" "}
                                <span>
                                  {item.min_person}-{item.max_person}P
                                </span>{" "}
                                <span
                                  className="float_right_table"
                                  onClick={() => editcombination(index)}
                                >
                                  EDIT
                                </span>
                              </h6>
                            ))
                          )}
                        </div>
                        <div className="totaltableDiv">
                          <h6 className="subheadsBlack p-0">Block Table</h6>
                          {TotalBlockTable.length === 0 ? (
                            <h6 className="subheadsBlack p-0">0</h6>
                          ) : (
                            TotalBlockTable.map((item, index) => (
                              <h6 key={index} className="subheadsBlack p-0">
                                {/* {item._objects[1].text} */}
                                {item._objects &&
                                  item._objects[1] &&
                                  item._objects[1].text}
                              </h6>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="saveAreaButtons">
                  <button
                    style={{ width: "100px" }}
                    className="cancelAreaBtn"
                    onClick={() => handleLinkClick("/Floor_Plan_Management")}
                  >
                    Cancel
                  </button>
                  <button
                    className="saveAreaBtn"
                    onClick={() =>
                      handleSaveChangesdynamic(
                        "CarrerformData",
                        sava_update_table_position
                      )
                    }
                  >
                    {location.pathname.includes("/Create_Floor_Plan") ? (
                      <>Create</>
                    ) : (
                      <>Save</>
                    )}{" "}
                    Area
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`selectedTableEdit ${tableSelected !== 1 && "hidden"}`}
            >
              <div className="Righ-side-bar">
                <div className="right">
                  <div className="tableEditFormHead">
                    <h6 className="subheads p-0">Selection Details</h6>

                    <button onClick={() => RemoveObjectSelected()}>
                      <img src={DeletIcon} alt="Barley's Dashboard" />
                    </button>
                  </div>
                  <h5 className="p-0">1 Table Selected</h5>
                  <div className="newTableDetails p-0">
                    <div className="editAreaName">
                      <div className="row m-0">
                        <div className="col-md-6 paddingLeft0">
                          <h6 className="subheads p-0">Table name</h6>
                          <input
                            className="newAreaName"
                            type="text"
                            id="table_name"
                            name="table_name"
                            maxLength={3}
                            onInput={(e) =>
                              handleotherinformation(e, "table_type", "single")
                            }
                          />
                        </div>
                        <div className="col-md-6 paddingRight0">
                          <h6 className="subheads p-0">Type</h6>
                          <select
                            className="newAreaName"
                            id="type_save_single"
                            onChange={(e) =>
                              handleotherinformation(e, "type_save", "single")
                            }
                          >
                            <option value="Standard">Standard</option>
                            <option value="Drink">Drink</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="toggleBtnsTabledit">
                      <div className="editableToggle mb-3">
                        <div className="on-off-toggle on-off-toggleTable">
                          <input
                            className="on-off-toggle__input"
                            type="checkbox"
                            role="switch"
                            id="online_status"
                            value={0}
                            onChange={(e) =>
                              handleotherinformation(e, "online", "single")
                            }
                          />

                          <label
                            htmlFor="online_status"
                            className="on-off-toggle__slider on-off-toggleTable__slider"
                          ></label>
                        </div>
                        <h6 className="labelsBlack p-0">
                          Available for online reservatiion
                        </h6>
                      </div>
                      <div className="editableToggle">
                        <div className="on-off-toggle on-off-toggleTable">
                          <input
                            className="on-off-toggle__input"
                            type="checkbox"
                            role="switch"
                            id="block_status"
                            value={0}
                            onChange={(e) =>
                              handleotherinformation(e, "block", "single")
                            }
                          />

                          <label
                            htmlFor="block_status"
                            className="on-off-toggle__slider on-off-toggleTable__slider on-off-blockTable__slider"
                          ></label>
                        </div>
                        <h6 className="labelsBlack p-0">Block Table</h6>
                      </div>
                    </div>
                    <div className="totaltableDiv">
                      <h6 className="subheadsBlack p-0 mb-3">
                        Number of Seats
                      </h6>
                      <div className="row m-0">
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Min</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="min_seat"
                                defaultValue={1}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(e, "min", "single")
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Preferred</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="preferred_seat"
                                defaultValue={1}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(
                                    e,
                                    "prefreed",
                                    "single"
                                  )
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Max</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="max_seat"
                                defaultValue={1}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(e, "max", "single")
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 my-3 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Priority Order</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="priority_seat"
                                defaultValue={1}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(
                                    e,
                                    "priority",
                                    "single"
                                  )
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>
                                  /{TotalTable + TotalCombinationTable.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="saveAreaButtons paddingLeft0">
                  <button
                    className="cancelAreaBtn"
                    onClick={() => backbutton()}
                  >
                    Back
                  </button>
                  <button className="saveAreaBtn" onClick={handleTableSelect}>
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`selectedTableEdit ${tableSelected !== 2 && "hidden"}`}
            >
              <div className="Righ-side-bar">
                <div className="right">
                  <div className="tableEditFormHead">
                    <h6 className="subheads p-0">Selection Details</h6>

                    <button onClick={() => RemoveObjectSelected()}>
                      <img src={DeletIcon} alt="Barley's Dashboard" />
                    </button>
                  </div>
                  <h5 className="p-0">{MutipleTableSelected} Table Selected</h5>
                  <div className="newTableDetails p-0">
                    <div className="editAreaName">
                      <div className="row m-0">
                        <div className="col-md-6 paddingLeft0">
                          <h6 className="subheads p-0">Table name</h6>
                          {MutipleTableName}
                        </div>
                        <div className="col-md-6 paddingRight0">
                          <h6 className="subheads p-0">Type</h6>
                          <select className="newAreaName" id="mutiple_type">
                            <option value="Standard">Standard</option>
                            <option value="Drink">Drink</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="toggleBtnsTabledit">
                      <div className="editableToggle mb-3">
                        <div className="on-off-toggle on-off-toggleTable">
                          <input
                            className="on-off-toggle__input"
                            type="checkbox"
                            role="switch"
                            id="online_status_mutiple"
                            value={0}
                            // checked={MutipleAvailableOnline === 0}
                            defaultChecked={MutipleAvailableOnline === 1}
                            onChange={(e) =>
                              handleotherinformation(e, "online", "mutiple")
                            }
                          />

                          <label
                            htmlFor="online_status_mutiple"
                            className="on-off-toggle__slider on-off-toggleTable__slider"
                          ></label>
                        </div>
                        <h6 className="labelsBlack p-0">
                          Available for online reservatiion
                        </h6>
                      </div>
                    </div>
                    <div className="totaltableDiv">
                      <h6 className="subheadsBlack p-0 mb-3">
                        Number of Seats
                      </h6>
                      <div className="row m-0">
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Min</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="min_seat_mutiple"
                                defaultValue={MutipleMinPerson}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(e, "min", "mutiple")
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Preferred</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="preferred_seat_mutiple"
                                defaultValue={MutiplePreferredPerson}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(
                                    e,
                                    "prefreed",
                                    "mutiple"
                                  )
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Max</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="max_seat_mutiple"
                                defaultValue={MutipleMaxPerson}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(e, "max", "mutiple")
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>P</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 my-3 paddingLeft0">
                          <div className="tablePersoninput">
                            <p>Priority Order</p>
                            <div className="tablePersoninputContianer">
                              <input
                                type="text"
                                id="priority_seat_mutiple"
                                defaultValue={MutiplePriorityPerson}
                                maxLength={3}
                                onBlur={(e) =>
                                  handleotherinformation(
                                    e,
                                    "priority",
                                    "mutiple"
                                  )
                                }
                              />
                              <div className="leabelPersnInput">
                                <p>
                                  /{TotalTable + TotalCombinationTable.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="saveAreaButtons paddingLeft0">
                  <button
                    className="cancelAreaBtn"
                    onClick={() => backbutton()}
                  >
                    Back
                  </button>
                  <button
                    className="saveAreaBtn"
                    onClick={addMultipleCombination}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                Do You Want Delete This{" "}
                {tableSelected === 2
                  ? "Combination"
                  : "Table With Combinations"}{" "}
                ?
              </h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="releaseModalFooter">
          <Button
            className="releaseModalBtn Release_Table"
            onClick={() => RemoveObjectSelected_final()}
          >
            <label style={{ cursor: "pointer" }}>Yes</label>
          </Button>
          <Button className="editNowBtn Edit_Now" onClick={handleClose1}>
            <label style={{ cursor: "pointer" }}>No</label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
