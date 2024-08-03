import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  Open_Menu_text,
  CreateStaffRightText,
  EditStaffPage,
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
  save_update_staff,
  save_update_StaffRights,
  get_all_StaffRights,
} from "../ServiceConnection/serviceconnection.js";
// import { set } from "ramda";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
function CreateStaffRights() {
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
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
            // toast.error(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/View_Staff_Rights");
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
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("call_id", call_id);
    fd.append("flag", "3");
    await server_post_data(get_all_StaffRights, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data.length > 0) {
            if (Response.data.message.data[0].dropdown == true) {
              Response.data.message.data[0].dropdown = 1;
            } else {
              Response.data.message.data[0].dropdown = 0;
            }
            setEditorDatMainID(Response.data.message.data[0].id);
            seteditStaffData(Response.data.message.data[0]);
          }
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
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

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>
                  {location.pathname.includes("/Edit_Staff_Rights") ? (
                    <p>{EditStaffPage.Staff_Rights}</p>
                  ) : (
                    <p>{CreateStaffRightText.Staff_Rights}</p>
                  )}
                </p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body">
              <div className="create_staffRights">
                <form className="createRightsForm" id="createRightsForm">
                  <div className="row m-0">
                    <div className="personalForm">
                      <div className="staffForm_container">
                        <div className="row m-0">
                          <div className="col-md-4">
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {CreateStaffRightText.Right_Name}
                                <span>*</span>
                              </label>
                              <div>
                                <input
                                  type="text"
                                  name="right_name"
                                  placeholder={CreateStaffRightText.Right_Name}
                                  minLength={3}
                                  maxLength={75}
                                  className="trio_name trio_mandatory input_field_custom2 input_field_customPadding form-control"
                                  onInput={handleAphabetsChange}
                                  defaultValue={editStaffData.page_name || ""}
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`col-md-4 ${
                              editStaffData.dropdown ? "hidden" : ""
                            }`}
                          >
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {CreateStaffRightText.Right_Type}
                                <span>*</span>
                              </label>
                              <div>
                                <select
                                  id="admin_gender"
                                  name="right_type"
                                  className={`trio_mandatory form-control input_field_custom2 input_field_customPadding `}
                                  onChange={handleRightTypeChange}
                                  defaultValue={editStaffData.dropdown || ""}
                                >
                                  {/* <option value="">
                                    {CreateStaffRightText.Select_Right_Type}
                                    <span>*</span>
                                  </option> */}
                                  {options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          {isSubRight && (
                            <div
                              className={`col-md-4 ${
                                isSubRight === null ? "hidden" : ""
                              }`}
                            >
                              <div className="inpContainer">
                                <label className="no_prsnl_id">
                                  Class Name
                                  <span>*</span>
                                </label>
                                <div>
                                  <input
                                    type="text"
                                    id="class_name"
                                    name="class_name"
                                    minLength={3}
                                    maxLength={75}
                                    className={`  trio_mandatory  input_field_customPadding form-control`}
                                    onChange={handleAlphabetRightId}
                                    placeholder="Class Name"
                                    defaultValue={
                                      editStaffData.page_url_id || ""
                                    }
                                  />

                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                          )}
                          {!isSubRight && (
                            <div
                              className={`col-md-4 ${
                                isSubRight === null ? "hidden" : ""
                              }`}
                            >
                              <div className="inpContainer">
                                <label className="no_prsnl_id">
                                  URL
                                  <span>*</span>
                                </label>
                                <div className="urlContainer">
                                  <input
                                    type="text"
                                    name="class_name"
                                    placeholder="URL"
                                    minLength={3}
                                    maxLength={75}
                                    className=" trio_mandatory form-control input_field_custom2 input_field_customPadding"
                                    onInput={handleURLChange_Modify}
                                    onChange={handleSaveUrlChange}
                                    defaultValue={
                                      editStaffData.page_url_id || ""
                                    }
                                  />
                                  <span className="condition_error"></span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="createRightBtnDiv">
                          <button
                            className="btn btn-primary Create_Right_Btn btnSave"
                            type="button"
                            onClick={() =>
                              handleSaveChangesdynamic(
                                "createRightsForm",
                                save_update_StaffRights
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

export default CreateStaffRights;
