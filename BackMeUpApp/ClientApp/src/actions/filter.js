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

export { setFilter, setOrder, setPeriod };
