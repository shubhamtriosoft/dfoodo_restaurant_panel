import React, { useState, useEffect } from "react";
import RightArrowImg from "../assets/RAvacancy.svg";
import DeleteIcon from "../assets/newDelet.svg";
import { Modal, Button } from "react-bootstrap";
import * as FileSaver from "file-saver";
import {
  handleError,
  check_vaild_save,
  combiled_form_data,
  empty_form,
  handleIaphabetnumberChange,
  handleSuccess,
  inputdateformateChange,
  handleAphabetsChange,
  handleNumbersChange,
  handleNumbersDecimalChange,
} from "../CommonJquery/CommonJquery";
import Loader from "./Loader.js";
import {
  server_post_data,
  save_update_Vacancy,
  get_all_Vacancy,
  delete_website_master_data,
  update_data_career,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
const VacancyWebsite = () => {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [editStaffDataVaccancy, seteditStaffDataVaccancy] = useState([]);
  const [editStaffDataDetails, seteditStaffDataDetails] = useState([]);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowAccept, setModalShowAccept] = useState(false);
  const [modalShowDecline, setModalShowDecline] = useState(false);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");
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

  const handleDeactivateAccept = () => {
    master_data_action_update_career(SelectedData.primary_id, 1);
  };

  const handleDeactivateDecline = () => {
    master_data_action_update_career(SelectedData.primary_id, 7);
  };

  const handleClose = () => {
    setModalShow(false);
  };
  const handleCloseAccept = () => {
    setModalShowAccept(false);
  };
  const handleCloseDecline = () => {
    setModalShowDecline(false);
  };
  const handleShow = (data_call) => {
    setSelectedData(data_call);
    setModalShow(true);
  };
  const handleShowAccept = (data_call) => {
    setSelectedData(data_call);
    setModalShowAccept(true);
  };

  const handleShowDecline = (data_call) => {
    setSelectedData(data_call);
    setModalShowDecline(true);
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_Vacancy, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_Career.length > 0) {
            Response.data.message.data_Career.forEach((subObj) => {
              let filter_data = Response.data.message.data_vacancy.filter(
                (patient) => {
                  return patient.primary_id === subObj.vacancy_id;
                }
              );
              if (filter_data.length > 0) {
                subObj.vacancy_name = filter_data[0].designation;
              } else {
                subObj.vacancy_name = "";
              }
            });
            seteditStaffData(Response.data.message.data_Career);
            seteditStaffDataVaccancy(Response.data.message.data_vacancy);
            setsStaffImageLinkData(
              APL_LINK + Response.data.message.data_link_image
            );
            if (flag === "3") {
              seteditStaffDataDetails(Response.data.message.data_vacancy[0]);
              setEditorDatMainID(
                Response.data.message.data_vacancy[0].primary_id
              );
              setFormVisible(true);
            } else {
              seteditStaffDataDetails([]);
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

  const master_data_action_update = async (call_id, for_status_final) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("id_for_delete", call_id);
    fd.append("flag_for", "9");
    fd.append("for_status_final", for_status_final);
    await server_post_data(delete_website_master_data, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          handleCloseAccept();
          handleCloseDecline();
          master_data_get("", "", "1", "0");
        }
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };
  const downloadImage = (image_url, resume_file) => {
    FileSaver.saveAs(image_url, resume_file); // Put your image URL here.
  };
  const master_data_action_update_career = async (
    call_id,
    for_status_final
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();

    fd.append("id_for_update", call_id);
    fd.append("flag_for", 7);
    fd.append("status_job", for_status_final);
    await server_post_data(update_data_career, fd)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleClose();
          handleCloseAccept();
          handleCloseDecline();
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
          console.log(error);
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
            <h6>All Vacancy</h6>
            <button
              type="button"
              onClick={handleToggleForm}
              className="btn btn-secondary"
            >
              Add Vacancy
            </button>
          </div>
          <div className="vacancyOnOff">
            <div className="vacancyOnOff_Container">
              <div className="row m-0">
                {editStaffDataVaccancy &&
                  editStaffDataVaccancy.length > 0 &&
                  editStaffDataVaccancy.map((option, index) => (
                    <div className="col-md-3">
                      <div className="vacancyOnOffItem">
                        <div className="vacancyHead">
                          <div className="vacancyTitle">
                            <p>{option.designation}</p>
                            <p>{option.skills}</p>
                          </div>
                          <div className="dltVacancy">
                            <div
                              className="deletImgIcon dltVacancyIcon"
                              style={{ position: "static" }}
                              onClick={() => handleShow(option)}
                            >
                              <img src={DeleteIcon} alt="Barley's Dashboard" />
                            </div>
                            {/* <label className="switchSmall m5">
                              <input
                                type="checkbox"
                                onClick={() => handleShow(option)}
                              />
                              <small></small>
                            </label> */}
                          </div>
                        </div>
                        <div className="vacancyBody">
                          <p>
                            Work Exp: {option.min_experience}-
                            {option.max_experience} years
                          </p>
                          <img src={RightArrowImg} alt="Barley's Dashboard" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="seoTable_container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "#F58634", fontWeight: "600" }}>
                    Sr. No.
                  </th>
                  <th style={{ color: "#F58634", fontWeight: "600" }}>
                    Apply Date
                  </th>
                  <th style={{ color: "#F58634", fontWeight: "600" }}>Name</th>
                  <th style={{ color: "#F58634", fontWeight: "600" }}>Email</th>

                  <th style={{ color: "#F58634", fontWeight: "600" }}>
                    Contact Info
                  </th>
                  <th style={{ color: "#F58634", fontWeight: "600" }}>
                    Position
                  </th>
                  <th style={{ color: "#F58634", fontWeight: "600" }}></th>
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
                            <span>{1 + index}</span>
                          </div>
                        </td>
                        <td className="col-md">
                          <div>{inputdateformateChange(option.entry_date)}</div>
                        </td>
                        <td className="col-md">
                          <div>{option.user_name}</div>
                        </td>
                        <td className="col-md">
                          <div>{option.job_email}</div>
                        </td>
                        <td className="col-md">
                          <div>{option.job_mobile_no}</div>
                        </td>
                        <td>{option.vacancy_name}</td>
                        <td className="th4">
                          <div className="recentReservBtns">
                            <button
                              className="mb-2"
                              onClick={() =>
                                downloadImage(
                                  StaffImageLinkData + option.resume_file,
                                  option.resume_file
                                )
                              }
                            >
                              <p>Download</p>
                            </button>
                          </div>
                        </td>

                        <td className="th4">
                          {option.status_job === 0 && (
                            <div className="recentReservBtns">
                              <button
                                className="mb-2"
                                onClick={() => handleShowAccept(option)}
                              >
                                <p>Accept</p>
                              </button>
                              <button onClick={() => handleShowDecline(option)}>
                                <p>Reject</p>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="actionRow"></tr>
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
              Add Vacancy
            </button>

            <div className="form-group seoAddForm">
              <div className="row m-0">
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Designation </label>
                    <input
                      type="text"
                      name="designation"
                      defaultValue={editStaffDataDetails.designation || ""}
                      id="designation"
                      maxLength={60}
                      minLength={3}
                      onInput={handleAphabetsChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Designation* "
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">No. of Positions </label>
                    <input
                      type="text"
                      name="no_of_position"
                      defaultValue={editStaffDataDetails.no_of_position || ""}
                      id="no_of_position"
                      maxLength={10}
                      minLength={1}
                      onInput={handleNumbersChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter No. of Positions* "
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Qualification </label>
                    <input
                      type="text"
                      name="qualification"
                      defaultValue={editStaffDataDetails.qualification || ""}
                      id="qualification"
                      maxLength={300}
                      minLength={1}
                      onInput={handleIaphabetnumberChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Qualification* "
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Salary Details </label>
                    <input
                      type="text"
                      name="salary_details"
                      defaultValue={editStaffDataDetails.salary_details || ""}
                      id="salary_details"
                      maxLength={300}
                      minLength={1}
                      onInput={handleIaphabetnumberChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Salary Details*"
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Min Experience</label>
                    <input
                      type="text"
                      name="min_experience"
                      defaultValue={editStaffDataDetails.min_experience || ""}
                      id="min_experience"
                      maxLength={10}
                      minLength={1}
                      onInput={handleNumbersDecimalChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Min Experience* "
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Max Experience</label>
                    <input
                      type="text"
                      name="max_experience"
                      defaultValue={editStaffDataDetails.max_experience || ""}
                      id="max_experience"
                      maxLength={10}
                      minLength={1}
                      onInput={handleNumbersDecimalChange}
                      className="form-control trio_mandatory"
                      placeholder="Enter Max Experience* "
                    />
                    <span className="condition_error"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="inpContainer inpContainerSeo mt-2">
                    <label className="no_prsnl_id">Skills </label>
                    <textarea
                      type="text"
                      name="skills"
                      defaultValue={editStaffDataDetails.skills || ""}
                      id="skills"
                      maxLength={300}
                      minLength={1}
                      onInput={handleIaphabetnumberChange}
                      className="textareBlogs mt-0 form-control trio_mandatory"
                      placeholder="Enter Skills* "
                    ></textarea>
                    <span className="condition_error"></span>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="addBlogBtnDiv">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveChangesdynamic(
                          "addNewStaff",
                          save_update_Vacancy
                        )
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

      <Modal
        show={modalShowAccept}
        className="confirmModal"
        centered
        backdrop="static"
        keyboard={false}
        onHide={handleCloseAccept}
      >
        <Modal.Header className="confirmModalHeader" closeButton></Modal.Header>
        <Modal.Body className="confirmBody">
          <p className="modalText">Do You Want to Accept This Application?</p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`closeConfirmAeBtn closeConfirmBtn`}
            onClick={handleCloseAccept}
          >
            No
          </Button>
          <Button
            className={`confirmAeBtn Confirm_Deactive`}
            onClick={handleDeactivateAccept}
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

      <Modal
        show={modalShowDecline}
        className="confirmModal"
        centered
        backdrop="static"
        keyboard={false}
        onHide={handleCloseDecline}
      >
        <Modal.Header className="confirmModalHeader" closeButton></Modal.Header>
        <Modal.Body className="confirmBody">
          <p className="modalText">Do You Want to Reject This Application?</p>
        </Modal.Body>
        <Modal.Footer className="confirmModalFooter">
          <Button
            className={`closeConfirmAeBtn closeConfirmBtn`}
            onClick={handleCloseDecline}
          >
            No
          </Button>
          <Button
            className={`confirmAeBtn Confirm_Deactive`}
            onClick={handleDeactivateDecline}
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
export default VacancyWebsite;
