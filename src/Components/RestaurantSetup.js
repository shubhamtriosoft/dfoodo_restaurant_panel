import React, { useEffect, useState } from "react";
import "./Css/RestoSetup.css";
import Header from "./Header";
import Loader from "./Loader.js";
import EmployeeImg from "../assets/storeNew1.png";
import NORestro from "../assets/norestro.png";
import { Link } from "react-router-dom";
import Editred from "../assets/editred.svg";
import {
  server_post_data,
  action_update_resturant,
  get_all_new_resturant,
  APL_LINK,
} from "../ServiceConnection/serviceconnection.js";
import { handleError } from "../CommonJquery/CommonJquery";

function RestaurantSetup() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [noRestroAdded, setNoRestroAdded] = useState("1");
  const [editStaffData, seteditStaffData] = useState([]);
  const [StaffImageLinkData, setsStaffImageLinkData] = useState("");

  useEffect(() => {
    const flag = "1";
    let call_id = "0";
    master_data_get("", "", flag, call_id);
  }, []);

  const master_data_get = async (start_date, end_date, flag, call_id) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_new_resturant, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data_restaurant);
          setNoRestroAdded(Response.data.message.show_create_option);

          setsStaffImageLinkData(
            APL_LINK + Response.data.message.data_restaurant_image
          );
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
              <div className="pageCntn_head_left"></div>
            </div>

            <div className="page_body height80 container-lg">
              <div className="view_restroCOntainer">
                <div className="restroView_table">
                  <div className="restroView_table_Container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Restaurant Details</th>
                          <th scope="col">Contact Details</th>
                          <th scope="col">Email</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {editStaffData.map((option, index) => (
                          <>
                            <React.Fragment key={index}>
                              <tr className="tableRow tbodyStyle">
                                <td className="th1">
                                  <div className="rsvnDetails saparator1">
                                    <div className="rsvnDetailsImg">
                                      <img
                                        src={
                                          StaffImageLinkData +
                                          option.restaurant_image
                                        }
                                        onError={(e) =>
                                          (e.target.src = EmployeeImg)
                                        }
                                        alt="Barley's Dashboard"
                                      />
                                    </div>
                                    <div className="rsvnDetailsText">
                                      <h6>{option.restaurant_name}</h6>
                                      <p>{option.restaurant_tagline}</p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="rsvnDetails">
                                    <div className="rsvnContactDetails">
                                      <p>{option.restaurant_mobile_no}</p>
                                      {option.restaurant_other_no.length >
                                        2 && (
                                        <p>{option.restaurant_other_no}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="rsvnDetails">
                                    <div className="rsvnContactDetails">
                                      <p>{option.restaurant_email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="th2">
                                  <div className="rsvnDetails">
                                    <Link
                                      to={`/edit_restaurants/${option.primary_id}`}
                                    >
                                      <button className="editRestroBtn Edit_Restro">
                                        <img
                                          src={Editred}
                                          alt="Barley's Dashboard"
                                        />
                                        <p>Edit</p>
                                      </button>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr
                                //   key={`spacer-${index}`}
                                style={{ height: "1rem" }}
                              ></tr>
                            </React.Fragment>
                          </>
                        ))}
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
  );
}

export default RestaurantSetup;
