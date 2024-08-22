import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import "./Css/Analytics.css";
import dropdown from "../assets/arrow_drop_down_24px.svg";
import InfoIcon from "../assets/(i).png";
import DownloadImg from "../assets/print.svg";
import Downgrade from "../assets/downgrade.svg";
import Upgrade from "../assets/upgrade.svg";
import Chart from "react-apexcharts";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { Pagination } from "react-bootstrap";
import {
  server_post_data,
  get_all_analyticsReservation,
  get_analyticsReservationHourly,
} from "../ServiceConnection/serviceconnection.js";
import {
  handleError,
  computeTodayDate,
  handleCallClick,
  computeplussevendays,
} from "../CommonJquery/CommonJquery";
import html2canvas from "html2canvas";
import {
  options_select_drop_feedback,
  Analytics_text,
} from "./../CommonJquery/WebsiteText";
let total_count_array_Monday;
let total_count_array_Tuesday;
let total_count_array_Wednesday;
let total_count_array_Thursday;
let total_count_array_Friday;
let total_count_array_Saturday;
let total_count_array_Sunday;
let total_payout_array_Monday;
let total_payout_array_Tuesday;
let total_payout_array_Wednesday;
let total_payout_array_Thursday;
let total_payout_array_Friday;
let total_payout_array_Saturday;
let total_payout_array_Sunday;
function Analytics() {
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  const [customDateActive, setCustomDateActive] = useState(false);
  const [CalenderStartDate, setCalenderStartDate] = useState();
  const [CalenderEndDate, setCalenderEndDate] = useState();
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState(options_select_drop_feedback[0]);
  const [CardData, setCardData] = useState([]);
  const [series, setseries] = useState([0, 0, 0]);
  const [filteredData, setfilteredData] = useState([]);
  const [isFilterActive, setIsFIlterActive] = useState(false);
  const [selectedFilter, setIsSelectedFilter] = useState("Online");
  const [isChanelActive, setIsChanelActive] = useState(false);
  const [selectedChanel, setIsSelectedChanel] = useState("Online");
  const [selectedGraph1, setSelectedGraph1] = useState(true);
  const [showWeekdays, setShowWeekdays] = useState(false);
  const [selectedGraphMon, setSelectedGraphMon] = useState(false);
  const [selectedGraphTue, setSelectedGraphTue] = useState(false);
  const [selectedGraphWed, setSelectedGraphWed] = useState(false);
  const [selectedGraphThu, setSelectedGraphThu] = useState(false);
  const [selectedGraphFri, setSelectedGraphFri] = useState(false);
  const [selectedGraphSat, setSelectedGraphSat] = useState(false);
  const [selectedGraphSun, setSelectedGraphSun] = useState(false);
  const [xAxisCategories, setXAxisCategories] = useState([]);
  const [GraphStatics, setGraphStatics] = useState([]);
  const [Statics, setStatics] = useState([]);
  const [BookingBarData, setBookingBarData] = useState([]);
  const [RevenueBarData, setRevenueBarData] = useState([]);
  const [BookingBarTimeData, setBookingBarTimeData] = useState([]);
  const [RevenueBarTimeData, setRevenueBarTimeData] = useState([]);
  const [xAxisTime, setxAxisTime] = useState([]);
  const [TotalComplete, setTotalComplete] = useState(0);
  const [startDate, setStartDate] = useState(computeplussevendays());
  const [endDate, setEndDate] = useState(computeTodayDate());

  const toggleTabs = (Tab) => {
    setSelectedGraph1(Tab === "Day");
    setShowWeekdays(
      Tab === "Mon" ||
        Tab === "Tue" ||
        Tab === "Wed" ||
        Tab === "Thu" ||
        Tab === "Fri" ||
        Tab === "Sat" ||
        Tab === "Sun"
    );
    setSelectedGraphMon(Tab === "Mon");
    setSelectedGraphTue(Tab === "Tue");
    setSelectedGraphWed(Tab === "Wed");
    setSelectedGraphThu(Tab === "Thu");
    setSelectedGraphFri(Tab === "Fri");
    setSelectedGraphSat(Tab === "Sat");
    setSelectedGraphSun(Tab === "Sun");
  };
  const handleDownloadButtonClick = () => {
    html2canvas(document.body).then((canvas) => {
      const link = document.createElement("a");
      link.download = "Analytics.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const gethourdata = async (data_fordate, start_date, end_date) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    const current_date = new Date();

    fd.append("data_fordate", data_fordate);
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    await server_post_data(get_analyticsReservationHourly, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          console.log(Response.data.message);

          const time_slot = Response.data.message.time_slot.map(
            (item) => `(${item[0].split(":")[0]}-${item[1].split(":")[0]})`
          );

          console.log(time_slot);
          setxAxisTime(time_slot);
          // const Time_list = Response.data.message.time_slot.map((posnegObj) => {
          //   let have_data = 0;
          //   let total_count = 0; // Initialize total_count to 0
          //   let total_payout_amt = 0;

          //   Response.data.message.time_data.forEach((subObj) => {
          //     const start_time = posnegObj[0] + ":00";
          //     const end_time = posnegObj[1] + ":00";
          //     const ToChecktime = subObj.book_time;
          //     const startTime = new Date(`2000-01-01T${start_time}`);
          //     const endTime = new Date(`2000-01-01T${end_time}`);
          //     const checkTime = new Date(`2000-01-01T${ToChecktime}`);

          //     if (
          //       String(startTime) <= String(checkTime) &&
          //       String(checkTime) < String(endTime)
          //     ) {
          //       ///console.log(startTime + ' inside');
          //       total_count = subObj.total_count; // Assign total_count if month_or_date matches
          //       total_payout_amt = subObj.total_payout_amt;
          //       have_data = 1;
          //     }
          //   });

          //   return have_data
          //     ? { total_count, total_payout_amt }
          //     : { total_count: 0, total_payout_amt: 0 };
          // });
          // console.log(Time_list);
          // const total_count_array = Time_list.map((item) => item.total_count);
          // const total_payout_amt_array = Time_list.map(
          //   (item) => item.total_payout_amt
          // );
          //console.log(Response.data.message.show_week_data);

          total_count_array_Monday = Object.values(
            Response.data.message.show_week_data["Monday"]
          ).map((item) => item.total_count);
          total_count_array_Tuesday = Object.values(
            Response.data.message.show_week_data["Tuesday"]
          ).map((item) => item.total_count);
          total_count_array_Wednesday = Object.values(
            Response.data.message.show_week_data["Wednesday"]
          ).map((item) => item.total_count);
          total_count_array_Thursday = Object.values(
            Response.data.message.show_week_data["Thursday"]
          ).map((item) => item.total_count);
          total_count_array_Friday = Object.values(
            Response.data.message.show_week_data["Friday"]
          ).map((item) => item.total_count);
          total_count_array_Saturday = Object.values(
            Response.data.message.show_week_data["Saturday"]
          ).map((item) => item.total_count);
          total_count_array_Sunday = Object.values(
            Response.data.message.show_week_data["Sunday"]
          ).map((item) => item.total_count);

          total_payout_array_Monday = Object.values(
            Response.data.message.show_week_data["Monday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Tuesday = Object.values(
            Response.data.message.show_week_data["Tuesday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Wednesday = Object.values(
            Response.data.message.show_week_data["Wednesday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Thursday = Object.values(
            Response.data.message.show_week_data["Thursday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Friday = Object.values(
            Response.data.message.show_week_data["Friday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Saturday = Object.values(
            Response.data.message.show_week_data["Saturday"]
          ).map((item) => item.total_payout_amt);
          total_payout_array_Sunday = Object.values(
            Response.data.message.show_week_data["Sunday"]
          ).map((item) => item.total_payout_amt);

          console.log(total_count_array_Wednesday);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  // code by shubham jain for custom date functionality
  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get("", "", flag, call_id, selected.value);
  }, []);

  const master_data_get = async (
    start_date,
    end_date,
    flag,
    call_id,
    select_type
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
      const lastDayOfYear = new Date(current_date.getFullYear(), 11, 31);
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
    setCalenderStartDate(start_date);
    setCalenderEndDate(end_date);
    fd.append("start_date", start_date);
    fd.append("end_date", end_date);
    fd.append("flag", flag);
    fd.append("call_id", call_id);
    fd.append("select_type", select_type);
    gethourdata(start_date, start_date, end_date);
    setShowWeekdays(true);
    await server_post_data(get_all_analyticsReservation, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setSelectedGraphMon(false);
          setSelectedGraphTue(false);
          setSelectedGraphWed(false);
          setSelectedGraphThu(false);
          setSelectedGraphFri(false);
          setSelectedGraphSat(false);
          setSelectedGraphSun(false);
          setSelectedGraph1(true);
          console.log(Response.data.message);
          setCardData(Response.data.message);
          setfilteredData(Response.data.message.reservation_list);

          setseries([
            Response.data.message.total_direct_website,
            Response.data.message.total_walkin,
            Response.data.message.total_software_reservation,
          ]);

          const categories = Response.data.message.view_data.map(
            (item) => item.todisplay
          );
          console.log(categories);
          setXAxisCategories(categories);
          let total_card_possitive = 0;
          let total_card_nagitive = 0;
          const booking_bar_list = Response.data.message.view_data.map(
            (posnegObj) => {
              let have_data = 0;
              let total_count = 0; // Initialize total_count to 0
              let total_payout_amt = 0;
              let total_no_of_pets = 0;
              let total_no_of_guest = 0;
              let total_no_of_child = 0;

              Response.data.message.booking_revenue.forEach((subObj) => {
                const trimmedEntryDate = String(subObj.month_or_date).replace(
                  /^0+/,
                  ""
                );
                const trimmedToCheck = posnegObj.tocheck.replace(/^0+/, "");
                if (
                  String(trimmedEntryDate) === String(trimmedToCheck) &&
                  String(posnegObj.tocheck_year) === String(subObj.month_year)
                ) {
                  total_count = subObj.total_count; // Assign total_count if month_or_date matches
                  total_payout_amt = subObj.total_payout_amt;
                  total_no_of_pets = subObj.total_no_of_pets;
                  total_no_of_child = subObj.total_no_of_child;
                  total_no_of_guest = subObj.total_no_of_guest;
                  have_data = 1;
                }
              });

              return have_data
                ? {
                    total_count,
                    total_payout_amt,
                    total_no_of_pets,
                    total_no_of_child,
                    total_no_of_guest,
                  }
                : {
                    total_count: 0,
                    total_payout_amt: 0,
                    total_no_of_pets: 0,
                    total_no_of_child: 0,
                    total_no_of_guest: 0,
                  };
            }
          );
          //console.log(booking_bar_list);
          const total_count_array = booking_bar_list.map(
            (item) => item.total_count
          );
          const total_payout_amt_array = booking_bar_list.map(
            (item) => item.total_payout_amt
          );
          const total_no_of_pets_array = booking_bar_list.map(
            (item) => item.total_no_of_pets
          );
          const total_no_of_guest_array = booking_bar_list.map(
            (item) => item.total_no_of_guest
          );
          const total_no_of_child_array = booking_bar_list.map(
            (item) => item.total_no_of_child
          );
          const total_booking_sum = total_count_array.reduce(
            (acc, currentValue) => acc + currentValue,
            0
          );
          const total_payout_amt_sum = total_payout_amt_array.reduce(
            (acc, currentValue) => acc + currentValue,
            0
          );
          const total_no_of_pets_sum = total_no_of_pets_array.reduce(
            (acc, currentValue) => acc + currentValue,
            0
          );
          const total_no_of_guesr_sum = total_no_of_guest_array.reduce(
            (acc, currentValue) => acc + currentValue,
            0
          );
          const total_no_of_child_sum = total_no_of_child_array.reduce(
            (acc, currentValue) => acc + currentValue,
            0
          );
          const ary_list = {
            total_booking_sum: total_booking_sum,
            total_payout_amt_sum: total_payout_amt_sum,
            total_no_of_pets_sum: total_no_of_pets_sum,
            total_no_of_guest_sum: total_no_of_guesr_sum,
            total_no_of_child_sum: total_no_of_child_sum,
          };
          setGraphStatics(ary_list);
          setBookingBarData(total_count_array);
          setRevenueBarData(total_payout_amt_array);
          console.log(Response.data.message.reservations);
          let total_final_complete = 0;
          const barGraph = Response.data.message.view_data.map((posnegObj) => {
            let haveApprovalPendingData = 0;
            let haveArrivalData = 0;
            let haveArrivedData = 0;
            let haveCompletedData = 0;
            let haveNoShowData = 0;
            let haveDeclineData = 0;
            let haveCancelledData = 0;
            let haveReassignData = 0;
            let haveDisputeData = 0;

            let totalApprovalPending = 0;
            let totalArrival = 0;
            let totalArrived = 0;
            let totalCompleted = 0;
            let totalNoShow = 0;
            let totalDecline = 0;
            let totalCancelled = 0;
            let totalReassign = 0;
            let totalDispute = 0;

            Response.data.message.reservations.forEach((subObj) => {
              const trimmedEntryDate = String(subObj.month_or_date).replace(
                /^0+/,
                ""
              );
              const trimmedToCheck = posnegObj.tocheck.replace(/^0+/, "");

              if (
                String(trimmedEntryDate) === String(trimmedToCheck) &&
                String(posnegObj.tocheck_year) === String(subObj.month_year)
              ) {
                if (subObj.booking_status_name === "Approval Pending") {
                  totalApprovalPending = subObj.total_count;
                  haveApprovalPendingData = 1;
                }
                if (subObj.booking_status_name === "Arrival") {
                  totalArrival = subObj.total_count;
                  haveArrivalData = 1;
                }
                if (subObj.booking_status_name === "Arrived") {
                  totalArrived = subObj.total_count;
                  haveArrivedData = 1;
                }
                if (subObj.booking_status_name === "Completed") {
                  totalCompleted = subObj.total_count;
                  haveCompletedData = 1;
                  total_final_complete =
                    total_final_complete + subObj.total_count;
                }
                if (subObj.booking_status_name === "No Show") {
                  totalNoShow = subObj.total_count;
                  haveNoShowData = 1;
                }
                if (subObj.booking_status_name === "Decline") {
                  totalDecline = subObj.total_count;
                  haveDeclineData = 1;
                }
                if (subObj.booking_status_name === "Cancelled") {
                  totalCancelled = subObj.total_count;
                  haveCancelledData = 1;
                }
                if (subObj.booking_status_name === "Reassign") {
                  totalReassign = subObj.total_count;
                  haveReassignData = 1;
                }
                if (subObj.booking_status_name === "Dispute") {
                  totalDispute = subObj.total_count;
                  haveDisputeData = 1;
                }
              }
            });

            return {
              total_approval_pending: haveApprovalPendingData
                ? totalApprovalPending
                : 0,
              total_arrival: haveArrivalData ? totalArrival : 0,
              total_arrived: haveArrivedData ? totalArrived : 0,
              total_completed: haveCompletedData ? totalCompleted : 0,
              total_noshow: haveNoShowData ? totalNoShow : 0,
              total_decline: haveDeclineData ? totalDecline : 0,
              total_cancelled: haveCancelledData ? totalCancelled : 0,
              total_reassign: haveReassignData ? totalReassign : 0,
              total_dispute: haveDisputeData ? totalDispute : 0,
            };
          });
          setTotalComplete(total_final_complete);
          console.log(barGraph);
          const totalArrivedArray = barGraph.map((item) => item.total_arrived);
          const totalCompletedArray = barGraph.map(
            (item) => item.total_completed
          );
          const totalCancelledArray = barGraph.map(
            (item) => item.total_cancelled
          );
          const totalNoshowArray = barGraph.map((item) => item.total_noshow);
          const totalApprovalPendingArray = barGraph.map(
            (item) => item.total_approval_pending
          );
          const totalArrivalArray = barGraph.map((item) => item.total_arrival);
          const totalReassignArray = barGraph.map(
            (item) => item.total_reassign
          );
          const totalDisputeArray = barGraph.map((item) => item.total_dispute);
          const totalDeclineArray = barGraph.map((item) => item.total_decline);
          const totalApprovalPendingSum = totalApprovalPendingArray.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const totalArrivalArraySum = totalArrivalArray.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const aryList = {
            totalArrived: totalArrivedArray,
            totalCompleted: totalCompletedArray,
            totalCancelled: totalCancelledArray,
            totalNoshow: totalNoshowArray,
            totalApprovalPending: totalApprovalPendingSum,
            totalArrival: totalArrivalArraySum,
            totalReassign: totalReassignArray,
            totalDispute: totalDisputeArray,
            totalDecline: totalDeclineArray,
            totalCompletedSum: totalCancelledArray.reduce(
              (acc, curr) => acc + curr,
              0
            ),
            totalNoshowSum: totalNoshowArray.reduce(
              (acc, curr) => acc + curr,
              0
            ),
            totalDeclineSum: totalDeclineArray.reduce(
              (acc, curr) => acc + curr,
              0
            ),
            totalDisputeSum: totalDisputeArray.reduce(
              (acc, curr) => acc + curr,
              0
            ),
          };
          setStatics(aryList);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };

  const search_data = () => {
    master_data_get(startDate, endDate, "1", "", selected.value);
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

  const calculateBusinessGrowth = (currentMonthBookings, lastMonthBookings) => {
    let businessGrowth = 0;
    if (Number(lastMonthBookings) > 0) {
      businessGrowth = (
        ((Number(currentMonthBookings) - Number(lastMonthBookings)) /
          Number(lastMonthBookings)) *
        100
      ).toFixed(2);
    }

    if (isNaN(businessGrowth)) {
      return 0;
    } else {
      return businessGrowth;
    }
  };

  function formatDate(bookDate) {
    // Assuming item.book_date is in the format "yyyy-mm-dd"
    let dateParts = bookDate.split("-");
    let formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
    return formattedDate;
  }

  // code by shubham jain for custom date functionality

  const optionsRadial2 = {
    chart: {
      type: "donut",
    },
    labels: ["Direct Reservation", "Walk -In", "Reservation"],
    colors: ["#3268C1", "#509D30", "#67d880"],
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const seriesBar = [
    {
      name: "Revenue",
      data: RevenueBarData,
    },
    {
      name: "Reservations",
      data: BookingBarData,
    },
  ];

  const optionsBar = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false, // Hide the toolbar including the download option
      },
      events: {
        click: function (event, chartContext, config) {
          if (config && config.dataPointIndex !== undefined) {
            const clickedDate = xAxisCategories[config.dataPointIndex];
            console.log("Clicked Date:", clickedDate);
            //if (!isNaN(Date.parse(clickedDate))) {
            toggleTabs("Mon");
            //gethourdata(clickedDate);
            //}
            // Do something with the clicked date
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%", // Adjust the width of the bars
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xAxisCategories,
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      show: false, // Hide legends
    },
  };

  const seriesBar_Hour_Mon = [
    {
      name: "Revenue",
      data: total_payout_array_Monday,
    },
    {
      name: "Reservations",
      data: total_count_array_Monday,
    },
  ];

  const optionsBar_Hour = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false, // Hide the toolbar including the download option
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%", // Adjust the width of the bars
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xAxisTime,
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      show: false, // Hide legends
    },
  };

  const seriesBar_Hour_Tue = [
    {
      name: "Revenue",
      data: total_payout_array_Tuesday,
    },
    {
      name: "Reservations",
      data: total_count_array_Tuesday,
    },
  ];

  const seriesBar_Hour_Wed = [
    {
      name: "Revenue",
      data: total_payout_array_Wednesday,
    },
    {
      name: "Reservations",
      data: total_count_array_Wednesday,
    },
  ];

  const seriesBar_Hour_Thu = [
    {
      name: "Revenue",
      data: total_payout_array_Thursday,
    },
    {
      name: "Reservations",
      data: total_count_array_Thursday,
    },
  ];

  const seriesBar_Hour_Fri = [
    {
      name: "Revenue",
      data: total_payout_array_Friday,
    },
    {
      name: "Reservations",
      data: total_count_array_Friday,
    },
  ];
  const seriesBar_Hour_Sat = [
    {
      name: "Revenue",
      data: total_payout_array_Saturday,
    },
    {
      name: "Reservations",
      data: total_count_array_Saturday,
    },
  ];

  const seriesBar_Hour_Sun = [
    {
      name: "Revenue",
      data: total_payout_array_Sunday,
    },
    {
      name: "Reservations",
      data: total_count_array_Sunday,
    },
  ];

  const seriesLine = [
    {
      name: "Arrived",
      data: Statics.totalArrived,
    },
    {
      name: "Completed",
      data: Statics.totalCompleted,
    },
    {
      name: "Cancelled",
      data: Statics.totalCancelled,
    },
    {
      name: "No Show",
      data: Statics.totalNoshow,
    },
  ];

  const optionsLine = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false, // Disable zooming
      },
      toolbar: {
        show: false, // Hide toolbar
      },
    },
    stroke: {
      curve: "smooth", // Smoothened curve for the line
    },
    xaxis: {
      categories: xAxisCategories,
    },
    yaxis: {
      title: {
        text: "No. of Reservations",
      },
    },
    stroke: {
      curve: "straight",
    },
    colors: ["#509D30", "#3268C1", "#FF1212", "#A098AE"],
    markers: {
      size: 6,
      colors: ["#509D30", "#3268C1", "#FF1212", "#A098AE"],
      strokeColors: "#fff",
      strokeWidth: 0,
      hover: {
        size: 8,
      },
    },
    grid: {
      show: false, // Hide grid lines
    },
    legend: {
      show: false, // Hide legends
    },
  };

  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageClick = (pageNumber) => {
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
          // onClick={() => paginate(number)}
          onClick={() => handlePageClick(number)}
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

  const exportToCSV = (csvData, fileName, fileExtension) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
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
    <div className="dashboard">
      {showLoaderAdmin && <Loader />}

      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="analyticsHead">
                <div className="analyticFIlter">
                  <div className="col-xl-10">
                    <div className="row m-0">
                      <div className="col-md-4">
                        <div className="dropdownCustom" ref={dropdownRef}>
                          <div
                            onClick={(e) => {
                              setIsActive(!isActive);
                            }}
                            className="dropdownCustom-btn"
                          >
                            {Analytics_text.Period_text}: {selected.label}
                            <span
                              className={
                                isActive
                                  ? "fas fa-caret-up"
                                  : "fas fa-caret-down"
                              }
                            >
                              <img src={dropdown} alt="Barley's Dashboard" />
                            </span>
                          </div>
                          <div
                            className="dropdownCustom-content"
                            style={{ display: isActive ? "block" : "none" }}
                          >
                            {options_select_drop_feedback.map(function (
                              items,
                              index
                            ) {
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
                          <div className="col-md-3 bottomAlgin">
                            <div className="person__calenderFrame_image image_icon_position1 ">
                              <input
                                autoComplete="off"
                                id="startDate"
                                type="date"
                                placeholder="From Date"
                                defaultValue={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control  input_field_custom4 backcolorWhite"
                                max={computeTodayDate()}
                              />
                            </div>
                          </div>
                          <div className="col-md-3 bottomAlgin">
                            <div className="person__calenderFrame_image image_icon_position1 ">
                              <input
                                autoComplete="off"
                                id="endDate"
                                type="date"
                                placeholder="To Date"
                                defaultValue={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-control  input_field_custom4 backcolorWhite"
                                max={computeTodayDate()}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="downloadBtnAna">
                              <button onClick={() => search_data()}>
                                {Analytics_text.Search_text}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="downloadBtnAna">
                  <button onClick={handleDownloadButtonClick}>
                    {Analytics_text.download_text}
                  </button>
                </div>
              </div>
            </div>

            <div className="page_body">
              <div className="analytics">
                <div className="analytics_container">
                  <div className="row m-0">
                    <div className="col-md-4">
                      <div className="radilaGraph">
                        <div className="bargrapgh_container m-0">
                          <div className="radilaGraph_container">
                            <div className="donut-container">
                              <Chart
                                options={optionsRadial2}
                                series={series}
                                type="donut"
                                className="donutStyle"
                              />
                              {/* Overlay text */}
                              <div className="centerText">
                                {Analytics_text.overlay_text_netcovers}
                              </div>
                            </div>
                          </div>
                          <div className="radilaGraphText">
                            <div className="radilaGraphTextLeft">
                              <h6>{Analytics_text.overlay_text_covers}</h6>
                              <ul>
                                <li>
                                  <div className="legendCOntainer">
                                    <div className="legendColor rescheduleLegend"></div>
                                    <p>
                                      {
                                        Analytics_text.overlay_text_direct_booking
                                      }
                                    </p>
                                  </div>
                                </li>
                                <li hidden>
                                  <div className="legendCOntainer">
                                    <div className="legendColor aggregator1"></div>
                                    <p>
                                      {Analytics_text.overlay_text_aggregator +
                                        "01"}
                                    </p>
                                  </div>
                                </li>
                                <li hidden>
                                  <div className="legendCOntainer">
                                    <div className="legendColor"></div>
                                    <p>
                                      {Analytics_text.overlay_text_aggregator +
                                        "02"}
                                    </p>
                                  </div>
                                </li>
                                <li>
                                  <div className="legendCOntainer">
                                    <div className="legendColor arrivedLegend2"></div>
                                    <p>{Analytics_text.reservation_text}</p>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="radilaGraphTextRight">
                              <h6>{Analytics_text.overlay_text_covers_off}</h6>
                              <ul>
                                <li>
                                  <div className="legendCOntainer">
                                    <div className="legendColor arrivedLegend"></div>
                                    <p>{Analytics_text.walk_in}</p>
                                  </div>
                                </li>

                                {/* <li>
                                <div className="legendCOntainer">
                                  <div className="legendColor offlineReser"></div>
                                  <p>Offline Reser.</p>
                                </div>
                              </li> */}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="analyticsCardsContainer">
                        <div className="analyticsCardsRow">
                          <div className="row m-0">
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard colorCard1">
                                <p>{Analytics_text.total_reservation}</p>
                                <h5>{GraphStatics.total_booking_sum}</h5>
                              </div>
                            </div>
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard colorCard2">
                                <p>{Analytics_text.arrival_txt}</p>
                                <h5>{Statics.totalArrival}</h5>
                              </div>
                            </div>
                            {/* <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard colorCard3">
                                <p>Occupancy</p>
                                <h5>{CardData.total_occupancy}%</h5>
                              </div>
                            </div> */}
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard colorCard3">
                                <p>{Analytics_text.complete_txt}</p>
                                <h5>{TotalComplete}</h5>
                              </div>
                            </div>
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard colorCard4">
                                <p>{Analytics_text.Approval_Pending}</p>
                                <h5>{Statics.totalApprovalPending}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="analyticsCardsRow">
                          <div className="row m-0">
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard">
                                <div className="textInfo">
                                  <p>{Analytics_text.revenue}</p>
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Total Revenue`}
                                  >
                                    <img
                                      src={InfoIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                </div>
                                <h5>{GraphStatics.total_payout_amt_sum}</h5>
                              </div>
                            </div>
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard">
                                <div className="textInfo">
                                  <p>{Analytics_text.Cancellations}</p>
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Total Cancellation`}
                                  >
                                    <img
                                      src={InfoIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                </div>
                                <div className="numberPercent">
                                  <h5>{Statics.totalCompletedSum}</h5>
                                  {/* <div className="numberPercentGrade">
                                    {(() => {
                                      const show_per = calculateBusinessGrowth(
                                        CardData.total_cancellations,
                                        CardData.total_cancellations_past
                                      );
                                      return (
                                        <>
                                          {show_per > 0 ? (
                                            <>
                                              <p>+{show_per}%</p>
                                              <img
                                                src={Upgrade}
                                                alt="Upgrade"
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <p>{show_per}%</p>
                                              <img
                                                src={Downgrade}
                                                alt="Downgrade"
                                              />
                                            </>
                                          )}
                                        </>
                                      );
                                    })()}{" "}
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard">
                                <div className="textInfo">
                                  <p>{Analytics_text.decline_text}</p>
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Total Decline`}
                                  >
                                    <img
                                      src={InfoIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                </div>
                                <div className="numberPercent">
                                  <h5>{Statics.totalDeclineSum}</h5>
                                  {/* <div className="numberPercentGrade">
                                    {(() => {
                                      const show_per = calculateBusinessGrowth(
                                        CardData.total_cancellations,
                                        CardData.total_cancellations_past
                                      );
                                      return (
                                        <>
                                          {show_per > 0 ? (
                                            <>
                                              <p>+{show_per}%</p>
                                              <img
                                                src={Upgrade}
                                                alt="Upgrade"
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <p>{show_per}%</p>
                                              <img
                                                src={Downgrade}
                                                alt="Downgrade"
                                              />
                                            </>
                                          )}
                                        </>
                                      );
                                    })()}{" "}
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3 paddingLeft1200">
                              <div className="analyticsCard">
                                <div className="textInfo">
                                  <p>{Analytics_text.No_Show}</p>
                                  <button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    htmlFor="top"
                                    title={`Total No Show`}
                                  >
                                    <img
                                      src={InfoIcon}
                                      alt="Barley's Dashboard"
                                    />
                                  </button>
                                </div>
                                <div className="numberPercent">
                                  <h5>{Statics.totalNoshowSum}</h5>
                                  {/* <div className="numberPercentGrade">
                                    {(() => {
                                      const show_per = calculateBusinessGrowth(
                                        CardData.total_no_show,
                                        CardData.total_no_show_past
                                      );
                                      return (
                                        <>
                                          {show_per > 0 ? (
                                            <>
                                              <p>+{show_per}%</p>
                                              <img
                                                src={Upgrade}
                                                alt="Upgrade"
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <p>{show_per}%</p>
                                              <img
                                                src={Downgrade}
                                                alt="Downgrade"
                                              />
                                            </>
                                          )}
                                        </>
                                      );
                                    })()}{" "}
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row m-0">
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.no_of_guest}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Total No. of Guest`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{GraphStatics.total_no_of_guest_sum}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.no_of_child}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Total No. of Children`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{GraphStatics.total_no_of_child_sum}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.no_of_pets}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Total No. of Pets`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{GraphStatics.total_no_of_pets_sum}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.Direct_Website}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Reservations From Direct Website`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{CardData.total_direct_website}</h5>
                                <div className="numberPercentGrade" hidden>
                                  {(() => {
                                    const show_per = calculateBusinessGrowth(
                                      CardData.total_direct_website,
                                      CardData.total_direct_website_past
                                    );
                                    return (
                                      <>
                                        {show_per > 0 ? (
                                          <>
                                            <p>+{show_per}%</p>
                                            <img src={Upgrade} alt="Upgrade" />
                                          </>
                                        ) : (
                                          <>
                                            <p>{show_per}%</p>
                                            <img
                                              src={Downgrade}
                                              alt="Downgrade"
                                            />
                                          </>
                                        )}
                                      </>
                                    );
                                  })()}{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.Special_Day_Booking}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Special Day Booking`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{CardData.total_spacial_booking}</h5>
                                <div className="numberPercentGrade" hidden>
                                  {(() => {
                                    const show_per = calculateBusinessGrowth(
                                      CardData.total_spacial_booking,
                                      CardData.total_spacial_booking_past
                                    );
                                    return (
                                      <>
                                        {show_per > 0 ? (
                                          <>
                                            <p>+{show_per}%</p>
                                            <img src={Upgrade} alt="Upgrade" />
                                          </>
                                        ) : (
                                          <>
                                            <p>{show_per}%</p>
                                            <img
                                              src={Downgrade}
                                              alt="Downgrade"
                                            />
                                          </>
                                        )}
                                      </>
                                    );
                                  })()}{" "}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="analyticsCard" hidden>
                            <div className="textInfo">
                              <p>
                                {Analytics_text.overlay_text_aggregator + "01"}
                              </p>
                              <button
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                htmlFor="top"
                                title={`Aggregator 01`}
                              >
                                <img src={InfoIcon} alt="Barley's Dashboard" />
                              </button>
                            </div>
                            <div className="numberPercent">
                              <h5>{CardData.total_aggregator_1}</h5>
                              <div className="numberPercentGrade">
                                {(() => {
                                  const show_per = calculateBusinessGrowth(
                                    CardData.total_aggregator_1,
                                    CardData.total_aggregator_1_past
                                  );
                                  return (
                                    <>
                                      {show_per > 0 ? (
                                        <>
                                          <p>+{show_per}%</p>
                                          <img src={Upgrade} alt="Upgrade" />
                                        </>
                                      ) : (
                                        <>
                                          <p>{show_per}%</p>
                                          <img
                                            src={Downgrade}
                                            alt="Downgrade"
                                          />
                                        </>
                                      )}
                                    </>
                                  );
                                })()}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="analyticsCard" hidden>
                            <div className="textInfo">
                              <p>
                                {Analytics_text.overlay_text_aggregator + "02"}
                              </p>
                              <button
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                htmlFor="top"
                                title={`Aggregator 02`}
                              >
                                <img src={InfoIcon} alt="Barley's Dashboard" />
                              </button>
                            </div>
                            <div className="numberPercent">
                              <h5>{CardData.total_aggregator_2}</h5>
                              <div className="numberPercentGrade">
                                {(() => {
                                  const show_per = calculateBusinessGrowth(
                                    CardData.total_aggregator_2,
                                    CardData.total_aggregator_2_past
                                  );
                                  return (
                                    <>
                                      {show_per > 0 ? (
                                        <>
                                          <p>+{show_per}%</p>
                                          <img src={Upgrade} alt="Upgrade" />
                                        </>
                                      ) : (
                                        <>
                                          <p>{show_per}%</p>
                                          <img
                                            src={Downgrade}
                                            alt="Downgrade"
                                          />
                                        </>
                                      )}
                                    </>
                                  );
                                })()}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 paddingLeft1200">
                            <div className="analyticsCard">
                              <div className="textInfo">
                                <p>{Analytics_text.Dispute}</p>
                                <button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  htmlFor="top"
                                  title={`Total Dispute`}
                                >
                                  <img
                                    src={InfoIcon}
                                    alt="Barley's Dashboard"
                                  />
                                </button>
                              </div>
                              <div className="numberPercent">
                                <h5>{Statics.totalDisputeSum}</h5>
                                <div className="numberPercentGrade" hidden>
                                  {(() => {
                                    const show_per = calculateBusinessGrowth(
                                      CardData.total_dispute,
                                      CardData.total_dispute_past
                                    );
                                    return (
                                      <>
                                        {show_per > 0 ? (
                                          <>
                                            <p>+{show_per}%</p>
                                            <img src={Upgrade} alt="Upgrade" />
                                          </>
                                        ) : (
                                          <>
                                            <p>{show_per}%</p>
                                            <img
                                              src={Downgrade}
                                              alt="Downgrade"
                                            />
                                          </>
                                        )}
                                      </>
                                    );
                                  })()}{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bargrapgh">
                    <div className="bargrapgh_container">
                      <div className="garphTabs">
                        <p
                          className={`${selectedGraph1 && "selectedGraph"}`}
                          onClick={() => toggleTabs("Day")}
                        >
                          {Analytics_text.Date_Month}
                        </p>
                        {/* <<<<<<<  */}
                        {/* ======= */}
                        {showWeekdays && (
                          <div className="weekdayGrapghs">
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Mon")}
                            >
                              <span>MON</span>
                              <div
                                className={`${
                                  selectedGraphMon && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Tue")}
                            >
                              <span>TUE</span>
                              <div
                                className={`${
                                  selectedGraphTue && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Wed")}
                            >
                              <span>WED</span>
                              <div
                                className={`${
                                  selectedGraphWed && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Thu")}
                            >
                              <span>THU</span>
                              <div
                                className={`${
                                  selectedGraphThu && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Fri")}
                            >
                              <span>FRI</span>
                              <div
                                className={`${
                                  selectedGraphFri && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Sat")}
                            >
                              <span>SAT</span>
                              <div
                                className={`${
                                  selectedGraphSat && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                            <p
                              className="weekdayBtns"
                              onClick={() => toggleTabs("Sun")}
                            >
                              <span>SUN</span>
                              <div
                                className={`${
                                  selectedGraphSun && "selectedDayGrapghs"
                                }`}
                              ></div>
                            </p>
                          </div>
                        )}
                        {/* >>>>>>> bfb8459a1d6e8a8c8ce03cd08da29965100fcfca */}
                      </div>
                      <div className="revenueGraph">
                        {selectedGraph1 && (
                          <Chart
                            options={optionsBar}
                            series={seriesBar}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphMon && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Mon}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphTue && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Tue}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphWed && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Wed}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphThu && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Thu}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphFri && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Fri}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphSat && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Sat}
                            type="bar"
                            height={350}
                          />
                        )}
                        {selectedGraphSun && (
                          <Chart
                            options={optionsBar_Hour}
                            series={seriesBar_Hour_Sun}
                            type="bar"
                            height={350}
                          />
                        )}
                      </div>
                      <div className="bargrapghTextRow">
                        <div className="col-md-3">
                          <div className="bargrapghCard">
                            <p>{Analytics_text.Total_Revenue}</p>
                            <h5>
                              {CardData.data_money_left}
                              {GraphStatics.total_payout_amt_sum}
                              {CardData.data_money_right}{" "}
                            </h5>
                          </div>
                        </div>
                        <div className="bargrapghTextRow2">
                          <div className="bargrapghCard2">
                            <p>{Analytics_text.Total_Booking}</p>
                            <h5>{GraphStatics.total_booking_sum}</h5>
                          </div>
                          <div className="bargrapghCard2">
                            <p>{Analytics_text.Auto_Approval}</p>
                            <h5>{CardData.auto_approval}</h5>
                          </div>
                          <div className="bargrapghCard2">
                            <p>{Analytics_text.Manual_Approval}</p>
                            <h5>{CardData.manual_approval}</h5>
                          </div>
                          <div className="bargrapghCard2">
                            <p>{Analytics_text.Rate_of_Auto_Approval}</p>
                            <h5> {CardData.rate_of_approval}%</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="GuestStatusGraph">
                    <div className="GuestStatusGraphContainer">
                      <div className="GuestStatusGraphHead">
                        <div className="GuestStatusGraphLegends">
                          <div className="legendCOntainer">
                            <div className="legendColor arrivedLegend"></div>
                            <p>{Analytics_text.arrived}</p>
                          </div>
                          <div className="legendCOntainer">
                            <div className="legendColor rescheduleLegend"></div>
                            <p>{Analytics_text.complete_txt}</p>
                          </div>
                          <div className="legendCOntainer">
                            <div className="legendColor cancelledLegend"></div>
                            <p>{Analytics_text.Cancelled_text}</p>
                          </div>
                          <div className="legendCOntainer">
                            <div className="legendColor"></div>
                            <p>{Analytics_text.no_show}</p>
                          </div>
                        </div>
                        <div className="GuestStatusGraphFilter">
                          <div
                            className="downloadImng"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            htmlFor="top"
                            title={`Print Graph`}
                          >
                            <img src={DownloadImg} alt="Barley's Dashboard" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Chart
                          options={optionsLine}
                          series={seriesLine}
                          type="line"
                          height={350}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="feedBackTable">
                    <div className="feedBackTable_container">
                      <h5>{Analytics_text.reservation_text_2}</h5>
                      <div className="tableResponsive">
                        <div className="tableResponsive_container">
                          <table
                            id="myTable"
                            ref={tableRef}
                            className="display table"
                          >
                            <thead>
                              <tr>
                                <th scope="col" className="th3">
                                  {Analytics_text.s_no}
                                </th>
                                <th scope="col">{Analytics_text.guest_name}</th>
                                <th scope="col">{Analytics_text.Email_txt}</th>
                                <th scope="col">{Analytics_text.mobile_no}</th>
                                <th scope="col">
                                  {Analytics_text.Reservation_Date_Time}
                                </th>
                                <th scope="col">
                                  {Analytics_text.Person_Child_Pets}
                                </th>
                                <th className="th4">
                                  {Analytics_text.Bill_Amount}
                                </th>
                              </tr>
                              <tr style={{ height: "25px" }}></tr>
                            </thead>
                            <tbody>
                              {currentItems &&
                                currentItems.map((item, index) => (
                                  <React.Fragment key={index}>
                                    <tr key={index}>
                                      <td>
                                        <div className="recentANme">
                                          <p>{index + 1}</p>
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
                                        </div>
                                      </td>
                                      <td>
                                        <div className="recentContact">
                                          <p>{item.guest_mobile_no}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="recentContact">
                                          <p>
                                            {formatDate(item.book_date)} |{" "}
                                            {item.book_time.slice(0, -3)}
                                            {/* <span className="sprtor">|</span>&nbsp; */}
                                          </p>
                                          {/* <p>{ item.book_time.slice(0, -3)}</p> */}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="recentContact">
                                          <p>
                                            {item.no_of_guest}{" "}
                                            {item.no_of_guest > 1
                                              ? "Person"
                                              : "Person"}{" "}
                                            <br></br>
                                            {item.no_of_child}{" "}
                                            {item.no_of_child > 1
                                              ? "Children"
                                              : "Child"}{" "}
                                            <br></br>
                                            {item.no_of_pets}{" "}
                                            {item.no_of_pets > 1
                                              ? "Pets"
                                              : "Pet"}{" "}
                                          </p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="recentContact">
                                          <p>
                                            {CardData.data_money_left}
                                            {item.payout_amt}
                                            {CardData.data_money_right}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>

                                    <tr
                                      style={{
                                        height: "1rem",
                                        boxShadow: "none",
                                      }}
                                    ></tr>
                                  </React.Fragment>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <Pagination>
                        <div className="paginationContainer">
                          <div className="nxtBttnTble">
                            {!currentItems && currentPage !== 1 ? (
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    prev > 1 ? prev - 1 : prev
                                  )
                                }
                              >
                                {Analytics_text.Previous_text}
                              </button>
                            ) : null}
                          </div>
                          <div className="d-flex gap-2">
                            {renderPaginationItems()}
                          </div>
                          {!currentItems && (
                            <div className="nxtBttnTble">
                              <button
                                className="btn btn-primary"
                                disabled={currentPage === totalPageCount}
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    prev < totalPageCount ? prev + 1 : prev
                                  )
                                }
                              >
                                {Analytics_text.next_text}
                              </button>
                            </div>
                          )}
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
  );
}

export default Analytics;
