import React, { useState, useEffect } from "react";
import teamimage from "../assets/addImgImg.png";
import delicon from "../assets/delete.svg";
import update from "../assets/editBlack.svg";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader.js";
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
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_blog,
  delete_website_master_data,
  get_all_blogs,
} from "../ServiceConnection/serviceconnection.js";
import { BlogWebsite_text } from "../CommonJquery/WebsiteText";

const BlogWebsite = () => {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [editStaffDataDetails, seteditStaffDataDetails] = useState([]);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [SelectedData, setSelectedData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [error_show, seterror_show] = useState("");
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
  const handleEditorChange = (event, editor) => {
    setEditorData(editor.getData());
  };

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_blogs, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data_blog.length > 0) {
            seteditStaffData(Response.data.message.data_blog);
            if (flag === "3") {
              seteditStaffDataDetails(Response.data.message.data_blog[0]);
              setEditorDatMainID(Response.data.message.data_blog[0].primary_id);
              setEditorData(Response.data.message.data_blog[0].description);
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
    fd.append("flag_for", "1");
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
      if (editorData.length > 0) {
        setshowLoaderAdmin(true);
        let fd_from = combiled_form_data(form_data, null);
        fd_from.append("main_id", editorDataMainID);
        fd_from.append("description_data", editorData);
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
      } else {
        seterror_show("Please Fill The Mandatory Information");
      }
    }
  };

  return (
    <div>
      {showLoaderAdmin && <Loader />}
      {!formVisible && (
        <>
          <div className="headSeo">
            <button
              type="button"
              onClick={handleToggleForm}
              className="btn btn-secondary"
            >
              {BlogWebsite_text.Add_Blog}
            </button>
          </div>
          <div className="seoTable_container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    {BlogWebsite_text.Create_Date}
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    {BlogWebsite_text.Image}
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    {BlogWebsite_text.Title}
                  </th>

                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    {BlogWebsite_text.Description}
                  </th>
                  <th style={{ color: "#3268C1", fontWeight: "600" }}>
                    {BlogWebsite_text.Keywords}
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
                            <p>{formatTimeintotwodigit(option.entry_date)}</p>
                          </div>
                        </td>
                        <td>
                          <img
                            src={option.image_url}
                            onError={(e) => (e.target.src = teamimage)}
                            alt="Barley's Dashboard"
                          />
                        </td>
                        <td className="col-md">
                          <div>{option.title_name}</div>
                        </td>
                        <td>
                          <div>{option.tag_line}</div>
                        </td>
                        <td>{option.author}</td>
                      </tr>
                      <tr className="actionRow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <div className="img-icons mb-4">
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
              {BlogWebsite_text.Add_Blog}
            </button>

            <div className="form-group mt-4">
              <div className="row m-0">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="old_image_link"
                    id="old_image_link"
                    defaultValue={editStaffDataDetails.image_url || ""}
                    onInput={handleURLChange}
                    className="form-control trio_mandatory"
                    placeholder="Enter Image URL*"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    id="author_data"
                    defaultValue={editStaffDataDetails.image_url || ""}
                    name="author_data"
                    onInput={handleIaphabetnumberChange}
                    className="form-control trio_mandatory"
                    placeholder="Author*"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="col-md-12 mt-2">
                  <input
                    type="text"
                    name="title_data"
                    defaultValue={editStaffDataDetails.title_name || ""}
                    id="title_data"
                    onInput={handleAphabetsChange}
                    className="form-control trio_mandatory"
                    placeholder="Enter Title*"
                  />
                  <span className="condition_error"></span>
                </div>
                <div className="col-md-12">
                  <textarea
                    className="textareBlogs form-control trio_mandatory"
                    name="tagline_data"
                    id="tagline_data"
                    defaultValue={editStaffDataDetails.tag_line || ""}
                    onInput={handleIaphabetnumberChange}
                    placeholder="Enter Introduction*"
                  ></textarea>
                  <span className="condition_error"></span>
                </div>

                <div className={`col-md-12`}>
                  <div className="inpContainer mt-2">
                    <label className="no_prsnl_id">
                      {BlogWebsite_text.Description}
                      <span>*</span>
                    </label>
                    <div>
                      <CKEditor
                        editor={ClassicEditor}
                        data={editStaffDataDetails.description || ""}
                        onChange={handleEditorChange}
                      />
                    </div>
                    <span className="condition_error">{error_show}</span>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="addBlogBtnDiv">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveChangesdynamic(
                          "addNewStaff",
                          save_update_blog
                        )
                      }
                      className="btn btn-secondary mt-3 save-cap-btn"
                    >
                      {BlogWebsite_text.save_txt}
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
            {BlogWebsite_text.no_txt}
          </Button>
          <Button
            className={`confirmAeBtn Confirm_Deactive`}
            onClick={handleDeactivate}
          >
            <label
              style={{ cursor: "pointer" }}
              htmlFor={`dynamic_id${SelectedData.primary_id}`}
            >
              {BlogWebsite_text.Yes_txt}
            </label>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default BlogWebsite;
