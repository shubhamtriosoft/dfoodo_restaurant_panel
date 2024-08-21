import React, { useState, useEffect } from "react";
import {
  Open_Menu_text,
  CreateStaffRightText,
} from "../CommonJquery/WebsiteText";
import {
  check_vaild_save,
  combiled_form_data,
  handleSuccess,
  handleError,
  handleURLChange,
  handleAphabetsChange,
} from "../CommonJquery/CommonJquery";
import Loader from "./Loader.js";
import {
  server_post_data,
  save_update_general_Settings,
  get_all_ReservationSetting,
} from "../ServiceConnection/serviceconnection.js";
function IntegrationSettings() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [reservationsettings, setreservationsettings] = useState(null); // State to hold calendar data
  const [url, setUrl] = useState("");
  const handleSaveUrlChange = (event) => {
    const url = event.target.value;
    setUrl(url);
  };

  useEffect(() => {
    const master_data_get = async () => {
      setshowLoaderAdmin(true);
      const fd = new FormData();
      await server_post_data(get_all_ReservationSetting, fd)
        .then((Response) => {
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            setreservationsettings(Response.data.message.data[0]);
            console.log(Response.data.message);
          }

          setshowLoaderAdmin(false);
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
        });
    };
    master_data_get();
  }, []);

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);
    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("flag", "2");
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          console.log(Response.data.message);
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccess(Response.data.message);
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
          handleError("network");
        });
    }
  };
  return (
    <div className="integration_Settings">
      {showLoaderAdmin && (
        <Loader />
      )}
      <div className="integration_Settings_container">
        <form className="createForm" id="createForm">
          <div className="row m-0">
            <div className="col-lg-5 col-md-8">
              <div className="intergerInputDiv">
                <label>Google Place ID*</label>
                <div className="googleicon image_icon_position1">
                  <input
                    type="text"
                    name="google_place_id"
                    placeholder={"Google Place ID"}
                    className="form-control trio_mandatory input_field_custom2 "
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["google_place_id"]
                        : ""
                    }
                  />
                  <span className="condition_error"></span>
                </div>
              </div>

              <div className="intergerInputDiv">
                <label>Wowreviews Key *</label>
                <div className="wowpng image_icon_position1">
                  <input
                    type="text"
                    name="wowreview_key"
                    placeholder={"Wowrevies Key"}
                    className="form-control trio_mandatory input_field_custom2 "
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["wowreview_key"]
                        : ""
                    }
                  />
                  <span className="condition_error"></span>
                </div>
              </div>
              <div className="intergerInputDiv">
                <label>Wowreviews URL *</label>
                <div className="wowpng image_icon_position1">
                  <input
                    type="text"
                    name="wowreview_url"
                    placeholder={"Wowrevies URL"}
                    className="form-control trio_mandatory input_field_custom2 "
                    onInput={handleURLChange}
                    onChange={handleSaveUrlChange}
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["wowreview_url"]
                        : ""
                    }
                  />
                  <span className="condition_error"></span>
                </div>
              </div>
              <div className="intergerInputDiv">
                <label>Takeaway Url *</label>
                <div className="take-away image_icon_position1">
                  <input
                    type="text"
                    name="take_away_url"
                    placeholder={"Takeaway Url"}
                    className="form-control trio_mandatory input_field_custom2 "
                    onInput={handleURLChange}
                    onChange={handleSaveUrlChange}
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["take_away_url"]
                        : ""
                    }
                  />
                  <span className="condition_error"></span>
                </div>
              </div>

              <div className="intergerInputDiv">
                <label>Delivery Url *</label>
                <div className="delivery-scooter image_icon_position1">
                  <input
                    type="text"
                    name="delivery_url"
                    placeholder={"Delivery Url"}
                    onInput={handleURLChange}
                    onChange={handleSaveUrlChange}
                    className="form-control trio_mandatory input_field_custom2 "
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["delivery_url"]
                        : ""
                    }
                  />
                  <span className="condition_error"></span>
                </div>
              </div>
              
              

            </div>
            <div className="col-lg-7 col-md-8">
              <div className="intergerInputDiv " style={{height:"400px"}}>
                <label>Delivery Url *</label>
                <div className="delivery-scooter image_icon_position1  h-80"  style={{height:"400px"}}>
                  <textarea
                    // type="text"
                    name="restaurant_about"
                    placeholder={"About Restaurant"}
                    onInput={handleAphabetsChange}
                    onChange={handleSaveUrlChange}
                    className="form-control trio_mandatory input_field_custom2 " 
                    defaultValue={
                      reservationsettings
                        ? reservationsettings["restaurant_about"]
                        : ""
                    }
                  ></textarea>
                  <span className="condition_error"></span>
                </div>
              </div>
            </div>
              <div className="saveFormBtns">
                <button className="btnCancel" type="hidden">
                  Cancel
                </button>
                <button
                  className="Create_Right_Btn btnSave"
                  type="button"
                  onClick={() =>
                    handleSaveChangesdynamic(
                      "createForm",
                      save_update_general_Settings
                    )
                  }
                >
                  Update
                </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IntegrationSettings;
