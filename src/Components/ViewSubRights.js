import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import EditBtn from "../assets/edit_square.png";
import GuestIcon from "../assets/guestIcon.png";
import DltBtn from "../assets/delete.svg";
import DeactiIcon from "../assets/deactiIcon.png";
import { Modal, Button } from "react-bootstrap";
import {
  Open_Menu_text,
  ViewSubRightPages,
  ViewStaffPagesText,
} from "./../CommonJquery/WebsiteText";

import {
  server_post_data,
  get_all_StaffRights,
  action_update_staff_right,
} from "../ServiceConnection/serviceconnection.js";
import { handleError } from "../CommonJquery/CommonJquery";
import { Link, useLocation } from "react-router-dom";
function ViewSubRights() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [filteredData, setfilteredData] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [mainid, setMainid] = useState(0);

  useEffect(() => {
    const url = currentUrl;
    const parts = url.split("/");
    let call_id = "0";
    if (parts.length !== 1) {
      call_id = parts[1];
    }
    setMainid(call_id);
    master_data_get();
    
  }, []);

  const master_data_get = async () => {
    const url = currentUrl;
    const parts = url.split("/");
    let call_id = "0";
    if (parts.length !== 1) {
      call_id = parts[1];
    }
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("call_id", call_id);
    fd.append("flag", "2");
    await server_post_data(get_all_StaffRights, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setfilteredData(Response.data.message.data);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const master_data_action_update = async (call_id, for_status_final) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("id_for_delete", call_id);
    fd.append("flag_for", "1");
    fd.append("for_status_final", for_status_final);
    await server_post_data(action_update_staff_right, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          // toggleRef.current.click();
          handleClose();
          master_data_get();
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleActiveDeactive = () => {
    let allow_access_data = "c";
    if (SelectedData.flag === "c") {
      allow_access_data = "d";
    }
    console.log(SelectedData.id, SelectedData.flag);
    master_data_action_update(SelectedData.id, allow_access_data);
  };
  const handleDeactivate = () => {
    handleActiveDeactive();
  };
  const handleClose = () => setModalShow(false);
  const handleShow = (data_call) => {
    setSelectedData(data_call);
    console.log(data_call);
    setModalShow(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{ViewSubRightPages.Staff_Sub_Rights}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>

              <div className="col-xl-2 col-sm-4 bottomAlgin">
                <Link to={`/create_SubStaff_Rights/${mainid}`}>
                  <button type="button" className="btnAddStaff add_staff">
                    {ViewSubRightPages.Add_Btn}
                  </button>
                </Link>
              </div>
            </div>

            <div className="page_body">
              <div className="viewStaff">
                <div className="viewGuest_table">
                  <div className="viewGuest_table_container">
                    <div className="row m-0">
                      <div className="col-md-12">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <div className="theadStyle imgThead">
                                  <span>{ViewSubRightPages.Right_Name}</span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewSubRightPages.URL_ID_text}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewSubRightPages.Status_text}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewSubRightPages.Action_text}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tboday">
                            {filteredData.map((option, index) => (
                              <React.Fragment>
                                <tr className="tableRow">
                                  <td className="th1">
                                    <div className="tbodyStyle guest_incenter borderLeftRadius">
                                      {option.page_name}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tbodyStyle guest_incenter shadowOnlyBottom">
                                      {option.page_url_id.slice(0, 20)}
                                      {option.page_url_id.length > 20
                                        ? `...`
                                        : ``}
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      className="on-off-toggle"
                                      onClick={(e) => handleShow(option)}
                                    >
                                      <input
                                        className="on-off-toggle__input"
                                        type="checkbox"
                                        id={`dynamic_id${option.id}`}
                                        defaultChecked={
                                          option.flag === "c" ? true : false
                                        }
                                      />

                                      <label
                                        // htmlFor={`dynamic_id${option.primary_id}`}
                                        className="on-off-toggle__slider"
                                      ></label>
                                    </div>
                                  </td>
                                  <td className="th2">
                                    <div className="tbodyStyle1 guest_incenter borderRightRadius">
                                      <div className="rightsActionBtns">
                                        <Link
                                          to={`/Edit_SubStaff_Rights/${option.id}`}
                                        >
                                          <button
                                            className="editRightBtn Edti_Sub_Right_btn"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="left"
                                            title="Edit Sub Right"
                                          >
                                            <img
                                              src={EditBtn}
                                              alt="Barley's Dashboard"
                                            />
                                          </button>
                                        </Link>
                                        <Link
                                          to={`/View_Inside_Page_Rights/${option.id}`}
                                        >
                                          <button
                                            type="button"
                                            className="sendEmailBtn sendEmailBtnGuest m-0 Inside_Page_Rights"
                                          >
                                            <p>
                                              {
                                                ViewSubRightPages.InsidePage_Rights
                                              }
                                            </p>
                                          </button>
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr style={{ height: "1rem" }}></tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
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
        className="confirmModal"
        centered
        onHide={handleClose}
      >
        <Modal.Header className="confirmModalHeader" closeButton></Modal.Header>
        <Modal.Body className="confirmBody">
          <img src={DeactiIcon} alt="Barley's Dashboard" />
          <p className="modalText">
            {ViewStaffPagesText.model_text}{" "}
            {SelectedData.flag === "d" ? "Activate" : "Deactivate"}?
          </p>

          <p className="modalTextRed">Name: {SelectedData.page_name} </p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`${
              SelectedData.flag === "d" ? "closeConfirmAeBtn" : ""
            } closeConfirmBtn`}
            onClick={handleClose}
          >
            {ViewStaffPagesText.Close_text}
          </Button>
          <Button
            className={`${
              SelectedData.flag === "d" ? "confirmAeBtn" : "confirmDeBtn"
            } Confirm_Deactive`}
            onClick={handleDeactivate}
          >
            <label
              style={{ cursor: "pointer" }}
              htmlFor={`dynamic_id${SelectedData.id}`}
            >
              {SelectedData.flag === "d" ? "Activate" : "Deactivate"}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewSubRights;
