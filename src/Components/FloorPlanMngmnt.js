import React, { useState, useEffect } from "react";
import "./Css/TableSetup.css";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import MenuDots from "../assets/menuDots.svg";
import { Modal, Button } from "react-bootstrap";
import { FloorPlanMngmntPage } from "./../CommonJquery/WebsiteText";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  server_post_data,
  get_all_diningarea,
  delete_diningarea,
  update_primary_diningarea,
  update_diningarea_sequence,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  handleConfimDeleteClick,
  handleLinkClick,
} from "../CommonJquery/CommonJquery";
function FloorPlanMngmnt() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [FloorData, setFloorData] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);
  useEffect(() => {
    const flag = "1";
    let call_id = "0";
    master_data_get("", "", flag, call_id);
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_diningarea, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          console.log(Response.data.message.data_dining_area);
          setFloorData(Response.data.message.data_dining_area);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const master_data_action = async (call_id) => {
    if (handleConfimDeleteClick()) {
      setshowLoaderAdmin(true);
      const fd = new FormData();
      fd.append("main_id", call_id);
      await server_post_data(delete_diningarea, fd)
        .then((Response) => {
          setshowLoaderAdmin(false);
          console.log(Response.data);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            master_data_get("", "", "1", "0");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };
  const confirmVIP = (index) => {
    master_data_action_update(SelectedData.primary_id, "0");
  };

  const master_data_action_update = async (call_id, for_status_final) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("id_for_delete", call_id);
    fd.append("flag_for", "1");
    fd.append("for_status_final", for_status_final);
    await server_post_data(update_primary_diningarea, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          closeModal();
          master_data_get("", "", "1", "0");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const saving_sequence = async (sequenceOrder) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("sequenceOrder", sequenceOrder);
    fd.append("flag_for", "1");
    await server_post_data(update_diningarea_sequence, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [selectedGuestIndex, setSelectedGuestIndex] = useState(null);

  const openModal = (guestName, index) => {
    setSelectedData(guestName);
    setShowModal(true);
    setClickedButton(guestName.dining_area_name);
    setSelectedGuestIndex(index);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = FloorData[dragIndex];
    const updatedData = [...FloorData];
    updatedData.splice(dragIndex, 1);
    updatedData.splice(hoverIndex, 0, draggedItem);
    setFloorData(updatedData);
  };

  const DraggableItem = ({ index, item }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "ITEM",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: "ITEM",
      hover(item) {
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) {
          return;
        }
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
      drop: () => {
        //console.log('hii');
        const sequenceOrder = FloorData.map((item) => item.primary_id);

        saving_sequence(sequenceOrder);
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <tr
        ref={(node) => drag(drop(node))}
        style={{ boxShadow:"none",borderBottom:"1px solid #d9d9d9" }}
        className="tableRow tbodyStyle"
      >
        <td className="th1 tabledata">{index + 1}</td>
        <td className="th1 tabledata">
          <div className="guest_incenter borderLeftRadius">
            {item.dining_area_name}
          </div>
        </td>
        <td className="tabledata">
          <div className="guest_incenter shadowOnlyBottom">
            {item.no_of_table}
          </div>
        </td>
        <td className="tabledata">
          {index + 1}
          {/* <button
            type="button"
            className={`markVip Mark_Vip ${
              item.primary_status === 1 ? "vipMarked" : ""
            }`}
          >
            <p>Primary</p>
          </button> */}
        </td>
        <td className="th2 tabledata">
          <div className="guest_incenter borderRightRadius">
            <div className="dropdown">
              <button
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-placement="left"
                title="Edit Dining Area"
                className="dropdown-toggle editDiningArea Edit_Dining_Area"
              >
                <img src={MenuDots} alt="Barley's Dashboard" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    onClick={() =>
                      handleLinkClick("/Edit_Floor_Plan/" + item.primary_id)
                    }
                  >
                    {FloorPlanMngmntPage.Edit}
                  </Link>
                </li>
                <li className="delete_option">
                  <Link
                    className="dropdown-item"
                    onClick={() => master_data_action(item.primary_id)}
                  >
                    {FloorPlanMngmntPage.Delete}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </td>
      </tr>
    );
  };
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
              <div className="pageCntn_head_left">
                <div className="pageNameDiv">
                  <p>{FloorPlanMngmntPage.Floor_Management} </p>
                  <img src={GreyArrow} alt="Barley's Dashboard" />
                </div>
              </div>
              <Link to="/Create_Floor_Plan">
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Create Dining Area"
                  className="createDiningArea Create_Dining_Area"
                >
                  {FloorPlanMngmntPage.Create_Dining_Area}
                </button>
              </Link>
            </div>

            <div className="page_body">
              <div className="viewGuest_table view_florPlan">
                <div className="viewGuest_table_container ">
                  <div className="row m-0">
                    <div className="col-md-12">
                      <DndProvider backend={HTML5Backend}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">S.No</th>
                              <th scope="col">Name</th>
                              <th scope="col">Tables</th>
                              <th scope="col">Priority</th>
                              <th scope="col"></th>
                            </tr>
                            <tr style={{ height: "1rem", border: "none" }}></tr>
                          </thead>
                          <tbody className="tboday">
                            {FloorData.map((item, index) => (
                              <DraggableItem
                                key={item.primary_id}
                                index={index}
                                item={item}
                              />
                            ))}
                          </tbody>
                        </table>
                      </DndProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Body className="modal_body">
          <div className="success_img d-flex justify-content-center">
            {/* ... Modal content goes here ... */}
          </div>

          <p>
            Are you sure you want to mark{" "}
            <span style={{ color: "#3268C1" }}>{clickedButton}</span> as
            Default?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="logoutYesBtn"
            onClick={() => confirmVIP(selectedGuestIndex)}
          >
            Yes
          </Button>
          <Button className="logoutNoBtn" onClick={closeModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FloorPlanMngmnt;
