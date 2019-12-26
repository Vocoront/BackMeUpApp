import moment from "moment";
const convertUtcToLocal = time => {
  return moment
    .utc(time)
    .local()
    .format("YYYY-MMM-DD h:mm A");
};
export { convertUtcToLocal };
