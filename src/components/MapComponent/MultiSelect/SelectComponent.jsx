import React, { useState, Fragment } from "react";
import TableComponent from "./../Table/Table";
import ChipsIcon from "../Icons/ChipsIcon";
import "./SelectChips.scss";
import ChipsRemoveIcon from "../Icons/ChipsRemoveIcon";

const SelectComponent = ({
  socialMediaResponse,
  options,
  selectedColumns,
  removeTweet,
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  // console.log(socialMediaResponse);
  // console.log(selectedColumns);
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
    options.forEach((item) => {
      removeTweet(item.value);
    });
    // setSelectedFilters([]);
  };

  const clearSelection = (option) => {
    removeTweet(option.value);
  };

  return (
    <Fragment>
      <div className="md:px-10 px-5 md:pt-10 pt-5 flex flex-wrap md:flex-row md:gap-5 gap-2 items-center">
        {options.map((option, i) => (
          <div key={option.value}>
            <div
              className="cursor-pointer chips border-[#06adcf] text-[#06adcf] border-solid border-[1px]"
              selected={"selected"}
              // onClick={() => handleSelectChips(option)}
            >
              {option.label}
              <span className="chipsBtn" onClick={() => clearSelection(option)}>
                <ChipsRemoveIcon className="mt-[15px]" />
              </span>
            </div>
          </div>
        ))}
        <button onClick={() => clearAllFilter()}>Clear All</button>
      </div>
      <TableComponent
        socialMediaResponse={socialMediaResponse}
        coloumn={selectedColumns}
      />
    </Fragment>
  );
};

export default SelectComponent;
