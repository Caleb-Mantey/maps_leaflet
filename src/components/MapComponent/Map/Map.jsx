// All styles that show up as strings are inside the map.scss file
// All other styles are in their respective modules.

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Popup,
  FeatureGroup,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { cleanData } from "../util/cleanMapData";
import Modal from "../Modal/modal";

import classes from "./Map.module.scss";

import "./Map.scss";
// import useStatsSearchCustomHook from "../../../../../customHooks/useStatsSearch.customHook";
// import { INTERVAL, TYPE } from "../../../../../../common/constants";
// import Loader from "../../../../../App/LayoutComponents/Loader/Loader";
import { data } from "../util/data";
import SelectComponent from "../MultiSelect/SelectComponent";

var southWest = L.latLng(-90, 180),
  northEast = L.latLng(90, -180),
  bounds = L.latLngBounds(southWest, northEast);
function MapComponent({ searchObject }) {
  // search object holds API response data
  // const { twitterResponse, twitterLoader, twitterError, handleAllApi } = data;
  const twitterResponse = data;
  const twitterLoader = false;
  const twitterError = false;
  // useStatsSearchCustomHook({
  //   searchObject: {
  //     twitter: searchObject.twitter,
  //     days: searchObject.days,
  //     lang: searchObject.lang,
  //   },
  //   interval: INTERVAL.total,
  //   type: TYPE.detailed,
  // });

  const [coordinates, setCoordinates] = useState([]);

  const [tweetData, setTweetData] = useState({});
  const [tweetList, setTweetList] = useState(new Map()); // Stores the map tweet modals
  const [tweetLocations, setTweetLocations] = useState([]);

  const tweetColumns = [
    { label: "Profile Image", value: "profile_image_url" },
    // { label: "Name", value: "name" },
    { label: "Handler", value: "handler_name" },
    { label: "Date", value: "date" },
  ];

  useEffect(() => {
    // handleAllApi();
  }, [searchObject]);

  useEffect(() => {
    // Removes the default functionality of the popup close button of leaflet
    document
      .querySelector(".leaflet-pane .leaflet-popup-pane")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
      });
  }, [tweetList]);

  // Get tweet data and memoize it

  // Check if twitterResponse and twitterResponse.data are present then update the state for location (lat & long data) and the tweet data.
  useEffect(() => {
    if (twitterResponse && twitterResponse.data) {
      try {
        const allTweets =
          twitterResponse?.data?.stats?.twitter?.timelineStats?.timeline[0]
            ?.allTweets;
        const data = cleanData(allTweets);
        const [locationCountList, tweetData] = data;
        setTweetData(tweetData);
        setCoordinates(locationCountList);
      } catch (e) {
        console.error("cleanData error ==> ", e);
      }
    }
  }, [twitterResponse]);

  const addTweetLocation = (location) => {
    if (tweetLocations.find((item) => item.value === location.value)) return;

    setTweetLocations([...tweetLocations, location]);
  };

  const removeTweetLocation = (code) => {
    setTweetLocations([
      ...tweetLocations.filter((item) => item.value !== code),
    ]);
  };

  const showTweet = (code) => {
    const mList = new Map(tweetList);
    mList.set(code, code);
    // const tweet =
    addTweetLocation({ label: code, value: code });
    // setTweetLocations([...tweetLocations, { label: code, value: code }]);
    // mList.forEach()
    // console.log(mList);
    setTweetList(mList);
  };

  const removeTweet = (code) => {
    const mList = new Map(tweetList);
    mList.delete(code);
    removeTweetLocation(code);
    setTweetList(mList);
  };

  // output the sentiment style of the sentiment anywhere sentiments are needed
  // It takes an item and the objects for style coding
  // checks for the proper sentiment and displays the appropriate style
  const selectSentiment = (item, pos, neu, neg) => {
    return item.average >= -1 && item.average < 0
      ? neg
      : item.average >= 0 && item.average < 0.5
      ? neu
      : item.average >= 0.5 && item.average <= 1
      ? pos
      : "";
  };

  // Style code for the map bubbles
  const fillRedOptions = {
    fillColor: "red",
    color: "red",
    strokeWidth: "2px",
  };
  const fillGreenOptions = {
    color: "green",
    fillColor: "green",
    strokeWidth: "2px",
  };
  const fillOrangeOptions = {
    color: "orange",
    fillColor: "orange",
    strokeWidth: "2px",
  };
  // Identifies the center of the map
  const center = [51.505, -0.09];

  return twitterLoader ? (
    <div>Loading</div>
  ) : // <Loader message="Loading map" />
  twitterError ? (
    <div>There was an error...</div>
  ) : (
    <div>
      {/* Display the tweet modals on the map */}
      {[...tweetList].map(([code, id]) => {
        // console.log(code);
        return (
          <Modal
            key={id}
            tweetLocation={code}
            avTweetDetails={coordinates}
            tweetData={tweetData}
            closeModal={() => removeTweet(code)}
          />
        );
      })}

      <div className="main_map_container">
        <div className="map_container_left">
          <div className="map-container">
            <div className="w-[97%] border border-outline rounded-lg mx-auto shadow-md text-center text-onprimarycontainer overflow-hidden">
              <MapContainer
                center={center}
                zoom={1.7}
                scrollWheelZoom={true}
                maxBounds={bounds}
                maxZoom={19}
                minZoom={1.5}
              >
                {/* url gets the map */}
                <TileLayer
                  noWrap={true}
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                />
                {/* plot bubbles for the tweets based on location */}
                {coordinates.map((item, id) => {
                  return (
                    <div key={id}>
                      <FeatureGroup>
                        <Popup
                          className={`${selectSentiment(
                            item,
                            "good",
                            "neutral",
                            "bad"
                          )} tooltip`}
                        >
                          <div
                            className={classes.popup}
                            onClick={() => showTweet(item.locationCode)}
                          >
                            <p className={classes.popup_title}>
                              <strong>Location: {item.locationCode}</strong>
                            </p>
                            <p className={classes.popup_tweet_count}>
                              Tweets: {item.count}
                            </p>
                            <p className={classes.popup_mean_sentiment}>
                              <strong>Mean sentiment:</strong>
                              {`${selectSentiment(
                                item,
                                "Positive",
                                "Neutral",
                                "Negative"
                              )}`}
                              {(+item.average).toFixed(2)}
                            </p>
                            <p className={classes.popup_sentiment_count}>
                              Sentiment count: {item.count}
                            </p>
                            <hr />
                            <p>
                              <strong>Legend:</strong> Positive &gt; 0.5; 0 &lt;
                              Neutral &lt; 0.5; Negative &lt; 0
                            </p>
                          </div>
                        </Popup>
                        {item.latitude && item.longitude && (
                          <CircleMarker
                            radius={item.count * 0.5}
                            center={[item.latitude, item.longitude]}
                            pathOptions={selectSentiment(
                              item,
                              fillGreenOptions,
                              fillOrangeOptions,
                              fillRedOptions
                            )}
                          />
                        )}
                      </FeatureGroup>
                    </div>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
        <div className="map_container_right">
          {[...tweetList].map(([code, id]) => {
            // console.log(code);
            return (
              <SelectComponent
                key={id}
                tweetLocation={code}
                avTweetDetails={coordinates}
                options={tweetLocations}
                socialMediaResponse={tweetData}
                selectedColumns={tweetColumns}
                removeTweet={removeTweet}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MapComponent);

MapComponent.propTypes = {
  searchObject: PropTypes.shape({
    facebook: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    twitter: PropTypes.string,
    reddit: PropTypes.string,
    instagram: PropTypes.string,
    youtube: PropTypes.string,
    articles: PropTypes.string,
    days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    lang: PropTypes.string.isRequired,
    mainSearchTerm: PropTypes.string.isRequired,
    option: PropTypes.string,
    type: PropTypes.string.isRequired,
    country: PropTypes.string,
  }),
};