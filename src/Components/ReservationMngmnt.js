import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Open_Menu_text } from "./../CommonJquery/WebsiteText";

function ReservationMngmnt() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  
  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}

      <div className="dashboard_container">
        <div className="page_content">
          
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              
              <div className="pageNameDiv">
                <p>Reservation Management</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
            </div>

            <div className="page_body"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationMngmnt;
