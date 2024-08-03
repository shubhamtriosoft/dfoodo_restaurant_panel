import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Loader from "./Loader.js";
import "./Css/HelpAndSupport.css";
import {
  server_post_data,
  get_all_faq,
} from "../ServiceConnection/serviceconnection.js";
import { handleError,formatDateStringdot,
  handleConfimDeleteClick } from "../CommonJquery/CommonJquery";
function Faqs() {

  const [faqdata, setFaqData] = useState([]);
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
    await server_post_data(get_all_faq, fd)
      .then((Response) => {
        console.log(Response.data);
        if (Response.data.error) {
          handleError(Response.data.message);
        } else {
          setFaqData(Response.data.message.data);
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

  const [topics, setTopics] = useState([]);

useEffect(() => {
  if (faqdata.length > 0) {
    const uniqueTopics = [...new Set(faqdata.map(item => item.topic_name))];
    setTopics(uniqueTopics);
  }
}, [faqdata]);
  
  return (
    <section className="faqs">
      <div className="faqs_container">
        <h3>Frequently Asked Questions</h3>
        <div className="row m-0">
          <div className="faqs_div col-xl-8 col-sm-9 col-11 m-auto">
          <div>
              {topics.map((topic, index) => (
                <div key={index}>
                  <div className="faqsHeaDING">
                    <h5>{index + 1}. {topic}</h5>
                  </div>
                  
                  <div className="accordion" id={`accordion-${index}`}>
                    {faqdata.filter(faq => faq.topic_name === topic).map((faq, faqIndex) => {
                      const itemId = `collapse-${index}-${faqIndex}`;
                      return (
                        <div className="accordion-item" key={itemId}>
                          <h2 className="accordion-header" id={`heading-${itemId}`}>
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${itemId}`}
                              aria-expanded="false"
                              aria-controls={itemId}
                            >
                              {faq.question_name}
                            </button>
                          </h2>
                          <div
                            id={itemId}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${itemId}`}
                            data-bs-parent={`#accordion-${index}`}
                          >
                            <div className="accordion-body">{faq.answer_name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            </div>

          
        </div>
      </div>
    </section>
  );
}
export default Faqs;
