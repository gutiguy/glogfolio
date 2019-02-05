function ISOStringToNormalDate(date) {
  return date.substring(0, 10) + " " + date.substring(11, 19);
}

export { ISOStringToNormalDate };
