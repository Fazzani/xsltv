import React from "react";
import PropTypes from "prop-types";

export let api_files_url = "https://api.myjson.com/bins/8tvgs";

export let Loader = ({ displayText }) => {
  return <div id="loading">{displayText}</div>;
};

Loader.propTypes = {
  displayText: PropTypes.string
};

/**
 * Datetime to xsltv format
 * @param {current date time} currenttime 
 * @param {DÃ©calage horaire} offsetminutes 
 */
export let getParamsCurrentDate = (currenttime = new Date(), offsetminutes = 60) => {
    let myDate = new Date(currenttime);
    myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes));
    return [
        myDate.getHours(),
        myDate.getDate(),
        myDate.getMonth() + 1,
        myDate.getFullYear()
    ];
}