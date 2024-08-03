import React, { useState, useEffect } from "react";
import "./Css/TableSetup.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import {
  Open_Menu_text,
  CreateFloorPlanPage,
} from "./../CommonJquery/WebsiteText";
import CreateDiningArea from "./CreateDiningArea";
import { useParams } from "react-router-dom";
function CreateFloorPlan() {
  let { id } = useParams();
  id = id || 0; // If id is undefined, set its value to 0

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageCntn_head_left">
                <div className="pageNameDiv">
                  <p>
                    {id === 0
                      ? CreateFloorPlanPage.Create_Dining
                      : CreateFloorPlanPage.Edit_Dining_Area}
                  </p>
                </div>
              </div>
            </div>

            <div className="page_body">
              <div>
                <CreateDiningArea CALLID={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFloorPlan;
