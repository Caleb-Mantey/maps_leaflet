import React, { useEffect, useRef, useState } from "react";
import ChipsRemoveIcon from "../Icons/ChipsRemoveIcon";
import "./LocationAccordion.scss";

function LocationAccordion({ title, content, data, removeTweet }) {
  const [opened, setOpened] = useState(false);
  const [averageSentiment, setAverageSentiment] = useState(0);
  const ref = useRef(null);

  const toggleAccordion = (isOpened) => {
    var panel = ref.current;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    setOpened(isOpened);
  };

  useEffect(() => {
    let totalSentiment = 0;
    data.forEach((element) => {
      totalSentiment += element.sentimentPolarity;
    });
    setAverageSentiment(totalSentiment / data.length);
  }, [data]);

  // console.log(data);

  return (
    <div>
      <div style={{ display: "flex" }}>
        {" "}
        {averageSentiment !== undefined && (
          <div
            style={{ marginBottom: 8 }}
            className={`border-l-4 ${
              averageSentiment < 0
                ? "border-red-500"
                : averageSentiment > 0
                ? "border-green-500"
                : "border-yellow-500"
            }`}
          ></div>
        )}
        <button
          className={opened ? "accordion active" : "accordion"}
          onClick={() => {
            toggleAccordion(!opened);
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <span
            onClick={() => {
              removeTweet(title);
            }}
          >
            <ChipsRemoveIcon />
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 12,
              marginLeft: 25,
            }}
          >
            <span style={{ fontWeight: "bold" }}>{title}</span>
            <span> Tweets: {data.length}</span>
          </div>
        </button>
      </div>

      <div ref={ref} className="panel">
        {content}
      </div>
    </div>
  );
}

export default LocationAccordion;
