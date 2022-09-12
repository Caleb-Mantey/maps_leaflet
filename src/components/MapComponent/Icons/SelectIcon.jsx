import React from "react";

function SelectIcon({ width, height, color }) {
  return (
    <div style={{ marginRight: "5px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-check"
        width={width || "20"}
        height={height || "20"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        // stroke={color || "#dcfce7"}
        stroke={color || "#7bc62d"}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l5 5l10 -10" />
      </svg>
    </div>
  );
}

export default SelectIcon;
