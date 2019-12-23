import moment from "moment";
const  ConvertUtcToLocal=(time)=>{
    return moment
    .utc(time)
    .local()
    .format("YYYY-MMM-DD h:mm A")
}
export {ConvertUtcToLocal}