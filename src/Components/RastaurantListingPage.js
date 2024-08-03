import { useEffect } from "react";
import { fabric } from "fabric";
import RoundTableImage from "../assets/round-table.svg";
import TableImage from "../assets/table (2).svg";
import TriangleeImage from "../assets/triangle.svg";
import CashierImage from "../assets/cashier.svg";
import {
  addCircleTriangle,
  tableFill_main,
  backgroundColor_main,
  white_main,
  blocked_main,
} from "../CommonJquery/TableAssignment.js";
import {
  server_post_data,
  get_all_table_position,
  sava_update_table_position,
} from "../ServiceConnection/serviceconnection.js";

let canvas;
let initialPosition = {
  left: 0,
  top: 0,
};
let grid = 20;
export default function RastaurantListingPage() {
  useEffect(() => {
    const start_date = "";
    const end_date = "";
    const flag = "1";
    const call_id = "0";
    master_data_get(start_date, end_date, flag, call_id);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  const updateSelectedObjectDetails = (obj) => {
    const max_seat = document.getElementById("max_seat");
    const preferred_seat = document.getElementById("preferred_seat");
    const min_seat = document.getElementById("min_seat");
    const block_status = document.getElementById("block_status");
    const online_status = document.getElementById("online_status");
    const table_name = document.getElementById("table_name");
    const priority_seat = document.getElementById("priority_seat");
    if (obj) {
      if (obj.type === "table") {
        table_name.value = obj._objects[1].text.replace("T", "");
        let split_data = obj.globalCompositeOperation.split("@@@");
        let available_online = split_data[1];
        let min_person = split_data[2];
        let preferred_person = split_data[3];
        let max_person = split_data[4];
        let priority_level = split_data[5];
        console.log(split_data);
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
      } else {
        table_name.value = "";
        max_seat.value = "0";
        preferred_seat.value = "0";
        min_seat.value = "0";
        block_status.value = "0";
        online_status.value = "0";
        priority_seat.value = "0";
      }
    }
  };

  const initCanvas = (all_table_list) => {
    try {
      canvas = new fabric.Canvas("canvas");
      canvas.backgroundColor = backgroundColor_main;
      // all_table_list.forEach((objectData) => {
      //   createFabricObject(objectData);
      // });
      // Render all objects on the main canvas
      canvas.renderAll();
      canvas.on("mouse:down", function (e) {
        const target = e.target;

        if (target) {
          updateSelectedObjectDetails(target);
          try {
            initialPosition = {
              left: target.left,
              top: target.top,
            };
          } catch (err) {
            //rrr
          }
        }
      });

      canvas.on("mouse:up", function (e) {
        const target = e.target;
        if (target) {
          const position = {
            left: target.left,
            top: target.top,
          };

          if (
            initialPosition &&
            (position.left !== initialPosition.left ||
              position.top !== initialPosition.top)
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
      });
      canvas.on("object:moving", function (e) {
        checkBoudningBox(e);
      });
      canvas.on("object:rotating", function (e) {
        checkBoudningBox(e);
      });
      canvas.on("object:scaling", function (e) {
        checkBoudningBox(e);
      });
    } catch (error) {
      console.error("Error loading canvas ddd data:", error.message);
    }
  };

  function checkBoudningBox(e) {
    const obj = e.target;

    if (!obj) {
      return;
    }
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

  const getOverlappingTable = (targetTable) => {
    return canvas
      .getObjects()
      .find(
        (obj) => obj !== targetTable && targetTable.intersectsWithObject(obj)
      );
  };

  const createFabricObject = (objectData) => {
    const left_po = parseFloat(objectData.left_position);
    const top_po = parseFloat(objectData.top_position);

    const number_table_with_t = objectData.table_code;
    const scaleX_position = parseFloat(objectData.scalex_position);
    const scaley_position = parseFloat(objectData.scaley_position);
    const blocked_status = objectData.fill_position;
    let number_table = Number(objectData.qr_id);
    let available_online = objectData.available_online;
    let min_person = objectData.min_person;
    let preferred_person = objectData.preferred_person;
    let max_person = objectData.max_person;
    let priority_level = objectData.priority_level;
    let table_type = objectData.table_type;
    let angle_position = objectData.angle_position;
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
        false
      );
      canvas.add(o);
    } else if (table_type === "rect") {
      o = addCircleTriangle(
        left_po,
        top_po,
        60,
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
        false
      );
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
        false
      );
      canvas.add(o);
    } else if (table_type === "triangle") {
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
        "triangle",
        false
      );
      canvas.add(o);
    }
  };

  const getNextTableNumber = () => {
    const tableObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "table");
    const maxNumber = tableObjects.reduce(
      (max, obj) => (obj.number > max ? obj.number : max),
      0
    );

    return maxNumber + 1;
  };

  const CreateTable = () => {
    const number_table = 0;
    const number_table_with_t = "T" + getNextTableNumber();
    const scaleX_position = 1;
    const scaley_position = 1;

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
      0,
      1,
      3,
      6,
      0,
      "square_table",
      false
    );
    canvas.add(o);
    canvas.setActiveObject(o);
  };
  const CreateRoundTable = () => {
    const number_table = 0;
    const number_table_with_t = "T" + getNextTableNumber();
    const scaleX_position = 1;
    const scaley_position = 1;

    const o = addCircleTriangle(
      0,
      0,
      0,
      0,
      30,
      number_table,
      number_table_with_t,
      scaleX_position,
      scaley_position,
      0,
      "",
      0,
      1,
      3,
      6,
      0,
      "circle",
      false
    );
    canvas.add(o);
    canvas.setActiveObject(o);
  };
  const CreateTriangleTable = () => {
    const number_table = 0;
    const number_table_with_t = "T" + getNextTableNumber();
    const scaleX_position = 1;
    const scaley_position = 1;

    const o = addCircleTriangle(
      0,
      0,
      0,
      0,
      30,
      number_table,
      number_table_with_t,
      scaleX_position,
      scaley_position,
      0,
      "",
      0,
      1,
      3,
      6,
      0,
      "triangle",
      false
    );
    canvas.add(o);
    canvas.setActiveObject(o);
  };
  const CreateBarTable = () => {
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
      0,
      1,
      3,
      6,
      0,
      "counter",
      false
    );
    canvas.add(o);
    canvas.setActiveObject(o);
  };
  const RemoveObjectSelected = () => {
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
  };

  const handleotherinformation = (e, click_type) => {
    if (canvas) {
      const obj = canvas.getActiveObject();
      if (obj.type === "table") {
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
              subObj.set({ fill: fillColor });
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
            priority_level;
        } else if (click_type === "min") {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");

          let number_table = obj.id;

          let split_data = obj.globalCompositeOperation.split("@@@");
          let available_online = split_data[1];
          let min_person = e.target.value;
          let preferred_person = split_data[3];
          let max_person = split_data[4];
          let priority_level = split_data[5];

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
            priority_level;
        } else if (click_type === "prefreed") {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");

          let number_table = obj.id;

          let split_data = obj.globalCompositeOperation.split("@@@");
          let available_online = split_data[1];
          let min_person = split_data[2];
          let preferred_person = e.target.value;
          let max_person = split_data[4];
          let priority_level = split_data[5];

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
            priority_level;

          obj.item(2).set("text", "F-" + preferred_person + "P"); // Assuming p0 is the third item in the group
        } else if (click_type === "max") {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");

          let number_table = obj.id;

          let split_data = obj.globalCompositeOperation.split("@@@");
          let available_online = split_data[1];
          let min_person = split_data[2];
          let preferred_person = split_data[3];
          let max_person = e.target.value;
          let priority_level = split_data[5];

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
            priority_level;
        } else if (click_type === "priority") {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");

          let number_table = obj.id;

          let split_data = obj.globalCompositeOperation.split("@@@");
          let available_online = split_data[1];
          let min_person = split_data[2];
          let preferred_person = split_data[3];
          let max_person = split_data[4];
          let priority_level = e.target.value;

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
            priority_level;
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
        canvas.renderAll();
      }
    }
  };
  const findTableByNumber = (tableNumber) => {
    return canvas.getObjects().find((obj) => obj.number === tableNumber);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_table_position, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          alert(Response.data.message);
        } else {
          initCanvas(Response.data.message.table_list);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    if (canvas) {
      let fd_from = new FormData();

      const data = canvas.getObjects().map((obj) => {
        return obj.toObject();
      });
      let i = 0;
      data.forEach((objectData) => {
        let split_data = objectData.globalCompositeOperation.split("@@@");
        i++;
        console.log(objectData);
        fd_from.append("left_position" + i, objectData.left);
        fd_from.append("top_position" + i, objectData.top);
        fd_from.append("angle_position" + i, objectData.angle);
        fd_from.append("table_code" + i, objectData.objects[1].text);
        fd_from.append("scalex_position" + i, objectData.scaleX);
        fd_from.append("scaley_position" + i, objectData.scaleY);
        fd_from.append("fill_position" + i, objectData.objects[0].fill);
        fd_from.append("id_for_update" + i, split_data[0]);
        fd_from.append("available_online" + i, split_data[1]);
        fd_from.append("min_person" + i, split_data[2]);
        fd_from.append("preferred_person" + i, split_data[3]);
        fd_from.append("max_person" + i, split_data[4]);
        fd_from.append("priority_level" + i, split_data[5]);
        fd_from.append("table_type" + i, objectData.objects[0].type);
        fd_from.append("special_feature" + i, "");
      });
      fd_from.append("total_canvas", i);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response);
        })
        .catch((error) => {
          console.log(error);
        });
      //  console.log(JSON.stringify(data));
      // sessionStorage.setItem("canvasObjectData", JSON.stringify(data));
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-8">
          <div className="row">
            <div className="side-box flex">
              <button
                className="btn btn-primary rectangle flex flex-col justify-center items-center "
                onClick={CreateTable}
              >
                <div>
                  <img src={TableImage} alt="Table Icon" />
                </div>

                <p className=" text-[10px]">Table</p>
              </button>
              <button
                className="btn btn-primary circle flex flex-col justify-center items-center "
                onClick={CreateRoundTable}
              >
                <img src={RoundTableImage} alt="Table Icon" />

                <p className=" text-[10px]">Table</p>
              </button>
              <button
                className="btn btn-primary triangle flex flex-col justify-center items-center"
                onClick={CreateTriangleTable}
              >
                <img src={TriangleeImage} alt="Table Icon" />

                <p className=" text-[10px]">Triangle Table</p>
              </button>
              <button
                className="btn btn-primary bar flex flex-col justify-center items-center"
                onClick={CreateBarTable}
              >
                <img src={CashierImage} alt="Table Icon" />

                <p className=" text-[10px]">Bar</p>
              </button>{" "}
              <button
                className="btn btn-danger remove"
                onClick={RemoveObjectSelected}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="row">
            <canvas id="canvas" width={836} height={500} />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="Righ-side-bar">
            <div className="right">
              <h1>Selection Details</h1>
              <h3> Table Selected</h3>
              <div>
                <div className="c">
                  <div className="table-details">
                    <label>Table name</label>
                    <div className="wrapper">
                      <input
                        type="text"
                        id="table_name"
                        name="table_name"
                        maxLength={3}
                        onInput={(e) => handleotherinformation(e, "table_type")}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-check form-switch">
                  <div className="Active-input">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="online_status"
                      value={0}
                      onChange={(e) => handleotherinformation(e, "online")}
                    />
                  </div>

                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    Available for online reservation
                  </label>
                </div>

                <div className="form-check form-switch">
                  <div className="blockT">
                    <div className="Block-Table-input">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="block_status"
                        value={0}
                        onChange={(e) => handleotherinformation(e, "block")}
                      />
                    </div>

                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Block Table
                    </label>
                  </div>
                </div>

                <div className="number-seatClass ">
                  <div className="number-seat">
                    <label>Min</label>
                    <div className="seat"></div>
                    <div className="flex">
                      <input
                        type="text"
                        id="min_seat"
                        defaultValue={0}
                        maxLength={3}
                        onInput={(e) => handleotherinformation(e, "min")}
                      />
                      <div className=" px-2 h-[27px] bg-[#0000005c] text-white">
                        P
                      </div>
                    </div>
                  </div>

                  <div className="number-seat1">
                    <label>Preferred</label>
                    <div className="seat1"></div>
                    <div className="flex">
                      <input
                        type="text"
                        id="preferred_seat"
                        defaultValue={0}
                        maxLength={3}
                        onInput={(e) => handleotherinformation(e, "prefreed")}
                      />
                      <div className=" px-2 h-[27px] bg-[#0000005c] text-white">
                        P
                      </div>
                    </div>
                  </div>
                  <div className="number-seat2">
                    <label>Max</label>
                    <div className="seat2"></div>
                    <div className="flex">
                      <input
                        type="text"
                        id="max_seat"
                        defaultValue={0}
                        maxLength={3}
                        onInput={(e) => handleotherinformation(e, "max")}
                      />
                      <div className=" px-2 h-[27px] bg-[#0000005c] text-white">
                        P
                      </div>
                    </div>
                  </div>
                </div>

                <div className="Priority-Order">
                  <label>Priority Orider</label>
                  <div className="seat3"></div>
                  <div className="flex">
                    <input
                      type="text"
                      id="priority_seat"
                      defaultValue={0}
                      maxLength={3}
                      onInput={(e) => handleotherinformation(e, "priority")}
                    />
                    <div className=" px-2 h-[27px] bg-[#0000005c] text-white">
                      38
                    </div>
                  </div>
                </div>

                <div className="container-save-button">
                  <button
                    className="btn btn-warning customer-mode"
                    id="admin-save"
                    onClick={() =>
                      handleSaveChangesdynamic(
                        "CarrerformData",
                        sava_update_table_position
                      )
                    }
                  >
                    Save Arera
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
