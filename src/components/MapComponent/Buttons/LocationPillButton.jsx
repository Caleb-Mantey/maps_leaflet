import React, { useState } from "react";
import SelectIcon from "../Icons/SelectIcon";

function PillButton({ onSelect, isActive, children }) {
  return (
    <button
      className={
        isActive ? "location_pill_button_selected" : "location_pill_button"
      }
      onClick={() => {
        onSelect();
      }}
    >
      <div className="location_pill_button_content">
        {isActive ? <SelectIcon /> : ""}
        {children}
      </div>
    </button>
  );
}

export default PillButton;
