
/**
import { getParamsCurrentDate } from './shared';
 * Datetime to xsltv format
 * @param {Date} currenttime -current date time
 * @param {number} offsetminutes - jet lag (minutes)
 * @return {array} anonymous - fragment date as an array  
 */
export let getParamsCurrentDate = (
  currenttime = new Date(),
  offsetminutes = 60
) => {
  let myDate = new Date(currenttime)
  myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes))
  return [
    myDate.getHours(),
    myDate.getDate(),
    myDate.getMonth() + 1,
    myDate.getFullYear(),
  ]
}