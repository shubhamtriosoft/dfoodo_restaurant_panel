import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import ChangePassword from "./Components/ChangePassword";
import AddStaff from "./Components/AddStaff";
import ViewStaff from "./Components/ViewStaff";
import GuestMngmt from "./Components/GuestMngmt";
import CreateStaffRights from "./Components/CreateStaffRights";
import ViewStaffRights from "./Components/ViewStaffRights";
import CreateSubStaffRights from "./Components/CreateSubStaffRights";
import ViewSubRights from "./Components/ViewSubRights";
import EditSubRights from "./Components/EditSubRights";
import InsidePageRightsView from "./Components/InsidePageRightsView";
import CreateInsidePageRights from "./Components/CreateInsidePageRights";
import ViewReservationCalendar from "./Components/ViewReservationCalendar";
import FloorPlanMngmnt from "./Components/FloorPlanMngmnt";
import CreateFloorPlan from "./Components/CreateFloorPlan";
import ProfileSettings from "./Components/ProfileSettings";
import SystemSettings from "./Components/SystemSettings";
import Analytics from "./Components/Analytics";
import RestaurantSetup from "./Components/RestaurantSetup";
import CreateRestro from "./Components/CreateRestro";
import CreateReservation from "./Components/CreateReservation";
import AddDesignation from "./Components/AddDesignation";
import ViewDesignation from "./Components/ViewDesignation";
import FeedBackManagement from "./Components/FeedBackManagement";
import ViewFeedback from "./Components/ViewFeedback";
import ViewSearchMaster from "./Components/ViewSearchMaster";
import Add_SearchMaster from "./Components/Add_SearchMaster";
import Manuals from "./Components/Manuals";
import Add_Faqs from "./Components/Add_Faqs";
import ViewFaq from "./Components/ViewFaq";
import ViewKB from "./Components/ViewKB";
import AddKB from "./Components/AddKB";
import Report from "./Components/Reports";
import WebsiteMngt from "./Components/WebsiteMngmt";

function App() {
  useEffect(() => {
    console.log("Effect is running");
    const inputElements = document.getElementsByTagName("input");
    Array.from(inputElements).forEach((input) => {
      input.setAttribute("autocomplete", "off");
    });
  }, [Array]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Working Screen */}

          {/* Login Screens */}
          <Route path="/" element={<Login />} />
          <Route path="/Forgot_Password" element={<ForgotPassword />} />
          <Route path="/Change_Password/:id" element={<ChangePassword />} />

          {/* Add and Edit Staff Pages */}
          <Route path="/View_Staff" element={<ViewStaff />} />
          <Route path="/Add_Staff" element={<AddStaff />} />
          <Route path="/edit_staff/:id" element={<AddStaff />} />

          {/* Profile Settings Pages */}
          <Route path="/Profile_Settings" element={<ProfileSettings />} />

          {/* Guest Management Pages */}
          <Route path="/View_Guest" element={<GuestMngmt />} />

          {/* Floor Management Pages */}
          <Route path="/Floor_Plan_Management" element={<FloorPlanMngmnt />} />

          <Route
            path="/Reservation_Calendar"
            element={<ViewReservationCalendar />}
          />

          {/* Restraurant Setup Pages */}
          <Route path="/View_Restaurants" element={<RestaurantSetup />} />
          <Route path="/Create_Restaurant" element={<CreateRestro />} />
          <Route path="/edit_restaurants/:id" element={<CreateRestro />} />

          {/* System Settings Pages */}
          <Route path="/System_Settings" element={<SystemSettings />} />

          {/* Website Settings Pages */}
          <Route path="/Website_Management" element={<WebsiteMngt />} />

          {/* Create, Edit and View Righst Pages */}
          <Route path="/Create_Staff_Rights" element={<CreateStaffRights />} />
          <Route path="/View_Staff_Rights" element={<ViewStaffRights />} />
          <Route
            path="/Edit_Staff_Rights/:id"
            element={<CreateStaffRights />}
          />
          <Route
            path="/Create_SubStaff_Rights/:id"
            element={<CreateSubStaffRights />}
          />
          <Route path="/View_Sub_Rights/:id" element={<ViewSubRights />} />
          <Route
            path="/Edit_SubStaff_Rights/:id"
            element={<CreateSubStaffRights />}
          />
          <Route path="/Edit_Sub_Rights" element={<EditSubRights />} />
          <Route
            path="/View_Inside_Page_Rights/:id"
            element={<InsidePageRightsView />}
          />
          <Route
            path="/Create_Inside_Page_Rights/:id"
            element={<CreateInsidePageRights />}
          />

          <Route path="/Add_Designation" element={<AddDesignation />} />
          <Route path="/Edit_Designation/:id" element={<AddDesignation />} />
          <Route path="/ViewDesignation" element={<ViewDesignation />} />

          <Route path="/Create_Reservation" element={<CreateReservation />} />
          <Route
            path="/Edit_Reservation/:reservation_id"
            element={<CreateReservation />}
          />
          <Route path="/Create_WalkIn" element={<CreateReservation />} />

          {/* Help And Support Pages */}
          <Route path="/Manuals" element={<Manuals />} />
          <Route path="/Add_Faq" element={<Add_Faqs />} />
          <Route path="/View_Faq" element={<ViewFaq />} />
          <Route path="/View_KB" element={<ViewKB />} />
          <Route path="/Add_KB" element={<AddKB />} />
          <Route path="/Edit_KB/:id" element={<AddKB />} />
          <Route path="/Edit_Faq/:id" element={<Add_Faqs />} />

          <Route path="/View_Feedbacks" element={<ViewFeedback />} />

          {/* Search Master */}
          <Route path="/ViewSearchMaster" element={<ViewSearchMaster />} />
          <Route path="/Add_SearchMaster" element={<Add_SearchMaster />} />
          <Route path="/Edit_SearchMaster/:id" element={<Add_SearchMaster />} />

          {/* Working Screen */}
          {/* Dashboard Screens */}
          <Route path="/Dashboard" element={<Dashboard />} />

          <Route path="/Create_Floor_Plan" element={<CreateFloorPlan />} />
          <Route path="/Edit_Floor_Plan/:id" element={<CreateFloorPlan />} />

          {/* Analytics and Reports Pages */}
          <Route path="/Analytics" element={<Analytics />} />

          <Route path="/Feedback_Management" element={<FeedBackManagement />} />

          <Route path="/View_Reports" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
