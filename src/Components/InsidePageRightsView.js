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
  insidePageText,
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
    fd.append("flag", "4");
    await server_post_data(get_all_StaffRights, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data[0].insidepage !== null) {
            const datamiom =
              Response.data.message.data[0].insidepage.split("/");

            if (datamiom[0] != "") {
              setfilteredData(datamiom);
            } else {
              setfilteredData([]);
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

  const handleDeleteClick = async (index_id) => {
    setshowLoaderAdmin(true);
    const datamiom = [...filteredData]; // Create a copy of filteredData
    datamiom.splice(index_id, 1);
    const joinedString = datamiom.join("/");
    console.log(joinedString);

    const fd = new FormData();

    fd.append("id_for_delete", mainid);
    fd.append("flag_for", "2");
    fd.append("for_status_final", joinedString);
    await server_post_data(action_update_staff_right, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          master_data_get();
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
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
                <p>{insidePageText.Inside_Page_R}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
              <div className="col-xl-2 col-sm-4 bottomAlgin">
                <Link to={`/Create_Inside_Page_Rights/${mainid}`}>
                  <button type="button" className="btnAddStaff add_staff">
                    {insidePageText.Add_Btn}
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
                                  <span>{insidePageText.Right_Name}</span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {insidePageText.URL_ID_text}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {insidePageText.Action_text}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tboday">
                            {filteredData.map((option, index) => {
                              const parts = option.split("@"); // Split the option by '@'
                              return (
                                <React.Fragment>
                                  <tr className="tableRow">
                                    <td className="th1">
                                      <div className="tbodyStyle guest_incenter borderLeftRadius">
                                        {parts[1]}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tbodyStyle guest_incenter shadowOnlyBottom">
                                        {parts[0]}
                                      </div>
                                    </td>

                                    <td className="th2">
                                      <div className="tbodyStyle1 guest_incenter borderRightRadius">
                                        <div className="rightsActionBtns">
                                          <button
                                            className="editRightBtn Delete_Sub_Right_btn"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="left"
                                            title="Delete Sub Right"
                                            onClick={() =>
                                              handleDeleteClick(index)
                                            }
                                          >
                                            <img
                                              src={DltBtn}
                                              alt="Barley's Dashboard"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr style={{ height: "1rem" }}></tr>
                                </React.Fragment>
                              );
                            })}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewSubRights;
