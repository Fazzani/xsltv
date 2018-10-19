/**
import { getParamsCurrentDate } from './shared';
 * Datetime to xsltv format
 * @param {Date} currentTime -current date time
 * @param {number} offsetMinutes - jet lag (minutes)
 * @return {array} anonymous - fragment date as an array  
 */
const getParamsCurrentDate = (
  currentTime: number = Date.now(),
  offsetMinutes: number = 60
): Array<any> => {
  const myDate = new Date(currentTime);
  myDate.setMinutes(myDate.getMinutes() + (60 - offsetMinutes));
  return [
    myDate.getHours(),
    myDate.getDate(),
    myDate.getMonth() + 1,
    myDate.getFullYear()
  ];
};

export { getParamsCurrentDate };
