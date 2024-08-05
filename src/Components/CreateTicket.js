import React, { useState, useEffect } from "react";
import "./Css/HelpSupport.css";
import "./Css/StaffRights.css";
import Header from "./Header.js";
import Success from "../assets/success_gif.gif";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  empty_form,
  handleNumbersChange,
  computeTodayDate,
  computeFutureDate,
  handleIaphabetnumberChange,
} from "../CommonJquery/CommonJquery.js";
import {
  server_post_data,
  get_save_update_tickets,
} from "../ServiceConnection/serviceconnection.js";
function CreateNewTicket() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);

  const [ticketType, setTicketType] = useState("");
  const [priority, setPriority] = useState("High");
  const [ticketBody, setTicketBody] = useState("");

  
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const ticketNAme = [
    { name: "Bug", code: "Bug" },
    { name: "Feature Request", code: "Feature Request" },
    { name: "Amendment", code: "Ammendment" },
    { name: "Upgradation", code: "Upgradation" },
    { name: "KB Update", code: "KB Update" },
  ];

  const priorityArray = [
    { name: "High", code: "High" },
    { name: "Medium", code: "Medium" },
    { name: "Low", code: "Low" },
  ];

  


  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      await server_post_data(url_for_save, fd_from)
        .then((Response) => {
          setshowLoaderAdmin(false);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            handleSuccessSession(Response.data.message, "/Manuals");
            empty_form(form_data);
          }
        })
        .catch((error) => {
          console.log(error);
          setshowLoaderAdmin(false);
        });
    }
  };


  return (
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head container-lg">
              <div className="pageNameDiv">
                <p>
                  <p>
                    Create New Ticket
                    <img src={GreyArrow} alt="Shopup Admin" />
                  </p>
                </p>
              </div>
            </div>

            <div className="page_body">
              <div className="create_staffRights container-lg">
                <div className="Suppotr_wrapper">
                  <div className="newticket-container">
                    <div className="newticket_head">
                      <h4>Create Quick Ticket</h4>
                      <p>Write and address new queries and issues</p>
                    </div>
                    <form id="createRightsForm">
                      <div className="newTicketform">
                        <div className="row m-0">
                          <div className="col-md-4">
                            <div className="form-row">
                              <label>Request Ticket Type</label>
                              <br />

                              <select
                                value={ticketType}
                                onChange={(e) => setTicketType(e.target.value)}
                                placeholder="Choose Type"
                                className="priorityBtn trio_mandatory form-control"
                                id="request_ticket_type"
                                name="request_ticket_type"
                                style={{
                                  paddingTop: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                <option value=" ">Choose Type</option>
                                {ticketNAme.map((item, index) => (
                                  <option key={index} value={item.code}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              <span className="condition_error"></span>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-row">
                              <label>Priority Status</label>
                              <br />

                              <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                placeholder="Choose Type"
                                optionLabel="name"
                                id="priority_status"
                                name="priority_status"
                                className="priorityBtn trio_mandatory form-control"
                                style={{
                                  paddingTop: "8px",
                                  paddingBottom: "8px",
                                }}
                              >
                                <option value=" ">Choose Type</option>
                                {priorityArray.map((item, index) => (
                                  <option key={index} value={item.code}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              <span className="condition_error"></span>
                            </div>
                          </div>
                        </div>
                        <div className="form-row" style={{ padding: "0 12px" }}>
                          <label>Ticket Body</label>
                          <br />
                          <textarea
                            rows="7"
                            value={ticketBody}
                            id="ticket_body"
                            name="ticket_body"
                            className="priorityBtn trio_mandatory form-control"
                            onChange={(e) => setTicketBody(e.target.value)}
                          />
                          <span className="condition_error"></span>
                        </div>
                      </div>
                    </form>
                    <div
                      className="newticketSubmitBtn"
                      style={{ padding: "0 12px" }}
                    >
                      <button
                        onClick={() =>
                          handleSaveChangesdynamic(
                            "createRightsForm",
                            get_save_update_tickets
                          )
                        }
                        type="button"
                      >
                        Send Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id="myModal"
        show={showModal}
        onHide={closeModal}
        centered
        backdrop="static"
      >
        <Modal.Body className="modal_body">
          <div className="success_img d-flex justify-content-center">
            <img src={Success} alt="icon" />
          </div>
          <p>
            Your ticket has been send successfully. Click on the button below to
            see your tickets.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/Help">
            <div className="btn go_to_login">View Tickets</div>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateNewTicket;
