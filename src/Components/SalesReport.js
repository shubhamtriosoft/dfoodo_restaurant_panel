import React, { useState, useEffect, useRef } from "react";
import {
  options_select_report,
  GuestManagementPageText,
  options_select_drop_feedback,
} from "./../CommonJquery/WebsiteText";
import FilterIcon from "../assets/filterIcon.png";
import Search from "../assets/searchGreeeey.svg";
import SearchIcon from "../assets/searchOrang.svg";
import dropdown from "../assets/arrow_drop_down_24px.svg";
import PrintOrng from "../assets/printOrang2.svg";
import PersonCount from "../assets/account_circle.svg";
import Pets from "../assets/pets.svg";
import Childs from "../assets/escalator_warning.svg";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import { Pagination } from "react-bootstrap";
import XLSX from "sheetjs-style";
import jsPDF from "jspdf";
import Loader from "./Loader.js";
import "jspdf-autotable";
import {
  server_post_data,
  get_all_ReportsReservation,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  formatDateStringdot,
  formattimeonlytime,
  handleIaphabetnumberChange,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
function SalesReport() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  // Set initial state using useState hook
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());
  const [selectedValue, setSelectedValue] = useState("");
  const [selected, setIsSelected] = useState(options_select_drop_feedback[0]);
  const [customDateActive, setCustomDateActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [ReservationData, setReservationData] = useState([]);
  const [ReservationDataList, setReservationDataList] = useState([]);
  const [selected2, setIsSelected2] = useState(options_select_report[0]);
  const [isActive2, setIsActive2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get(
      "",
      "",
      flag,
      call_id,
      selected.value,
      selected2.value,
      selectedValue
    );
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
    fd.append("select_type", select_type);
    fd.append("select_card", select_card);
    fd.append("select_name_bill", select_name_bill);
    await server_post_data(get_all_ReportsReservation, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          console.log(Response.data.message);
          setReservationData(Response.data.message);
          setReservationDataList(Response.data.message.reservation_list);
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

      master_data_get(
        "",
        "",
        1,
        "",
        itemsdata.value,
        selected2.value,
        selectedValue
      );
    }
  };

  const handleSelect = () => {
    master_data_get(
      startDate,
      endDate,
      1,
      "",
      selected.value,
      selected2.value,
      selectedValue
    );
  };
  const select_dropdown2 = (itemsdata) => {
    setIsSelected2(itemsdata);
    setIsActive2(!isActive2);

    master_data_get(
      "",
      "",
      1,
      "",
      selected.value,
      itemsdata.value,
      selectedValue
    );
  };

  const search_data = () => {
    master_data_get(
      startDate,
      endDate,
      1,
      "",
      selected.value,
      selected2.value,
      selectedValue
    );
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
  //print the data

  const handlePrint = () => {
    const doc = new jsPDF();
    const tables = document.querySelectorAll("table");
    tables.forEach((table, index) => {
      const tableData = [];
      const headers = [];
      table.querySelectorAll("thead th").forEach((headerCell) => {
        headers.push(headerCell.textContent.trim());
      });
      table.querySelectorAll("tbody tr").forEach((row) => {
        const rowData = [];
        row.querySelectorAll("td").forEach((cell) => {
          rowData.push(cell.textContent.trim());
        });
        tableData.push(rowData);
      });
      if (index > 0) {
        doc.addPage();
      }
      doc.autoTable({
        head: [headers],
        body: tableData,
      });
    });

    // Save PDF
    doc.save("Reservation Report.pdf");
  };

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

  const dropdownRef2 = useRef(null);
  const dropdownRef1 = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef2.current &&
      !dropdownRef2.current.contains(event.target) &&
      !isActive2
    ) {
      setIsActive2(false);
    }
    if (
      dropdownRef1.current &&
      !dropdownRef1.current.contains(event.target) &&
      !isActive
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {}, [isActive]);
  useEffect(() => {}, [isActive2]);

  return (
    <div className="resvReports">
      {showLoaderAdmin && <Loader />}
      <div className="resvReports_container">
        <div className="viewStaff_head py-2" style={{top:'131px'}}>
          <div className="row m-0">
            <div
              className={` ${
                customDateActive ? "col-xl-2 col-sm-8" : "col-xl-3 col-sm-4"
              } bottomAlgin`}
            >
              <div className="inputDiv2 searchBt2">
                <img src={Search} alt="Barley's Dashboard" />
                <input
                  type="text"
                  id="search_data"
                  onChange={(event) => {
                    setSelectedValue(event.target.value);
                  }}
                  placeholder="Guest Name/Bill No/Phone No./ID"
                  onInput={handleIaphabetnumberChange}
                />
                <div className="searchBt">
                  <button
                    type="button"
                    className="btnSearch btnSearch2"
                    onClick={() => handleSelect()}
                  >
                    <img src={SearchIcon} alt="Barley's Dashboard" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 paddingLeft0 bottomAlgin">
              <div className="dropdownCustom " ref={dropdownRef2}>
                <div
                  onClick={(e) => {
                    setIsActive2(!isActive);
                  }}
                  className="dropdownCustom-btn secondaryBg"
                >
                  {selected2.label}
                  <span
                    className={
                      isActive2 ? "fas fa-caret-up" : "fas fa-caret-down"
                    }
                  >
                    <img src={dropdown} alt="Barley's Dashboard" />
                  </span>
                </div>
                <div
                  className="dropdownCustom-content"
                  style={{ display: isActive2 ? "block" : "none" }}
                >
                  {options_select_report.map(function (items, index) {
                    return (
                      <div
                        onClick={(e) => {
                          select_dropdown2(items);
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
              <div className="col-md-1 p-0 d-xl-block d-none"></div>
            )}
            <div className="col-xl-2 col-md-4 paddingLeft1200 paddingLeft0 bottomAlgin">
              <div className="dropdownCustom " ref={dropdownRef1}>
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
                <div className="col-xl-2 col-sm-3 paddingLeft0 bottomAlgin">
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

                <div className="col-xl-2 col-sm-3 paddingLeft0 bottomAlgin">
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
                <div className="col-md-1 p-0">
                  <label className="labelView"> </label>
                  <div className="downloadBtnAna paddingBottomUp">
                    <button onClick={() => search_data()}>Search</button>
                  </div>
                </div>
              </>
            )}

            <div
              className={` ${
                customDateActive ? "col-sm-8" : "col-xl-3"
              } alignCol bottomAlgin`}
            >
              <div className="pageActionBtns">
                <button
                  className="CSVBTN"
                  onClick={() =>
                    exportToCSV(ReservationDataList, "download_excel", ".xlsx")
                  }
                >
                  Excel
                </button>

                <CSVLink data={ReservationDataList} target="_blank">
                  <button className="CSVBTN">CSV</button>
                </CSVLink>
                <button className="printReposrr" onClick={handlePrint}>
                  <img src={PrintOrng} alt="Barley's Dashboard" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="resrvReposrt_body">
          <div className="resrvReportsCards">
            <div className="row m-0">
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>Total Collection </p>
                  <h5>
                    {" "}
                    {ReservationData.data_money_left}
                    {ReservationData.total_collection_amount}
                    {ReservationData.data_money_right}
                  </h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>Online Covers </p>
                  <h5> {ReservationData.total_online_cover}</h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>Offline Covers </p>
                  <h5> {ReservationData.total_offline_cover}</h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>Total Table </p>
                  <h5>{ReservationData.total_table_count}</h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>No Show </p>
                  <h5>{ReservationData.total_no_show_count}</h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="resrvReportsCards_card">
                  <p>Cancelled </p>
                  <h5>{ReservationData.total_cancel_count}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="feedBackTable">
            <div className="feedBackTable_container">
              {/* <h5>Recent Reservation</h5> */}
              <div className="tableResponsive">
                <div className="tableResponsive_container">
                  <table id="myTable" className="display table">
                    <thead>
                      <tr>
                        <th scope="col" className="th3">
                          S.No.
                        </th>
                        <th scope="col">Guest Name</th>
                        <th scope="col">Contact Details</th>
                        <th scope="col">Dine-in Date</th>
                        <th scope="col">Person/Table</th>
                        <th className="th4">Bill Amount</th>
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
                                  {(currentPage - 1) * itemsPerPage + index + 1}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className="recentContact">
                                <p>{item.guest_name}</p>
                              </div>
                            </td>
                            <td>
                              <div className="recentContact">
                                <p>{item.guest_email}</p>
                                <p>{item.guest_mobile_no}</p>
                              </div>
                            </td>
                            <td>
                              <div className="recentContact">
                                <p>
                                  {formatDateStringdot(item.book_date)}{" "}
                                  <span className="sprtor">|</span>
                                  &nbsp;
                                  <span>
                                    {" "}
                                    {formattimeonlytime(item.book_time)}
                                  </span>
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className="recentContact">
                                <p>
                                  Billed ({" "}
                                  {item !== null &&
                                  item.table_code_names !== undefined &&
                                  item.table_code_names !== "" &&
                                  item.table_code_names !== null
                                    ? item.table_code_names.replace(/,/g, "+")
                                    : ""}
                                  )
                                </p>
                                <div className="historyTableRowText historyPerson flexForCount">
                                  <div>
                                    <img
                                      src={PersonCount}
                                      alt="Barley's Dashboard"
                                    />
                                    <p>{item.no_of_guest}P</p>
                                  </div>
                                  <div>
                                    <img src={Pets} alt="Barley's Dashboard" />
                                    <p>{item.no_of_pets} pet</p>
                                  </div>
                                  <div>
                                    <img
                                      src={Childs}
                                      alt="Barley's Dashboard"
                                    />
                                    <p>{item.no_of_child} Child</p>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="recentContact">
                                <p>
                                  {item.invoice_no_bill !== "" && (
                                    <>#{item.invoice_no_bill}</>
                                  )}{" "}
                                  &nbsp;
                                  {item.payment_type &&
                                    item.payment_type.length > 2 && ( // Check if book_discount is greater than 0
                                      <span className="pymntMode">
                                        {item.payment_type}
                                      </span>
                                    )}
                                </p>
                                <p style={{ fontWeight: "500" }}>
                                  {ReservationData.data_money_left}
                                  {item.payout_amt}
                                  {ReservationData.data_money_right}
                                  {Number(item.book_discount) > 0 && ( // Check if book_discount is greater than 0
                                    <>
                                      {" "}
                                      (Discount
                                      {item.book_discount}%)
                                    </>
                                  )}
                                </p>
                              </div>
                            </td>
                          </tr>

                          <tr
                            style={{ height: "1rem", boxShadow: "none" }}
                          ></tr>
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
                </div>
              </div>
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

export default SalesReport;
