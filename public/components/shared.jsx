/**
 * Datetime to xsltv format
 * @param {current date time} currenttime
 * @param {DÃ©calage horaire} offsetminutes
 */
export let getParamsCurrentDate = (currenttime = new Date(), offsetminutes = 60) => {
  let myDate = new Date(currenttime);
  myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes));
  return [myDate.getHours(), myDate.getDate(), myDate.getMonth() + 1, myDate.getFullYear()];
};
