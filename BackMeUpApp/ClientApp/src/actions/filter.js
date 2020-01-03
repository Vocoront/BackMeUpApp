const setFilter = (filter = "date") => ({
  type: "SET_FILTER",
  filter
});

const setOrder = (order = "desc") => ({
  type: "SET_ORDER",
  order
});

const setPeriod = (period = "day") => ({
  type: "SET_PERIOD",
  period
});

const setTag = (tag = "") => ({
  type: "SET_TAG",
  tag
});

const setCreator = (creator = "") => ({
  type: "SET_CREATOR",
  creator
});

const clearFilter = () => ({
  type: "CLEAR_FILTER"
});

export { setFilter, setOrder, setPeriod, setTag, setCreator, clearFilter };
