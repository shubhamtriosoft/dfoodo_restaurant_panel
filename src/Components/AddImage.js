import React, { useState, useEffect } from "react";
import FolderImg from "../assets/Folder-pana.png";
import DeleteBlack from "../assets/deleteBlack1.svg";
import CopyLink from "../assets/content_copy.svg";
import { Modal, Button } from "react-bootstrap";
import {
  handleError,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  handleSuccess,
} from "../CommonJquery/CommonJquery";

import {
  server_post_data,
  save_update_imagelink,
  delete_website_master_data,
  get_all_imagelink,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import Loader from "./Loader.js";
import { AddImage_text } from "../CommonJquery/WebsiteText.js";
function AddImage() {
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

  useEffect(() => {}, [editStaffData]);
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

  const copyToClipboard = (copy_link) => {
    // Create a temporary input element to copy the link to the clipboard
    const inputElement = document.createElement("input");
    inputElement.value = copy_link;
    document.body.appendChild(inputElement);
    inputElement.select();
    // Execute the copy command
    document.execCommand("copy");
    // Remove the temporary input element
    document.body.removeChild(inputElement);
    // Optionally, provide feedback to the user
    handleSuccess("Link Copied");
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_imagelink, fd)
      .then((Response) => {
        console.log(Response.data.message);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data_imagelink);
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
    fd.append("flag_for", "3");
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
      {showLoaderAdmin && <Loader />}
      <div className="addImg_container">
        <div className="row m-0">
          <div className="col-md-8 mx-auto paddingRight0">
            <div className="row m-0 p-0">
              {editStaffData.map((option, index) => (
                <div className="col-md-3 mb-4 paddingRight0" key={index}>
                  <div className="uploadedImg h-100">
                    <div className="uploadedImg_container">
                      <img
                        className="uploadedImgLink"
                        src={StaffImageLinkData + option.images_name}
                        alt="Barley's Dashboard"
                      />
                      <div className="uploadedImg_footer">
                        <button onClick={() => handleShow(option)}>
                          <img src={DeleteBlack} alt="Barley's Dashboard" />
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              StaffImageLinkData + option.images_name
                            )
                          }
                        >
                          <p>{AddImage_text.copy_link}</p>
                          <img src={CopyLink} alt="Barley's Dashboard" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-xl-3 col-md-4">
            <div className="addImgform">
              <form id="addNewStaff">
                <div className="addImgform_Container">
                  <h6>New image API</h6>
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
                    <p className="drop-img mt-2">
                      {" "}
                      {AddImage_text.drop_img_text}
                    </p>
                    <input
                      type="file"
                      name="doctor_image"
                      onChange={handleFileChangedynamic("doctor_image")}
                      className="trio_mandatory form-control"
                      accept=".jpg,.jpeg,.png"
                      hidden
                      id="imgInput"
                    />
                    <label htmlFor="imgInput">Choose Image</label>
                  </div>
                  <button
                    className="webMngSave"
                    type="button"
                    onClick={() =>
                      handleSaveChangesdynamic(
                        "addNewStaff",
                        save_update_imagelink
                      )
                    }
                  >
                    {AddImage_text.save_text}
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
          <p className="modalText">{AddImage_text.want_to_dlt_text}</p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`closeConfirmAeBtn closeConfirmBtn`}
            onClick={handleClose}
          >
            {AddImage_text.No_text}
          </Button>
          <Button
            className={`confirmAeBtn Confirm_Deactive`}
            onClick={handleDeactivate}
          >
            <label
              style={{ cursor: "pointer" }}
              htmlFor={`dynamic_id${SelectedData.primary_id}`}
            >
              {AddImage_text.yes_text}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddImage;
