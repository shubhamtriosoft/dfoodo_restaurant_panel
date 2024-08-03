import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Open_Menu_text,
  CreateStaffRightText,
  EditStaffPage,
  AddKB_text,
} from "../CommonJquery/WebsiteText";
import {
  handleAphabetsChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  handleURLChange_Modify,
  handleAlphabetRightId,
} from "../CommonJquery/CommonJquery";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  server_post_data,
  save_update_knowledgebase,
  get_all_knowledgebase,
} from "../ServiceConnection/serviceconnection.js";
function AddKB() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [editorData, setEditorData] = useState("");
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [editStaffData, seteditStaffData] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (!editorData) {
      alert("Details Field is Empty");
    }
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      fd_from.append("main_id", editorDataMainID);
      fd_from.append("editorData", editorData);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
            // toast.error(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/View_KB");
            toast.success("Data saved successfully");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          toast.error(
            "Failed to connect to the server. Please try again later."
          );
        });
    }
  };

  useEffect(() => {
    master_data_get();
  }, []);
  const master_data_get = async () => {
    const url = currentUrl;
    const parts = url.split("/");
    let call_id = "0";
    if (parts.length !== 1) {
      call_id = parts[1];
    }
    if (call_id != "0") {
      setshowLoaderAdmin(true);
      const fd = new FormData();
      fd.append("call_id", call_id);
      fd.append("flag", "3");
      await server_post_data(get_all_knowledgebase, fd)
        .then((Response) => {
          console.log(Response.data);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            if (Response.data.message.data.length > 0) {
              setEditorDatMainID(Response.data.message.data[0].primary_id);
              console.log(Response.data.message.data[0].primary_id);
              seteditStaffData(Response.data.message.data[0]);
            }
          }
          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          handleError("network");
          setshowLoaderAdmin(false);
        });
    }
  };
  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head container-lg">
              <div className="pageNameDiv">
                <p>
                  <p>
                    {currentUrl ? "Edit Knowledge Base" : "Add Knowledge Base"}
                  </p>
                </p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="create_staffRights container-lg">
                <form className="createRightsForm" id="createRightsForm">
                  <div className="row m-0">
                    <div className="personalForm">
                      <div className="staffForm_container">
                        <div className="row m-0">
                          <div className="col-md-4">
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {AddKB_text.topic_name} <span>*</span>
                              </label>
                              <div>
                                <input
                                  type="text"
                                  id="topic_name"
                                  name="topic_name"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder="Enter Topic Name"
                                  defaultValue={editStaffData.topic_name || ""}
                                />

                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>

                          <div className={`col-md-12`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {AddKB_text.details}
                                <span>*</span>
                              </label>
                              <div>
                                <CKEditor
                                  editor={ClassicEditor}
                                  onChange={handleEditorChange}
                                  data={editStaffData.knowledgebase_data || ""}
                                  id="ckeditor"
                                  name="ckeditor"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="createRightBtnDiv">
                          <button
                            className="btn btn-primary Create_Right_Btn btnSave"
                            type="button"
                            onClick={() =>
                              handleSaveChangesdynamic(
                                "createRightsForm",
                                save_update_knowledgebase
                              )
                            }
                          >
                            {location.pathname.includes("/Edit_Staff_Rights")
                              ? EditStaffPage.save_text
                              : CreateStaffRightText.Create_text}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddKB;
