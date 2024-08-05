import axios from "axios";
import { retrieveData } from "../LocalConnection/LocalConnection.js";
const appauth_key = "barlays@2029";
let APL_LINK = "http://192.168.1.34:8000/";
// APL_LINK = "https://back.barleys.se/";  
let Website_URL = "https://www.barleys.se/";
let local_server_link_react = APL_LINK + "api/admin_link/";
let feedback_online_link = "https://www.wowreviews.co/Adminmaster/";

// API functions

const login_to_superadmin = local_server_link_react + "login_to_superadmin";
const forgot_password = local_server_link_react + "forgot_password";
const check_resetlink_vaild = local_server_link_react + "check_resetlink_vaild";  
const change_password_by_forgot =
  local_server_link_react + "change_password_by_forgot";
const save_update_staff = local_server_link_react + "save_update_staff";
const get_all_staff = local_server_link_react + "get_all_staff";
const action_update_staff = local_server_link_react + "action_update_staff";
const save_update_designtion =
  local_server_link_react + "save_update_designtion";
const get_all_guestInformation =
  local_server_link_react + "get_all_guestInformation";
const update_guest_vip_status =
  local_server_link_react + "update_guest_vip_status";
const view_calender_reservation =
  local_server_link_react + "view_calender_reservation";
const view_reservation_history =
  local_server_link_react + "view_reservation_history";
const update_profile_staff = local_server_link_react + "update_profile_staff";

const save_update_faq = local_server_link_react + "save_update_faq";
const get_all_faq = local_server_link_react + "get_all_faq";
const save_update_knowledgebase =
  local_server_link_react + "save_update_knowledgebase";
const get_all_knowledgebase = local_server_link_react + "get_all_knowledgebase";

const get_all_diningarea = local_server_link_react + "get_all_diningarea";
const delete_diningarea = local_server_link_react + "delete_diningarea";
const update_primary_diningarea =
  local_server_link_react + "update_primary_diningarea";
const update_diningarea_sequence =
  local_server_link_react + "update_diningarea_sequence";
const get_all_table_position = local_server_link_react + "get_all_tablesetup";
const get_all_table_position2 = local_server_link_react + "get_all_tablesetup2";
const sava_update_table_position = local_server_link_react + "save_tablesetup";
const delete_tablesetup = local_server_link_react + "delete_tablesetup";

const save_new_resturant = local_server_link_react + "save_new_resturant";
const get_all_new_resturant = local_server_link_react + "get_all_new_resturant";
const action_update_resturant =
  local_server_link_react + "action_update_resturant";

const view_special_timing = local_server_link_react + "view_special_timing";
const view_week_all_timing = local_server_link_react + "view_week_all_timing";
const save_update_special_timing =
  local_server_link_react + "save_update_special_timing";
const save_update_week_timing =
  local_server_link_react + "save_update_week_timing";
const allot_table_to_reservation =
  local_server_link_react + "allot_table_to_reservation";
const get_all_StaffRights = local_server_link_react + "get_all_StaffRights";
const save_update_StaffRights =
  local_server_link_react + "save_update_StaffRights";
const save_update_general_Settings =
  local_server_link_react + "save_update_general_Settings";
const get_all_ReservationSetting =
  local_server_link_react + "get_all_ReservationSetting";
const get_all_reservation_date_notification =
  local_server_link_react + "get_all_reservation_date_notification";
const get_all_reservation_date =
  local_server_link_react + "get_all_reservation_date";
const update_action_reservation =
  local_server_link_react + "update_action_reservation";
const table_release_from_reservation =
  local_server_link_react + "table_release_from_reservation";
const get_all_timing_date_wise =
  local_server_link_react + "get_all_timing_date_wise";
const create_table_reservation_staff =
  local_server_link_react + "create_table_reservation_staff";
const get_all_floor_data = local_server_link_react + "get_all_floor_data";
const action_update_staff_right =
  local_server_link_react + "action_update_staff_right";
const get_all_designation = local_server_link_react + "get_all_designation";
const update_calender_seat_status =
  local_server_link_react + "update_calender_seat_status";
const check_no_show_review =
  local_server_link_react + "check_no_show_review";
const get_all_analyticsReservation =
  local_server_link_react + "get_all_analyticsReservation";
const get_analyticsReservationHourly =
  local_server_link_react + "get_analyticsReservationHourly";
const get_reservation_by_mobile_no =
  local_server_link_react + "get_reservation_by_mobile_no";
const get_all_notification = local_server_link_react + "get_all_notification";
const update_notification_status =
  local_server_link_react + "update_notification_status";

const feedback_dashboard_view =
  feedback_online_link + "feedback_dashboard_view";
const bad_bus_search_api = feedback_online_link + "bad_bus_search_api";

const get_all_searchmaster = local_server_link_react + "get_all_searchmaster";
const save_update_searchmaster =
  local_server_link_react + "save_update_searchmaster";
const insert_note_from_feedback =
  local_server_link_react + "insert_note_from_feedback";
const get_all_notes_by_id = local_server_link_react + "get_all_notes_by_id";
const get_all_ReportsReservation =
  local_server_link_react + "get_all_ReportsReservation";
const get_all_ReportsSales = local_server_link_react + "get_all_ReportsSales";
const get_all_guestReport = local_server_link_react + "get_all_guestReport";
const get_all_tablesetup2_for_edit = local_server_link_react + "get_all_tablesetup2_for_edit";

