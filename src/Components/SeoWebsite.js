import React, { useState, useEffect } from "react";
import delicon from "../assets/delete.svg";
import update from "../assets/editBlack.svg";
import Loader from "./Loader.js";
import { Modal, Button } from "react-bootstrap";
import {
  handleError,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  handleIaphabetnumberChange,
  formatTimeintotwodigit,
  handleAphabetsChange,
  handleSuccess,
  handleURLChange,
  handleIaphabetnumberkeywordChange,
  handleAphabetswithhashChange,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_seo,
  delete_website_master_data,
  get_all_seo,
  Website_URL,
} from "../ServiceConnection/serviceconnection.js";
const SeoWebsite = () => {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [editStaffDataDetails, seteditStaffDataDetails] = useState([]);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const handleToggleForm = () => {
    setFormVisible(!formVisible);
  };
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

  const handleEdit = (data_call) => {
    master_data_get("", "", "3", data_call.primary_id);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_seo, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_seo.length > 0) {
            seteditStaffData(Response.data.message.data_seo);
            if (flag === "3") {
              seteditStaffDataDetails(Response.data.message.data_seo[0]);
              setEditorDatMainID(Response.data.message.data_seo[0].primary_id);
              setFormVisible(true);
            } else {
              seteditStaffDataDetails([]);
            }
          }
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
    fd.append("flag_for", "2");
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

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("main_id", editorDataMainID);
      fd_from.append("website_url", Website_URL);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            master_data_get("", "", "1", "0");
            handleSuccess(Response.data.message);
            setFormVisible(false);
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
      {!formVisible && (
        <>
          <div className="headSeo">
            <button
              type="button"
              onClick={handleToggleForm}
              className="btn btn-secondary"
            >
              Add SEO
            </button>
          </div>
          <div className="seoTable_container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "#3268C1", fontWeight: "600",whiteSpace:"nowrap" }}>
                    Create Date
                  </th>

                  <th style={{ color: "#3268C1", fontWeight: "600" }}>Title</th>

                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    Description
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    Keywords
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
                            <span>
                              {formatTimeintotwodigit(option.entry_date)}
                            </span>
                          </div>
                        </td>
                        <td className="col-md">
                          <div>{option.title_name}</div>
                        </td>
                        <td>{option.description}</td>
                        <td>{option.keywords}</td>
                      </tr>
                      <tr className="actionRow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <div className="img-icons mb-2">
                            <img
                              onClick={() => handleShow(option)}
                              className="del-icon"
                              src={delicon}
                              alt=""
                            />
                            <img
                              onClick={() => handleEdit(option)}
                              className=""
                              src={update}
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
        </>
      )}

      {formVisible && (
        <form id="addNewStaff">
          <div className="event-box blog-data">
            <button
              style={{ fontWeight: "500" }}
              type="button"
              className="btn custom-btn"
            >
              Add SEO
            </button>

            <div className="form-group seoAddForm">
              <div className="row m-0">
                <div className="col-md-12 mt-2">
                  <input
                    type="text"
                    name="title_name"
                    defaultValue={editStaffDataDetails.title_name || ""}
                    id="title_name"
                    onInput={handleAphabetsChange}
                    className="form-control trio_mandatory"
                    placeholder="Enter Title*"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Actual Link </label>
                    <input
                      type="text"
                      name="call_function_name"
                      id="call_function_name"
                      defaultValue={
                        editStaffDataDetails.call_function_name || ""
                      }
                      onInput={handleAphabetswithhashChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Actual Link*"
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Pretty Link</label>
                    <input
                      type="text"
                      name="pretty_function_name"
                      id="pretty_function_name"
                      defaultValue={
                        editStaffDataDetails.pretty_function_name || ""
                      }
                      onInput={handleAphabetswithhashChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Pretty Link*"
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Favicon Images Link</label>
                    <input
                      type="text"
                      name="favicon"
                      id="favicon"
                      defaultValue={editStaffDataDetails.favicon || ""}
                      onInput={handleURLChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Favicon Images Link*"
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Page Image Link</label>
                    <input
                      type="text"
                      name="image_link"
                      id="image_link"
                      defaultValue={editStaffDataDetails.image || ""}
                      onInput={handleURLChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Page Image Link*"
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Description</label>
                    <textarea
                      type="text"
                      name="description"
                      id="description"
                      defaultValue={editStaffDataDetails.description || ""}
                      onInput={handleIaphabetnumberChange}
                      minLength={3}
                      maxLength={150}
                      className="textareBlogs mt-0 form-control trio_mandatory"
                      placeholder="Enter Description*"
                    ></textarea>
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="inpContainer mt-2">
                    <label className="no_prsnl_id">Keyword</label>
                    <textarea
                      type="text"
                      name="keywords"
                      id="keywords"
                      defaultValue={editStaffDataDetails.keywords || ""}
                      onInput={handleIaphabetnumberkeywordChange}
                      minLength={3}
                      maxLength={300}
                      className="textareBlogs mt-0 form-control trio_mandatory"
                      placeholder="Enter Keyword*"
                    ></textarea>
                    <span className="condition_error"></span>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="addBlogBtnDiv">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveChangesdynamic("addNewStaff", save_update_seo)
                      }
                      className="btn btn-secondary mt-3 save-cap-btn"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

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
export default SeoWebsite;
