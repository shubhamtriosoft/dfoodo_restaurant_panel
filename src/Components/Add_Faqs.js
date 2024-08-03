import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Dropdown } from "primereact/dropdown";

import {
  Open_Menu_text,
  CreateStaffRightText,
  EditStaffPage,
  add_faqs_text,
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
import {
  server_post_data,
  save_update_faq,
  get_all_faq,
} from "../ServiceConnection/serviceconnection.js";
// import { set } from "ramda";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function Add_Faqs() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [isSubRight, setIsSubRight] = useState(true);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editOldImageData, seteditOldImageData] = useState([]);
  const [editStaffData, seteditStaffData] = useState([]);
  const [dynaicimage, setDynaicimage] = useState(null);
  const [className, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [url, setUrl] = useState("");

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, dynaicimage);
      fd_from.append("main_id", editorDataMainID);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/View_Faq");
            toast.success(add_faqs_text.save_changesDynamic_toast_success);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          toast.error(add_faqs_text.save_changesDynamic_toast_error);
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
      await server_post_data(get_all_faq, fd)
        .then((Response) => {
          console.log(Response.data);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            if (Response.data.message.data.length > 0) {
              setEditorDatMainID(Response.data.message.data[0].primary_id);
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

  const handleRightTypeChange = (event) => {
    if (event.target.value === "1") {
      setIsSubRight(true);
    } else if (event.target.value === "0") {
      setIsSubRight(false);
    } else {
      setIsSubRight("");
    }
  };

  const options = [
    { value: 1, label: "Sub-Rights" },
    { value: 0, label: "No Sub-Rights" },
  ];

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setClassName(inputValue);
  };

  const handleSaveUrlChange = (event) => {
    const url = event.target.value;
    setUrl(url);
  };

  const [SelectedFloorListID, setSelectedFloorListID] = useState([]);
  const options_search = [
    { value: add_faqs_text.options_search_value1, label: "Booking" },
    { value: add_faqs_text.options_search_value2, label: "Table Setup" },
  ];

  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head container-lg">
              <div className="pageNameDiv">
                <p>
                  <p>{currentUrl ? "Edit FAQ" : "Add FAQs"}</p>
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
                              <div className="faqDropdown">
                                <div className="inpContainer">
                                  <label className="no_prsnl_id">
                                    {add_faqs_text.Related_Question}
                                    <span>*</span>
                                  </label>
                                  <div>
                                    <select
                                      id="admin_gender"
                                      name="topic_name"
                                      className={`trio_mandatory form-control input_field_custom2 input_field_customPadding `}
                                      onChange={(e) => {
                                        setSelectedFloorListID(e.value);
                                      }}
                                    >
                                      {options_search.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                          selected={
                                            editStaffData.topic_name ===
                                            option.value
                                              ? true
                                              : false
                                          }
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="condition_error"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={`col-md-8`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {add_faqs_text.Question}
                                <span>*</span>
                              </label>
                              <div>
                                <input
                                  type="text"
                                  id="question"
                                  name="question_name"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder={add_faqs_text.Enter_question}
                                  defaultValue={
                                    editStaffData.question_name || ""
                                  }
                                />

                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>

                          <div className={`col-md-12`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {add_faqs_text.Answer}
                                <span>*</span>
                              </label>
                              <div>
                                <textarea
                                  type="text"
                                  id="question"
                                  name="answer_name_dd"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder={add_faqs_text.Enter_answer}
                                  defaultValue={editStaffData.answer_name || ""}
                                />

                                <span className="condition_error"></span>
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
                                save_update_faq
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

export default Add_Faqs;