/**website links */
const get_all_subscribe = local_server_link_react + "get_all_subscribe";
const save_update_blog = local_server_link_react + "save_update_blog";
const get_all_blogs = local_server_link_react + "get_all_blogs";
const save_update_seo = local_server_link_react + "save_update_seo";
const get_all_seo = local_server_link_react + "get_all_seo";
const save_update_imagelink = local_server_link_react + "save_update_imagelink";
const get_all_imagelink = local_server_link_react + "get_all_imagelink";
const save_update_team = local_server_link_react + "save_update_team";
const get_all_team = local_server_link_react + "get_all_team";
const save_update_EventResturant =
  local_server_link_react + "save_update_EventResturant";
const get_all_EventResturant =
  local_server_link_react + "get_all_EventResturant";
const get_all_WebsiteCaps = local_server_link_react + "get_all_WebsiteCaps";
const save_update_WebsiteCaps =
  local_server_link_react + "save_update_WebsiteCaps";
const delete_website_master_data =
  local_server_link_react + "delete_website_master_data";
const get_all_Vacancy = local_server_link_react + "get_all_Vacancy";
const save_update_Vacancy = local_server_link_react + "save_update_Vacancy";
const update_data_career = local_server_link_react + "update_data_career";
const get_all_WebsiteManagement =
  local_server_link_react + "get_all_WebsiteManagement";
const save_update_WebsiteManagement =
  local_server_link_react + "save_update_WebsiteManagement";

const get_all_tickets = local_server_link_react + "get_all_tickets";
const get_save_update_tickets = local_server_link_react + "get_save_update_tickets";
const resolve_ticket_by_user = local_server_link_react + "resolve_ticket_by_user";
const get_save_update_tickets_details = local_server_link_react + "get_save_update_tickets_details";

/**website links */
// Retrieving data

const retrievedAdminId = retrieveData("admin_id");
const retrievedRestaurantId = retrieveData("default_restaurant_id");
const retrievedWowreviewkey = retrieveData("wowreview_key");
const restaurant_name = retrieveData("restaurant_name");

const server_post_data = async (url_for, form_data) => {
  // const headers = {
  //   "Content-Type": "application/json",
  // };

  if (form_data === null) {
    form_data = new FormData();
  }
  form_data.append("admin_id", retrievedAdminId);
  form_data.append("default_restaurant_id", retrievedRestaurantId);
  form_data.append("appauth_key", appauth_key);
  form_data.append("res_name", retrievedWowreviewkey);
  form_data.append("restaurant_name", restaurant_name);
  if (form_data.get("data_call") !== null) {
    form_data.append("call_id", retrievedAdminId);
  }
  return axios.post(url_for, form_data);
};

export {
  APL_LINK,
  Website_URL,
  appauth_key,
  server_post_data,
  get_all_table_position,
  get_all_table_position2,
  sava_update_table_position,
  login_to_superadmin,
  forgot_password,
  check_resetlink_vaild,
  change_password_by_forgot,
  save_update_staff,
  get_all_staff,
  action_update_staff,
  get_all_guestInformation,
  view_calender_reservation,
  view_reservation_history,
  view_special_timing,
  view_week_all_timing,
  update_profile_staff,
  get_all_diningarea,
  delete_diningarea,
  delete_tablesetup,
  save_new_resturant,
  save_update_special_timing,
  get_all_StaffRights,
  save_update_StaffRights,
  get_all_new_resturant,
  action_update_resturant,
  save_update_week_timing,
  allot_table_to_reservation,
  save_update_general_Settings,
  get_all_ReservationSetting,
  get_all_reservation_date,
  update_action_reservation,
  table_release_from_reservation,
  get_all_timing_date_wise,
  create_table_reservation_staff,
  get_all_floor_data,
  action_update_staff_right,
  get_all_designation,
  save_update_designtion,
  feedback_dashboard_view,
  update_calender_seat_status,
  save_update_faq,
  get_all_faq,
  save_update_knowledgebase,
  get_all_knowledgebase,
  get_all_analyticsReservation,
  get_analyticsReservationHourly,
  get_reservation_by_mobile_no,
  get_all_notification,
  update_notification_status,
  update_guest_vip_status,
  update_primary_diningarea,
  update_diningarea_sequence,
  bad_bus_search_api,
  get_all_searchmaster,
  save_update_searchmaster,
  insert_note_from_feedback,
  get_all_notes_by_id,
  get_all_ReportsReservation,
  get_all_ReportsSales,
  get_all_guestReport,
  get_all_reservation_date_notification,
  get_all_tablesetup2_for_edit,
  check_no_show_review,
  //website Links
  save_update_blog,
  get_all_blogs,
  save_update_seo,
  get_all_seo,
  save_update_imagelink,
  get_all_imagelink,
  save_update_team,
  get_all_team,
  save_update_EventResturant,
  get_all_EventResturant,
  get_all_WebsiteCaps,
  save_update_WebsiteCaps,
  delete_website_master_data,
  get_all_Vacancy,
  save_update_Vacancy,
  update_data_career,
  get_all_WebsiteManagement,
  save_update_WebsiteManagement,
  get_all_subscribe,
  get_all_tickets,
  get_save_update_tickets,
  resolve_ticket_by_user,
  get_save_update_tickets_details,
  //website Links
};
