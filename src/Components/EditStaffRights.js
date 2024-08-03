import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Open_Menu_text, EditStaffPage } from "../CommonJquery/WebsiteText";
import {
  handleURLChange,
  handleAphabetsChange,
} from "../CommonJquery/CommonJquery";

function EditStaffRights() {
  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{EditStaffPage.Staff_Rights}</p>
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
                          <div className="col-md-6">
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {EditStaffPage.Right_Name}
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder={EditStaffPage.Right_Name}
                                  minLength={3}
                                  maxLength={75}
                                  className="trio_name trio_mandatory form-control"
                                  onInput={handleAphabetsChange}
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="inpContainer">
                              <label className="no_prsnl_id">
                                {EditStaffPage.Page_URL}
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder={EditStaffPage.Right_Name}
                                  maxLength={150}
                                  minLength={4}
                                  className="trio_name trio_mandatory form-control"
                                  onInput={handleURLChange}
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="createRightBtnDiv">
                          <button className="btn btn-primary Save_Right_Btn">
                            {EditStaffPage.save_text}
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

export default EditStaffRights;
