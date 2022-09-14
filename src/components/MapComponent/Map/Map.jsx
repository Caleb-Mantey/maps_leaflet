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
  useMap,
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
import ChipsIcon from "../Icons/ChipsIcon";
import PillButton from "../Buttons/LocationPillButton";
import SearchIcon from "../Icons/SearchIcon";
import { useRef } from "react";

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
  const [filteredCoordinates, setFilteredCoordinates] = useState([]);

  const [tweetData, setTweetData] = useState({});
  const [tweetList, setTweetList] = useState(new Map()); // Stores the map tweet modals
  const [selectedTweetLocations, setSelectedTweetLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [allTweetLocations, setAllTweetLocations] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [leafletMap, setMap] = useState(null);

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
        // initializeAllTweetLocations(locationCountList);
        setCoordinates(locationCountList);
        setFilteredCoordinates(locationCountList);
        // console.log(locationCountList);
      } catch (e) {
        console.error("cleanData error ==> ", e);
      }
    }
  }, [twitterResponse]);

  // useEffect(() => {
  //   if (search === "") {
  //     //  setFilteredCoordinates([...coordinates]);
  //     return;
  //   }

  //   setFilteredCoordinates([
  //     ...coordinates.filter(
  //       (coord) =>
  //         coord.locationCode.toLowerCase().search(search.toLowerCase()) !== -1
  //     ),
  //   ]);
  // }, [search]);

  const fiterCoordinatesList = (value) => {
    setSearch(value);
    if (value === "") {
      setFilteredCoordinates([...coordinates]);
      return;
    }

    setFilteredCoordinates([
      ...coordinates.filter(
        (coord) =>
          coord.locationCode.toLowerCase().search(value.toLowerCase()) !== -1
      ),
    ]);
  };

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "450px";
    document.getElementById("main_right").style.marginRight = "450px";
  };

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main_right").style.marginRight = "0";
  };

  const tweetIsPresent = (location) => {
    return selectedTweetLocations.find((item) => item.value === location.value);
  };

  const addTweetLocation = (location) => {
    if (tweetIsPresent(location)) return;

    setSelectedTweetLocations([...selectedTweetLocations, location]);
  };

  const removeTweetLocation = (code) => {
    setSelectedTweetLocations([
      ...selectedTweetLocations.filter((item) => item.value !== code),
    ]);
  };

  const showTweet = (code) => {
    const mList = new Map(tweetList);
    mList.set(code, code);

    if (!isFullScreen) setIsFullScreen(true);
    // lleafletMap.setView()
    const { latitude, longitude } = coordinates.find(
      (coords) => coords.locationCode === code
    );
    leafletMap.setView([latitude, longitude], 5);
    console.log(mList);
    console.log(latitude);
    console.log(longitude);
    console.log(coordinates);
    // const tweet =
    addTweetLocation({ label: code, value: code });
    // setSelectedTweetLocations([...selectedTweetLocations, { label: code, value: code }]);
    // mList.forEach()
    // console.log(mList);
    setTweetList(mList);
    openNav();
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
    // console.log(item);
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
    <div className={isFullScreen ? "fullscreen_map" : "main_map_container"}>
      <div className="map_container_left">
        {isFullScreen && (
          <a
            className="closebtn1"
            onClick={() => setIsFullScreen(false)}
            style={{ cursor: "pointer" }}
          >
            &times;
          </a>
        )}
        <div className="map_nav_bar">
          <div className="map_search">
            <form>
              <input
                className="map_search_box"
                type="text"
                value={search}
                placeholder="Search Locations"
                onChange={(e) => fiterCoordinatesList(e.target.value)}
              />
            </form>
            <SearchIcon />
          </div>
          <div
            className="map_location_chips location_pill_buttons"
            id="main_right"
          >
            <div className="location_pill_buttons">
              {filteredCoordinates.map((item, index) => (
                <PillButton
                  key={index}
                  // onClick={() => showTweet(item.locationCode)}
                  // isActive={isSelected(text)}
                  onSelect={() => {
                    showTweet(item.locationCode);
                  }}
                >
                  {item.locationCode}
                </PillButton>
              ))}
            </div>
          </div>
        </div>
        <div className="map-container">
          <div
            className="w-[100%] border border-outline rounded-lg mx-auto shadow-md text-center text-onprimarycontainer overflow-hidden"
            style={{ height: "100%" }}
          >
            <MapContainer
              center={center}
              zoom={3}
              scrollWheelZoom={true}
              maxBounds={bounds}
              maxZoom={19}
              minZoom={1.5}
              zoomControl={false}
              ref={setMap}
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
                            <strong>Mean sentiment: </strong>
                            {`${selectSentiment(
                              item,
                              "Positive",
                              "Neutral",
                              "Negative"
                            )}`}{" "}
                            {(+item.average).toFixed(2)}
                          </p>
                          <p className={classes.popup_sentiment_count}>
                            Sentiment count: {item.count}
                          </p>
                          {/* <hr />
                            <p>
                              <strong>Legend:</strong> Positive &gt; 0.5; 0 &lt;
                              Neutral &lt; 0.5; Negative &lt; 0
                            </p> */}
                        </div>
                      </Popup>
                      {item.latitude && item.longitude && (
                        <CircleMarker
                          radius={item.count * 1}
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
      {
        // <div className="map_container_right">
        <div>
          <div id="mySidenav" className="sidenav">
            <div className="map_side_nav_title">
              <h4>Tweets By Location</h4>
              <a
                className="closebtn"
                onClick={closeNav}
                style={{ cursor: "pointer" }}
              >
                &times;
              </a>
            </div>
            {/* {[...tweetList].map(([code, id]) => { */}
            {/* // console.log(code); */}
            {/* return ( */}
            <SelectComponent
              // key={id}
              tweetLocations={selectedTweetLocations}
              avTweetDetails={coordinates}
              options={tweetColumns}
              socialMediaResponse={tweetData}
              selectedColumns={tweetColumns}
              removeTweet={removeTweet}
            />
            {/* ); */}
            {/* })} */}
          </div>
        </div>
      }
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
