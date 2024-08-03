import React, { useState, useEffect, useRef } from "react";
import {
  GuestManagementPageText,
  options_select_drop_feedback,
} from "./../CommonJquery/WebsiteText";
import dropdown from "../assets/arrow_drop_down_24px.svg";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { Pagination } from "react-bootstrap";
import Loader from "./Loader.js";
import {
  server_post_data,
  get_all_subscribe,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
function EmailSubs() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);

  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const [selected, setIsSelected] = useState(options_select_drop_feedback[0]);
  const [customDateActive, setCustomDateActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [ReservationDataList, setReservationDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get("", "", flag, call_id, selected.value, "", "");
  }, []);

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    select_type,
    select_card,
    select_name_bill
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    const current_date = new Date(); // Initialize current_date with the current date
    if (select_type === "today") {
      start_date = start_date_fn(current_date);
      end_date = end_date_fn(current_date);
    } else if (select_type === "last_7_days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      start_date = start_date_fn(sevenDaysAgo);
      end_date = end_date_fn(current_date);
    } else if (select_type === "this_month") {
      const firstDayOfMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth() + 1,
        0
      );
      start_date = start_date_fn(firstDayOfMonth);
      end_date = end_date_fn(lastDayOfMonth);
    } else if (select_type === "last_month") {
      const firstDayOfLastMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        current_date.getFullYear(),
        current_date.getMonth(),
        0
      );
      start_date = start_date_fn(firstDayOfLastMonth);
      end_date = end_date_fn(lastDayOfLastMonth);
    } else if (select_type === "this_year") {
      const firstDayOfYear = new Date(current_date.getFullYear(), 0, 1);
      start_date = start_date_fn(firstDayOfYear);
      end_date = end_date_fn(current_date);
    }

    function start_date_fn(start_date) {
      // Formatting start date
      const start_year = start_date.getFullYear();
      const start_month = (start_date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const start_day = start_date.getDate().toString().padStart(2, "0");
      return `${start_year}-${start_month}-${start_day}`;
    }

    function end_date_fn(end_date) {
      // Formatting end date
      const end_year = end_date.getFullYear();
      const end_month = (end_date.getMonth() + 1).toString().padStart(2, "0");
      const end_day = end_date.getDate().toString().padStart(2, "0");
      return `${end_year}-${end_month}-${end_day}`;
    }

    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    await server_post_data(get_all_subscribe, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setReservationDataList(Response.data.message.data_subscribe);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const select_dropdown = (itemsdata) => {
    setIsSelected(itemsdata);
    setIsActive(!isActive);

    if (itemsdata.datepicker_show) {
      setCustomDateActive(true);
    } else {
      setCustomDateActive(false);

      master_data_get("", "", 2, "", itemsdata.value, "", "");
    }
  };

  const search_data = () => {
    master_data_get(startDate, endDate, 2, "", selected.value, "", "");
  };
  const exportToCSV = (csvData, fileName, fileExtension) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const totalPages = Math.ceil(ReservationDataList.length / itemsPerPage);
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //  To print data
  const paginationItems = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(ReservationDataList.length / itemsPerPage);

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePagination(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      const minPage = Math.max(1, currentPage - 1);
      const maxPage = Math.min(totalPages, currentPage + 2);

      if (currentPage > 2) {
        pageNumbers.push(
          <Pagination.Item key={1} onClick={() => handlePagination(1)}>
            {1}
          </Pagination.Item>
        );
        if (currentPage !== 3) {
          pageNumbers.push(<Pagination.Ellipsis key="ellipsis1" />);
        }
      }

      for (let i = minPage; i <= maxPage; i++) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePagination(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 1) {
        if (currentPage !== totalPages - 2) {
          pageNumbers.push(<Pagination.Ellipsis key="ellipsis2" />);
        }
        pageNumbers.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePagination(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }

    return pageNumbers;
  };
  const isDataAvailable = ReservationDataList.length > 0;
  const handlePrevButtonClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextButtonClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="resvReports">
      {showLoaderAdmin && <Loader />}
      <div className="resvReports_container">
        <div className="viewStaff_head">
          <div className="row m-0">
            <div className="col-xl-3 col-md-4 bottomAlgin">
              <div className="dropdownCustom " ref={dropdownRef}>
                <div
                  onClick={(e) => {
                    setIsActive(!isActive);
                  }}
                  className="dropdownCustom-btn secondaryBg"
                >
                  {selected.label}
                  <span
                    className={
                      isActive ? "fas fa-caret-up" : "fas fa-caret-down"
                    }
                  >
                    <img src={dropdown} alt="Barley's Dashboard" />
                  </span>
                </div>
                <div
                  className="dropdownCustom-content"
                  style={{ display: isActive ? "block" : "none" }}
                >
                  {options_select_drop_feedback.map(function (items, index) {
                    return (
                      <div
                        onClick={(e) => {
                          select_dropdown(items);
                        }}
                        className="itemDrop"
                        key={index}
                      >
                        {items.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {customDateActive && (
              <>
                <div className="col-xl-2 col-sm-3 bottomAlgin">
                  <label className="labelView">
                    {GuestManagementPageText.Start_Date}
                  </label>
                  <div className="person__calenderFrame_image image_icon_position1 ">
                    <input
                      id="startDate"
                      type="date"
                      placeholder={GuestManagementPageText.D_O_B}
                      className="form-control  input_field_custom4"
                      defaultValue={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={computeTodayDate()}
                    />
                  </div>
                </div>

                <div className="col-xl-2 col-sm-3 bottomAlgin">
                  <label className="labelView">
                    {GuestManagementPageText.End_Date}
                  </label>
                  <div className="person__calenderFrame_image image_icon_position1 ">
                    <input
                      id="endDate"
                      type="date"
                      placeholder={GuestManagementPageText.D_O_B}
                      className="form-control  input_field_custom4"
                      defaultValue={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={computeTodayDate()}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <label className="labelView"> </label>
                  <div className="downloadBtnAna">
                    <button onClick={() => search_data()}>Search</button>
                  </div>
                </div>
              </>
            )}

            <div
              className={` ${
                customDateActive ? "col-sm-3" : "col-xl-3"
              } alignCol bottomAlgin`}
            >
              <div className="pageActionBtns">
                <button
                  className="CSVBTN"
                  onClick={() =>
                    exportToCSV(ReservationDataList, "download_excel", ".xlsx")
                  }
                >
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="resrvReposrt_body">
          <div className="feedBackTable">
            <div className="feedBackTable_container subsTable_container">
              <h6>Recent Subscribers</h6>
              <table id="myTable" className="display table">
                <thead>
                  <tr>
                    <th scope="col" className="th3">
                      S.No.
                    </th>
                    <th className="th4">Email Subscriber</th>
                  </tr>
                  <tr style={{ height: "25px" }}></tr>
                </thead>
                <tbody>
                  {ReservationDataList.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  ).map((item, index) => (
                    <React.Fragment>
                      <tr>
                        <td>
                          <div className="recentANme">
                            <p>
                              {" "}
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="recentContact">
                            <p>{item.subscribe_email}</p>
                          </div>
                        </td>
                      </tr>

                      <tr style={{ height: "1rem", boxShadow: "none" }}></tr>
                    </React.Fragment>
                  ))}
                  {ReservationDataList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text_align_center">
                        No Results Found
                      </td>{" "}
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="paginationnn">
                <div className="nxtBttnTble pprrvvss">
                  {currentPage !== 1 && (
                    <button
                      className="btn btn-primary "
                      onClick={handlePrevButtonClick}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  )}
                </div>
                {paginationItems().map((item, index) => (
                  <React.Fragment key={index}>{item}</React.Fragment>
                ))}
                <div className="nxtBttnTble">
                  {currentPage !== totalPages && isDataAvailable && (
                    <button
                      className="btn btn-primary"
                      onClick={handleNextButtonClick}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSubs;
