import React, { useState, useEffect } from "react";
import "./Css/TableSetup.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import OpenMenu from "../assets/menu_open.png";
import {
  Open_Menu_text,
  EditFloorPlanPage,
} from "./../CommonJquery/WebsiteText";
import AllotcateArea from "./AllotcateArea";

function EditFloorPlan() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);



  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}

      <div className="dashboard_container">
        <div className="page_content">
          
          <div className="page_content_container">
            <Header  />
            <div className="pageCntn_head">
              <div className="pageCntn_head_left">
                <div className="pageNameDiv">
                  <p>{EditFloorPlanPage.Edit_Dining_Area}</p>
                  <img src={GreyArrow} alt="Barley's Dashboard" />
                </div>
              </div>
            </div>

            <div className="page_body">
              <div>
                <AllotcateArea />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditFloorPlan;
