import React, { useState } from "react";
import SelectIcon from "../Icons/SelectIcon";

function PillButton({ onSelect, isActive, children }) {
  return (
    <button
      className={isActive ? "pill_button_selected" : "pill_button"}
      onClick={() => {
        onSelect();
      }}
    >
      <div className="pill_button_content">
        {isActive ? <SelectIcon /> : ""}
        {children}
      </div>
    </button>
  );
}

export default PillButton;
