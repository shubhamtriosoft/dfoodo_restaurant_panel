import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import SideBar from "./SideBar";
import Header from "./Header";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Open_Menu_text, EditSubRight } from "../CommonJquery/WebsiteText";
import {
  handleAphabetsChange,
  handleAlphabetRightId,
} from "../CommonJquery/CommonJquery";

function EditSubRights() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleResize = () => {
    setIsSidebarOpen(window.innerWidth > 991);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{EditSubRight.edit_sub_right}</p>
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
                                {EditSubRight.Right_Name}
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder={EditSubRight.Right_Name}
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
                                {EditSubRight.Right_Id}
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder={EditSubRight.Right_Name}
                                  minLength={3}
                                  maxLength={75}
                                  className="trio_name trio_mandatory form-control"
                                  onInput={handleAlphabetRightId}
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="createRightBtnDiv">
                          <button className="btn btn-primary Save_Sub_Right_Btn">
                            {EditSubRight.save_text}
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

export default EditSubRights;
