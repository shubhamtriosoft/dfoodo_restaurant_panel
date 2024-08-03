import React, { useState, useCallback, useMemo } from "react";
import searchIcn from "../assets/XMLID 223.png";
import searchIcn2 from "../assets/XMLID 224.png";
import chatIcn from "../assets/Vector.png";
import userIcn from "../assets/Ellipse 142.png";

const Note = () => {
  const [state, setState] = useState({
    showBookingDetails: false,
    showAddNote: true,
    noteText: "",
    notes: [],
    additionalInfoStyle: {
      backgroundColor: "#F3F3F3",
      boxShadow: "none",
    },
  });

  const getCurrentTime = useMemo(() => {
    return () => {
      const now = new Date();
      const date = now.getDate();
      const month = now.toLocaleString("default", { month: "short" });
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${date}th. ${month} ${year}, ${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;
    };
  }, []);

  const handleSearchClick = () => {
    setState((prevState) => ({ ...prevState, showBookingDetails: true }));
  };

  const handleAddNoteClick = () => {
    setState((prevState) => ({ ...prevState, showAddNote: true }));
  };

  const handleNoteInputChange = (e) => {
    setState((prevState) => ({ ...prevState, noteText: e.target.value }));
  };

  const handleAddNote = useCallback(() => {
    if (state.noteText.trim() !== "") {
      const newNote = {
        text: state.noteText,
        timing: getCurrentTime(),
        staffName: "Ashutosh",
      };
      setState((prevState) => ({
        ...prevState,
        notes: [...prevState.notes, newNote],
        noteText: "",
        showAddNote: false,
        additionalInfoStyle: {
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
      }));
    }
  }, [state, getCurrentTime]);

  return (
    <div className="booking-container">
      <div className="guest-mobile-input">
        <div className="input-wrapper">
          <img src={searchIcn} alt="Guest icon" className="guest-icon" />
          <label
            htmlFor="guestMobileInput"
            className="input-label visually-hidden"
          >
            Enter Guest Mobile No.
          </label>
          <input
            type="tel"
            id="guestMobileInput"
            placeholder="Enter Guest Mobile No."
            className="input-label"
          />
        </div>
        <img
          src={searchIcn2}
          alt="Search icon"
          className="search-icon"
          onClick={handleSearchClick}
        />
      </div>

      {state.showBookingDetails && (
        <>
          <div className="booking-details">
            <div className="booking-details-label">
              <label>Booking Details</label> <p> ID:FDF3642651</p>
            </div>
            <div className="booking-info">
              <div className="booking-date">FRi, 31 JAN, 2024</div>
              <div className="booking-time">Booking Time : 19:00</div>
              <div className="table-number">T06</div>
            </div>
          </div>

          <div className="guest-details">
            <div className="guest-name-wrapper">
              <div className="guest-name">Rammez Sahhbez</div>

              <div className="guest-count">
                <p>17 Person</p>
                <p> 0 Children</p>
                <p>0 Pets</p>
              </div>
            </div>
          </div>

          <div className="additional-info" style={state.additionalInfoStyle}>
            {state.notes.map((note, index) => (
              <div key={index} className="info-header">
                <div className="info-header-left">
                  <img
                    src={chatIcn}
                    alt="Calendar icon"
                    className="calendar-icon"
                  />
                  <div className="staff-info">
                    <img
                      src={userIcn}
                      alt="Staff avatar"
                      className="staff-avatar"
                    />
                    <div className="staff-name">{note.staffName}</div>
                  </div>
                </div>
                <div className="info-header-right">
                  <div className="note-item">{note.text}</div>
                  <div className="booking-datetime">
                    {note.timing}{" "}
                    <span style={{ color: "rgba(245, 134, 52, 1)" }}>I</span>
                  </div>
                </div>
              </div>
            ))}
            {state.showAddNote ? (
              <div className="add-notes-button2">
                <img
                  src={chatIcn}
                  alt="Add notes icon"
                  className="add-notes-icon"
                />

                <input
                  type="text"
                  value={state.noteText}
                  onChange={handleNoteInputChange}
                  placeholder="Type your note..."
                />
                <button className="ad" onClick={handleAddNote}>
                  Add
                </button>
              </div>
            ) : (
              <button className="add-notes-button" onClick={handleAddNoteClick}>
                <img
                  src={userIcn}
                  alt="Add notes icon"
                  className="add-notes-icon"
                />
                <div className="add-notes-text">Add Notes</div>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Note;
