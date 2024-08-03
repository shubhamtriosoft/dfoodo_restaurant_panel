import React, { useState, useEffect } from "react";
import "./Css/StaffRights.css";
import Header from "./Header";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  Add_designation_text,
  CreateStaffRightText,
  EditStaffPage,
} from "../CommonJquery/WebsiteText";
import {
  handleAphabetsChange,
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  handleURLChange,
} from "../CommonJquery/CommonJquery";
import {
  server_post_data,
  save_update_designtion,
  get_all_designation,
} from "../ServiceConnection/serviceconnection.js";
import { Link, useLocation } from "react-router-dom";
function AddDesignation() {
  const location = useLocation();
  const currentUrl = location.pathname.substring(1);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editorDataMainID, setEditorDatMainID] = useState("0");
  const [editStaffData, seteditStaffData] = useState([]);
  const [parentData, setParentData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [designationpagelist, setDesignationPagelist] = useState([]);

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    const checkboxes = document.querySelectorAll(".checkboxclass");
    let access_list = "";
    // Loop through each checkbox
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked == true) {
        access_list += "/" + checkbox.value;
      }
      if (checkbox.hasAttribute("insidepagehave")) {
        const insidePageValue = checkbox.getAttribute("insidepagehave");
        const insideDiv = document.querySelector(
          ".insidemain" + insidePageValue
        );
        if (insideDiv) {
          const innerCheckboxes = insideDiv.querySelectorAll(
            'input[type="checkbox"]'
          );
          innerCheckboxes.forEach((innerCheckbox) => {
            if (innerCheckbox.checked == true) {
              access_list += "@" + innerCheckbox.value;
            }
          });
        }
      }
    });
    if (access_list.startsWith("/")) {
      access_list = access_list.substring(1);
    }
    if (access_list == "") {
      alert("Please Select Staff Rights");
    } else {
      if (vaild_data) {
        setshowLoaderAdmin(true);
        let fd_from = combiled_form_data(form_data, null);
        fd_from.append("main_id", editorDataMainID);
        fd_from.append("access_list", access_list);
        await server_post_data(url_for_save, fd_from)
          .then((Response) => {
            console.log(Response.data.message);
            setshowLoaderAdmin(false);
            if (Response.data.error) {
              handleError(Response.data.message);
            } else {
              handleSuccessSession(Response.data.message, "/ViewDesignation");
            }
          })
          .catch((error) => {
            setshowLoaderAdmin(false);
            handleError(
              Add_designation_text.error_message_toast_handleSaveChangesDyanamic
            );
          });
      }
    }
  };

  useEffect(() => {}, [parentData]);

  const master_data_get = async () => {
    const url = currentUrl;
    const parts = url.split("/");
    let call_id = 0;
    let flag = 1;
    if (parts.length !== 1) {
      call_id = parts[1];
      flag = 2;
    }
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("call_id", call_id);
    fd.append("flag", flag);
    await server_post_data(get_all_designation, fd)
      .then((Response) => {
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          console.log(Response.data.message);

          // Assuming this is within a React component
          var parent_array_nty = [];
          var sub = {};
          Response.data.message.data.forEach(function (item) {
            if (item.parent_id == 0) {
              parent_array_nty.push({
                id: item.id,
                page_name: item.page_name,
                page_url_id: item.page_url_id,
                parent_id: item.parent_id,
                insidepage: item.insidepage,
                dropdown: item.dropdown,
                flag: item.flag,
              });
            } else {
              if (!sub[item.parent_id]) {
                sub[item.parent_id] = []; // Initialize sub array if not already defined
              }
              sub[item.parent_id].push({
                id: item.id,
                page_name: item.page_name,
                page_url_id: item.page_url_id,
                parent_id: item.parent_id,
                insidepage: item.insidepage,
                dropdown: item.dropdown,
                flag: item.flag,
              });
            }
          });
          setParentData(parent_array_nty);
          setSubData(sub);

          if (Response.data.message.designation.length > 0) {
            ///console.log(Response.data.message.designation[0].access_permission);
            const datamiom =
              Response.data.message.designation[0].access_permission.split("/");
            const newDataxt = datamiom.reduce((acc, item, index) => {
              if (item.includes("@")) {
                const [page, ...extras] = item.split("@");
                if (!acc[page]) {
                  acc[page] = {};
                }
                extras.forEach((extra, idx) => {
                  acc[page][idx] = extra;
                });
              } else {
                acc[item] = { ["class_list"]: "" };
              }
              return acc;
            }, {});
            console.log(newDataxt);
            setDesignationPagelist(newDataxt);

            if (Response.data.message.data[0].dropdown == true) {
              Response.data.message.data[0].dropdown = 1;
            } else {
              Response.data.message.data[0].dropdown = 0;
            }
            setEditorDatMainID(Response.data.message.designation[0].primary_id);
            seteditStaffData(
              Response.data.message.designation[0].designation_name
            );
          }
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        // handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  useEffect(() => {
    master_data_get();
  }, []);

  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}
      <div className="dashboard_container">
        <Header />
        <div className="page_content">
          <div className="page_content_container">
            <div className="pageCntn_head" style={{ top: "0px" }}>
              <div className="pageNameDiv">
                <p>
                  {location.pathname.includes("/Edit_Designation") ? (
                    <p>Edit Designation</p>
                  ) : (
                    <p>Add Designation</p>
                  )}
                </p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
              <div className="col-xl-2 col-sm-4 bottomAlgin">
                <Link to="/create_Staff_Rights">
                  <button type="button" className="btnAddStaff add_staff_right">
                    {Add_designation_text.button_text}
                  </button>
                </Link>
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
                                {Add_designation_text.Designation_name}
                                <span>*</span>
                              </label>
                              <div>
                                <input
                                  type="text"
                                  name="right_name"
                                  placeholder={
                                    Add_designation_text.Designation_name
                                  }
                                  minLength={3}
                                  maxLength={75}
                                  className="trio_name trio_mandatory input_field_custom2 input_field_customPadding form-control"
                                  onInput={handleAphabetsChange}
                                  defaultValue={editStaffData || ""}
                                />
                                <span className="condition_error"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="addDesigRights">
                          <div className="addDesigRightsContainer">
                            <h6>{Add_designation_text.select_staff_rights}</h6>

                            <div className="selectRightsBox">
                              <div className="selectRightsBox_container">
                                {parentData.map((option, index) => (
                                  <div className="selectRightsBoxList">
                                    <div className="selectRightsBoxListHead">
                                      <div className="no_prsnl_id">
                                        <div className="rememberMe">
                                          <input
                                            type="checkbox"
                                            id={`master${index}`}
                                            tabIndex="1"
                                            className={`hidden-checkbox checkboxclass  checkboxclass${index}`}
                                            value={option.page_url_id}
                                            defaultChecked={
                                              designationpagelist.hasOwnProperty(
                                                option.page_url_id
                                              )
                                                ? true
                                                : false
                                            }
                                            {...(option.parent_id == "0" &&
                                              option.dropdown == false && {
                                                insidepagehave: `mn${index}`,
                                              })}
                                          />

                                          <label
                                            htmlFor={`master${index}`}
                                            className="checkbox-label labelCheckbox"
                                            tabIndex="2"
                                          >
                                            {option.page_name}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    {subData[option.id] &&
                                      subData[option.id].map(
                                        (suboption, subindex) => (
                                          <React.Fragment key={subindex}>
                                            <div
                                              className="subrightsBoxes"
                                              key={subindex}
                                            >
                                              <ul>
                                                <li>
                                                  <div>
                                                    <div className="selectRightsBoxListHead checkboxFlex">
                                                      <input
                                                        type="checkbox"
                                                        insidepagehave={`${subindex}`}
                                                        className={`checkboxclass checkboxclass${index}_${subindex}`}
                                                        value={
                                                          suboption.page_url_id
                                                        }
                                                        defaultChecked={
                                                          designationpagelist.hasOwnProperty(
                                                            suboption.page_url_id
                                                          )
                                                            ? true
                                                            : false
                                                        }
                                                      />
                                                      <label>
                                                        {suboption.page_name}
                                                      </label>
                                                    </div>
                                                    <div
                                                      className={`inside_PageBoxes insidemain${subindex}`}
                                                    >
                                                      <ul>
                                                        {suboption.insidepage &&
                                                          suboption.insidepage
                                                            .split("/")
                                                            .map(
                                                              (
                                                                insidePage,
                                                                insideIndex
                                                              ) => {
                                                                const insidePages =
                                                                  insidePage.split(
                                                                    "@"
                                                                  ); // Split by "@" if exists
                                                                return (
                                                                  <li
                                                                    key={
                                                                      insideIndex
                                                                    }
                                                                    className="col-md-3"
                                                                  >
                                                                    <div className="selectRightsBoxListHead">
                                                                      <input
                                                                        type="checkbox"
                                                                        className={`insidePage checkboxclass${index}_${subindex}_${insideIndex}`}
                                                                        value={
                                                                          insidePages[0]
                                                                        }
                                                                        defaultChecked={
                                                                          designationpagelist.hasOwnProperty(
                                                                            suboption.page_url_id
                                                                          ) &&
                                                                          Object.values(
                                                                            designationpagelist[
                                                                              suboption
                                                                                .page_url_id
                                                                            ]
                                                                          ).includes(
                                                                            insidePages[0]
                                                                          )
                                                                            ? true
                                                                            : false
                                                                        }
                                                                      />
                                                                      <label>
                                                                        {
                                                                          insidePages[1]
                                                                        }
                                                                      </label>
                                                                    </div>
                                                                  </li>
                                                                );
                                                              }
                                                            )}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                </li>
                                              </ul>
                                            </div>
                                          </React.Fragment>
                                        )
                                      )}

                                    {option.parent_id == "0" &&
                                      option.dropdown == false && (
                                        <React.Fragment key={index}>
                                          <div
                                            className="subrightsBoxes"
                                            key={index}
                                          >
                                            <ul>
                                              <li>
                                                <div>
                                                  <div
                                                    className={`inside_PageBoxes insidemainmn${index}`}
                                                  >
                                                    <ul>
                                                      {option.insidepage &&
                                                        option.insidepage
                                                          .split("/")
                                                          .map(
                                                            (
                                                              insidePage,
                                                              insideIndex
                                                            ) => {
                                                              console.log(
                                                                "inside"
                                                              );
                                                              const insidePages =
                                                                insidePage.split(
                                                                  "@"
                                                                ); // Split by "@" if exists
                                                              return (
                                                                <li
                                                                  key={
                                                                    insideIndex
                                                                  }
                                                                  className="col-md-3"
                                                                >
                                                                  <div className="selectRightsBoxListHead">
                                                                    <input
                                                                      type="checkbox"
                                                                      className={`insidePage checkboxclass${index}_${insideIndex}`}
                                                                      value={
                                                                        insidePages[0]
                                                                      }
                                                                      defaultChecked={
                                                                        designationpagelist.hasOwnProperty(
                                                                          option.page_url_id
                                                                        ) &&
                                                                        Object.values(
                                                                          designationpagelist[
                                                                            option
                                                                              .page_url_id
                                                                          ]
                                                                        ).includes(
                                                                          insidePages[0]
                                                                        )
                                                                          ? true
                                                                          : false
                                                                      }
                                                                    />
                                                                    <label>
                                                                      {
                                                                        insidePages[1]
                                                                      }
                                                                    </label>
                                                                  </div>
                                                                </li>
                                                              );
                                                            }
                                                          )}
                                                    </ul>
                                                  </div>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </React.Fragment>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="createRightBtnDiv mb-5">
                          <button
                            className="btn btn-primary Create_Designation_Btn btnSave"
                            type="button"
                            onClick={() =>
                              handleSaveChangesdynamic(
                                "createRightsForm",
                                save_update_designtion
                              )
                            }
                          >
                            {location.pathname.includes("/Edit_Designation")
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

export default AddDesignation;
