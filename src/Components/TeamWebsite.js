import React, { useState, useEffect } from "react";
import FolderImg from "../assets/Folder-pana.png";
import { Modal, Button } from "react-bootstrap";
import DeleteIcon from "../assets/newDelet.svg";
import Loader from "./Loader.js";
import {
  handleError,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  handleIaphabetnumberChange,
  handleSuccess,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_team,
  get_all_team,
  delete_website_master_data,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
function TeamWebsite() {
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
    await server_post_data(get_all_team, fd)
      .then((Response) => {
        console.log(Response.data.message);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data_team);
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
    fd.append("flag_for", "5");
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
    <div className="addImage">
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="addImg_container">
        <div className="row m-0">
          <div className="col-md-8 mx-auto">
            <h6>Team ({editStaffData && editStaffData.length})</h6>
            <div className="row m-0 p-0">
              {editStaffData.map((option, index) => (
                <div className="col-md-3" key={index}>
                  <div className="uploadedImg">
                    <div className="uploadedImg_container teamIng_Contianer">
                      <img
                        className="uploadedImgLink"
                        src={StaffImageLinkData + option.team_image}
                        alt="barlays"
                      />
                      <div
                        className="deletImgIcon"
                        onClick={() => handleShow(option)}
                      >
                        <img src={DeleteIcon} alt="Barley's Dashboard" />
                      </div>
                    </div>
                    <p className="img_name">
                      {index + 1}. {option.team_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-xl-3 col-md-4">
            <div className="addImgform">
              <form id="addNewStaff">
                <div className="addImgform_Container">
                  <h6>Add Team Member</h6>
                  {dynaicimage && dynaicimage.team_image_show ? (
                    <img
                      src={dynaicimage.team_image_show}
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
                      name="team_image"
                      onChange={handleFileChangedynamic("team_image")}
                      className="trio_mandatory form-control"
                      accept=".jpg,.jpeg,.png"
                      hidden
                      id="imgInput"
                    />
                    <span className="condition_error"></span>
                    <label htmlFor="imgInput">Choose Image</label>
                  </div>
                  <div className="mb-2">
                    <textarea
                      type="text"
                      onInput={handleIaphabetnumberChange}
                      placeholder="Name*"
                      id="team_name"
                      name="team_name"
                      className="mb-0 trio_mandatory form-control    "
                    ></textarea>
                    <span className="condition_error"></span>
                  </div>
                  <div className="mb-4">
                    <textarea
                      type="text"
                      placeholder="Designation*"
                      id="team_position"
                      name="team_position"
                      onInput={handleIaphabetnumberChange}
                      className=" trio_mandatory form-control mb-0   "
                    ></textarea>
                    <span className="condition_error"></span>
                  </div>
                  <button
                    className="webMngSave"
                    type="button"
                    onClick={() =>
                      handleSaveChangesdynamic("addNewStaff", save_update_team)
                    }
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
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
}

export default TeamWebsite;
