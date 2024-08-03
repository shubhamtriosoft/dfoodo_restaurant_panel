import React, { useEffect, useState, useRef } from "react";
import { Pagination } from "react-bootstrap";
import Header from "./Header";
import Loader from "./Loader.js";
import "./Css/Analytics.css";
import Delete from "../assets/delete.svg";
import Edit from "../assets/edit_square.png";
import GreyArrow from "../assets/greyLeftAr.png";
import {
  server_post_data,
  get_all_faq,
  save_update_faq,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  formatDateStringdot,
  handleConfimDeleteClick,
} from "../CommonJquery/CommonJquery";
import { options_select_drop_feedback } from "./../CommonJquery/WebsiteText";
import { Link } from "react-router-dom";
function ViewFaq() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [editStaffData, seteditStaffData] = useState([]);
  const [TatalPlusData, setTatalPlusData] = useState([]);
  const [TotalGoogleRating, setTotalGoogleRating] = useState(0);
  const [TotalGoogleUserRating, setTotalGoogleUserRating] = useState(0);
  const [TotalReviewPositive, setTotalReviewPositive] = useState();
  const [TotalReviewPositivelist, setTotalReviewPositivelist] = useState([]);
  const [TotalReviewNagativelist, setTotalReviewNagativelist] = useState([]);
  const [TotalReviewNagative, setTotalReviewNagative] = useState();
  const [customDateActive, setCustomDateActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState(options_select_drop_feedback[0]);

  const initialCharsToShow = 35;
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    // Update the expanded state based on the current value
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get("", "", flag, call_id, selected.value);
  }, []);

  const tableRef = useRef(null);

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    select_type
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("select_type", select_type);
    await server_post_data(get_all_faq, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          seteditStaffData(Response.data.message.data);
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
      master_data_get("", "", "1", "", itemsdata.value);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPageCount = Math.ceil(editStaffData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPageCount; i++) {
      pageNumbers.push(i);
    }

    if (totalPageCount <= 5) {
      return pageNumbers.map((number) => (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      ));
    } else {
      const delta = 2;
      const left = currentPage - delta;
      const right = currentPage + delta + 1;
      let pages = [];
      let isEllipsisShown = false;

      for (let i = 1; i <= totalPageCount; i++) {
        if (i === 1 || i === totalPageCount || (i >= left && i < right)) {
          pages.push(i);
        } else if (!isEllipsisShown) {
          pages.push(-1); // -1 indicates ellipsis
          isEllipsisShown = true;
        }
      }

      return pages.map((number, index) => {
        if (number === -1) {
          return <Pagination.Ellipsis key={index} />;
        }
        return (
          <Pagination.Item
            key={index}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        );
      });
    }
  };

  const master_data_action = async (call_id) => {
    if (handleConfimDeleteClick()) {
      setshowLoaderAdmin(true);
      const fd = new FormData();
      fd.append("main_id", call_id);
      fd.append("flag", "3");
      await server_post_data(save_update_faq, fd)
        .then((Response) => {
          setshowLoaderAdmin(false);
          console.log(Response.data);
          if (Response.data.error) {
            handleError(Response.data.message);
          } else {
            master_data_get("", "", "1", "0");
          }
        })
        .catch((error) => {
          setshowLoaderAdmin(false);
        });
    }
  };
  return (
    <div className="dashboard">
      {showLoaderAdmin && (
        <Loader />
      )}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="pageNameDiv">
                <p>View FAQs</p>
                <img src={GreyArrow} alt="Barley's Dashboard" />
              </div>
              <Link to="/Add_Faq">
                <button type="button" className="btnAddStaff darkBg add_FAQ">
                  Add FAQ
                </button>
              </Link>
            </div>

            <div className="page_body">
              <div className="analytics">
                <div className="analytics_container mt-2">
                  <div className="analyticsCardsContainer">
                    <div className="feedBackTable">
                      <div className="feedBackTable_container">
                        <table
                          id="myTable"
                          className="display table"
                          ref={tableRef}
                        >
                          <thead>
                            <tr>
                              <th scope="col" className="th3">
                                S. No.
                              </th>
                              <th scope="col">Entry Date</th>
                              <th scope="col">Related Topic</th>
                              <th scope="col">Question</th>
                              <th scope="col">Answer</th>
                              <th className="th4">Action</th>
                            </tr>
                            <tr style={{ height: "25px" }}></tr>
                          </thead>
                          <tbody>
                            {editStaffData.map((item, index) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td className="th3">
                                    <div className="recentANme">
                                      <p>{index + 1}</p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentContact">
                                      <p>
                                        {formatDateStringdot(item.entry_date)}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentContact">
                                      <p>{item.topic_name}</p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentContact">
                                      <p>
                                        {item.question_name.slice(0, 20)}
                                        {item.question_name.length > 20
                                          ? `...`
                                          : ``}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="recentContact">
                                      <p>
                                        {item.answer_name.slice(0, 20)}
                                        {item.answer_name.length > 20
                                          ? `...`
                                          : ``}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="th4">
                                    <div className="recentReservBtns">
                                      <Link to={`/Edit_Faq/${item.primary_id}`}>
                                        <button
                                          className="mb-2"
                                          style={{ width: "90px" }}
                                        >
                                          <p>Edit</p>
                                          <img
                                            style={{
                                              width: "18px",
                                              height: "18px",
                                            }}
                                            src={Edit}
                                            alt="Barley's Dashboard"
                                          />
                                        </button>
                                      </Link>
                                      <button
                                        className="mb-2"
                                        style={{ width: "90px" }}
                                        onClick={() =>
                                          master_data_action(item.primary_id)
                                        }
                                      >
                                        <p>Delete</p>
                                        <img
                                          src={Delete}
                                          alt="Barley's Dashboard"
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  style={{ height: "1rem", boxShadow: "none" }}
                                ></tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                        <Pagination>
                          <div className="paginationContainer">
                            <div className="nxtBttnTble">
                              {currentPage !== 1 ? (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    setCurrentPage((prev) =>
                                      prev > 1 ? prev - 1 : prev
                                    )
                                  }
                                >
                                  Previous
                                </button>
                              ) : null}
                            </div>
                            <div className="d-flex gap-2">
                              {renderPaginationItems()}
                            </div>
                          </div>
                        </Pagination>
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

export default ViewFaq;
