import React, { useState } from "react";
import "./Css/Settings.css";
import Header from "./Header";
import WebRestroInfo from "./WebRestroInfo";
import "./Css/WebsiteMngmt.css";
import AddImage from "./AddImage";
import TeamWebsite from "./TeamWebsite";
import CapsWebsite from "./CapsWebsite";
import SeoWebsite from "./SeoWebsite";
import BlogWebsite from "./BlogWebsite";
import EventWebsite from "./EventWebsite";
import EmailSubs from "./EmailSubsView";
import VacancyWebsite from "./VacancyWebsite";

function WebsiteMngt() {
  const [restriInfo, setrestriInfo] = useState(true);
  const [addImage, setaddImage] = useState(false);
  const [blog, setblog] = useState(false);
  const [seo, setseo] = useState(false);
  const [team, setteam] = useState(false);
  const [emailSubs, setemailSubs] = useState(false);
  const [events, setevents] = useState(false);
  const [caps, setcaps] = useState(false);
  const [vacancy, setvacancy] = useState(false);

  const toggleSettingsBar = (TabId) => {
    setrestriInfo(TabId === "1");
    setaddImage(TabId === "2");
    setblog(TabId === "3");
    setseo(TabId === "4");
    setteam(TabId === "5");
    setemailSubs(TabId === "6");
    setevents(TabId === "7");
    setcaps(TabId === "8");
    setvacancy(TabId === "9");
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        <div className="page_content">
          <div className="page_content_container">
            <Header />
            <div className="pageCntn_head">
              <div className="settingsTabs">
                <div className="settingsTabs_container">
                  <ul>
                    <li
                      className={`${restriInfo ? "currentTab" : ""}`}
                      onClick={() => toggleSettingsBar("1")}
                    >
                      <div className="setTab setTab1">
                        <p>Restaurant Info</p>
                      </div>
                    </li>
                    <li className={`${addImage ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("2")}
                      >
                        <p>Add Image</p>
                      </div>
                    </li>
                    <li className={`${blog ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("3")}
                      >
                        <p>Blog</p>
                      </div>
                    </li>
                    <li className={`${seo ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("4")}
                      >
                        <p>SEO</p>
                      </div>
                    </li>
                    <li className={`${team ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("5")}
                      >
                        <p>Team</p>
                      </div>
                    </li>
                    <li className={`${emailSubs ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("6")}
                      >
                        <p>Email Subs.</p>
                      </div>
                    </li>
                    <li className={`${events ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("7")}
                      >
                        <p>Events</p>
                      </div>
                    </li>
                    <li className={`${caps ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("8")}
                      >
                        <p>Beer Caps</p>
                      </div>
                    </li>
                    <li className={`${vacancy ? "currentTab" : ""}`}>
                      <div
                        className="setTab setTab1"
                        onClick={() => toggleSettingsBar("9")}
                      >
                        <p>Vacancy</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="page_body">
              <div className="settingstabsContainer">
                {restriInfo && <WebRestroInfo />}
                {addImage && <AddImage />}
                {team && <TeamWebsite />}
                {caps && <CapsWebsite />}
                {seo && <SeoWebsite />}
                {blog && <BlogWebsite />}
                {events && <EventWebsite />}
                {emailSubs && <EmailSubs />}
                {vacancy && <VacancyWebsite />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteMngt;
