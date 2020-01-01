import moment from "moment";
const convertUtcToLocal = time => {
  return moment
    .utc(time)
    .local()
    .format("YYYY-MMM-DD h:mm A");
};

const isAfter = (timeA, timeB) => moment.utc(timeA).isAfter(moment.utc(timeB));

export { convertUtcToLocal, isAfter };
