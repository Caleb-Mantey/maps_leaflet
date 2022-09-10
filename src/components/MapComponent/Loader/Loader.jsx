import React from "react";
import PropTypes from "prop-types";
import "./loader.css";

export const LoaderBoxes = ({ message }) => {
  return (
    <div className="mt-24 text-center">
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
};

export const Loader = ({ message }) => {
  return (
    <div className="mt-24 text-center">
      <div className="loader"></div>
      {message && <div className="text-sm text-neutral-400">{message}</div>}
    </div>
  );
};

LoaderBoxes.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

Loader.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Loader;
