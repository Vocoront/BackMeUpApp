const setFilter = (filter = "date") => ({
  type: "SET_FILTER",
  filter
});

const setOrder = (order = "desc") => ({
  type: "SET_ORDER",
  order
});

export { setFilter, setOrder };
