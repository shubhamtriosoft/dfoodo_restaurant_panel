import React, { useState, useEffect } from "react";
import "./Css/HelpSupport.css";
import "./Css/StaffRights.css";
import SearchIcon from "../assets/search-normal.svg";
import Edit from "../assets/message-edit.svg";
import SMS from "../assets/sms.svg";
import SMSnot from "../assets/allticketNot.svg";
import NewSMS from "../assets/sms-notification.svg";
import NewSMSSelected from "../assets/newselected.svg";
import OnGoingSMS from "../assets/sms-tracking.svg";
import OnGoingSMSSelected from "../assets/onselected.svg";
import ResolvedSMS from "../assets/sms-star.svg";
import ResolvedSMSselected from "../assets/resolvedSelected.svg";
import People from "../assets/People.svg";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import Loader from "./Loader.js";
import {
  server_post_data,
  get_all_tickets,
  resolve_ticket_by_user,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  formatDateStringdot,
  handleSuccess,
} from "../CommonJquery/CommonJquery.js";
function Help() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [searchTicket, setSearchTicket] = useState("");
  const priority = [
    { name: "New Ticket", code: "New", color: "#3B8AFF" },
    { name: "On-Going", code: "On", color: "#FAC885" },
    { name: "Resolved", code: "Resolved", color: "#54C104" },
  ];
  ///////////////////////////////////////
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    setshowLoaderAdmin(true);
    await server_post_data(get_all_tickets, null)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          console.log(Response.data.message.ticket_data);
          setTicketList(Response.data.message.ticket_data);
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
      });
  };

  //////////////////////////

  const customItemTemplate = (option) => {
    return (
      <div className="optionDIvPrio">
        <div
          className="optionBgDiv"
          style={{ backgroundColor: `${option.color}` }}
        ></div>
        {option.name}
      </div>
    );
  };

  const [selectedTicketNumber, setSelectedTicketNumber] = useState("");

  const show_confirmation_modal = (ticket_no) => {
    setShowModal(true);
    setSelectedTicketNumber(ticket_no);
  };

  const [selectedTab, setSelectedTab] = useState("allTickets");
  const [selectedPriority, setSelectedPriority] = useState(null);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handlePriorityChange = (selectedPriority) => {
    setSelectedPriority(selectedPriority ? selectedPriority.code : null);

    // Update selectedTab based on selectedPriority
    if (selectedPriority) {
      const tabForPriority = mapPriorityToTab(selectedPriority.code);
      setSelectedTab(tabForPriority);
    }
  };

  const mapPriorityToTab = (priorityCode) => {
    // You may need to customize this mapping based on your specific logic
    if (priorityCode === "New") {
      return "new";
    } else if (priorityCode === "On") {
      return "onGoing";
    } else if (priorityCode === "Resolved") {
      return "resolved";
    }
    // Default to 'allTickets' if no match
    return "allTickets";
  };

  const filteredTickets = () => {
    let filteredList = ticketList;
    // Filter further based on the selected tab
    if (selectedTab === "new") {
      filteredList = filteredList.filter(
        (ticket) => ticket.ticket_category === "New"
      );
    } else if (selectedTab === "onGoing") {
      filteredList = filteredList.filter(
        (ticket) => ticket.ticket_category === "On-going"
      );
    } else if (selectedTab === "resolved") {
      filteredList = filteredList.filter(
        (ticket) => ticket.ticket_category === "Resolved"
      );
    }

    filteredList = filteredList.filter((ticket) => {
      let ticket_date = new Date(ticket.entry_date);
      // Check date range
      const isDateInRange =
        selectedtime.startDate <= ticket_date &&
        selectedtime.endDate >= ticket_date;

      // Check if the sender contains searchTicket (case insensitive)
      const isSenderMatch =
        searchTicket === "" ||
        ticket.ticket_body.toLowerCase().includes(searchTicket.toLowerCase());

      // Return true if both conditions are met
      return isDateInRange && isSenderMatch;
    });
    return filteredList;
  };

  const [selectedtime, setSelectedselectedtime] = useState({
    value: "All",
    startDate: new Date("2023-01-01"),
    endDate: new Date(),
  });

  const timeList = [
    { name: "All", code: 0 },
    { name: "This Week", code: 1 },
    { name: "This Month", code: 2 },
    { name: "Last Month", code: 3 },
    { name: "Last 3 Months", code: 4 },
  ];

  const handleDurationFilterChange = (timePeriod) => {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of the week
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);
    lastMonthEnd.setDate(thisMonthStart.getDate() - 1);
    const last3MonthsStart = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      1
    );

    const filters = [
      { value: "All", startDate: new Date("2023-01-01"), endDate: today },
      { value: "This Week", startDate: thisWeekStart, endDate: today },
      { value: "This Month", startDate: thisMonthStart, endDate: today },
      {
        value: "Last Month",
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
      },
      { value: "Last 3 Months", startDate: last3MonthsStart, endDate: today },
    ];

    setSelectedselectedtime(filters[timePeriod.code]);
  };

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const searchTicketFromDB = async (input) => {
    setSearchTicket(input);
    filteredTickets();
  };

  const resolveTicket = async () => {
    setshowLoaderAdmin(true);
    let formdata = new FormData();
    formdata.append("resolve_by", "owner");
    formdata.append("ticket_id", selectedTicketNumber);
    await server_post_data(resolve_ticket_by_user, formdata)
      .then((Response) => {
        setshowLoaderAdmin(false);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          handleSuccess(Response.data.message);
          closeModal();
          getAllTickets();
        }
      })
      .catch((error) => {
        console.log(error);
        setshowLoaderAdmin(false);
      });
  };

  return (
    <>
      <div className="Suppotr_wrapper">
      {showLoaderAdmin && <Loader />}
        <div className="Suppotr_Header">
          <div className="searchInputHelp">
            <img src={SearchIcon} alt="icon" />
            <input
              type="text"
              placeholder="Search for ticket"
              onChange={(e) => {
                searchTicketFromDB(e.target.value);
              }}
              onInput={(e) => {
                if (!/^[a-zA-Z0-9@.]*$/.test(e.target.value)) {
                  e.target.value = ""; // Clear the input if it contains any other character
                }
              }}
            />
          </div>

          <div className="Suppotr_HeaderRight">
            <div className="Suppotr_HeaderRightCont">
              <div className="guideBtn">
                <p>Self Help Guide Resources </p>
              </div>
              <div className="Suppotr_HeaderBtns">
                <Dropdown
                  value={priority.find((p) => p.code === selectedPriority)}
                  onChange={(e) => handlePriorityChange(e.value)}
                  options={priority}
                  optionLabel="name"
                  placeholder="Select Ticket Type"
                  className="priorityBtn"
                  itemTemplate={customItemTemplate}
                />
                <Dropdown
                  value={timeList.find((p) => p.name === selectedtime.value)}
                  onChange={(e) => handleDurationFilterChange(e.value)}
                  options={timeList}
                  optionLabel="name"
                  placeholder="Select Duration"
                  className="priorityBtn"
                />
                <Link to="/Manuals/Create_Ticket">
                  <button className="newTicketBtn">
                    <span>
                      <img src={Edit} alt="icon" />
                    </span>
                    <p>New Ticket</p>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="ticketsTab">
          <div className="ticketsTab_container">
            <div
              className={`ticketsTab_btn ${
                selectedTab === "allTickets" && "selectedTicketTab"
              }`}
              onClick={() => handleTabClick("allTickets")}
            >
              {selectedTab !== "allTickets" && <img src={SMSnot} alt="icon" />}
              {selectedTab === "allTickets" && <img src={SMS} alt="icon" />}
              <p>All Tickets</p>
            </div>
            <div
              className={`ticketsTab_btn ${
                selectedTab === "new" && "selectedTicketTab"
              }`}
              onClick={() => handleTabClick("new")}
            >
              {selectedTab !== "new" && <img src={NewSMS} alt="icon" />}
              {selectedTab === "new" && <img src={NewSMSSelected} alt="icon" />}
              <p>New</p>
            </div>
            <div
              className={`ticketsTab_btn ${
                selectedTab === "onGoing" && "selectedTicketTab"
              }`}
              onClick={() => handleTabClick("onGoing")}
            >
              {selectedTab !== "onGoing" && <img src={OnGoingSMS} alt="icon" />}
              {selectedTab === "onGoing" && (
                <img src={OnGoingSMSSelected} alt="icon" />
              )}
              <p>On-Going</p>
            </div>
            <div
              className={`ticketsTab_btn ${
                selectedTab === "resolved" && "selectedTicketTab"
              }`}
              onClick={() => handleTabClick("resolved")}
            >
              {selectedTab !== "resolved" && (
                <img src={ResolvedSMS} alt="icon" />
              )}
              {selectedTab === "resolved" && (
                <img src={ResolvedSMSselected} alt="icon" />
              )}
              <p>Resolved</p>
            </div>
          </div>
        </div>

        <div className="ticketsCOntainer">
          <div className="ticketsWrapper">
            <div className="ticketslist">
              {filteredTickets().map((ticket, index) => (
                <div className="ticketsListItem" key={index}>
                  <div className="ticketsListItemHead">
                    <div className="ticketsListItemHeadLeft">
                      <div className={ticket.status}></div>
                      <p>Ticket# {ticket.primary_id}</p>
                      {ticket.priority_status === "High" && (
                        <div className="priorityStatusHigh">
                          <p className="highColor">High Priority</p>
                        </div>
                      )}
                      {ticket.priority_status === "Medium" && (
                        <div className="priorityStatusMedium">
                          <p className="mediumColor">Medium Priority</p>
                        </div>
                      )}
                      {ticket.priority_status === "Low" && (
                        <div className="priorityStatusLow">
                          <p className="lowColor">Low Priority</p>
                        </div>
                      )}
                    </div>
                    <div className="ticketsListItemHeadRight">
                      <div className="ticketTime">
                        <p>
                          Posted on {formatDateStringdot(ticket.entry_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ticketDetails">
                    <div className="ticketDetailsContainer">
                      <h6>{ticket.ticket_body}</h6>
                      <p>{ticket.ticket_category}</p>
                    </div>
                  </div>
                  <div className="ticketsListItemFOOTER">
                    <div className="ticketsListItemfootLeft">
                      <div className="cutomerImg">
                        <img src={People} alt="icon" />
                      </div>
                      <p>{ticket.restaurant_name}</p>
                    </div>
                    <div className="ticketsListItemfootRight flexBtns">
                      <div>
                        {ticket.ticket_category !== "Resolved" && (
                          <div
                            className="showTicketBtn"
                            onClick={() =>
                              show_confirmation_modal(ticket.primary_id)
                            }
                          >
                            <p>Resolve Ticket</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/Manuals/Reply_Ticket/${ticket.primary_id}`}
                        >
                          <div className="showTicketBtn">
                            <p>Open Ticket</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="success_img d-flex justify-content-center"></div>
          <p>Are you sure you want to resolve the ticket?</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="btn go_to_login" onClick={resolveTicket}>
            Resolve
          </div>
          <div className="btn go_to_login" onClick={closeModal}>
            Cancel
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Help;
