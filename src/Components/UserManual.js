import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import "./Css/HelpAndSupport.css";
import {
  server_post_data,
  get_all_knowledgebase,
} from "../ServiceConnection/serviceconnection.js";
import { handleError,formatDateStringdot,
  handleConfimDeleteClick } from "../CommonJquery/CommonJquery";
function UserManual() {
  const [data, setData] = useState([]);
  const [showLoaderAdmin, setshowLoaderAdmin] = useState(false);
  useEffect(() => {
    const flag = "1";
    const call_id = "0";
    master_data_get(flag, call_id);
  }, []);


  const master_data_get = async (
    flag,
  ) => {
    setshowLoaderAdmin(true);
    const fd = new FormData();
    fd.append("flag", flag);
    await server_post_data(get_all_knowledgebase, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setData(Response.data.message.data);
          console.log(Response.data.message.data);
        }

        setshowLoaderAdmin(false);
      })
      .catch((error) => {
        console.log(error);
        handleError("network");
        setshowLoaderAdmin(false);
      });
  };
  const [selectedTopic, setSelectedTopic] = useState(0);
  const handleTopicClick = (index) => {
    setSelectedTopic(index);
  };
  return (
    <section className="faqs">
      <div className="faqs_container">
        <h3>Knowledge Base</h3>
        <div className="row m-0">
          <div className="faqs_div col-xl-8 col-sm-9 col-11 m-auto">
          <div className="manualSection">
        <div className="faqsHeaDING">
          <h5>{`${selectedTopic + 1}. ${data[selectedTopic]?.topic_name || ''}`}</h5>
        </div>
        <div className="manualSection_container">
          <div className="manualSectionItems">
            <div className="manualSectionItemsContaienr">
            <div dangerouslySetInnerHTML={{ __html: data[selectedTopic]?.knowledgebase_data || '' }} />

            </div>
          </div>
        </div>
      </div>
          </div>
          <div className="col-md-3">
            <div className="indexIst">
              <h5>Popular Articles</h5>
              <ul>
              {data.map((item, index) => (
          <li key={item.primary_id} className={selectedTopic === index ? "currentTopic" : ""} onClick={() => handleTopicClick(index)}>
            {`${index + 1}. ${item.topic_name}`}
          </li>
        ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default UserManual;
