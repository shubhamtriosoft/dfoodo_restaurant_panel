import React, { useState, useEffect } from "react";
import Header from "./Header.js";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import EditBtn from "../assets/edit_square.png";
import { ViewDesignationData } from "../CommonJquery/WebsiteText.js";
import {
  server_post_data,
  get_all_designation,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  formatDateStringdot,
} from "../CommonJquery/CommonJquery.js";
import { Link } from "react-router-dom";
function ViewDesignation() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [filteredData, setfilteredData] = useState([]);

  const master_data_get = async () => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("flag", "3");
    await server_post_data(get_all_designation, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          const datamiom = Response.data.message.designation;

          setfilteredData(datamiom);

          console.log(datamiom);
        }
        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        handleError("network");
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
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>{ViewDesignationData.viewdesignation_data}</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
              <div className="col-xl-2 col-sm-4 bottomAlgin">
                <Link to={`/Add_Designation`}>
                  <button type="button" className="btnAddStaff add_staff">
                    {ViewDesignationData.Add_Btn}
                  </button>
                </Link>
              </div>
            </div>

            <div className="page_body">
              <div className="viewStaff">
                <div className="viewGuest_table">
                  <div className="viewGuest_table_container">
                    <div className="row m-0">
                      <div className="col-md-12">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <div className="theadStyle imgThead">
                                  <span>{ViewDesignationData.Entry_date}</span>
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewDesignationData.Designation_Name}
                                </div>
                              </th>
                              <th scope="col">
                                <div className="theadStyle">
                                  {ViewDesignationData.Action_text}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tboday">
                            {filteredData.map((option, index) => {
                              return (
                                <React.Fragment>
                                  <tr className="tableRow">
                                    <td className="th1">
                                      <div className="tbodyStyle guest_incenter borderLeftRadius">
                                        {formatDateStringdot(option.entry_date)}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tbodyStyle guest_incenter shadowOnlyBottom">
                                        {option.designation_name}
                                      </div>
                                    </td>

                                    <td className="th2">
                                      <div className="tbodyStyle1 guest_incenter borderRightRadius">
                                        {option.designation_name !==
                                          "Owner" && (
                                          <div className="rightsActionBtns">
                                            <Link
                                              to={`/Edit_Designation/${option.primary_id}`}
                                            >
                                              <button
                                                className="editRightBtn Edti_Sub_Right_btn"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="left"
                                                title="Edit Designation"
                                              >
                                                <img
                                                  src={EditBtn}
                                                  alt="Barley's Dashboard"
                                                />
                                              </button>
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr style={{ height: "1rem" }}></tr>
                                </React.Fragment>
                              );
                            })}
                            {filteredData.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text_align_center">
                                  No Results Found
                                </td>{" "}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default ViewDesignation;
