import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import Header from "./Header.js";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  Add_SearchMaster_text,
  CreateStaffRightText,
  EditStaffPage,
} from "../CommonJquery/WebsiteText.js";
import {
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
} from "../CommonJquery/CommonJquery.js";
import {
  server_post_data,
  save_update_searchmaster,
  get_all_searchmaster,
} from "../ServiceConnection/serviceconnection.js";
import { useLocation } from "react-router-dom";
function Add_SearchMaster() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editStaffData, seteditStaffData] = useState([]);
  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("main_id", editorDataMainID);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/ViewSearchMaster");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
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
      await server_post_data(get_all_searchmaster, fd)
        .then((Response) => {
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            if (Response.data.message.data_search.length > 0) {
              setEditorDatMainID(
                Response.data.message.data_search[0].primary_id
              );
              seteditStaffData(Response.data.message.data_search[0]);
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
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head container-lg">
              <div className="pageNameDiv">
                <p>
                  <p>Add/Update Search Master</p>
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
                          <div className={`col-md-8`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {Add_SearchMaster_text.Name_heading}
                                <span>*</span>
                              </label>
                              <div>
                                <input
                                  type="text"
                                  id="master_name"
                                  name="master_name"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder={
                                    Add_SearchMaster_text.Name_inside_inputField
                                  }
                                  defaultValue={editStaffData.master_name || ""}
                                />

                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>

                          <div className={`col-md-8`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {Add_SearchMaster_text.Value_heding}
                                <span>*</span>
                              </label>
                              <div>
                                <textarea
                                  type="text"
                                  id="master_value"
                                  name="master_value"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder={
                                    Add_SearchMaster_text.value_inside_inputfield
                                  }
                                  defaultValue={
                                    editStaffData.master_value || ""
                                  }
                                />

                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          <div className={`col-md-8`}>
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {Add_SearchMaster_text.URl_heading}
                                <span>*</span>
                              </label>
                              <div>
                                <textarea
                                  type="text"
                                  id="master_url"
                                  name="master_url"
                                  className={`  trio_mandatory  input_field_customPadding form-control`}
                                  placeholder={
                                    Add_SearchMaster_text.URL_inside_input_filed
                                  }
                                  defaultValue={editStaffData.master_url || ""}
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
                                save_update_searchmaster
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

export default Add_SearchMaster;
