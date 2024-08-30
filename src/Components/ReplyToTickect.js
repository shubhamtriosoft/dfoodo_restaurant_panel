import React, { useState, useEffect } from "react";
import "./Css/HelpSupport.css";
import "./Css/StaffRights.css";
import Header from "./Header.js";
import Success from "../assets/success_gif.gif";
import Modal from "react-bootstrap/Modal";
import { Link, useParams, useLocation } from "react-router-dom";
import Loader from "./Loader.js";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  check_vaild_save,
  combiled_form_data,
  handleSuccessSession,
  handleError,
  empty_form,
  formatDateStringdot,
} from "../CommonJquery/CommonJquery.js";
import {
  server_post_data,
  get_save_update_tickets_details,
  get_all_tickets,
} from "../ServiceConnection/serviceconnection.js";
function ReplyToTicket() {
  const location = useLocation();
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const { ticketId } = useParams();
  const [ticketBody, setTicketBody] = useState("");

  const [ticketConversation, setTicketConversation] = useState([]);
  const [priority_status, setpriority_status] = useState("");

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    setshowLoaderAdmin(true);
    let formdata = new FormData();
    formdata.append("primary_id", ticketId);
    await server_post_data(get_all_tickets, formdata)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          if (Response.data.message.ticket_data.length > 0) {
            setTicketConversation(
              Response.data.message.ticket_data[0].ticket_details
            );
            setpriority_status(
              Response.data.message.ticket_data[0].priority_status
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
      });
  };

  const handleSaveChangesdynamic = async (form_data, url_for_save) => {
    let vaild_data = check_vaild_save(form_data);

    if (vaild_data) {
      setshowLoaderAdmin(true);
      let fd_from = combiled_form_data(form_data, null);
      fd_from.append("ticket_id", ticketId);
      fd_from.append("priority_status", priority_status);
      fd_from.append("ticket_id", ticketId);
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
                  <p className="d-flex align-items-center gap-1">
                    {location.pathname.includes("Reply_Ticket") ? (
                      <p>Reply To Ticket</p>
                    ) : (
                      <p>Create New Ticket</p>
                    )}
                    <img
                      style={{ height: "15px" }}
                      src={GreyArrow}
                      alt="Shopup Admin"
                    />
                  </p>
                </p>

                {/* <p>
                  <p>{editorDataMainID !== "0" ? "Edit FAQ" : "Add FAQs"}</p>
                </p>
                <img src={GreyArrow} alt="Shopup Admin" /> */}
              </div>
            </div>

            <div className="page_body">
              <div className="create_staffRights container-lg">
                <div className="Suppotr_wrapper">
                  <div className="newticket-container">
                    {ticketConversation.map((ticket, idx) => {
                      return (
                        <div className="ticketReplyDiv" key={ticket.primary_id}>
                          <div className="ticketsListItemHead">
                            <div className="ticketsListItemHeadLeft">
                              {/* <div className="NewTicket"></div> */}
                              <p>Ticket: #{ticket.ticket_id}</p>
                            </div>
                            <div className="ticketsListItemHeadRight">
                              <div className="ticketTime">
                                <p>
                                  Posted on{" "}
                                  {formatDateStringdot(ticket.entry_date)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ticketDetails">
                            <div className="ticketDetailsContainer">
                              {idx === 0 && <h6>{ticket.ticket_body}</h6>}
                              {idx > 0 && <p>{ticket.ticket_body}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {ticketConversation &&
                      ticketConversation.length > 0 &&
                      ticketConversation[0].ticket_category !== "Resolved" && (
                        <>
                          <form id="createRightsForm">
                            <div className="newticket_head newticket_head2">
                              <h5>Reply To Ticket</h5>
                            </div>
                            <div className="newTicketform">
                              <div
                                className="form-row"
                                style={{ padding: "0 12px" }}
                              >
                                <label>Ticket Body</label>
                                <br />
                                <textarea
                                  rows="7"
                                  value={ticketBody}
                                  id="ticket_body"
                                  name="ticket_body"
                                  className="priorityBtn trio_mandatory form-control"
                                  onChange={(e) =>
                                    setTicketBody(e.target.value)
                                  }
                                />
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
                                  get_save_update_tickets_details
                                )
                              }
                            >
                              Reply
                            </button>
                          </div>
                        </>
                      )}
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
            Your reply has been send successfully. Click on the button below to
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

export default ReplyToTicket;
