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
  ViewStaffRightPages,
  ViewStaffPagesText,
} from "./../CommonJquery/WebsiteText";

import {
  server_post_data,
  get_all_StaffRights,
  action_update_staff_right,
} from "../ServiceConnection/serviceconnection.js";
import { handleError } from "../CommonJquery/CommonJquery";

import { Link } from "react-router-dom";
function ViewStaffRights() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [filteredData, setfilteredData] = useState([]);
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const master_data_get = async () => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("flag", "1");
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

  useEffect(() => {
    master_data_get();
  }, []);

  const [allow_access_data, setallow_access_data] = useState("c");
  const handleActiveDeactive = () => {
    // let allow_access_data = "c";
    if (SelectedData.flag === "c") {
      setallow_access_data("d");
    }
    console.log(SelectedData.id, SelectedData.flag);
    master_data_action_update(SelectedData.id, allow_access_data);

    {
      console.log(SelectedData.flag);
    }
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
                <p>{ViewStaffRightPages.Staff_Rights}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
              <div className="col-xl-2 col-sm-4 bottomAlgin">
                <Link to="/create_Staff_Rights">
                  <button type="button" className="btnAddStaff add_staff">
                    {ViewStaffRightPages.Add_Btn}
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
                                  <span>{ViewStaffRightPages.Right_Name}</span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewStaffRightPages.URL_ID_text}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewStaffRightPages.Status_text}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewStaffRightPages.Action_text}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tboday">
                            {filteredData.map((option, index) => (
                              <React.Fragment>
                                <tr className="tableRow">
                                  <td className="th1">
                                    <div className="guest_incenter tbodyStyle borderLeftRadius">
                                      {option.page_name}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="guest_incenter tbodyStyle shadowOnlyBottom">
                                      {option.page_url_id.slice(0, 20)}
                                      {option.page_url_id.length > 20
                                        ? `...`
                                        : ``}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="guest_incenter tbodyStyle shadowOnlyBottom">
                                      <div
                                        className="on-off-toggle"
                                        onClick={(e) => {
                                          handleShow(option);
                                          console.log(option.flag);
                                        }}
                                      >
                                        <input
                                          className="on-off-toggle__input"
                                          type="checkbox"
                                          id={`dynamic_id${option.id}`}
                                          defaultChecked={
                                            option.flag === "c" ? "checked" : ""
                                          }
                                        />

                                        <label
                                          // htmlFor={`dynamic_id${option.primary_id}`}
                                          className="on-off-toggle__slider"
                                        ></label>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="th2">
                                    <div className="tbodyStyle1 borderRightRadius">
                                      <div className="guest_incenter rightsActionBtns">
                                        <Link
                                          to={`/Edit_Staff_Rights/${option.id}`}
                                        >
                                          <button
                                            className="editRightBtn Edti_Right_btn"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="left"
                                            title="Edit Right"
                                          >
                                            <img
                                              src={EditBtn}
                                              alt="Barley's Dashboard"
                                            />
                                          </button>
                                        </Link>
                                        {option.dropdown === true ? (
                                          <Link
                                            to={`/View_Sub_Rights/${option.id}`}
                                          >
                                            <button
                                              type="button"
                                              className="sendEmailBtn sendEmailBtnGuest m-0 Sub_Rights"
                                            >
                                              <p>
                                                {ViewStaffRightPages.Sub_Rights}
                                              </p>
                                            </button>
                                          </Link>
                                        ) : (
                                          <Link
                                            to={`/View_Inside_Page_Rights/${option.id}`}
                                          >
                                            <button
                                              type="button"
                                              className="sendEmailBtn sendEmailBtnGuest m-0 Inside_Page_Rights"
                                            >
                                              <p>
                                                {
                                                  ViewStaffRightPages.InsidePage_Rights
                                                }
                                              </p>
                                            </button>
                                          </Link>
                                        )}
                                        <button
                                          className="editRightBtn Delete_Right_btn"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="left"
                                          title="Delete Right"
                                        ></button>
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
          {/* <img src={DeactiIcon} alt="Barley's Dashboard" /> */}
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
              {SelectedData.flag === "c" ? "Activate" : "Deactivate"}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewStaffRights;
