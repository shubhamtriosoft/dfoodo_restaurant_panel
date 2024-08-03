import React, { useState, useEffect } from "react";
import delicon from "../assets/delete.svg";
import FolderImg from "../assets/Folder-pana.png";
import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader.js";
import {
  handleError,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  handleSuccess,
  inputdateformateChange,
  formatTimeintotwodigit,
  computeTodayDate,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_EventResturant,
  get_all_EventResturant,
  delete_website_master_data,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
const EventWebsite = () => {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);
  const [SelectedData, setSelectedData] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    const flag = "1";
    let call_id = "0";
    master_data_get("", "", flag, call_id);
  }, []);

  const handleDeactivate = () => {
    master_data_action_update(SelectedData.primary_id, "d");
  };

  const handleClose = () => {
    setModalShow(false);
  };
  const handleShow = (data_call) => {
    setSelectedData(data_call);
    setModalShow(true);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_EventResturant, fd)
      .then((Response) => {
        console.log(Response.data.message);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data_eventResturant);
          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_link_image
          );
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
    fd.append("flag_for", "4");
    fd.append("for_status_final", for_status_final);
    await server_post_data(delete_website_master_data, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          master_data_get("", "", "1", "0");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const handleFileChangedynamic = (keyname) => (event) => {
    const file = event.target.files[0];

    let new_file_name = keyname + "_show";
    if (!file) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      // Validate file size
      if (file.size < 200 * 1024) {
        // 200KB in bytes
        alert("File size is below the minimum limit (200KB).");
        return;
      }

      if (file.size > 500 * 1024) {
        // 500KB in bytes
        alert("File size exceeds the maximum limit (500KB).");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        setDynaicimage((prevImages) => ({
          ...prevImages,
          [keyname]: file,
          [new_file_name]: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      event.target.value = ""; // Clear the file input
    }
  };
  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            master_data_get("", "", "1", "0");
            handleSuccess(Response.data.message);
            empty_form(form_data);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };
  return (
    <div>
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="row m-0">
        <div className=" col-md-8 mx-auto paddingRight0">
          <div className="seoTable_container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    Create Date
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>Image</th>

                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    Event Name /Date Time
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {editStaffData &&
                  editStaffData.length > 0 &&
                  editStaffData.map((option, index) => (
                    <React.Fragment key={index}>
                      <tr className="seoTable_row">
                        <td className="col-xs serial-span">
                          <div>
                            <span className="indexNumber">{1 + index}</span>
                          </div>
                        </td>
                        <td>
                          <img
                            src={StaffImageLinkData + option.event_image}
                            alt="Barley's Dashboard"
                          />
                        </td>
                        <td>
                          <p>{inputdateformateChange(option.event_date)}</p>
                          <p>{formatTimeintotwodigit(option.event_time)}</p>
                          <p>{option.event_name}</p>
                        </td>
                        <td>{option.event_des}</td>
                      </tr>
                      <tr className="actionRow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <div className="img-icons">
                            <img
                              onClick={() => handleShow(option)}
                              className="del-icon"
                              src={delicon}
                              alt=""
                            />
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-xl-3 col-md-4">
          <div className="addImgform">
            <form id="addNewStaff">
              <div className="addImgform_Container">
                <h6>Create New Event</h6>
                {dynaicimage && dynaicimage.doctor_image_show ? (
                  <img
                    src={dynaicimage.doctor_image_show}
                    onError={(e) => (e.target.src = FolderImg)}
                    alt="Barley's Dashboard"
                  />
                ) : (
                  <img src={FolderImg} alt="Barley's Dashboard" />
                )}
                <div className="imgInputCotnainer">
                  <p className="drop-img mt-2"> Drop Your Image Here</p>
                  <input
                    type="file"
                    name="doctor_image"
                    onChange={handleFileChangedynamic("doctor_image")}
                    className="trio_mandatory form-control"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    id="imgInput"
                  />
                  <span className="condition_error"></span>
                  <label htmlFor="imgInput">Choose Image</label>
                </div>
                <div className="mb-2">
                  <input
                    placeholder="Event Name*"
                    minLength={3}
                    maxLength={100}
                    className="trio_mandatory form-control mb-0"
                    type="text"
                    id="event_name"
                    name="event_name"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="mb-2">
                  <input
                    type="date"
                    placeholder="Event Date*"
                    min={computeTodayDate()}
                    className="trio_mandatory form-control mb-0"
                    id="event_date"
                    name="event_date"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="mb-2">
                  <input
                    type="time"
                    placeholder="Event Time*"
                    className="trio_mandatory form-control mb-0"
                    id="event_time"
                    name="event_time"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="mb-3">
                  <textarea
                    type="text"
                    placeholder="Description*"
                    minLength={3}
                    maxLength={300}
                    className="trio_mandatory form-control mb-0"
                    id="event_des"
                    name="event_des"
                  ></textarea>
                  <span className="condition_error"></span>
                </div>
                <button
                  className="webMngSave"
                  type="button"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "addNewStaff",
                      save_update_EventResturant
                    )
                  }
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        className="confirmModal"
        centered
        backdrop="static"
        keyboard={false}
        onHide={handleClose}
      >
        <Modal.Header className="confirmModalHeader" closeButton></Modal.Header>
        <Modal.Body className="confirmBody">
          <p className="modalText">Do You Want to Delete This Data?</p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`closeConfirmAeBtn closeConfirmBtn`}
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            className={`confirmAeBtn Confirm_Deactive`}
            onClick={handleDeactivate}
          >
            <label
              style={{ cursor: "pointer" }}
              htmlFor={`dynamic_id${SelectedData.primary_id}`}
            >
              Yes
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default EventWebsite;
