import React, { useEffect, useState } from "react";
import "./Css/RestoSetup.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import { Open_Menu_text } from "./../CommonJquery/WebsiteText";
import NORestro from "../assets/norestro.png";
import { Link } from "react-router-dom";

function CreateRestaurant() {
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
              {/* <div className="pageNameDiv">
                <p>System Settings</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div> */}
            </div>

            <div className="page_body height80 container-lg">
              <div className="createRestro">
                <div className="no_restroContainer">
                  <div className="no_restroImg">
                    <img src={NORestro} alt="Barley's Dashboard" />
                    <Link to="/Create_Restaurant">
                      <button className="createRetroBtn Create_Restaurant">
                        Create Restaurant
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRestaurant;
