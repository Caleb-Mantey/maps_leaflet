import React, { useState, Fragment, useEffect } from "react";
import TableComponent from "../Table/Table";
import ChipsIcon from "../Icons/ChipsIcon";
import "./SelectChips.scss";
import ChipsRemoveIcon from "../Icons/ChipsRemoveIcon";
import LocationAccordion from "../Accordion/LocationAccordion";

const SelectComponent = ({
  socialMediaResponse,
  options,
  tweetLocations,
  selectedColumns,
  removeTweet,
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  // console.log(options);

  // console.log(socialMediaResponse);
  // console.log(selectedColumns);

  useEffect(() => {
    setSelectedFilters([options[0]]);
  }, []);

  const isSelected = (removeOption) => {
    const isSelected = selectedFilters.find(
      (option) => option.value === removeOption.value
    );
    return isSelected;
  };

  const handleSelectChips = (option) => {
    if (!isSelected(option))
      setSelectedFilters((current) => [...current, option]);
    else {
      const index = selectedFilters.indexOf(option);
      if (index > -1) {
        selectedFilters.splice(index, 1);
      }
      setSelectedFilters((selectedFilters) => [...selectedFilters]);
    }
  };

  const clearAllFilter = () => {
    setSelectedFilters([]);
  };

  const clearAllSelection = () => {
    tweetLocations.forEach((item) => {
      removeTweet(item.value);
    });
  };

  const clearSelection = (option) => {
    removeTweet(option.value);
  };

  const filteredByLocations = (location) => {
    // console.log(selected);
    console.log(
      socialMediaResponse.filter((item) => item.locationCode === location)
    );
    return socialMediaResponse.filter((item) => item.locationCode === location);
  };

  console.log(tweetLocations);
  return (
    <Fragment>
      <div
        className="flex flex-wrap md:flex-row items-center"
        style={{ padding: 5 }}
      >
        {tweetLocations.map((option, i) => (
          // console.log(option);
          <LocationAccordion
            key={option.value}
            title={option.label}
            data={filteredByLocations(option.value)}
            removeTweet={removeTweet}
            content={
              <>
                {/* <div key={option.value}>
                  <div
                    className="cursor-pointer chips border-[#06adcf] text-[#06adcf] border-solid border-[1px]"
                    selected={"selected"}
                    // onClick={() => handleSelectChips(option)}
                  >
                    {option.label}
                    <span
                      className="chipsBtn"
                      onClick={() => clearSelection(option)}
                    >
                      <ChipsRemoveIcon className="mt-[15px]" />
                    </span>
                  </div>
                </div> */}
                <div
                  className="flex flex-wrap md:flex-row md:gap-5 gap-2 items-center"
                  style={{ marginTop: 15, marginBottom: 15 }}
                >
                  {options.map((option, i) => (
                    <div key={option.value}>
                      <div
                        className={`cursor-pointer chips ${
                          isSelected(option)
                            ? "border-[#06adcf] text-[#06adcf] border-solid border-[1px]"
                            : ""
                        }`}
                        selected={isSelected(option) ? "selected" : ""}
                        onClick={() => handleSelectChips(option)}
                      >
                        {option.label}
                        <span className="chipsBtn">
                          {isSelected(option) ? (
                            <ChipsIcon className="mt-[15px]" />
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => clearAllFilter()}>Clear All</button>
                </div>
                <TableComponent
                  socialMediaResponse={filteredByLocations(option.value)}
                  coloumn={selectedFilters}
                />
              </>
            }
          />
        ))}
      </div>
    </Fragment>
  );
};

export default SelectComponent;
