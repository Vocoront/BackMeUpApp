const setAlert = (title="",message="") => ({
  type: "SET_ALERT",
  visible:true,
  title,
  message
});
const clearAlert = () => ({ type: "CLEAR_ALERT" });

export { setAlert, clearAlert };
