import React, { useState } from "react";
import SentimentProgressBar from "./SentimentProgressBar";
import Checkbox from "./Checkbox";

const CommentRows = ({ socialMediaData, handleSetActive, coloumn, style }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  // console.log("Social Media Data");
  // console.log(socialMediaData);
  return (
    <div
      key={socialMediaData._id}
      className={`cursor-pointer ${coloumn.length > 0 ? "" : ""}`}
      style={style}
    >
      <div className="border border-black-500 rounded mb-4 flex">
        {socialMediaData["sentimentPolarity"] !== undefined && (
          <div
            className={`border-l-4 ${
              socialMediaData.sentimentPolarity < 0
                ? "border-red-500"
                : socialMediaData.sentimentPolarity > 0
                ? "border-green-500"
                : "border-yellow-500"
            }`}
          ></div>
        )}
        <div className="w-full">
          {coloumn.length > 0 && (
            <>
              <div
                onClick={() => handleSetActive(socialMediaData)}
                className="flex my-2 border-b px-4 font-semibold text-[0.675rem] cursor-pointer"
              >
                {coloumn.map((d) => (
                  <div key={d.value} className="w-[100px] break-all">
                    {d.value === "sentimentPolarityLabel" ? (
                      socialMediaData.sentimentPolarity < 0 ? (
                        <SentimentProgressBar color="red" />
                      ) : socialMediaData.sentimentPolarity > 0 ? (
                        <SentimentProgressBar color="green" />
                      ) : (
                        <SentimentProgressBar color="yellow" />
                      )
                    ) : d.value === "mark_as_read" ? (
                      <Checkbox />
                    ) : d.value === "handler_name" ? (
                      <p style={{ marginRight: 10 }}>
                        @{socialMediaData[d.value]}
                      </p>
                    ) : d.value === "profile_image_url" ? (
                      <div className="profile-image">
                        <img src={socialMediaData[d.value]} alt="profile-pic" />
                      </div>
                    ) : d.value === "date" ? (
                      <p>{socialMediaData[d.value].split("T").join(", ")}</p>
                    ) : (
                      socialMediaData[d.value]
                    )}
                  </div>
                ))}
                <div></div>
              </div>
              <div className="px-4 text-[0.675rem]">
                <p className="text">
                  {!socialMediaData.tweet
                    ? ""
                    : isReadMore
                    ? socialMediaData.tweet.slice(0, 150)
                    : socialMediaData.tweet}
                  <a
                    href={`https://twitter.com/i/web/status/${socialMediaData._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer tweet-link"
                  >
                    Goto tweet
                  </a>
                  {/* <span onClick={toggleReadMore} className="cursor-pointer">
                    {isReadMore ? "...read more" : " show less"}
                  </span> */}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentRows;
