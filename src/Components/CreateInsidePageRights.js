import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Loader from "./Loader.js";
import OpenMenu from "../assets/menu_open.png";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  Open_Menu_text,
  createInsidePageText,
} from "../CommonJquery/WebsiteText";
import {
  handleAphabetsChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  handleURLChange,
  handleAlphabetRightId,
} from "../CommonJquery/CommonJquery.js";
import {
  server_post_data,
  save_update_StaffRights,
  get_all_StaffRights,
} from "../ServiceConnection/serviceconnection.js";
import { useLocation } from "react-router-dom";
function CreateInsidePageRights() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [filteredData, setfilteredData] = useState([]);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [parentDataMainID, setparentDatMainID] = useState("0");

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      const right_name = document.getElementById("right_name").value;
      const right_id = document.getElementById("right_id").value;
      const mixing = right_id + "@" + right_name;
      const datamiom = [...filteredData];
      const joinedString = datamiom.join("/");
      let mixedString;
      if (joinedString) {
        mixedString = joinedString + "/" + mixing;
      } else {
        mixedString = mixing;
      }
      ///console.log(mixedString);
      fd_from.append("insidepage", mixedString);
      fd_from.append("parent_id", parentDataMainID);
      fd_from.append("flag", "3");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(
              Response.data.message,
              "/View_Inside_Page_Rights/" + parentDataMainID
            );
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
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
      setparentDatMainID(call_id);
    }
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("call_id", call_id);
    fd.append("flag", "4");
    await server_post_data(get_all_StaffRights, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.data[0].insidepage !== null) {
            const datamiom =
              Response.data.message.data[0].insidepage.split("/");
            if (datamiom[0] != "") {
              setfilteredData(datamiom);
            } else {
              setfilteredData([]);
            }
            console.log(datamiom);
          }
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };
  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{createInsidePageText.Create_Inside_R}</p>
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
                                {createInsidePageText.Right_Name}
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder={createInsidePageText.Right_Name}
                                  minLength={3}
                                  maxLength={75}
                                  id="right_name"
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
                                Right Class
                                <span>*</span>
                              </label>
                              <div className="inputDiv1">
                                <input
                                  type="text"
                                  name="staff_name"
                                  placeholder="Right Class"
                                  minLength={3}
                                  maxLength={75}
                                  id="right_id"
                                  className={`trio_mandatory  input_field_customPadding form-control`}
                                  onInput={handleAlphabetRightId}
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
                                save_update_StaffRights
                              )
                            }
                          >
                            {createInsidePageText.create_Text}
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

export default CreateInsidePageRights;
